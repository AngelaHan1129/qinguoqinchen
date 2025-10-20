// src/config/swagger.docs.js - 路由文檔定義
const swaggerDocs = {
    // 首頁路由文檔
    home: {
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
                                success: { type: 'boolean', example: true },
                                system: { type: 'string', example: '侵國侵城 AI 滲透測試系統' },
                                version: { type: 'string', example: '1.0.0' },
                                status: { type: 'string', example: 'operational' },
                                message: { type: 'string', example: '🚀 系統啟動成功！' },
                                endpoints: {
                                    type: 'object',
                                    properties: {
                                        health: { type: 'string', example: '/health' },
                                        systemInfo: { type: 'string', example: '/system/info' },
                                        aiAttack: { type: 'string', example: '/ai-attack/vectors' }
                                    }
                                },
                                timestamp: { type: 'string', format: 'date-time' }
                            }
                        }
                    }
                }
            }
        }
    },

    // 健康檢查路由文檔
    health: {
        tags: ['System'],
        summary: '系統健康檢查',
        description: '檢查系統運行狀態、記憶體使用情況和服務狀態',
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
            503: {
                description: '服務不可用'
            }
        }
    },

    // 攻擊向量列表文檔
    attackVectors: {
        tags: ['AI Attack'],
        summary: '取得所有攻擊向量',
        description: '返回系統支援的所有 AI 攻擊向量列表及其詳細資訊',
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
                                        mostEffective: { type: 'string', example: 'A3 - SimSwap' }
                                    }
                                },
                                timestamp: { type: 'string', format: 'date-time' }
                            }
                        }
                    }
                }
            }
        }
    },

    // 攻擊執行文檔
    attackExecute: {
        tags: ['AI Attack'],
        summary: '執行 AI 攻擊測試',
        description: '執行指定的 AI 攻擊向量測試，返回詳細的測試結果和分析',
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/AttackRequest'
                    },
                    examples: {
                        singleVector: {
                            summary: '單一向量攻擊',
                            value: {
                                vectorIds: ['A3'],
                                intensity: 'high'
                            }
                        },
                        multipleVectors: {
                            summary: '多向量組合攻擊',
                            value: {
                                vectorIds: ['A1', 'A3', 'A5'],
                                intensity: 'medium'
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: '攻擊測試成功執行',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                testId: { type: 'string', example: 'QQC_ATK_1729454567890_A1B2C3' },
                                attackResults: {
                                    type: 'object',
                                    properties: {
                                        vectors: { type: 'array', items: { type: 'string' } },
                                        intensity: { type: 'string' },
                                        results: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/AttackResult' }
                                        },
                                        summary: {
                                            type: 'object',
                                            properties: {
                                                totalAttacks: { type: 'integer' },
                                                successfulAttacks: { type: 'integer' },
                                                successRate: { type: 'string' },
                                                threatLevel: {
                                                    type: 'string',
                                                    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
                                                }
                                            }
                                        }
                                    }
                                },
                                timestamp: { type: 'string', format: 'date-time' }
                            }
                        }
                    }
                }
            },
            400: {
                description: '請求參數錯誤'
            }
        }
    }
};

module.exports = swaggerDocs;
