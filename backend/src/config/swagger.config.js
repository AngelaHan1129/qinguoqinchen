// src/config/swagger.config.js - 完整整合版本
class SwaggerConfig {
    static getSwaggerSpec() {
        return {
            openapi: '3.0.0',
            info: {
                title: '侵國侵城 AI 滲透測試系統 API',
                version: '2.0.0',
                description: `
# 🎯 侵國侵城 AI 滲透測試系統

專業的 eKYC 系統 AI 安全測試平台，整合多重 AI 引擎和 RAG 技術。

## 🚀 主要功能
- **多 AI 引擎整合**: Gemini AI + Grok AI + Vertex AI Agent
- **攻擊向量模擬**: StyleGAN3、SimSwap、DALL·E 等先進技術
- **RAG 智能問答**: 基於向量檢索的知識管理系統
- **量化安全評估**: APCER、BPCER、威脅等級分析
- **實時系統監控**: 健康檢查、效能統計
- **智能安全分析**: 深度威脅分析和風險評估

## 🏆 競賽資訊
- **競賽**: 2025 InnoServe 大專校院資訊應用服務創新競賽
- **團隊**: 侵國侵城團隊
- **學校**: 國立臺中科技大學

## 🎯 攻擊向量
- **A1 StyleGAN3**: 偽造真人自拍 (成功率 78%)
- **A2 StableDiffusion**: 螢幕翻拍攻擊 (成功率 65%)
- **A3 SimSwap**: 即時換臉攻擊 (成功率 89%) ⚠️ 高危
- **A4 Diffusion+GAN**: 偽造護照攻擊 (成功率 73%)
- **A5 DALL·E**: 生成假證件 (成功率 82%)
                `,
                contact: {
                    name: '侵國侵城團隊',
                    email: 'qinguoqinchen@nutc.edu.tw',
                    url: 'https://github.com/AngelaHan1129/qinguoqinchen'
                },
                license: {
                    name: 'MIT',
                    url: 'https://opensource.org/licenses/MIT'
                }
            },
            servers: [
                {
                    url: `http://localhost:${process.env.PORT || 7939}`,
                    description: '開發環境'
                },
                {
                    url: 'https://api.qinguoqinchen.ai',
                    description: '生產環境 (待部署)'
                }
            ],
            paths: {
                // === 系統管理 API ===
                '/': {
                    get: {
                        tags: ['System'],
                        summary: '系統首頁',
                        description: '取得系統基本資訊和可用端點列表',
                        responses: {
                            200: {
                                description: '系統資訊',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                system: { type: 'string', example: '侵國侵城 AI 滲透測試系統' },
                                                version: { type: 'string', example: '2.0.0' },
                                                status: { type: 'string', example: 'operational' },
                                                message: { type: 'string', example: '🚀 系統啟動成功！' },
                                                endpoints: {
                                                    type: 'object',
                                                    properties: {
                                                        health: { type: 'string', example: '/health' },
                                                        documentation: { type: 'string', example: '/api/docs' },
                                                        aiAttack: { type: 'string', example: '/ai-attack/vectors' },
                                                        ragSystem: { type: 'string', example: '/rag/ask' }
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

                '/health': {
                    get: {
                        tags: ['System'],
                        summary: '系統健康檢查',
                        description: '檢查系統運行狀態、記憶體使用情況和 AI 服務狀態',
                        responses: {
                            200: {
                                description: '系統健康狀態',
                                content: {
                                    'application/json': {
                                        schema: {
                                            $ref: '#/components/schemas/HealthStatus'
                                        }
                                    }
                                }
                            },
                            503: { description: '服務不可用' }
                        }
                    }
                },

                '/system/info': {
                    get: {
                        tags: ['System'],
                        summary: '系統詳細資訊',
                        description: '取得系統詳細配置和狀態資訊',
                        responses: {
                            200: { description: '系統詳細資訊' }
                        }
                    }
                },

                '/admin/stats': {
                    get: {
                        tags: ['Admin'],
                        summary: '管理統計',
                        description: '取得系統管理統計資訊',
                        responses: {
                            200: { description: '管理統計資訊' }
                        }
                    }
                },

                '/admin/version': {
                    get: {
                        tags: ['Admin'],
                        summary: '系統版本',
                        description: '取得系統版本資訊',
                        responses: {
                            200: { description: '版本資訊' }
                        }
                    }
                },

                // === AI 攻擊系統 API ===
                '/ai-attack/vectors': {
                    get: {
                        tags: ['AI Attack'],
                        summary: '取得所有攻擊向量',
                        description: '獲取系統支援的所有 AI 攻擊向量列表及詳細資訊',
                        responses: {
                            200: {
                                description: '攻擊向量列表',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                success: { type: 'boolean', example: true },
                                                vectors: {
                                                    type: 'array',
                                                    items: {
                                                        $ref: '#/components/schemas/AttackVector'
                                                    }
                                                },
                                                statistics: {
                                                    type: 'object',
                                                    properties: {
                                                        totalVectors: { type: 'integer', example: 5 },
                                                        averageSuccessRate: { type: 'string', example: '77.4%' },
                                                        mostEffective: { type: 'string', example: 'A3 - SimSwap' },
                                                        leastEffective: { type: 'string', example: 'A2 - StableDiffusion' }
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

                '/ai-attack/execute': {
                    post: {
                        tags: ['AI Attack'],
                        summary: '執行 AI 攻擊測試',
                        description: '執行指定的 AI 攻擊向量測試，支援單一或多向量組合攻擊',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/AttackRequest'
                                    },
                                    examples: {
                                        singleAttack: {
                                            summary: '單一向量攻擊',
                                            value: {
                                                vectorIds: ['A3'],
                                                intensity: 'high'
                                            }
                                        },
                                        diamondCombo: {
                                            summary: '💎 鑽石組合 - 最高威脅',
                                            value: {
                                                vectorIds: ['A3', 'A4'],
                                                intensity: 'high',
                                                options: {
                                                    targetSystem: '銀行eKYC系統',
                                                    maxDuration: 600
                                                }
                                            }
                                        },
                                        goldCombo: {
                                            summary: '🥇 黃金組合 - 標準測試',
                                            value: {
                                                vectorIds: ['A1', 'A5'],
                                                intensity: 'medium'
                                            }
                                        },
                                        lightningCombo: {
                                            summary: '⚡ 閃電組合 - 視訊繞過',
                                            value: {
                                                vectorIds: ['A2', 'A3'],
                                                intensity: 'high'
                                            }
                                        },
                                        fullAttack: {
                                            summary: '🔥 全向量攻擊 - 綜合測試',
                                            value: {
                                                vectorIds: ['A1', 'A2', 'A3', 'A4', 'A5'],
                                                intensity: 'medium'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: '攻擊執行結果',
                                content: {
                                    'application/json': {
                                        schema: {
                                            $ref: '#/components/schemas/AttackResult'
                                        }
                                    }
                                }
                            },
                            400: { description: '請求參數錯誤' },
                            500: { description: '攻擊執行失敗' }
                        }
                    }
                },

                // === Gemini AI API ===
                '/ai-gemini/attack-vector': {
                    post: {
                        tags: ['Gemini AI'],
                        summary: 'Gemini AI 攻擊向量生成',
                        description: '使用 Gemini AI 生成針對性的攻擊向量策略和建議',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['prompt'],
                                        properties: {
                                            prompt: {
                                                type: 'string',
                                                example: '針對銀行eKYC系統的深偽攻擊策略分析',
                                                description: '攻擊分析提示 (最少10字元)',
                                                minLength: 10,
                                                maxLength: 1000
                                            }
                                        }
                                    },
                                    examples: {
                                        bankingAttack: {
                                            summary: '銀行系統攻擊分析',
                                            value: {
                                                prompt: '分析針對銀行eKYC系統使用SimSwap即時換臉技術的攻擊策略，包括技術實現方法和防護建議'
                                            }
                                        },
                                        insuranceAttack: {
                                            summary: '保險業攻擊分析',
                                            value: {
                                                prompt: '評估保險業eKYC系統對StyleGAN3生成假自拍攻擊的脆弱性，提供攻擊向量和防護措施'
                                            }
                                        },
                                        generalSecurity: {
                                            summary: '一般安全評估',
                                            value: {
                                                prompt: 'eKYC系統面對AI生成Deepfake攻擊的安全漏洞分析和改進建議'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: 'Gemini AI 分析結果',
                                content: {
                                    'application/json': {
                                        schema: {
                                            $ref: '#/components/schemas/GeminiAnalysisResult'
                                        }
                                    }
                                }
                            },
                            400: { description: '提示參數缺失或格式錯誤' },
                            500: { description: 'Gemini AI 調用失敗' }
                        }
                    }
                },

                // === Grok AI API ===
                '/ai-grok/security-analysis': {
                    post: {
                        tags: ['Grok AI'],
                        summary: 'Grok AI 安全威脅分析',
                        description: '使用 Grok AI 進行深度安全威脅分析和風險評估',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            threatDescription: {
                                                type: 'string',
                                                example: 'AI生成Deepfake攻擊',
                                                description: '威脅描述'
                                            },
                                            targetSystem: {
                                                type: 'string',
                                                example: '銀行eKYC系統',
                                                description: '目標系統類型'
                                            },
                                            analysisType: {
                                                type: 'string',
                                                enum: ['vulnerability', 'risk-assessment', 'attack-surface', 'compliance'],
                                                default: 'vulnerability',
                                                description: '分析類型'
                                            }
                                        }
                                    },
                                    examples: {
                                        deepfakeAnalysis: {
                                            summary: 'Deepfake 威脅分析',
                                            value: {
                                                threatDescription: 'SimSwap即時換臉攻擊對金融eKYC系統的威脅',
                                                targetSystem: '銀行數位開戶系統',
                                                analysisType: 'vulnerability'
                                            }
                                        },
                                        documentForging: {
                                            summary: '文件偽造分析',
                                            value: {
                                                threatDescription: 'AI生成假身分證件和護照',
                                                targetSystem: '保險業KYC系統',
                                                analysisType: 'risk-assessment'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: 'Grok AI 安全分析結果',
                                content: {
                                    'application/json': {
                                        schema: {
                                            $ref: '#/components/schemas/GrokAnalysisResult'
                                        }
                                    }
                                }
                            },
                            400: { description: '分析參數不完整' },
                            500: { description: 'Grok AI 服務異常' }
                        }
                    }
                },

                // === Vertex AI Agent API ===
                '/ai-agent/chat': {
                    post: {
                        tags: ['Vertex AI Agent'],
                        summary: 'Vertex AI Agent 智能對話',
                        description: '與 Vertex AI Agent 進行安全諮詢對話，支援會話記憶',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['message'],
                                        properties: {
                                            sessionId: {
                                                type: 'string',
                                                example: 'security-session-001',
                                                description: '會話 ID (用於維持對話上下文)'
                                            },
                                            message: {
                                                type: 'string',
                                                example: '分析銀行eKYC系統的安全風險',
                                                description: '對話訊息內容',
                                                minLength: 1,
                                                maxLength: 2000
                                            },
                                            agentId: {
                                                type: 'string',
                                                default: 'default-security-agent',
                                                enum: ['default-security-agent', 'ekyc-specialist', 'penetration-tester'],
                                                description: 'AI Agent 類型'
                                            },
                                            context: {
                                                type: 'object',
                                                description: '額外的上下文資訊',
                                                properties: {
                                                    domain: { type: 'string', example: 'banking' },
                                                    previousAttacks: { type: 'array', items: { type: 'string' } },
                                                    systemType: { type: 'string', example: 'mobile-app' }
                                                }
                                            }
                                        }
                                    },
                                    examples: {
                                        securityConsultation: {
                                            summary: '安全諮詢對話',
                                            value: {
                                                sessionId: 'security-consultation-001',
                                                message: '我們的銀行eKYC系統最近發現可能存在Deepfake攻擊風險，請提供專業的安全評估建議',
                                                agentId: 'ekyc-specialist',
                                                context: {
                                                    domain: 'banking',
                                                    systemType: 'mobile-app'
                                                }
                                            }
                                        },
                                        penetrationTest: {
                                            summary: '滲透測試討論',
                                            value: {
                                                sessionId: 'pentest-planning-001',
                                                message: '計劃對eKYC系統進行滲透測試，需要制定測試策略和攻擊向量選擇',
                                                agentId: 'penetration-tester',
                                                context: {
                                                    previousAttacks: ['A1', 'A3'],
                                                    systemType: 'web-application'
                                                }
                                            }
                                        },
                                        generalInquiry: {
                                            summary: '一般安全諮詢',
                                            value: {
                                                sessionId: 'general-inquiry-001',
                                                message: '什麼是最新的AI攻擊技術？對金融業有什麼影響？',
                                                agentId: 'default-security-agent'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: 'AI Agent 對話回應',
                                content: {
                                    'application/json': {
                                        schema: {
                                            $ref: '#/components/schemas/VertexAgentResponse'
                                        }
                                    }
                                }
                            },
                            400: { description: '對話參數錯誤' },
                            500: { description: 'Vertex AI Agent 服務不可用' }
                        }
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
                                                        status: { type: 'string', example: 'ready' },
                                                        mode: { type: 'string', example: 'enhanced' },
                                                        features: {
                                                            type: 'array',
                                                            items: { type: 'string' },
                                                            example: ['Gemini AI Integration', 'Knowledge Base Search', 'RAG Pipeline']
                                                        }
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
                        summary: 'RAG 智能問答',
                        description: '基於已攝取的文件進行智能問答，整合 Gemini AI 生成回答',
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
                                                    documentType: { type: 'string', example: 'security' },
                                                    category: { type: 'string', example: 'technical' }
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
                                        attackVectorQuestion: {
                                            summary: '攻擊向量問題',
                                            value: {
                                                question: 'SimSwap 攻擊的成功率和防護方法？',
                                                filters: { category: 'ai-attack' }
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
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            id: { type: 'string' },
                                                            title: { type: 'string' },
                                                            similarity: { type: 'number', format: 'float' },
                                                            category: { type: 'string' }
                                                        }
                                                    }
                                                },
                                                confidence: { type: 'number', format: 'float', example: 0.88 },
                                                mode: { type: 'string', enum: ['RAG', 'Direct', 'Fallback'] },
                                                documentsUsed: { type: 'integer', example: 3 },
                                                timestamp: { type: 'string', format: 'date-time' }
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
                                        },
                                        attackVectorDoc: {
                                            summary: '攻擊向量文件',
                                            value: {
                                                text: 'SimSwap 是目前最危險的即時換臉技術，成功率高達89%，主要通過深度學習模型...',
                                                metadata: {
                                                    title: 'SimSwap 攻擊分析',
                                                    category: 'ai-attack',
                                                    source: '攻擊向量研究'
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
                                                message: { type: 'string', example: '文件攝取成功' },
                                                timestamp: { type: 'string', format: 'date-time' }
                                            }
                                        }
                                    }
                                }
                            },
                            400: { description: '請求參數錯誤' }
                        }
                    }
                },

                '/rag/ingest/file': {
                    post: {
                        tags: ['RAG System'],
                        summary: '攝取檔案',
                        description: '上傳並攝取檔案到 RAG 系統 (支援 .txt, .json, .pdf)',
                        requestBody: {
                            required: true,
                            content: {
                                'multipart/form-data': {
                                    schema: {
                                        type: 'object',
                                        required: ['document'],
                                        properties: {
                                            document: {
                                                type: 'string',
                                                format: 'binary',
                                                description: '要上傳的檔案 (最大 10MB)'
                                            },
                                            metadata: {
                                                type: 'string',
                                                description: 'JSON 格式的元資料',
                                                example: '{"title":"技術文件","category":"technical"}'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            200: { description: '檔案攝取成功' },
                            400: { description: '檔案格式不支援或參數錯誤' }
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
                {
                    name: 'System',
                    description: '系統管理和監控',
                    externalDocs: {
                        description: '系統文檔',
                        url: 'https://docs.qinguoqinchen.ai/system'
                    }
                },
                {
                    name: 'AI Attack',
                    description: 'AI 攻擊向量模擬和測試',
                    externalDocs: {
                        description: '攻擊向量文檔',
                        url: 'https://docs.qinguoqinchen.ai/attack-vectors'
                    }
                },
                {
                    name: 'Gemini AI',
                    description: 'Google Gemini AI 攻擊分析',
                    externalDocs: {
                        description: 'Gemini AI 文檔',
                        url: 'https://ai.google.dev/gemini-api'
                    }
                },
                {
                    name: 'Grok AI',
                    description: 'X.AI Grok 安全威脅分析',
                    externalDocs: {
                        description: 'Grok AI 文檔',
                        url: 'https://docs.x.ai'
                    }
                },
                {
                    name: 'Vertex AI Agent',
                    description: 'Google Vertex AI Agent 智能對話',
                    externalDocs: {
                        description: 'Vertex AI 文檔',
                        url: 'https://cloud.google.com/vertex-ai'
                    }
                },
                {
                    name: 'RAG System',
                    description: 'RAG 知識管理系統',
                    externalDocs: {
                        description: 'RAG 系統文檔',
                        url: 'https://docs.qinguoqinchen.ai/rag'
                    }
                },
                {
                    name: 'Admin',
                    description: '管理員功能',
                    externalDocs: {
                        description: '管理文檔',
                        url: 'https://docs.qinguoqinchen.ai/admin'
                    }
                }
            ],

            components: {
                schemas: {
                    // 攻擊向量相關 schemas
                    AttackVector: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', example: 'A1', description: '攻擊向量 ID' },
                            model: { type: 'string', example: 'StyleGAN3', description: 'AI 模型名稱' },
                            scenario: { type: 'string', example: '偽造真人自拍', description: '攻擊場景' },
                            difficulty: {
                                type: 'string',
                                enum: ['EASY', 'MEDIUM', 'HIGH'],
                                example: 'MEDIUM',
                                description: '攻擊難度等級'
                            },
                            successRate: { type: 'string', example: '78%', description: '預估成功率' },
                            description: { type: 'string', example: '使用 StyleGAN3 生成高擬真臉部影像' }
                        }
                    },

                    AttackRequest: {
                        type: 'object',
                        required: ['vectorIds'],
                        properties: {
                            vectorIds: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    enum: ['A1', 'A2', 'A3', 'A4', 'A5']
                                },
                                example: ['A3', 'A4'],
                                description: '要執行的攻擊向量 ID 列表'
                            },
                            intensity: {
                                type: 'string',
                                enum: ['low', 'medium', 'high'],
                                default: 'medium',
                                example: 'high',
                                description: '攻擊強度等級'
                            },
                            options: {
                                type: 'object',
                                description: '額外的攻擊選項',
                                properties: {
                                    targetSystem: { type: 'string', example: '銀行eKYC系統' },
                                    testMode: { type: 'boolean', default: true },
                                    maxDuration: { type: 'integer', example: 300 }
                                }
                            }
                        }
                    },

                    AttackResult: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                            testId: { type: 'string', example: 'QQC_ATK_1729454567890_A1B2C3' },
                            attackResults: {
                                type: 'object',
                                properties: {
                                    vectors: {
                                        type: 'array',
                                        items: { type: 'string' }
                                    },
                                    intensity: { type: 'string' },
                                    summary: {
                                        type: 'object',
                                        properties: {
                                            threatLevel: {
                                                type: 'string',
                                                enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
                                            },
                                            successRate: { type: 'string', example: '89%' },
                                            totalAttacks: { type: 'integer', example: 2 },
                                            successfulAttacks: { type: 'integer', example: 1 }
                                        }
                                    }
                                }
                            },
                            timestamp: { type: 'string', format: 'date-time' }
                        }
                    },

                    // AI 分析結果 schemas
                    GeminiAnalysisResult: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                            analysis: { type: 'string', description: 'AI 生成的攻擊向量分析' },
                            attackStrategies: {
                                type: 'array',
                                items: { type: 'string' }
                            },
                            defenseRecommendations: {
                                type: 'array',
                                items: { type: 'string' }
                            },
                            riskLevel: {
                                type: 'string',
                                enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
                            },
                            confidence: { type: 'number', format: 'float', example: 0.92 },
                            timestamp: { type: 'string', format: 'date-time' }
                        }
                    },

                    GrokAnalysisResult: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                            analysis: { type: 'string' },
                            vulnerabilities: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        severity: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
                                        description: { type: 'string' },
                                        impact: { type: 'string' },
                                        mitigation: { type: 'string' }
                                    }
                                }
                            },
                            riskScore: { type: 'number', format: 'float', example: 8.5 },
                            recommendations: {
                                type: 'array',
                                items: { type: 'string' }
                            },
                            timestamp: { type: 'string', format: 'date-time' }
                        }
                    },

                    VertexAgentResponse: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                            response: { type: 'string', description: 'AI Agent 回應內容' },
                            sessionId: { type: 'string' },
                            agentId: { type: 'string' },
                            suggestions: {
                                type: 'array',
                                items: { type: 'string' },
                                description: '後續建議問題'
                            },
                            relatedAttackVectors: {
                                type: 'array',
                                items: { type: 'string' },
                                description: '相關攻擊向量'
                            },
                            confidence: { type: 'number', format: 'float', example: 0.87 },
                            conversationLength: { type: 'integer', description: '對話輪數' },
                            timestamp: { type: 'string', format: 'date-time' }
                        }
                    },

                    // 系統狀態 schemas
                    HealthStatus: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'string',
                                enum: ['healthy', 'degraded', 'unhealthy'],
                                example: 'healthy',
                                description: '系統健康狀態'
                            },
                            uptime: {
                                type: 'string',
                                example: '120秒',
                                description: '系統運行時間'
                            },
                            memory: {
                                type: 'object',
                                properties: {
                                    used: { type: 'string', example: '45MB' },
                                    total: { type: 'string', example: '128MB' }
                                }
                            },
                            services: {
                                type: 'object',
                                properties: {
                                    geminiAI: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'ready' }
                                        }
                                    },
                                    grokAI: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'ready' }
                                        }
                                    },
                                    ragSystem: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'ready' }
                                        }
                                    }
                                }
                            }
                        }
                    },

                    ApiResponse: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                example: true,
                                description: '請求是否成功'
                            },
                            timestamp: {
                                type: 'string',
                                format: 'date-time',
                                example: '2025-10-21T08:20:00.000Z',
                                description: '回應時間戳'
                            }
                        }
                    }
                }
            }
        };
    }

    static setupSwagger(app) {
        try {
            const swaggerUi = require('swagger-ui-express');
            const specs = this.getSwaggerSpec();

            const swaggerUiOptions = {
                customCss: `
                    .swagger-ui .topbar { display: none }
                    .swagger-ui .info .title { color: #1976d2; font-weight: bold; }
                    .swagger-ui .info .description { font-size: 14px; line-height: 1.6; }
                    .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .swagger-ui .opblock.opblock-post { border-color: #49cc90; }
                    .swagger-ui .opblock.opblock-get { border-color: #61affe; }
                    .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; }
                    .swagger-ui .opblock-tag { font-size: 18px; font-weight: bold; }
                `,
                customSiteTitle: '侵國侵城 AI API 文檔',
                customfavIcon: '/assets/favicon.ico',
                swaggerOptions: {
                    persistAuthorization: true,
                    displayRequestDuration: true,
                    filter: true,
                    showCommonExtensions: true,
                    tryItOutEnabled: true,
                    requestSnippetsEnabled: true,
                    syntaxHighlight: {
                        theme: 'monokai'
                    },
                    docExpansion: 'list',
                    defaultModelsExpandDepth: 2
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
        .header { background: linear-gradient(135deg, #1976d2, #42a5f5); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .endpoint { background: #f5f5f5; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #1976d2; }
        .method { display: inline-block; padding: 6px 12px; color: white; border-radius: 4px; font-weight: bold; margin-right: 10px; }
        .get { background: #61affe; }
        .post { background: #49cc90; }
        .delete { background: #f93e3e; }
        .code { background: #2d3748; color: #e2e8f0; padding: 20px; border-radius: 8px; font-family: 'Courier New', monospace; white-space: pre-wrap; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .feature-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .tag { background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 侵國侵城 AI 滲透測試系統 API</h1>
        <p>專業的 eKYC 系統 AI 安全測試平台，整合多重 AI 引擎和 RAG 技術</p>
        <p><strong>團隊</strong>: 侵國侵城團隊 | <strong>學校</strong>: 國立臺中科技大學</p>
        <p><strong>競賽</strong>: 2025 InnoServe 大專校院資訊應用服務創新競賽</p>
    </div>
    
    <div class="feature-grid">
        <div class="feature-card">
            <h3>🤖 多 AI 引擎</h3>
            <p>Gemini AI + Grok AI + Vertex AI Agent</p>
            <span class="tag">AI Attack</span><span class="tag">Smart Analysis</span>
        </div>
        <div class="feature-card">
            <h3>🔍 RAG 系統</h3>
            <p>基於向量檢索的智能問答系統</p>
            <span class="tag">Knowledge Base</span><span class="tag">Vector Search</span>
        </div>
        <div class="feature-card">
            <h3>⚔️ 攻擊向量</h3>
            <p>5種先進的 AI 攻擊模擬技術</p>
            <span class="tag">Deepfake</span><span class="tag">Penetration Test</span>
        </div>
    </div>
    
    <div class="section">
        <h2>📚 主要 API 分類</h2>
        
        <div class="endpoint">
            <h3>🏠 System APIs</h3>
            <span class="method get">GET</span> <strong>/</strong> - 系統首頁<br>
            <span class="method get">GET</span> <strong>/health</strong> - 健康檢查<br>
            <span class="method get">GET</span> <strong>/system/info</strong> - 系統資訊
        </div>
        
        <div class="endpoint">
            <h3>⚔️ AI Attack APIs</h3>
            <span class="method get">GET</span> <strong>/ai-attack/vectors</strong> - 攻擊向量列表<br>
            <span class="method post">POST</span> <strong>/ai-attack/execute</strong> - 執行攻擊測試
        </div>
        
        <div class="endpoint">
            <h3>🧠 AI Engine APIs</h3>
            <span class="method post">POST</span> <strong>/ai-gemini/attack-vector</strong> - Gemini AI 分析<br>
            <span class="method post">POST</span> <strong>/ai-grok/security-analysis</strong> - Grok AI 威脅分析<br>
            <span class="method post">POST</span> <strong>/ai-agent/chat</strong> - Vertex AI Agent 對話
        </div>
        
        <div class="endpoint">
            <h3>🤖 RAG System APIs</h3>
            <span class="method get">GET</span> <strong>/rag/stats</strong> - RAG 系統統計<br>
            <span class="method post">POST</span> <strong>/rag/ask</strong> - 智能問答<br>
            <span class="method post">POST</span> <strong>/rag/ingest/text</strong> - 文字攝取<br>
            <span class="method post">POST</span> <strong>/rag/search</strong> - 文件搜尋
        </div>
    </div>
    
    <div class="section">
        <h2>🚀 快速測試範例</h2>
        <div class="code"># 系統健康檢查
curl http://localhost:${process.env.PORT || 7939}/health

# 取得攻擊向量
curl http://localhost:${process.env.PORT || 7939}/ai-attack/vectors

# 執行鑽石組合攻擊
curl -X POST http://localhost:${process.env.PORT || 7939}/ai-attack/execute \\
  -H "Content-Type: application/json" \\
  -d '{"vectorIds":["A3","A4"],"intensity":"high"}'

# RAG 智能問答
curl -X POST http://localhost:${process.env.PORT || 7939}/rag/ask \\
  -H "Content-Type: application/json" \\
  -d '{"question":"eKYC系統的主要安全威脅有哪些？"}'

# Gemini AI 安全分析
curl -X POST http://localhost:${process.env.PORT || 7939}/ai-gemini/attack-vector \\
  -H "Content-Type: application/json" \\
  -d '{"prompt":"銀行eKYC系統的Deepfake攻擊防護策略"}'</div>
    </div>
    
    <div style="text-align: center; margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
        <p><a href="/api/docs.json" style="color: #1976d2; text-decoration: none; font-weight: bold;">📄 查看完整 JSON API 規格</a></p>
        <p>💡 執行 <code>pnpm add swagger-ui-express</code> 來啟用完整的 Swagger UI 介面</p>
        <p style="margin-top: 20px; color: #666;">
            🏆 <strong>2025 InnoServe 創新競賽參賽作品</strong><br>
            🛡️ 為更安全的數位身份驗證而努力
        </p>
    </div>
</body>
</html>
            `);
        });

        console.log('📚 簡化版 API 文檔已設置完成');
        console.log(`📍 API 文檔: http://localhost:${process.env.PORT || 7939}/api/docs`);
    }
}

module.exports = SwaggerConfig;
