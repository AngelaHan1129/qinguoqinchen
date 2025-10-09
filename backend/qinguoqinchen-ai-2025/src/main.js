// src/main.js
require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const express = require('express');
const swaggerUi = require('swagger-ui-express');

async function bootstrap() {
  try {
    console.log('🚀 啟動侵國侵城 AI 滲透測試系統...');
    
    // 建立一個最小的 AppModule
    class AppModule {}
    Reflect.defineMetadata('imports', [], AppModule);
    Reflect.defineMetadata('controllers', [], AppModule);
    Reflect.defineMetadata('providers', [], AppModule);
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
      cors: true
    });
    
    // 獲取底層的 Express 應用
    const expressInstance = app.getHttpAdapter().getInstance();
    
    // 確保 JSON 解析
    expressInstance.use(express.json());
    expressInstance.use(express.urlencoded({ extended: true }));
    
    // 手動建立服務實例
    const appService = createAppService();
    const healthService = createHealthService();
    const attackService = createAttackService();
    
    console.log('🔧 註冊路由...');
    
    // 註冊所有路由
    registerRoutes(expressInstance, appService, healthService, attackService);
    
    // 設置 Swagger
    setupSwagger(expressInstance);
    
    const port = process.env.PORT || 7939; // 使用你的端口
    await app.listen(port);
    
    console.log('✅ 侵國侵城 AI 滲透測試系統啟動成功!');
    console.log(`📍 主頁: http://localhost:${port}`);
    console.log(`📚 API 文檔: http://localhost:${port}/api/docs`);
    console.log(`🎯 健康檢查: http://localhost:${port}/health`);
    console.log(`⚔️ 攻擊向量: http://localhost:${port}/ai-attack/vectors`);
    
    // 測試所有端點
    console.log('\n📝 測試指令:');
    console.log(`curl http://localhost:${port}/`);
    console.log(`curl http://localhost:${port}/health`);
    console.log(`curl http://localhost:${port}/ai-attack/vectors`);
    console.log(`curl -X POST http://localhost:${port}/ai-attack/execute -H "Content-Type: application/json" -d '{"vectorIds":["A1","A3"],"intensity":"high"}'`);
    
  } catch (error) {
    console.error('❌ 系統啟動失敗:', error.message);
    console.error('詳細錯誤:', error.stack);
    process.exit(1);
  }
}

// 建立服務
function createAppService() {
  return {
    getSystemInfo() {
      console.log('📋 執行 getSystemInfo');
      return {
        message: '🛡️ 歡迎使用侵國侵城 AI 滲透測試系統',
        version: '1.0.0',
        status: 'operational',
        framework: 'NestJS + Express (手動路由)',
        timestamp: new Date().toISOString(),
        description: '本系統專為 eKYC 安全測試設計，整合多種生成式 AI 技術',
        capabilities: [
          '多模態 AI 攻擊模擬 (StyleGAN3, Stable Diffusion, SimSwap, DALL·E)',
          '智能滲透測試',
          '量化安全評估 (APCER, BPCER, ACER, EER)',
          'AI 驅動的防禦建議',
          '自動化報告生成'
        ],
        endpoints: {
          health: '/health',
          attackVectors: '/ai-attack/vectors',
          executeAttack: 'POST /ai-attack/execute',
          comboAttack: 'POST /ai-attack/combo',
          systemStats: '/system/stats',
          apiDocs: '/api/docs'
        }
      };
    }
  };
}

function createHealthService() {
  return {
    getSystemHealth() {
      console.log('🩺 執行 getSystemHealth');
      const memoryUsage = process.memoryUsage();
      
      return {
        status: 'healthy',
        system: '侵國侵城 AI 系統',
        uptime: `${Math.floor(process.uptime())}秒`,
        memory: {
          used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          percentage: `${Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)}%`
        },
        platform: process.platform,
        nodeVersion: process.version,
        timestamp: new Date().toISOString(),
        services: {
          nestjs: 'operational',
          express: 'operational',
          routes: 'registered',
          swagger: 'available'
        }
      };
    }
  };
}

function createAttackService() {
  return {
    getAllVectors() {
      console.log('⚔️ 執行 getAllVectors');
      return {
        success: true,
        vectors: [
          { 
            id: 'A1', 
            model: 'StyleGAN3', 
            scenario: '偽造真人自拍',
            difficulty: 'MEDIUM',
            successRate: '78%',
            description: '使用 StyleGAN3 生成高擬真臉部影像'
          },
          { 
            id: 'A2', 
            model: 'StableDiffusion', 
            scenario: '翻拍攻擊',
            difficulty: 'HIGH',
            successRate: '65%',
            description: '模擬螢幕反射與拍攝偽像'
          },
          { 
            id: 'A3', 
            model: 'SimSwap', 
            scenario: '即時換臉',
            difficulty: 'VERY_HIGH',
            successRate: '89%',
            description: '即時視訊換臉技術'
          },
          { 
            id: 'A4', 
            model: 'Diffusion+GAN', 
            scenario: '偽造護照',
            difficulty: 'HIGH',
            successRate: '73%',
            description: '生成含 MRZ 和條碼的偽造證件'
          },
          { 
            id: 'A5', 
            model: 'DALL·E', 
            scenario: '直接生成假證件',
            difficulty: 'MEDIUM',
            successRate: '82%',
            description: '直接生成身份證件圖像'
          }
        ],
        recommendedCombos: [
          { 
            combo: ['A2', 'A3'], 
            description: 'Deepfake + 翻拍攻擊',
            estimatedSuccessRate: '92%'
          },
          { 
            combo: ['A1', 'A4'], 
            description: '假自拍 + 假護照',
            estimatedSuccessRate: '75%'
          }
        ],
        statistics: {
          totalVectors: 5,
          averageSuccessRate: '77.4%',
          mostEffective: 'A3 - SimSwap',
          leastEffective: 'A2 - StableDiffusion'
        },
        timestamp: new Date().toISOString()
      };
    },

    executeAttack(body) {
      const { vectorIds = ['A1'], intensity = 'medium' } = body || {};
      
      console.log(`🎯 執行攻擊測試: ${vectorIds.join(', ')}, 強度: ${intensity}`);
      
      const results = vectorIds.map(vectorId => ({
        vectorId,
        model: this.getModelByVector(vectorId),
        scenario: this.getScenarioByVector(vectorId),
        success: Math.random() > 0.3,
        confidence: Math.round((Math.random() * 0.8 + 0.2) * 1000) / 1000,
        bypassScore: Math.random() > 0.5 ? Math.round(Math.random() * 0.4 + 0.6 * 1000) / 1000 : 0,
        processingTime: Math.round(1000 + Math.random() * 3000),
        timestamp: new Date()
      }));
      
      const successfulAttacks = results.filter(r => r.success).length;
      const successRate = Math.round((successfulAttacks / results.length) * 100);
      
      return {
        success: true,
        testId: `QQC_ATK_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        attackResults: {
          vectors: vectorIds,
          intensity,
          results,
          summary: {
            totalAttacks: results.length,
            successfulAttacks,
            successRate: `${successRate}%`,
            averageConfidence: Math.round((results.reduce((sum, r) => sum + r.confidence, 0) / results.length) * 1000) / 1000,
            threatLevel: successRate >= 80 ? 'CRITICAL' : successRate >= 60 ? 'HIGH' : 'MEDIUM'
          }
        },
        timestamp: new Date().toISOString()
      };
    },

    executeComboAttack(body) {
      const { combos = [['A1', 'A2']], intensity = 'medium' } = body || {};
      
      console.log(`🔥 執行複合攻擊: ${combos.map(c => c.join('+')).join(', ')}`);
      
      const comboResults = combos.map((combo, index) => ({
        comboId: `COMBO_${index + 1}`,
        combination: combo.join(' + '),
        description: combo.map(id => this.getScenarioByVector(id)).join(' + '),
        successRate: `${Math.round(Math.random() * 30 + 70)}%`,
        effectiveness: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM'
      }));
      
      return {
        success: true,
        comboAttackId: `QQC_COMBO_${Date.now()}`,
        executedCombos: combos.length,
        comboResults,
        timestamp: new Date().toISOString()
      };
    },

    getModelByVector(vectorId) {
      const models = {
        'A1': 'StyleGAN3', 'A2': 'StableDiffusion', 'A3': 'SimSwap',
        'A4': 'Diffusion+GAN', 'A5': 'DALL·E'
      };
      return models[vectorId] || 'Unknown';
    },

    getScenarioByVector(vectorId) {
      const scenarios = {
        'A1': '偽造真人自拍', 'A2': '翻拍攻擊', 'A3': '即時換臉',
        'A4': '偽造護照', 'A5': '生成假證件'
      };
      return scenarios[vectorId] || 'Unknown';
    }
  };
}

// 註冊所有路由
function registerRoutes(app, appService, healthService, attackService) {
  console.log('📍 註冊路由: GET /');
  app.get('/', (req, res) => {
    console.log('📥 收到首頁請求');
    try {
      const result = appService.getSystemInfo();
      res.json(result);
    } catch (error) {
      console.error('❌ 首頁錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  console.log('📍 註冊路由: GET /health');
  app.get('/health', (req, res) => {
    console.log('📥 收到健康檢查請求');
    try {
      const result = healthService.getSystemHealth();
      res.json(result);
    } catch (error) {
      console.error('❌ 健康檢查錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  console.log('📍 註冊路由: GET /ai-attack/vectors');
  app.get('/ai-attack/vectors', (req, res) => {
    console.log('📥 收到攻擊向量請求');
    try {
      const result = attackService.getAllVectors();
      res.json(result);
    } catch (error) {
      console.error('❌ 攻擊向量錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  console.log('📍 註冊路由: POST /ai-attack/execute');
  app.post('/ai-attack/execute', (req, res) => {
    console.log('📥 收到攻擊執行請求, Body:', req.body);
    try {
      const result = attackService.executeAttack(req.body);
      res.json(result);
    } catch (error) {
      console.error('❌ 攻擊執行錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  console.log('📍 註冊路由: POST /ai-attack/combo');
  app.post('/ai-attack/combo', (req, res) => {
    console.log('📥 收到複合攻擊請求, Body:', req.body);
    try {
      const result = attackService.executeComboAttack(req.body);
      res.json(result);
    } catch (error) {
      console.error('❌ 複合攻擊錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  console.log('📍 註冊路由: GET /system/stats');
  app.get('/system/stats', (req, res) => {
    console.log('📥 收到系統統計請求');
    try {
      const result = {
        systemStats: {
          totalTests: Math.floor(Math.random() * 1000) + 500,
          successfulAttacks: Math.floor(Math.random() * 600) + 300,
          averageSuccessRate: '72.3%',
          topPerformingVector: 'A3 - SimSwap'
        },
        performanceMetrics: {
          averageResponseTime: '1.2秒',
          systemLoad: '23%',
          memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
        },
        timestamp: new Date().toISOString()
      };
      res.json(result);
    } catch (error) {
      console.error('❌ 系統統計錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  console.log('✅ 所有路由註冊完成');
}

// 設置 Swagger
function setupSwagger(app) {
  const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: '侵國侵城 AI 滲透測試系統 API',
      description: '專為 eKYC 安全測試設計的 AI 紅隊滲透測試系統',
      version: '1.0.0'
    },
    servers: [
      { url: 'http://localhost:7939', description: '開發環境' }
    ],
    paths: {
      '/': {
        get: {
          tags: ['系統管理'],
          summary: '系統首頁',
          description: '獲取系統基本資訊和可用端點',
          responses: {
            200: {
              description: '系統資訊',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      version: { type: 'string' },
                      status: { type: 'string' }
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
          responses: {
            200: { description: '系統健康狀態' }
          }
        }
      },
      '/ai-attack/vectors': {
        get: {
          tags: ['AI 攻擊'],
          summary: '獲取攻擊向量列表',
          responses: {
            200: { description: '攻擊向量列表' }
          }
        }
      },
      '/ai-attack/execute': {
        post: {
          tags: ['AI 攻擊'],
          summary: '執行 AI 攻擊測試',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    vectorIds: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['A1', 'A3']
                    },
                    intensity: {
                      type: 'string',
                      enum: ['low', 'medium', 'high'],
                      example: 'medium'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: '攻擊測試結果' }
          }
        }
      }
    }
  };
  
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: '🛡️ 侵國侵城 AI API 文檔',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #d32f2f; font-size: 2rem; text-align: center; }
    `
  }));
  
  app.get('/api/docs-json', (req, res) => {
    res.json(swaggerDocument);
  });
  
  console.log('✅ Swagger 設置完成');
}

bootstrap();
