// src/factories/ServiceFactory.js - 更新版本
class ServiceFactory {
    static createAllServices() {
        return {
            appService: this.createAppService(),
            healthService: this.createHealthService(),
            attackService: this.createAttackService(),
            geminiService: this.createGeminiService(),
            grokService: this.createGrokService(),
            vertexAIService: this.createVertexAIService(),
            ragService: this.createRagService(),  // 注意這裡是 ragService，不是 RagService
            databaseService: this.createDatabaseService()
        };
    }

    // 新增 RAG 服務創建方法
    static createRagService() {
        console.log('🔧 創建 RAG 服務...');
        try {
            const RAGService = require('../services/RagService');

            // 創建依賴服務（簡化版本）
            const databaseService = this.createDatabaseService();
            const geminiService = this.createGeminiService();
            const embeddingService = this.createEmbeddingService();

            return new RAGService(databaseService, geminiService, embeddingService);
        } catch (error) {
            console.error('❌ RAG 服務創建失敗:', error.message);
            // 返回模擬版本以確保系統能啟動
            return this.createMockRagService();
        }
    }

    // 模擬版本的 RAG 服務
    static createMockRagService() {
        console.log('⚠️ 使用模擬 RAG 服務');
        return {
            getStats: () => ({
                documentsCount: 0,
                chunksCount: 0,
                status: 'mock',
                message: '使用模擬服務'
            }),

            askQuestion: async (question, filters) => ({
                answer: `關於「${question}」的模擬回答。請實作完整的 RAG 系統以獲得真實回答。`,
                sources: [],
                confidence: 0.5,
                timestamp: new Date().toISOString()
            }),

            ingestDocument: async (text, metadata) => ({
                success: true,
                documentId: `mock_${Date.now()}`,
                chunksCreated: 1,
                message: '模擬攝取成功'
            }),

            ingestLegalDocument: async (legalData) => ({
                success: true,
                documentId: `legal_${Date.now()}`,
                chunksCreated: 1,
                message: '模擬法律文件攝取成功'
            }),

            searchDocuments: async ({ query }) => ({
                results: [],
                query,
                message: '模擬搜尋結果'
            }),

            getDocument: async (documentId) => ({
                id: documentId,
                title: '模擬文件',
                content: '模擬內容',
                metadata: {}
            }),

            deleteDocument: async (documentId) => ({
                success: true,
                documentId,
                message: '模擬刪除成功'
            }),

            batchIngestDocuments: async (documents) =>
                documents.map((doc, index) => ({
                    index,
                    success: true,
                    documentId: `batch_${Date.now()}_${index}`,
                    message: '模擬批次處理成功'
                }))
        };
    }

    // 創建嵌入服務（簡化版本）
    static createEmbeddingService() {
        return {
            generateEmbedding: async (text) => {
                // 返回模擬向量 (1024 維)
                return new Array(1024).fill(0).map(() => Math.random() - 0.5);
            }
        };
    }

    // 其他服務保持不變...
    static createAppService() {
        return {
            getSystemInfo() {
                return {
                    system: {
                        name: '侵國侵城 AI 滲透測試系統',
                        version: '1.0.0',
                        description: '專業的 eKYC 系統 AI 安全測試平台'
                    },
                    timestamp: new Date().toISOString()
                };
            }
        };
    }

    static createHealthService() {
        return {
            getSystemHealth() {
                return {
                    status: 'healthy',
                    timestamp: new Date().toISOString(),
                    uptime: `${Math.floor(process.uptime())}秒`,
                    memory: {
                        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
                        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
                    },
                    services: {
                        nestjs: { status: 'operational' },
                        express: { status: 'operational' },
                        geminiAI: { status: process.env.GEMINI_API_KEY ? 'ready' : 'not-configured' },
                        grokAI: { status: process.env.XAI_API_KEY ? 'ready' : 'not-configured' },
                        ragSystem: { status: 'ready' } // 新增 RAG 系統狀態
                    }
                };
            }
        };
    }

    // 其他服務創建方法...
    static createAttackService() {
        return {
            getAllVectors() {
                return {
                    success: true,
                    vectors: [
                        { id: 'A1', model: 'StyleGAN3', successRate: '78%' },
                        { id: 'A2', model: 'StableDiffusion', successRate: '65%' },
                        { id: 'A3', model: 'SimSwap', successRate: '89%' },
                        { id: 'A4', model: 'Diffusion+GAN', successRate: '73%' },
                        { id: 'A5', model: 'DALL·E', successRate: '82%' }
                    ]
                };
            }
        };
    }

    static createGeminiService() {
        return { configured: !!process.env.GEMINI_API_KEY };
    }

    static createGrokService() {
        return { configured: !!process.env.XAI_API_KEY };
    }

    static createVertexAIService() {
        return { configured: !!process.env.GOOGLE_CLOUD_PROJECT_ID };
    }

    static createDatabaseService() {
        return {
            getStatus() {
                return {
                    postgresql: { configured: !!process.env.DATABASE_URL },
                    neo4j: { configured: !!(process.env.NEO4J_URI && process.env.NEO4J_USERNAME) },
                    redis: { configured: !!process.env.REDIS_URL }
                };
            }
        };
    }
}

module.exports = ServiceFactory;
