// services/pgvector-service.js
const { Pool } = require('pg');
const crypto = require('crypto');

class PgVectorService {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL || 'postgresql://admin:qinguoqinchen123@localhost:5847/qinguoqinchen_ai',
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 30000
        });
    }

    // 法律資料匯入向量化
    async ingestLegalData(data) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            // 計算內容雜湊
            const contentHash = crypto.createHash('sha256').update(data.content).digest('hex');

            // 檢查是否已存在
            const existCheck = await client.query(
                'SELECT id FROM legal_documents WHERE content_hash = $1',
                [contentHash]
            );

            if (existCheck.rows.length > 0) {
                throw new Error('文件已存在，無需重複匯入');
            }

            // 插入法律文件
            const documentResult = await client.query(`
        INSERT INTO legal_documents (title, content, source, document_type, jurisdiction, metadata, content_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, uuid_id
      `, [
                data.title,
                data.content,
                data.source || 'MANUAL',
                data.document_type || 'regulation',
                data.jurisdiction || 'Taiwan',
                JSON.stringify(data.metadata || {}),
                contentHash
            ]);

            const documentId = documentResult.rows[0].id;

            // 文本分塊
            const chunks = this.chunkLegalText(data.content, data.title);

            // 批次生成向量並插入
            const chunkPromises = chunks.map(async (chunk, index) => {
                // 生成向量嵌入
                const embedding = await this.generateEmbedding(chunk.text);

                return client.query(`
          INSERT INTO legal_chunks (
            document_id, chunk_index, text, embedding, 
            article_number, section_title, keyword_tags, legal_concepts, token_count
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id
        `, [
                    documentId,
                    index,
                    chunk.text,
                    `[${embedding.join(',')}]`, // 轉換為 PostgreSQL 向量格式
                    chunk.article_number,
                    chunk.section_title,
                    chunk.keyword_tags || [],
                    chunk.legal_concepts || [],
                    chunk.text.split(/\s+/).length
                ]);
            });

            await Promise.all(chunkPromises);

            await client.query('COMMIT');

            return {
                success: true,
                document_id: documentId,
                chunks_created: chunks.length,
                message: '法律資料向量化完成'
            };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // 用戶資料匯入向量化
    async ingestUserData(data) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            const contentHash = crypto.createHash('sha256').update(data.content).digest('hex');

            // 插入用戶文件
            const documentResult = await client.query(`
        INSERT INTO user_documents (title, content, category, tags, metadata, user_id, content_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, uuid_id
      `, [
                data.title || '未命名文件',
                data.content,
                data.category || 'general',
                data.tags || [],
                JSON.stringify(data.metadata || {}),
                data.userId || 'anonymous',
                contentHash
            ]);

            const documentId = documentResult.rows[0].id;

            // 文本分塊
            const chunks = this.chunkUserText(data.content, data.title);

            // 批次生成向量並插入
            const chunkPromises = chunks.map(async (chunk, index) => {
                const embedding = await this.generateEmbedding(chunk.text);

                return client.query(`
          INSERT INTO user_chunks (document_id, chunk_index, text, embedding, chunk_size, metadata)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `, [
                    documentId,
                    index,
                    chunk.text,
                    `[${embedding.join(',')}]`,
                    chunk.text.length,
                    JSON.stringify(chunk.metadata || {})
                ]);
            });

            await Promise.all(chunkPromises);

            // 更新文件狀態
            await client.query(`
        UPDATE user_documents 
        SET chunks_count = $1, has_vectors = true, status = 'active'
        WHERE id = $2
      `, [chunks.length, documentId]);

            await client.query('COMMIT');

            return {
                success: true,
                document_id: documentId,
                chunks_created: chunks.length
            };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // RAG 查詢功能
    async ragQuery(question, options = {}) {
        try {
            const {
                topK = 5,
                minSimilarity = 0.7,
                source = null,
                category = null,
                queryType = 'legal' // 'legal' or 'user'
            } = options;

            // 生成問題向量
            const questionEmbedding = await this.generateEmbedding(question);

            let searchResults;
            if (queryType === 'legal') {
                searchResults = await this.searchLegalKnowledge(questionEmbedding, {
                    topK, minSimilarity, source
                });
            } else {
                searchResults = await this.searchUserVectors(questionEmbedding, {
                    topK, minSimilarity, category
                });
            }

            if (searchResults.length === 0) {
                return {
                    success: true,
                    answer: '抱歉，在現有資料中找不到相關資訊。請檢查查詢條件或新增更多文件。',
                    sources: [],
                    query_type: queryType
                };
            }

            // 建構上下文
            const context = searchResults.map(result =>
                `[文件: ${result.document_title}][相似度: ${(result.similarity * 100).toFixed(1)}%]\n${result.chunk_text}`
            ).join('\n\n');

            // 使用 Gemini 生成回答
            const answer = await this.generateRAGAnswer(context, question, queryType);

            // 記錄查詢
            await this.logQuery(question, searchResults, answer, queryType);

            return {
                success: true,
                answer: answer,
                sources: searchResults.map(result => ({
                    document_id: result.document_id,
                    document_title: result.document_title,
                    similarity: result.similarity,
                    chunk_preview: result.chunk_text.substring(0, 200) + '...'
                })),
                query_type: queryType
            };

        } catch (error) {
            console.error('RAG 查詢錯誤:', error);
            throw error;
        }
    }

    // 法律知識向量搜尋
    async searchLegalKnowledge(queryEmbedding, options = {}) {
        const client = await this.pool.connect();
        try {
            const { topK = 5, minSimilarity = 0.7, source = null } = options;

            let query = `
        SELECT 
          lc.id as chunk_id,
          lc.document_id,
          ld.title as document_title,
          lc.text as chunk_text,
          1 - (lc.embedding <=> $1) as similarity,
          ld.source,
          ld.document_type,
          lc.article_number,
          lc.keyword_tags,
          lc.legal_concepts
        FROM legal_chunks lc
        JOIN legal_documents ld ON lc.document_id = ld.id
        WHERE 1 - (lc.embedding <=> $1) >= $2
          AND ld.status = 'active'
          AND lc.embedding IS NOT NULL
      `;

            const params = [`[${queryEmbedding.join(',')}]`, minSimilarity];

            if (source) {
                query += ` AND ld.source = $${params.length + 1}`;
                params.push(source);
            }

            query += ` ORDER BY lc.embedding <=> $1 LIMIT $${params.length + 1}`;
            params.push(topK);

            const result = await client.query(query, params);
            return result.rows;

        } finally {
            client.release();
        }
    }

    // 用戶向量搜尋
    async searchUserVectors(queryEmbedding, options = {}) {
        const client = await this.pool.connect();
        try {
            const { topK = 5, minSimilarity = 0.7, category = null, userId = null } = options;

            let query = `
        SELECT 
          uc.id as chunk_id,
          uc.document_id,
          ud.title as document_title,
          uc.text as chunk_text,
          1 - (uc.embedding <=> $1) as similarity,
          ud.category,
          ud.tags,
          ud.user_id,
          uc.chunk_index
        FROM user_chunks uc
        JOIN user_documents ud ON uc.document_id = ud.id
        WHERE 1 - (uc.embedding <=> $1) >= $2
          AND ud.status = 'active'
          AND ud.has_vectors = true
          AND uc.embedding IS NOT NULL
      `;

            const params = [`[${queryEmbedding.join(',')}]`, minSimilarity];

            if (category) {
                query += ` AND ud.category = $${params.length + 1}`;
                params.push(category);
            }

            if (userId) {
                query += ` AND ud.user_id = $${params.length + 1}`;
                params.push(userId);
            }

            query += ` ORDER BY uc.embedding <=> $1 LIMIT $${params.length + 1}`;
            params.push(topK);

            const result = await client.query(query, params);
            return result.rows;

        } finally {
            client.release();
        }
    }

    // 文本分塊 - 法律文件
    chunkLegalText(text, title) {
        const chunks = [];
        const maxChunkSize = 512;

        // 按條文分割
        const articles = text.split(/第\d+條|Article\s+\d+/);

        articles.forEach((article, index) => {
            if (article.trim().length === 0) return;

            const articleMatch = text.match(new RegExp(`第${index}條|Article\\s+${index}`));
            const articleNumber = articleMatch ? articleMatch[0] : null;

            // 如果單個條文太長，進一步分割
            if (article.length > maxChunkSize) {
                const sentences = article.split(/[。！？；]/).filter(s => s.trim().length > 0);
                let currentChunk = '';

                sentences.forEach(sentence => {
                    if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length > 0) {
                        chunks.push({
                            text: currentChunk.trim(),
                            article_number: articleNumber,
                            section_title: title,
                            keyword_tags: this.extractLegalKeywords(currentChunk),
                            legal_concepts: this.extractLegalConcepts(currentChunk)
                        });
                        currentChunk = sentence;
                    } else {
                        currentChunk += sentence + '。';
                    }
                });

                if (currentChunk.trim().length > 0) {
                    chunks.push({
                        text: currentChunk.trim(),
                        article_number: articleNumber,
                        section_title: title,
                        keyword_tags: this.extractLegalKeywords(currentChunk),
                        legal_concepts: this.extractLegalConcepts(currentChunk)
                    });
                }
            } else {
                chunks.push({
                    text: article.trim(),
                    article_number: articleNumber,
                    section_title: title,
                    keyword_tags: this.extractLegalKeywords(article),
                    legal_concepts: this.extractLegalConcepts(article)
                });
            }
        });

        return chunks;
    }

    // 文本分塊 - 用戶文件
    chunkUserText(text, title) {
        const chunks = [];
        const maxChunkSize = 512;
        const overlap = 50;

        const sentences = text.split(/[。！？\n]/).filter(s => s.trim().length > 0);
        let currentChunk = '';
        let currentIndex = 0;

        sentences.forEach(sentence => {
            if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length > 0) {
                chunks.push({
                    text: currentChunk.trim(),
                    metadata: {
                        title: title,
                        chunk_index: currentIndex,
                        source_type: 'user_input'
                    }
                });

                // 保留重疊內容
                const words = currentChunk.split(/\s+/);
                const overlapWords = words.slice(-overlap).join(' ');
                currentChunk = overlapWords + ' ' + sentence;
                currentIndex++;
            } else {
                currentChunk += sentence + '。';
            }
        });

        if (currentChunk.trim().length > 0) {
            chunks.push({
                text: currentChunk.trim(),
                metadata: {
                    title: title,
                    chunk_index: currentIndex,
                    source_type: 'user_input'
                }
            });
        }

        return chunks;
    }

    // 提取法律關鍵詞
    extractLegalKeywords(text) {
        const legalKeywords = [
            '個人資料', '隱私', '同意', '蒐集', '處理', '利用',
            '資通安全', '事件', '通報', '防護', '漏洞',
            'eKYC', '身份驗證', '客戶', '金融機構', '開戶',
            '生物特徵', '人臉識別', '指紋', '活體檢測',
            '罰鍰', '刑責', '違反', '處罰', '法律責任'
        ];

        return legalKeywords.filter(keyword => text.includes(keyword));
    }

    // 提取法律概念
    extractLegalConcepts(text) {
        const legalConcepts = [
            '個資保護', '資訊安全', '金融法規', '身份驗證',
            '生物特徵', '客戶盡職調查', '反洗錢', '法規遵循',
            '刑事責任', '行政處罰', '民事賠償'
        ];

        return legalConcepts.filter(concept =>
            text.toLowerCase().includes(concept.toLowerCase())
        );
    }

    // 生成向量嵌入
    async generateEmbedding(text) {
        try {
            // 呼叫 Python AI 服務生成嵌入
            const response = await fetch(`${process.env.PYTHON_AI_URL || 'http://localhost:8100'}/embed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            });

            if (!response.ok) {
                throw new Error(`嵌入生成失敗: ${response.status}`);
            }

            const result = await response.json();
            return result.embedding;

        } catch (error) {
            console.warn('Python AI 服務不可用，使用模擬向量:', error.message);
            // 模擬 1024 維向量
            return Array.from({ length: 1024 }, () => Math.random() - 0.5);
        }
    }

    // 生成 RAG 回答
    async generateRAGAnswer(context, question, queryType) {
        try {
            // 使用現有的 Gemini 服務
            const { createGeminiService } = require('../main.js');
            const geminiService = createGeminiService();

            const prompt = queryType === 'legal'
                ? this.buildLegalRAGPrompt(context, question)
                : this.buildUserRAGPrompt(context, question);

            const result = await geminiService.generateAttackVector(prompt);
            return result.text;

        } catch (error) {
            console.error('RAG 回答生成失敗:', error);
            return `基於搜尋到的相關資料：\n\n${context}\n\n針對您的問題「${question}」，建議您諮詢專業人士以獲得更準確的解答。`;
        }
    }

    buildLegalRAGPrompt(context, question) {
        return `你是侵國侵城 eKYC 系統的法規遵循專家。請基於以下法規資料回答問題：

=== 相關法規條文 ===
${context}

=== 用戶問題 ===
${question}

=== 回答要求 ===
1. 只能基於提供的法規條文回答
2. 必須引用具體的法條和相似度分數
3. 針對 eKYC 系統提供具體的合規建議
4. 如果涉及罰則，請詳細說明
5. 提供可操作的改善措施
6. 如果法規中沒有相關資訊，請明確說明

請以專業的法規專家角度回答：`;
    }

    buildUserRAGPrompt(context, question) {
        return `你是侵國侵城 eKYC 系統的技術顧問。請基於以下用戶資料回答問題：

=== 相關資料內容 ===
${context}

=== 用戶問題 ===
${question}

=== 回答要求 ===
1. 基於提供的資料內容進行分析
2. 提供實用的技術建議
3. 針對 eKYC 安全提供改善方案
4. 結合相關的攻擊向量分析
5. 如果資料不足，建議補充的方向

請以專業的技術專家角度回答：`;
    }

    // 記錄查詢
    async logQuery(question, sources, answer, queryType) {
        const client = await this.pool.connect();
        try {
            const tableName = queryType === 'legal' ? 'legal_queries' : 'user_queries';

            await client.query(`
        INSERT INTO ${tableName} (
          user_question, retrieved_chunks_ids, similarity_scores, 
          ${queryType === 'legal' ? 'gemini_response' : 'response'}, 
          query_type, chunks_retrieved
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
                question,
                sources.map(s => s.chunk_id),
                sources.map(s => s.similarity),
                answer,
                queryType,
                sources.length
            ]);
        } finally {
            client.release();
        }
    }

    // 獲取統計資料
    async getStats() {
        const client = await this.pool.connect();
        try {
            const stats = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM user_documents WHERE status = 'active') as user_documents_count,
          (SELECT COUNT(*) FROM legal_documents WHERE status = 'active') as legal_documents_count,
          (SELECT COUNT(*) FROM user_chunks) as user_chunks_count,
          (SELECT COUNT(*) FROM legal_chunks) as legal_chunks_count,
          (SELECT COUNT(*) FROM user_queries) as user_queries_count,
          (SELECT COUNT(*) FROM legal_queries) as legal_queries_count
      `);

            return stats.rows[0];
        } finally {
            client.release();
        }
    }
}

module.exports = { PgVectorService };
