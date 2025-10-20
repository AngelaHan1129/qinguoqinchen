// backend/src/services/legal-vector-manager.js
const { Pool } = require('pg');
const axios = require('axios');

class LegalVectorManager {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
        });
        this.pythonAiUrl = process.env.PYTHON_AI_URL || 'http://localhost:8100';
        console.log('🏛️ 法規向量管理器初始化完成');
    }

    /**
     * 完整的法規文件匯入和向量化
     */
    async ingestLegalDocumentsWithVectorization(documents) {
        const results = {
            total: documents.length,
            successful: 0,
            failed: 0,
            details: []
        };

        for (const doc of documents) {
            try {
                console.log(`📥 處理法規: ${doc.title}`);

                // 1. 儲存法規文件
                const docResult = await this.pool.query(`
          INSERT INTO legal_documents (title, content, source, document_type, jurisdiction, metadata)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, uuid_id
        `, [
                    doc.title,
                    doc.content,
                    doc.source,
                    doc.document_type || 'regulation',
                    doc.jurisdiction || 'Taiwan',
                    JSON.stringify(doc.metadata || {})
                ]);

                const documentId = docResult.rows[0].id;

                // 2. 智能法規分塊
                const chunks = await this.chunkLegalText(doc.content);

                // 3. 為每個分塊生成向量
                for (let i = 0; i < chunks.length; i++) {
                    const chunk = chunks[i];

                    // 生成向量
                    const embeddingResponse = await axios.post(`${this.pythonAiUrl}/embed`, {
                        texts: [`passage: ${chunk.text}`],
                        normalize: true
                    });

                    const embedding = embeddingResponse.data.embeddings[0];

                    // 儲存分塊和向量
                    await this.pool.query(`
            INSERT INTO legal_chunks (
              document_id, chunk_index, text, embedding, 
              chunk_type, article_number, keyword_tags, legal_concepts
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
                        documentId,
                        i,
                        chunk.text,
                        `[${embedding.join(',')}]`, // PostgreSQL vector format
                        chunk.type || 'article',
                        chunk.article_number,
                        this.extractKeywords(chunk.text),
                        this.extractLegalConcepts(chunk.text)
                    ]);
                }

                results.successful++;
                results.details.push({
                    success: true,
                    title: doc.title,
                    document_id: documentId,
                    chunks_created: chunks.length
                });

                console.log(`✅ 完成: ${doc.title} (${chunks.length} 個分塊)`);

            } catch (error) {
                results.failed++;
                results.details.push({
                    success: false,
                    title: doc.title,
                    error: error.message
                });
                console.error(`❌ 失敗: ${doc.title}`, error.message);
            }
        }

        return results;
    }

    /**
     * 核心向量搜尋功能
     */
    async searchSimilarLegalContent(userQuestion, options = {}) {
        try {
            const {
                maxResults = 5,
                similarityThreshold = 0.7,
                source = null,
                articleNumber = null
            } = options;

            console.log(`🔍 搜尋法規: "${userQuestion.substring(0, 50)}..."`);

            // 1. 將用戶問題向量化
            const queryResponse = await axios.post(`${this.pythonAiUrl}/embed`, {
                texts: [`query: ${userQuestion}`],
                normalize: true
            });

            const queryEmbedding = queryResponse.data.embeddings[0];

            // 2. 執行向量相似度搜尋
            const searchQuery = `
        SELECT 
          lc.id as chunk_id,
          lc.document_id,
          ld.title as document_title,
          lc.text as chunk_text,
          lc.article_number,
          lc.keyword_tags,
          lc.legal_concepts,
          ld.source,
          ld.document_type,
          ld.metadata,
          1 - (lc.embedding <=> $1::vector) as similarity
        FROM legal_chunks lc
        JOIN legal_documents ld ON lc.document_id = ld.id
        WHERE 1 - (lc.embedding <=> $1::vector) >= $2
          AND ld.status = 'active'
          AND ($3::varchar IS NULL OR ld.source = $3)
          AND ($4::varchar IS NULL OR lc.article_number = $4)
        ORDER BY lc.embedding <=> $1::vector
        LIMIT $5
      `;

            const searchResult = await this.pool.query(searchQuery, [
                `[${queryEmbedding.join(',')}]`,
                similarityThreshold,
                source,
                articleNumber,
                maxResults
            ]);

            const results = searchResult.rows.map(row => ({
                chunk_id: row.chunk_id,
                document_id: row.document_id,
                document_title: row.document_title,
                text: row.chunk_text,
                article_number: row.article_number,
                source: row.source,
                document_type: row.document_type,
                similarity: parseFloat(row.similarity),
                keyword_tags: row.keyword_tags,
                legal_concepts: row.legal_concepts,
                metadata: row.metadata
            }));

            console.log(`✅ 找到 ${results.length} 個相關條文`);
            return results;

        } catch (error) {
            console.error('❌ 向量搜尋失敗:', error);
            throw error;
        }
    }

    /**
     * 法規文本智能分塊
     */
    async chunkLegalText(content) {
        try {
            const response = await axios.post(`${this.pythonAiUrl}/chunk`, {
                text: content,
                chunk_size: 500,
                overlap: 50
            });
            return response.data.chunks;
        } catch (error) {
            console.error('法規分塊失敗:', error);
            throw error;
        }
    }

    /**
     * 提取關鍵詞
     */
    extractKeywords(text) {
        const keywords = [];

        // eKYC 相關
        if (text.match(/eKYC|身份驗證|生物特徵|人臉辨識|指紋|虹膜|活體檢測/)) {
            keywords.push('eKYC', '身份驗證', '生物特徵');
        }

        // 法規類型
        if (text.match(/個人資料|隱私保護|資料保護/)) keywords.push('個資保護');
        if (text.match(/資通安全|資訊安全|網路安全/)) keywords.push('資通安全');
        if (text.match(/金融機構|銀行|證券/)) keywords.push('金融法規');
        if (text.match(/AI|人工智慧|演算法|機器學習/)) keywords.push('AI法規');

        return keywords;
    }

    /**
     * 提取法律概念
     */
    extractLegalConcepts(text) {
        const concepts = [];

        if (text.match(/應|不得|得|義務|責任/)) concepts.push('權利義務');
        if (text.match(/處|罰|刑|罰金|罰鍰/)) concepts.push('處罰規定');
        if (text.match(/同意|授權|許可|核准/)) concepts.push('同意機制');
        if (text.match(/安全|保護|防護|措施/)) concepts.push('安全措施');
        if (text.match(/程序|手續|申請|通報/)) concepts.push('行政程序');

        return concepts;
    }
}

module.exports = { LegalVectorManager };
