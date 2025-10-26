// tests/setup/test-server.js
const express = require('express');
const { MockRAGService } = require('../mocks/mock-services');

class TestServer {
    constructor() {
        this.app = express();
        this.ragService = new MockRAGService();
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });

        this.app.use((req, res, next) => {
            console.log(`${req.method} ${req.path}`, req.query, req.body);
            next();
        });
    }

    setupRoutes() {
        // RAG合規查詢端點
        this.app.get('/api/rag/compliance', async (req, res) => {
            try {
                const { query } = req.query;

                if (!query) {
                    return res.status(400).json({
                        error: 'Query parameter is required',
                        code: 'MISSING_QUERY'
                    });
                }

                const results = await this.ragService.queryCompliance(query);

                res.json({
                    success: true,
                    query,
                    results: results.results || [],
                    total: results.results?.length || 0,
                    processing_time: Math.floor(Math.random() * 500) + 100,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                res.status(500).json({
                    error: 'Internal server error',
                    message: error.message,
                    code: 'RAG_SERVICE_ERROR'
                });
            }
        });

        // AI攻擊檢測端點
        this.app.post('/api/ai/attack-detection', async (req, res) => {
            try {
                const { inputData, detectionType } = req.body;

                if (!inputData || !detectionType) {
                    return res.status(400).json({
                        error: 'inputData and detectionType are required',
                        code: 'MISSING_PARAMETERS'
                    });
                }

                const result = await this.ragService.detectAttack(inputData, detectionType);

                res.json({
                    success: true,
                    inputData,
                    detectionType,
                    ...result,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                res.status(500).json({
                    error: 'Detection service error',
                    message: error.message,
                    code: 'AI_DETECTION_ERROR'
                });
            }
        });

        // 健康檢查端點
        this.app.get('/api/health', (req, res) => {
            res.json({
                status: 'healthy',
                services: {
                    rag: 'active',
                    ai_detection: 'active',
                    vertex_ai: 'active'
                },
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            });
        });

        // 404處理
        this.app.use((req, res) => {
            res.status(404).json({
                error: 'Endpoint not found',
                path: req.path,
                method: req.method,
                code: 'NOT_FOUND'
            });
        });
    }

    start(port = 3001) {
        return new Promise((resolve) => {
            this.server = this.app.listen(port, () => {
                console.log(`🧪 測試伺服器啟動於 http://localhost:${port}`);
                resolve(this.server);
            });
        });
    }

    stop() {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    console.log('🛑 測試伺服器已停止');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = TestServer;
