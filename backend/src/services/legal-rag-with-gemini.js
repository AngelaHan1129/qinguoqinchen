// backend/src/services/legal-rag-with-gemini.js
const { LegalVectorManager } = require('./legal-vector-manager.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class LegalRagWithGemini {
    constructor() {
        this.vectorManager = new LegalVectorManager();
        this.genAI = process.env.GEMINI_API_KEY ?
            new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
        this.model = this.genAI?.getGenerativeModel({ model: 'gemini-pro' });

        console.log('🧠 法規 RAG + Gemini AI 系統初始化完成');
    }

    /**
     * 核心功能：智能法規諮詢
     */
    async askLegalQuestion(userQuestion, context = {}) {
        const startTime = Date.now();

        try {
            console.log(`🏛️ 處理法規諮詢: ${userQuestion}`);

            // 1. 向量檢索相關法規
            const relevantLaws = await this.vectorManager.searchSimilarLegalContent(
                userQuestion,
                {
                    maxResults: context.maxResults || 5,
                    similarityThreshold: context.similarityThreshold || 0.7,
                    source: context.source
                }
            );

            if (relevantLaws.length === 0) {
                return {
                    success: false,
                    answer: '抱歉，在現有法規資料庫中找不到與您問題相關的條文。請嘗試調整問題描述或聯繫法規專家。',
                    retrievedLaws: [],
                    confidence: 0,
                    responseTime: Date.now() - startTime,
                    timestamp: new Date()
                };
            }

            // 2. 構建 Gemini 提示詞
            const prompt = this.buildLegalPrompt(userQuestion, relevantLaws, context);

            // 3. 使用 Gemini AI 生成專業法規建議
            let geminiResponse;
            if (this.model) {
                const result = await this.model.generateContent(prompt);
                geminiResponse = result.response.text();
            } else {
                // 如果沒有 Gemini API，提供基於檢索的基本回應
                geminiResponse = this.generateBasicLegalAdvice(userQuestion, relevantLaws);
            }

            // 4. 儲存查詢歷史
            await this.saveQueryHistory(userQuestion, relevantLaws, geminiResponse, Date.now() - startTime);

            // 5. 組裝完整回應
            const response = {
                success: true,
                answer: geminiResponse,
                retrievedLaws: relevantLaws.map(law => ({
                    document_title: law.document_title,
                    article_number: law.article_number,
                    source: law.source,
                    document_type: law.document_type,
                    similarity: Math.round(law.similarity * 100) / 100,
                    relevantText: law.text.length > 300 ? law.text.substring(0, 300) + '...' : law.text,
                    keyword_tags: law.keyword_tags,
                    legal_concepts: law.legal_concepts
                })),
                searchMetadata: {
                    totalRetrieved: relevantLaws.length,
                    maxSimilarity: relevantLaws[0].similarity,
                    avgSimilarity: relevantLaws.reduce((sum, law) => sum + law.similarity, 0) / relevantLaws.length,
                    responseTime: Date.now() - startTime
                },
                complianceLevel: this.assessComplianceLevel(relevantLaws),
                riskAssessment: this.assessLegalRisk(relevantLaws, context),
                recommendations: this.extractRecommendations(geminiResponse),
                timestamp: new Date()
            };

            console.log(`✅ 法規諮詢完成，耗時 ${Date.now() - startTime}ms`);
            return response;

        } catch (error) {
            console.error(`❌ 法規諮詢失敗: ${error.message}`);
            return {
                success: false,
                error: `法規諮詢失敗: ${error.message}`,
                retrievedLaws: [],
                responseTime: Date.now() - startTime,
                timestamp: new Date()
            };
        }
    }

    /**
     * 構建專業法規分析提示詞
     */
    buildLegalPrompt(userQuestion, relevantLaws, context) {
        const lawsContext = relevantLaws.map((law, index) =>
            `【法規條文 ${index + 1}】
文件：${law.document_title}
來源：${law.source}
條文：${law.article_number || '相關條文'}
相似度：${(law.similarity * 100).toFixed(1)}%
內容：${law.text}
法律概念：${law.legal_concepts.join(', ')}
關鍵標籤：${law.keyword_tags.join(', ')}
`
        ).join('\n\n');

        return `你是「侵國侵城」eKYC 系統的專業法規顧問，專精台灣資訊安全與個資保護法規。

【用戶問題】
${userQuestion}

【情境背景】
產業領域：${context.industryType || 'eKYC 身份驗證'}
系統類型：${context.systemType || 'AI 驅動的身份驗證系統'}
地理範圍：${context.jurisdiction || 'Taiwan'}
風險等級：${context.riskLevel || 'Medium'}

【相關法規條文】（基於向量相似度檢索）
${lawsContext}

【專業分析要求】
請基於上述檢索到的法規條文，提供結構化的法規遵循分析：

1. **直接回答**：針對問題給出明確的法規指導
2. **法規依據**：詳細引用相關條文並解釋適用性
3. **合規要求**：列出必須遵守的強制性規定
4. **實務建議**：提供具體的技術和管理建議
5. **風險評估**：分析不合規的潛在後果
6. **行動方案**：建議具體的實施步驟和時程

請使用專業嚴謹的法規語調，確保引用條文的準確性。對於模糊或需要進一步確認的部分，請明確指出。`;
    }

    /**
     * 生成基本法規建議（無 Gemini API 時）
     */
    generateBasicLegalAdvice(userQuestion, relevantLaws) {
        const topLaw = relevantLaws[0];

        return `根據向量檢索分析，針對您的問題「${userQuestion}」，找到以下相關法規：

主要適用條文：
- ${topLaw.document_title} ${topLaw.article_number}
- 來源：${topLaw.source}
- 相關度：${(topLaw.similarity * 100).toFixed(1)}%

法規要點：
${topLaw.text}

合規建議：
1. 確保符合${topLaw.document_title}的相關規定
2. 建立適當的${topLaw.legal_concepts.join('、')}機制
3. 實施必要的安全措施和程序

請注意：此為基於 AI 向量檢索的初步分析，建議進一步諮詢法律專家以獲得更詳細的指導。`;
    }

    /**
     * 評估合規等級
     */
    assessComplianceLevel(relevantLaws) {
        const mandatoryLaws = relevantLaws.filter(law =>
            law.legal_concepts.includes('權利義務') ||
            law.legal_concepts.includes('處罰規定')
        );

        if (mandatoryLaws.length >= 3) return 'HIGH';
        if (mandatoryLaws.length >= 1) return 'MEDIUM';
        return 'LOW';
    }

    /**
     * 評估法律風險
     */
    assessLegalRisk(relevantLaws, context) {
        let riskScore = 0;

        // 基於檢索結果評估
        relevantLaws.forEach(law => {
            if (law.legal_concepts.includes('處罰規定')) riskScore += 30;
            if (law.legal_concepts.includes('權利義務')) riskScore += 20;
            if (law.similarity > 0.8) riskScore += 15;
        });

        // 基於產業調整
        if (context.industryType === 'finance') riskScore += 20;
        if (context.systemType?.includes('eKYC')) riskScore += 10;

        let level = 'LOW';
        if (riskScore >= 70) level = 'CRITICAL';
        else if (riskScore >= 50) level = 'HIGH';
        else if (riskScore >= 30) level = 'MEDIUM';

        return {
            level,
            score: Math.min(riskScore, 100),
            factors: [...new Set(relevantLaws.flatMap(law => law.legal_concepts))],
            recommendation: this.getRiskRecommendation(level)
        };
    }

    getRiskRecommendation(level) {
        const recommendations = {
            CRITICAL: '立即尋求專業法律諮詢並暫停相關作業直到合規',
            HIGH: '優先處理合規問題，建議在30天內完成整改',
            MEDIUM: '檢視現有程序，建議在60天內優化合規措施',
            LOW: '維持現狀並定期檢視相關法規更新'
        };
        return recommendations[level];
    }

    /**
     * 從 Gemini 回應中提取建議
     */
    extractRecommendations(geminiResponse) {
        const recommendations = [];
        const lines = geminiResponse.split('\n');

        lines.forEach(line => {
            if (line.match(/^[0-9]+\.|^-|^•|建議|應該|必須/)) {
                const cleaned = line.replace(/^[0-9]+\.|\s*-\s*|\s*•\s*/, '').trim();
                if (cleaned.length > 10) {
                    recommendations.push(cleaned);
                }
            }
        });

        return recommendations.slice(0, 5); // 最多返回5個建議
    }

    /**
     * 儲存查詢歷史
     */
    async saveQueryHistory(question, retrievedLaws, geminiResponse, responseTime) {
        try {
            await this.vectorManager.pool.query(`
        INSERT INTO legal_queries (
          user_question, retrieved_chunks_ids, similarity_scores, 
          gemini_response, response_time_ms
        )
        VALUES ($1, $2, $3, $4, $5)
      `, [
                question,
                retrievedLaws.map(law => law.chunk_id),
                retrievedLaws.map(law => law.similarity),
                geminiResponse,
                responseTime
            ]);
        } catch (error) {
            console.error('儲存查詢歷史失敗:', error);
        }
    }

    /**
     * 匯入法規文件
     */
    async ingestLegalDocuments(documents) {
        return await this.vectorManager.ingestLegalDocumentsWithVectorization(documents);
    }

    /**
     * 健康檢查
     */
    async healthCheck() {
        try {
            const dbTest = await this.vectorManager.pool.query('SELECT 1');

            return {
                status: 'healthy',
                service: '法規 RAG + Gemini AI',
                version: '2.0.0',
                components: {
                    vectorDatabase: dbTest.rows.length > 0 ? 'healthy' : 'unhealthy',
                    pythonAI: 'connected',
                    geminiAI: !!this.model ? 'configured' : 'not-configured'
                },
                capabilities: [
                    '向量相似度法規檢索',
                    'Gemini AI 法規分析',
                    '智能合規建議',
                    '風險評估與建議'
                ],
                timestamp: new Date()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date()
            };
        }
    }
}

function createLegalRagWithGemini() {
    return new LegalRagWithGemini();
}

module.exports = { createLegalRagWithGemini };
