// src/swagger/swagger.config.js
function createSwaggerConfig() {
  return {
    title: '侵國侵城 AI 滲透測試系統 API',
    description: `
# 侵國侵城 AI 滲透測試系統

## 系統概述
專為 eKYC 安全測試設計的 AI 紅隊滲透測試系統

## 核心功能
### 🤖 多模態 AI 攻擊模擬
- **A1 - StyleGAN3**: 偽造真人自拍 (成功率: 78%)
- **A2 - Stable Diffusion**: 翻拍攻擊 (成功率: 65%)
- **A3 - SimSwap**: 即時換臉 (成功率: 89%)

### 📊 量化安全評估
- APCER (攻擊樣本分類錯誤率)
- BPCER (正常樣本分類錯誤率)
- ACER (平均分類錯誤率)

## 快速開始
1. 系統檢查: \`GET /health\`
2. 查看向量: \`GET /ai-attack/vectors\`
3. 執行測試: \`POST /ai-attack/execute\`
    `,
    version: '1.0.0',
    tags: [
      { name: '系統管理', description: '系統狀態和基本資訊' },
      { name: 'AI 攻擊', description: 'AI 攻擊向量和滲透測試' }
    ]
  };
}

function createOpenApiSpec() {
  return {
    openapi: '3.0.0',
    info: createSwaggerConfig(),
    servers: [
      { url: 'http://localhost:7939', description: '開發環境' }
    ],
    paths: {
      '/': {
        get: {
          tags: ['系統管理'],
          summary: '系統首頁',
          description: '獲取系統基本資訊',
          responses: {
            200: {
              description: '系統資訊',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: '🛡️ 歡迎使用侵國侵城 AI 滲透測試系統' },
                      version: { type: 'string', example: '1.0.0' },
                      status: { type: 'string', example: 'operational' }
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
          tags: ['系統管理'],
          summary: '系統健康檢查',
          description: '檢查系統運行狀態',
          responses: {
            200: {
              description: '健康狀態',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'healthy' },
                      uptime: { type: 'string', example: '120秒' },
                      memory: {
                        type: 'object',
                        properties: {
                          used: { type: 'string', example: '45MB' },
                          total: { type: 'string', example: '128MB' }
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
      '/ai-attack/vectors': {
        get: {
          tags: ['AI 攻擊'],
          summary: '獲取攻擊向量列表',
          description: '返回所有可用的 AI 攻擊向量',
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
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'A1' },
                            model: { type: 'string', example: 'StyleGAN3' },
                            scenario: { type: 'string', example: '偽造真人自拍' }
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
      '/ai-attack/execute': {
        post: {
          tags: ['AI 攻擊'],
          summary: '執行 AI 攻擊測試',
          description: '執行指定的攻擊向量進行滲透測試',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    vectorIds: {
                      type: 'array',
                      items: { type: 'string', enum: ['A1', 'A2', 'A3', 'A4', 'A5'] },
                      example: ['A1', 'A3']
                    },
                    intensity: {
                      type: 'string',
                      enum: ['low', 'medium', 'high'],
                      example: 'medium'
                    }
                  },
                  required: ['vectorIds']
                }
              }
            }
          },
          responses: {
            200: {
              description: '攻擊測試結果',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      testId: { type: 'string', example: 'QQC_ATK_1728462123' },
                      results: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            vectorId: { type: 'string', example: 'A1' },
                            success: { type: 'boolean', example: true },
                            confidence: { type: 'number', example: 0.85 }
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
      }
    }
  };
}

module.exports = { createSwaggerConfig, createOpenApiSpec };
