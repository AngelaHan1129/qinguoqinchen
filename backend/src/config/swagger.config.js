// src/config/swagger.config.js - 添加 RAG API 支援
class SwaggerConfig {
    static getSwaggerSpec() {
        return {
            openapi: '3.0.0',
            info: {
                title: '侵國侵城 AI 滲透測試系統 API',
                version: '1.0.0',
                description: `
# 🎯 侵國侵城 AI 滲透測試系統

專業的 eKYC 系統 AI 安全測試平台，提供多重 AI 攻擊向量模擬和智能分析功能。

## 🚀 主要功能
- **AI 攻擊向量模擬**: StyleGAN3、SimSwap、DALL·E 等技術
- **量化風險評估**: APCER、BPCER、威脅等級分析  
- **RAG 知識管理**: 文件攝取、智能問答、語義搜尋
- **實時系統監控**: 健康檢查、效能統計
- **智能安全分析**: Gemini AI、Grok AI 整合

## 🏆 競賽資訊
- **競賽**: 2025 InnoServe 大專校院資訊應用服務創新競賽
- **團隊**: 侵國侵城團隊
- **學校**: 國立臺中科技大學
                `,
                contact: {
                    name: '侵國侵城團隊',
                    email: 'qinguoqinchen@nutc.edu.tw'
                }
            },
            servers: [
                {
                    url: `http://localhost:${process.env.PORT || 7939}`,
                    description: '開發環境'
                }
            ],
            paths: {
                // 原有的系統路由...
                '/': {
                    get: {
                        tags: ['System'],
                        summary: '系統首頁',
                        responses: { 200: { description: '系統資訊' } }
                    }
                },
                '/health': {
                    get: {
                        tags: ['System'],
                        summary: '系統健康檢查',
                        responses: { 200: { description: '健康狀態' } }
                    }
                },
                '/ai-attack/vectors': {
                    get: {
                        tags: ['AI Attack'],
                        summary: '取得所有攻擊向量',
                        responses: { 200: { description: '攻擊向量列表' } }
                    }
                },
                '/ai-attack/execute': {
                    post: {
                        tags: ['AI Attack'],
                        summary: '執行 AI 攻擊測試',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/AttackRequest' }
                                }
                            }
                        },
                        responses: { 200: { description: '攻擊測試結果' } }
                    }
                },

                // === RAG 系統 API ===
                '/rag/stats': {
                    get: {
                        tags: ['RAG System'],
                        summary: '取得 RAG 系統統計',
                        description: '返回 RAG 系統的統計資訊，包括文件數量、處理狀態等',
                        responses: {
                            200: {
                                description: 'RAG 系統統計資訊',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                success: { type: 'boolean', example: true },
                                                stats: {
                                                    type: 'object',
                                                    properties: {
                                                        documentsCount: { type: 'integer', example: 150 },
                                                        chunksCount: { type: 'integer', example: 1500 },
                                                        status: { type: 'string', example: 'ready' }
                                                    }
                                                },
                                                timestamp: { type: 'string', format: 'date-time' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                '/rag/ask': {
                    post: {
                        tags: ['RAG System'],
                        summary: 'RAG 問答',
                        description: '基於已攝取的文件進行智能問答',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['question'],
                                        properties: {
                                            question: {
                                                type: 'string',
                                                example: 'eKYC 系統如何防範 Deepfake 攻擊？',
                                                description: '要詢問的問題'
                                            },
                                            filters: {
                                                type: 'object',
                                                description: '搜尋過濾條件',
                                                properties: {
                                                    documentType: { type: 'string', example: 'legal' },
                                                    category: { type: 'string', example: 'security' }
                                                }
                                            }
                                        }
                                    },
                                    examples: {
                                        securityQuestion: {
                                            summary: '安全相關問題',
                                            value: {
                                                question: 'eKYC 系統的主要安全威脅有哪些？',
                                                filters: { documentType: 'security' }
                                            }
                                        },
                                        legalQuestion: {
                                            summary: '法規相關問題',
                                            value: {
                                                question: '個人資料保護法對 eKYC 系統有什麼要求？',
                                                filters: { documentType: 'legal' }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: '問答結果',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                success: { type: 'boolean' },
                                                answer: { type: 'string', example: 'eKYC 系統主要面臨以下威脅...' },
                                                sources: {
                                                    type: 'array',
                                                    items: { type: 'string' }
                                                },
                                                confidence: { type: 'number', format: 'float', example: 0.95 }
                                            }
                                        }
                                    }
                                }
                            },
                            400: { description: '請求參數錯誤' }
                        }
                    }
                },

                '/rag/ingest/text': {
                    post: {
                        tags: ['RAG System'],
                        summary: '攝取文字文件',
                        description: '將文字內容攝取到 RAG 系統中',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['text'],
                                        properties: {
                                            text: {
                                                type: 'string',
                                                example: 'eKYC (電子化身分識別與核實程序) 是一種利用電子方式進行身分識別和驗證的技術...',
                                                description: '要攝取的文字內容 (10-100000 字元)',
                                                minLength: 10,
                                                maxLength: 100000
                                            },
                                            metadata: {
                                                type: 'object',
                                                description: '文件元資料',
                                                properties: {
                                                    title: { type: 'string', example: 'eKYC 系統介紹' },
                                                    category: { type: 'string', example: 'technical' },
                                                    source: { type: 'string', example: '內部文件' },
                                                    author: { type: 'string', example: '侵國侵城團隊' }
                                                }
                                            }
                                        }
                                    },
                                    examples: {
                                        technicalDoc: {
                                            summary: '技術文件',
                                            value: {
                                                text: 'eKYC 系統整合了多種 AI 技術，包括人臉辨識、活體檢測、OCR 文件辨識等...',
                                                metadata: {
                                                    title: 'eKYC 技術架構',
                                                    category: 'technical',
                                                    source: '技術規格書'
                                                }
                                            }
                                        },
                                        securityDoc: {
                                            summary: '安全文件',
                                            value: {
                                                text: 'Deepfake 攻擊是 eKYC 系統面臨的主要威脅之一，需要採用多層防護策略...',
                                                metadata: {
                                                    title: 'eKYC 安全威脅分析',
                                                    category: 'security',
                                                    source: '安全分析報告'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: '文件攝取成功',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                success: { type: 'boolean' },
                                                documentId: { type: 'string', example: 'doc_123456' },
                                                chunksCreated: { type: 'integer', example: 5 },
                                                message: { type: 'string', example: '文件攝取成功' }
                                            }
                                        }
                                    }
                                }
                            },
                            400: { description: '請求參數錯誤' }
                        }
                    }
                },

                '/rag/ingest/legal': {
                    post: {
                        tags: ['RAG System'],
                        summary: '攝取法律文件',
                        description: '攝取法律法規文件到 RAG 系統',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['title', 'content'],
                                        properties: {
                                            title: { type: 'string', example: '個人資料保護法' },
                                            content: { type: 'string', example: '第一條 為規範個人資料之蒐集、處理及利用...' },
                                            source: { type: 'string', example: '全國法規資料庫' },
                                            documentType: { type: 'string', enum: ['regulation', 'law', 'guideline'], default: 'regulation' },
                                            jurisdiction: { type: 'string', default: 'TW', example: 'TW' },
                                            lawCategory: { type: 'string', example: 'privacy' },
                                            articleNumber: { type: 'string', example: '第1條' },
                                            effectiveDate: { type: 'string', format: 'date', example: '2012-10-01' },
                                            metadata: { type: 'object' }
                                        }
                                    },
                                    examples: {
                                        privacyLaw: {
                                            summary: '隱私法規',
                                            value: {
                                                title: '個人資料保護法第6條',
                                                content: '有關醫療、基因、性生活、健康檢查及犯罪前科之個人資料，不得蒐集、處理或利用...',
                                                source: '全國法規資料庫',
                                                documentType: 'regulation',
                                                jurisdiction: 'TW',
                                                lawCategory: 'privacy',
                                                articleNumber: '第6條'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            200: { description: '法律文件攝取成功' },
                            400: { description: '請求參數錯誤' }
                        }
                    }
                },

                '/rag/search': {
                    post: {
                        tags: ['RAG System'],
                        summary: '搜尋文件',
                        description: '基於語義相似度搜尋相關文件',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['query'],
                                        properties: {
                                            query: { type: 'string', example: 'Deepfake 攻擊防護' },
                                            limit: { type: 'integer', minimum: 1, maximum: 50, default: 10, example: 5 },
                                            threshold: { type: 'number', minimum: 0.1, maximum: 1.0, default: 0.7, example: 0.8 },
                                            documentTypes: {
                                                type: 'array',
                                                items: { type: 'string' },
                                                example: ['technical', 'security']
                                            },
                                            timeRange: {
                                                type: 'object',
                                                properties: {
                                                    startDate: { type: 'string', format: 'date' },
                                                    endDate: { type: 'string', format: 'date' }
                                                }
                                            }
                                        }
                                    },
                                    examples: {
                                        securitySearch: {
                                            summary: '安全主題搜尋',
                                            value: {
                                                query: 'eKYC 系統安全威脅',
                                                limit: 10,
                                                threshold: 0.75,
                                                documentTypes: ['security', 'technical']
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: '搜尋結果',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                success: { type: 'boolean' },
                                                results: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            documentId: { type: 'string' },
                                                            title: { type: 'string' },
                                                            content: { type: 'string' },
                                                            similarity: { type: 'number', format: 'float' },
                                                            metadata: { type: 'object' }
                                                        }
                                                    }
                                                },
                                                query: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                '/rag/document/{documentId}': {
                    get: {
                        tags: ['RAG System'],
                        summary: '取得文件詳情',
                        description: '根據文件 ID 取得文件的詳細資訊',
                        parameters: [
                            {
                                name: 'documentId',
                                in: 'path',
                                required: true,
                                schema: { type: 'string' },
                                example: 'doc_123456',
                                description: '文件 ID'
                            }
                        ],
                        responses: {
                            200: { description: '文件詳情' },
                            404: { description: '文件不存在' }
                        }
                    },
                    delete: {
                        tags: ['RAG System'],
                        summary: '刪除文件',
                        description: '刪除指定的文件及其相關資料',
                        parameters: [
                            {
                                name: 'documentId',
                                in: 'path',
                                required: true,
                                schema: { type: 'string' },
                                example: 'doc_123456'
                            },
                            {
                                name: 'cascade',
                                in: 'query',
                                schema: { type: 'boolean', default: true },
                                description: '是否級聯刪除相關資料'
                            }
                        ],
                        responses: {
                            200: { description: '刪除成功' },
                            404: { description: '文件不存在' }
                        }
                    }
                },

                '/rag/batch/ingest': {
                    post: {
                        tags: ['RAG System'],
                        summary: '批次文件攝取',
                        description: '批次攝取多個文件到 RAG 系統（最多 50 個）',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['documents'],
                                        properties: {
                                            documents: {
                                                type: 'array',
                                                maxItems: 50,
                                                items: {
                                                    type: 'object',
                                                    required: ['text'],
                                                    properties: {
                                                        text: { type: 'string' },
                                                        metadata: { type: 'object' }
                                                    }
                                                },
                                                example: [
                                                    {
                                                        text: 'eKYC 系統技術規格...',
                                                        metadata: { title: '技術規格書', category: 'technical' }
                                                    },
                                                    {
                                                        text: '安全威脅分析報告...',
                                                        metadata: { title: '威脅分析', category: 'security' }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: '批次處理結果',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                success: { type: 'boolean' },
                                                results: { type: 'array', items: { type: 'object' } },
                                                summary: {
                                                    type: 'object',
                                                    properties: {
                                                        total: { type: 'integer' },
                                                        successful: { type: 'integer' },
                                                        failed: { type: 'integer' },
                                                        successRate: { type: 'string' }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },

            tags: [
                { name: 'System', description: '系統管理和監控' },
                { name: 'AI Attack', description: 'AI 攻擊向量模擬和測試' },
                { name: 'RAG System', description: 'RAG 知識管理系統' }, // 新增 RAG 標籤
                { name: 'Admin', description: '管理員功能' }
            ],

            components: {
                schemas: {
                    // 原有的 schemas...
                    AttackRequest: {
                        type: 'object',
                        required: ['vectorIds'],
                        properties: {
                            vectorIds: {
                                type: 'array',
                                items: { type: 'string', enum: ['A1', 'A2', 'A3', 'A4', 'A5'] }
                            },
                            intensity: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' }
                        }
                    }
                    // 可以在這裡添加更多 RAG 相關的 schemas
                }
            }
        };
    }

    // setupSwagger 方法保持不變...
    static setupSwagger(app) {
        try {
            const swaggerUi = require('swagger-ui-express');
            const specs = this.getSwaggerSpec();

            const swaggerUiOptions = {
                customCss: `
                    .swagger-ui .topbar { display: none }
                    .swagger-ui .info .title { color: #1976d2; }
                    .swagger-ui .info .description { font-size: 14px; }
                `,
                customSiteTitle: '侵國侵城 AI API 文檔',
                swaggerOptions: {
                    persistAuthorization: true,
                    displayRequestDuration: true,
                    tryItOutEnabled: true
                }
            };

            app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
            app.get('/api/docs.json', (req, res) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(specs);
            });

            console.log('📚 Swagger 文檔已設置完成');
            console.log(`📍 API 文檔: http://localhost:${process.env.PORT || 7939}/api/docs`);

        } catch (error) {
            console.log('⚠️ Swagger UI 套件未安裝，使用簡化版本');
            this.setupSimpleSwagger(app);
        }
    }
    static setupSimpleSwagger(app) {
        const specs = this.getSwaggerSpec();

        // 提供 JSON 規格
        app.get('/api/docs.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(specs);
        });

        // 提供簡單的 HTML 文檔頁面
        app.get('/api/docs', (req, res) => {
            res.setHeader('Content-Type', 'text/html');
            res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>侵國侵城 AI API 文檔</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: #1976d2; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .method { display: inline-block; padding: 4px 8px; color: white; border-radius: 3px; font-weight: bold; }
        .get { background: #61affe; }
        .post { background: #49cc90; }
        .code { background: #f8f8f8; padding: 10px; border-radius: 4px; font-family: monospace; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 侵國侵城 AI 滲透測試系統 API</h1>
        <p>專業的 eKYC 系統 AI 安全測試平台</p>
        <p><strong>團隊</strong>: 侵國侵城團隊 | <strong>學校</strong>: 國立臺中科技大學</p>
    </div>
    
    <h2>📚 API 端點</h2>
    
    <div class="endpoint">
        <span class="method get">GET</span> <strong>/</strong>
        <p>系統首頁 - 取得系統基本資訊</p>
    </div>
    
    <div class="endpoint">
        <span class="method get">GET</span> <strong>/health</strong>
        <p>系統健康檢查 - 檢查系統運行狀態</p>
    </div>
    
    <div class="endpoint">
        <span class="method get">GET</span> <strong>/ai-attack/vectors</strong>
        <p>取得所有攻擊向量 - 返回可用的 AI 攻擊向量列表</p>
    </div>
    
    <div class="endpoint">
        <span class="method post">POST</span> <strong>/ai-attack/execute</strong>
        <p>執行 AI 攻擊測試 - 執行指定的攻擊向量測試</p>
        <div class="code">
{
  "vectorIds": ["A1", "A3"],
  "intensity": "high"
}
        </div>
    </div>
    
    <div class="endpoint">
        <span class="method get">GET</span> <strong>/admin/stats</strong>
        <p>系統統計 - 取得系統運行統計資訊</p>
    </div>
    
    <h2>🚀 快速測試</h2>
    <div class="code">
# 測試系統健康
curl http://localhost:${process.env.PORT || 7939}/health

# 取得攻擊向量
curl http://localhost:${process.env.PORT || 7939}/ai-attack/vectors

# 執行攻擊測試
curl -X POST http://localhost:${process.env.PORT || 7939}/ai-attack/execute \\
  -H "Content-Type: application/json" \\
  -d '{"vectorIds":["A3"],"intensity":"high"}'
    </div>
    
    <p><a href="/api/docs.json">📄 查看 JSON 規格</a></p>
    <p>💡 安裝 <code>pnpm add swagger-ui-express</code> 來啟用完整的 Swagger UI</p>
</body>
</html>
            `);
        });

        console.log('📚 簡化版 API 文檔已設置完成');
        console.log(`📍 API 文檔: http://localhost:${process.env.PORT || 7939}/api/docs`);
    }
}

module.exports = SwaggerConfig;
