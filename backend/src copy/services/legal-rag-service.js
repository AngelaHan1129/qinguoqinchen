// backend/src/services/legal-rag-service.js
const { Pool } = require('pg');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class LegalRagService {
    constructor() {
        // PostgreSQL 連接
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        // Gemini AI 初始化
        this.genAI = process.env.GEMINI_API_KEY ?
            new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
        this.model = this.genAI?.getGenerativeModel({ model: 'gemini-pro' });

        // Python AI 服務 URL
        this.pythonAiUrl = process.env.PYTHON_AI_URL || 'http://localhost:8000';

        console.log('🏛️ 法規 RAG 服務初始化完成');
    }

    /**
     * 智能法規查詢 (核心功能)
     * @param {string} question - 使用者問題
     * @param {Object} context - 查詢上下文
     * @returns {Promise<Object>} - 法規建議回應
     */
    async askLegalCompliance(question, context = {}) {
        const startTime = Date.now();

        try {
            console.log(`🔍 處理法規查詢: ${question.substring(0, 50)}...`);

            // 1. 生成查詢向量
            const queryEmbedding = await this.generateEmbedding(`query: ${question}`);

            // 2. 向量相似度搜尋
            const relevantChunks = await this.searchSimilarChunks(queryEmbedding, context);

            // 3. 構建 Gemini 提示詞
            const prompt = this.buildLegalPrompt(question, relevantChunks, context);

            // 4. 使用 Gemini 生成專業法規建議
            const geminiResponse = await this.generateLegalAdvice(prompt);

            // 5. 儲存查詢歷史
            await this.saveQueryHistory(question, context, geminiResponse.text, relevantChunks, Date.now() - startTime);

            return {
                success: true,
                answer: geminiResponse.text,
                regulations: relevantChunks.map(chunk => ({
                    documentId: chunk.document_id,
                    title: chunk.document_title,
                    source: chunk.source,
                    similarity: chunk.similarity,
                    citation: `${chunk.source} - ${chunk.document_title}`,
                    relevantText: chunk.chunk_text.substring(0, 200) + '...'
                })),
                metadata: {
                    queryTime: Date.now() - startTime,
                    chunksRetrieved: relevantChunks.length,
                    model: 'gemini-pro',
                    embeddingModel: 'multilingual-e5-large'
                },
                timestamp: new Date()
            };

        } catch (error) {
            console.error(`❌ 法規查詢失敗: ${error.message}`);
            return {
                success: false,
                error: `法規查詢失敗: ${error.message}`,
                timestamp: new Date()
            };
        }
    }

    /**
     * 批量匯入法規文件
     * @param {Array} documents - 法規文件列表
     * @returns {Promise<Object>} - 匯入結果
     */
    async ingestLegalDocuments(documents) {
        const results = [];

        for (const doc of documents) {
            try {
                console.log(`📥 匯入法規: ${doc.title}`);

                // 1. 儲存文件
                const docResult = await this.pool.query(`
          INSERT INTO legal_documents (title, content, source, document_type, jurisdiction, metadata)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `, [doc.title, doc.content, doc.source, doc.documentType, doc.jurisdiction, doc.metadata]);

                const documentId = docResult.rows[0].id;

                // 2. 分塊文件
                const chunks = await this.chunkLegalDocument(doc.content);

                // 3. 生成向量並儲存
                for (let i = 0; i < chunks.length; i++) {
                    const chunk = chunks[i];
                    const embedding = await this.generateEmbedding(`passage: ${chunk.text}`);

                    await this.pool.query(`
            INSERT INTO legal_chunks (document_id, chunk_index, text, embedding, metadata)
            VALUES ($1, $2, $3, $4, $5)
          `, [
                        documentId,
                        chunk.chunk_index,
                        chunk.text,
                        `[${embedding.join(',')}]`,
                        { ...chunk, article_number: chunk.article_number }
                    ]);
                }

                results.push({
                    success: true,
                    documentId,
                    title: doc.title,
                    chunksCount: chunks.length
                });

            } catch (error) {
                results.push({
                    success: false,
                    title: doc.title,
                    error: error.message
                });
            }
        }

        return {
            total: documents.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            details: results
        };
    }

    /**
     * 向量相似度搜尋
     * @param {Array} queryEmbedding - 查詢向量
     * @param {Object} context - 搜尋上下文
     * @returns {Promise<Array>} - 相似文檔
     */
    async searchSimilarChunks(queryEmbedding, context, limit = 10) {
        try {
            let query = `
        SELECT 
          lc.id as chunk_id,
          lc.document_id,
          ld.title as document_title,
          lc.text as chunk_text,
          1 - (lc.embedding <=> $1) as similarity,
          lc.metadata,
          ld.source
        FROM legal_chunks lc
        JOIN legal_documents ld ON lc.document_id = ld.id
        WHERE 1 - (lc.embedding <=> $1) >= 0.7
          AND ld.status = 'active'
      `;

            const params = [`[${queryEmbedding.join(',')}]`];

            // 添加上下文過濾
            if (context.jurisdiction) {
                query += ` AND ld.jurisdiction = $${params.length + 1}`;
                params.push(context.jurisdiction);
            }

            if (context.source) {
                query += ` AND ld.source = $${params.length + 1}`;
                params.push(context.source);
            }

            query += ` ORDER BY lc.embedding <=> $1 LIMIT ${limit}`;

            const result = await this.pool.query(query, params);
            return result.rows;

        } catch (error) {
            console.error('向量搜尋失敗:', error);
            return [];
        }
    }

    /**
     * 生成文本向量
     * @param {string} text - 輸入文本
     * @returns {Promise<Array>} - 向量數組
     */
    async generateEmbedding(text) {
        try {
            const response = await axios.post(`${this.pythonAiUrl}/embed`, {
                texts: [text],
                normalize: true,
                instruction: text.startsWith('query:') ? 'query: ' : 'passage: '
            });

            return response.data.embeddings[0];
        } catch (error) {
            console.error('向量生成失敗:', error);
            throw error;
        }
    }

    /**
     * 分塊法規文件
     * @param {string} content - 文件內容
     * @returns {Promise<Array>} - 分塊結果
     */
    async chunkLegalDocument(content) {
        try {
            const response = await axios.post(`${this.pythonAiUrl}/chunk`, {
                text: content,
                chunk_size: 500,
                overlap: 50
            });

            return response.data.chunks;
        } catch (error) {
            console.error('文件分塊失敗:', error);
            throw error;
        }
    }

    /**
     * 建構法規提示詞
     * @param {string} question - 使用者問題
     * @param {Array} chunks - 相關條文
     * @param {Object} context - 上下文
     * @returns {string} - 完整提示詞
     */
    buildLegalPrompt(question, chunks, context) {
        const relevantLaws = chunks.map((chunk, index) =>
            `【法規 ${index + 1}】
來源：${chunk.source} - ${chunk.document_title}
相似度：${(chunk.similarity * 100).toFixed(1)}%
條文內容：${chunk.chunk_text}
`
        ).join('\n\n');

        return `你是「侵國侵城」專業的資安法規遵循顧問，專精於台灣資安相關法律。

【使用者問題】
${question}

【查詢背景】
產業領域：${context.industryScope || '一般企業'}
管轄區域：${context.jurisdiction || 'Taiwan'}
系統類型：${context.systemType || 'eKYC系統'}

【相關法規條文】
${relevantLaws}

【回應要求】
請基於上述法規條文，提供專業的合規建議：

1. **直接回答**：針對問題給出明確的法律意見
2. **法規要求**：說明相關的強制性和建議性要求
3. **合規步驟**：提供具體的實作建議
4. **風險評估**：分析不合規的潛在風險和罰則
5. **最佳實務**：建議業界最佳實務做法

請使用繁體中文，保持專業嚴謹的語調，並引用具體的法規條文。`;
    }

    /**
     * 使用 Gemini 生成法規建議
     * @param {string} prompt - 完整提示詞
     * @returns {Promise<Object>} - Gemini 回應
     */
    async generateLegalAdvice(prompt) {
        if (!this.model) {
            throw new Error('Gemini AI 未配置，請設定 GEMINI_API_KEY');
        }

        try {
            const result = await this.model.generateContent(prompt);
            return result.response;
        } catch (error) {
            console.error('Gemini 生成失敗:', error);
            throw error;
        }
    }

    /**
     * 儲存查詢歷史
     * @param {string} question - 問題
     * @param {Object} context - 上下文
     * @param {string} answer - 回答
     * @param {Array} chunks - 檢索到的條文
     * @param {number} responseTime - 回應時間
     */
    async saveQueryHistory(question, context, answer, chunks, responseTime) {
        try {
            await this.pool.query(`
        INSERT INTO legal_queries (question, context, answer, retrieved_chunks, response_time_ms)
        VALUES ($1, $2, $3, $4, $5)
      `, [
                question,
                context,
                answer,
                chunks.map(c => ({ chunk_id: c.chunk_id, similarity: c.similarity })),
                responseTime
            ]);
        } catch (error) {
            console.error('儲存查詢歷史失敗:', error);
        }
    }

    async healthCheck() {
        return {
            status: 'healthy',
            service: '法規遵循 RAG 系統',
            version: '1.0.0',
            connections: {
                postgres: await this.testPostgres(),
                pythonAI: await this.testPythonAI(),
                gemini: !!this.model
            },
            timestamp: new Date()
        };
    }

    async testPostgres() {
        try {
            await this.pool.query('SELECT 1');
            return 'connected';
        } catch (error) {
            return 'disconnected';
        }
    }

    async testPythonAI() {
        try {
            await axios.get(`${this.pythonAiUrl}/health`);
            return 'connected';
        } catch (error) {
            return 'disconnected';
        }
    }
}

function createLegalRagService() {
    return new LegalRagService();
}

module.exports = { createLegalRagService };
