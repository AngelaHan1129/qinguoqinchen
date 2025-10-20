// backend/src/services/rag-service.js
function createRagService() {
    console.log('📖 初始化 RAG 服務...');

    return {
        async askQuestion(question, filters = {}) {
            console.log(`📖 RAG 問答: ${question}`);

            // 模擬 RAG 回應
            const answer = `根據知識庫搜尋，關於「${question}」的回答：

這是一個模擬的 RAG (檢索增強生成) 回應。在真實環境中，系統會：
1. 使用向量相似度檢索相關文檔
2. 將檢索到的內容作為上下文
3. 使用 AI 模型生成準確的回答

查詢條件: ${JSON.stringify(filters, null, 2)}
處理時間: ${Date.now() % 1000}ms`;

            return {
                answer,
                sources: [
                    {
                        documentId: 'doc_001',
                        similarity: 0.89,
                        preview: '相關文檔內容預覽：這是一個示例文檔片段...',
                        metadata: {
                            title: '滲透測試報告',
                            type: 'report',
                            date: '2025-10-14'
                        }
                    },
                    {
                        documentId: 'doc_002',
                        similarity: 0.76,
                        preview: '另一個相關文檔：包含安全測試相關資訊...',
                        metadata: {
                            title: 'eKYC 安全指南',
                            type: 'guide',
                            date: '2025-10-13'
                        }
                    }
                ],
                searchMetadata: {
                    query: question,
                    filters: filters,
                    processingTime: Date.now() % 1000,
                    totalDocuments: 250,
                    relevantDocuments: 2
                },
                timestamp: new Date()
            };
        }
    };
}

module.exports = { createRagService };
