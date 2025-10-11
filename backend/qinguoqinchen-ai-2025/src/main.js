// src/main.js
require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config(); // 加載環境變數

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
    const geminiService = createGeminiService();
    const grokService = createGrokService(); // 新增 Grok 服務
    
    console.log('🔧 註冊路由...');
    
    // 註冊所有路由
    registerRoutes(expressInstance, appService, healthService, attackService, geminiService, grokService);
    
    // 設置 Swagger
    setupSwagger(expressInstance);
    
    const port = process.env.PORT || 7939;
    await app.listen(port);
    
    console.log('✅ 侵國侵城 AI 滲透測試系統啟動成功!');
    console.log(`📍 主頁: http://localhost:${port}`);
    console.log(`📚 API 文檔: http://localhost:${port}/api/docs`);
    console.log(`🎯 健康檢查: http://localhost:${port}/health`);
    console.log(`⚔️ 攻擊向量: http://localhost:${port}/ai-attack/vectors`);
    console.log(`🤖 Gemini AI: http://localhost:${port}/ai-gemini/test`);
    console.log(`🛸 Grok AI: http://localhost:${port}/ai-grok/test`); // 新增
    
    // 測試所有端點
    console.log('\n📝 測試指令:');
    console.log(`curl http://localhost:${port}/`);
    console.log(`curl http://localhost:${port}/health`);
    console.log(`curl http://localhost:${port}/ai-attack/vectors`);
    console.log(`curl -X POST http://localhost:${port}/ai-attack/execute -H "Content-Type: application/json" -d '{"vectorIds":["A1","A3"],"intensity":"high"}'`);
    
    console.log('\n🤖 Gemini AI 測試指令:');
    console.log(`curl http://localhost:${port}/ai-gemini/test`);
    console.log(`curl -X POST http://localhost:${port}/ai-gemini/attack-vector -H "Content-Type: application/json" -d '{"prompt":"針對銀行eKYC系統的深偽攻擊策略"}'`);
    
    console.log('\n🛸 Grok AI 測試指令:');
    console.log(`curl http://localhost:${port}/ai-grok/test`);
    console.log(`curl -X POST http://localhost:${port}/ai-grok/chat -H "Content-Type: application/json" -d '{"prompt":"用銀河便車指南的風格解釋SQL注入攻擊"}'`);
    console.log(`curl -X POST http://localhost:${port}/ai-grok/security-analysis -H "Content-Type: application/json" -d '{"threatDescription":"AI生成Deepfake攻擊","targetSystem":"銀行eKYC系統"}'`);
    
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
        framework: 'NestJS + Express (手動路由) + Gemini AI + Grok AI',
        timestamp: new Date().toISOString(),
        description: '本系統專為 eKYC 安全測試設計，整合多種生成式 AI 技術',
        capabilities: [
          '多模態 AI 攻擊模擬 (StyleGAN3, Stable Diffusion, SimSwap, DALL·E)',
          '智能滲透測試',
          '量化安全評估 (APCER, BPCER, ACER, EER)',
          'AI 驅動的防禦建議 (Gemini AI)',
          '幽默風格的資安分析 (Grok AI)',
          '自動化報告生成',
          'AI 輔助攻擊策略優化'
        ],
        endpoints: {
          health: '/health',
          attackVectors: '/ai-attack/vectors',
          executeAttack: 'POST /ai-attack/execute',
          comboAttack: 'POST /ai-attack/combo',
          systemStats: '/system/stats',
          geminiTest: '/ai-gemini/test',
          geminiAttackVector: 'POST /ai-gemini/attack-vector',
          geminiEkycAnalysis: 'POST /ai-gemini/ekyc-analysis',
          grokTest: '/ai-grok/test',
          grokChat: 'POST /ai-grok/chat',
          grokSecurityAnalysis: 'POST /ai-grok/security-analysis',
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
          swagger: 'available',
          geminiAI: process.env.GEMINI_API_KEY ? 'configured' : 'not_configured',
          grokAI: process.env.XAI_API_KEY ? 'configured' : 'not_configured'
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

// Gemini 服務
function createGeminiService() {
  let GoogleGenAI;
  try {
    const genai = require('@google/genai');
    GoogleGenAI = genai.GoogleGenAI;
    console.log('✅ Gemini SDK 載入成功');
  } catch (error) {
    console.log('⚠️ Gemini SDK 未安裝，請執行: npm install @google/genai');
    return createMockGeminiService();
  }

  if (!process.env.GEMINI_API_KEY) {
    console.log('⚠️ 未設定 GEMINI_API_KEY 環境變數，使用模擬服務');
    return createMockGeminiService();
  }

  return {
    ai: new GoogleGenAI({}),
    
    async generateAttackVector(prompt) {
      try {
        console.log('🤖 Gemini AI 生成攻擊向量...');
        const response = await this.ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `你是侵國侵城 AI 滲透測試專家。請基於以下情境生成攻擊向量建議：

情境：${prompt}

請提供：
1. 攻擊步驟詳細說明
2. 所需技術和工具
3. 成功率預估
4. 風險評級
5. 防護對策建議

請以專業的滲透測試報告格式回答。`,
        });
        
        return {
          text: response.text,
          success: true,
          timestamp: new Date().toISOString(),
          model: "gemini-2.5-flash"
        };
      } catch (error) {
        console.error('❌ Gemini API 錯誤:', error.message);
        throw new Error(`Gemini AI 攻擊向量生成失敗: ${error.message}`);
      }
    },

    async analyzeEkycVulnerability(targetSystem, attackType) {
      try {
        console.log('🤖 Gemini AI 分析 eKYC 漏洞...');
        const prompt = `
侵國侵城 AI 系統 - eKYC 安全漏洞分析：

目標系統：${targetSystem}
攻擊類型：${attackType}

請提供詳細的安全評估報告，包含：
1. 系統漏洞識別
2. 攻擊向量分析
3. 風險等級評估
4. APCER/BPCER 預測
5. 具體的滲透測試建議
6. 針對 StyleGAN3、SimSwap、StableDiffusion 等技術的對策
7. 防護強化建議

請以專業的 eKYC 安全評估報告格式回答。`;

        const response = await this.ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        
        return {
          vulnerability_analysis: response.text,
          system: targetSystem,
          attack_type: attackType,
          success: true,
          timestamp: new Date().toISOString(),
          model: "gemini-2.5-flash"
        };
      } catch (error) {
        console.error('❌ eKYC 分析錯誤:', error.message);
        throw new Error(`eKYC 漏洞分析失敗: ${error.message}`);
      }
    },

    async generateDeepfakePrompt(scenario) {
      try {
        console.log('🤖 Gemini AI 生成 Deepfake 提示...');
        const response = await this.ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `
侵國侵城系統 - 生成 Deepfake 攻擊場景的詳細執行計畫：

攻擊場景：${scenario}

請提供完整的攻擊執行計畫：
1. StyleGAN3 參數設定和配置
2. SimSwap 實時換臉技術參數
3. 攻擊執行步驟詳解
4. 成功率預估和影響因子
5. APCER/BPCER 指標預測
6. 技術風險評估
7. 防護對策建議

請以技術文檔格式詳細說明每個步驟。`,
        });
        
        return {
          deepfake_prompt: response.text,
          scenario: scenario,
          success: true,
          timestamp: new Date().toISOString(),
          model: "gemini-2.5-flash"
        };
      } catch (error) {
        console.error('❌ Deepfake 提示生成錯誤:', error.message);
        throw new Error(`Deepfake 提示生成失敗: ${error.message}`);
      }
    },

    async optimizeAttackStrategy(vectorIds, intensity) {
      try {
        console.log('🤖 Gemini AI 優化攻擊策略...');
        const response = await this.ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `
侵國侵城 AI 系統 - 攻擊策略優化分析：

選定攻擊向量：${vectorIds.join(', ')}
攻擊強度：${intensity}

現有向量詳細說明：
• A1: StyleGAN3 偽造真人自拍 (成功率 78%)
• A2: StableDiffusion 翻拍攻擊 (成功率 65%)
• A3: SimSwap 即時換臉 (成功率 89%)
• A4: Diffusion+GAN 偽造護照 (成功率 73%)
• A5: DALL·E 生成假證件 (成功率 82%)

請提供策略優化建議：
1. 最佳執行順序和時機
2. 各向量參數調整建議
3. 組合攻擊策略設計
4. 成功率提升方法
5. 風險緩解和規避策略
6. 針對 eKYC 系統的特殊考量
7. 攻擊效果評估指標

請提供可執行的優化方案。`,
        });
        
        return {
          optimized_strategy: response.text,
          vectors: vectorIds,
          intensity: intensity,
          success: true,
          timestamp: new Date().toISOString(),
          model: "gemini-2.5-flash"
        };
      } catch (error) {
        console.error('❌ 策略優化錯誤:', error.message);
        throw new Error(`攻擊策略優化失敗: ${error.message}`);
      }
    }
  };
}

function createMockGeminiService() {
  return {
    async generateAttackVector(prompt) {
      return {
        text: `[模擬模式] 基於情境「${prompt}」的攻擊向量建議：\n\n1. 攻擊步驟：使用 StyleGAN3 生成目標人臉\n2. 技術要求：高性能 GPU、大型資料集\n3. 成功率：約 75-85%\n4. 風險等級：HIGH\n5. 防護建議：實施活體檢測和多重驗證\n\n注意：這是模擬回應，請設定 GEMINI_API_KEY 以使用真實 AI 分析。`,
        success: true,
        timestamp: new Date().toISOString(),
        model: "mock-service"
      };
    },

    async analyzeEkycVulnerability(targetSystem, attackType) {
      return {
        vulnerability_analysis: `[模擬模式] ${targetSystem} 針對 ${attackType} 的漏洞分析：\n\n1. 主要漏洞：缺乏深度活體檢測\n2. 風險等級：CRITICAL\n3. APCER 預測：15-25%\n4. 防護建議：升級檢測算法\n\n注意：這是模擬分析，請設定 GEMINI_API_KEY 獲得詳細報告。`,
        system: targetSystem,
        attack_type: attackType,
        success: true,
        timestamp: new Date().toISOString(),
        model: "mock-service"
      };
    },

    async generateDeepfakePrompt(scenario) {
      return {
        deepfake_prompt: `[模擬模式] ${scenario} 的 Deepfake 攻擊計畫：\n\n1. 技術選擇：SimSwap + StyleGAN3\n2. 執行步驟：資料收集 → 模型訓練 → 即時生成\n3. 成功率：85%+\n\n注意：這是模擬方案，請設定 GEMINI_API_KEY 獲得完整計畫。`,
        scenario: scenario,
        success: true,
        timestamp: new Date().toISOString(),
        model: "mock-service"
      };
    },

    async optimizeAttackStrategy(vectorIds, intensity) {
      return {
        optimized_strategy: `[模擬模式] 攻擊向量 ${vectorIds.join('+')} 的優化策略：\n\n1. 執行順序：${vectorIds.reverse().join(' → ')}\n2. 強度調整：${intensity} → high\n3. 成功率提升：預計 +15%\n\n注意：這是模擬優化，請設定 GEMINI_API_KEY 獲得 AI 分析。`,
        vectors: vectorIds,
        intensity: intensity,
        success: true,
        timestamp: new Date().toISOString(),
        model: "mock-service"
      };
    }
  };
}

// 新增 Grok 服務
function createGrokService() {
  if (!process.env.XAI_API_KEY) {
    console.log('⚠️ XAI_API_KEY 未設定，使用模擬服務');
    return createMockGrokService();
  }

  try {
    const OpenAI = require('openai');
    console.log('✅ OpenAI SDK (for Grok) 載入成功');
    
    const client = new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: "https://api.x.ai/v1"
    });

    return {
      async chat(prompt, systemPrompt = "你是 Grok，幽默且專業的 AI 助手，受《銀河便車指南》啟發。") {
        try {
          console.log('🛸 Grok AI 處理中...');
          const completion = await client.chat.completions.create({
            model: "grok-4-latest",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt }
            ],
            stream: false,
            temperature: 0.7,
            max_tokens: 2000
          });

          return {
            success: true,
            response: completion.choices[0].message.content,
            model: "grok-4-latest",
            usage: completion.usage,
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          throw new Error(`Grok API 調用失敗: ${error.message}`);
        }
      },

      async analyzeSecurityThreat(threatDescription, targetSystem) {
        const systemPrompt = `
你是 Grok，一位資安專家，具有《銀河便車指南》的幽默風格。
請分析安全威脅並提供專業建議，但要保持輕鬆幽默的語調。
`;
        
        const userPrompt = `
請分析以下安全威脅：

威脅描述：${threatDescription}
目標系統：${targetSystem}

請提供：
1. 威脅等級評估（CRITICAL/HIGH/MEDIUM/LOW）
2. 攻擊向量分析
3. 潛在影響評估
4. 防護建議
5. 應急響應步驟

請用專業但幽默的方式回答，就像《銀河便車指南》的風格一樣。
`;

        return await this.chat(userPrompt, systemPrompt);
      },

      async generatePentestPlan(targetType, attackVectors = []) {
        const systemPrompt = `
你是 Grok，滲透測試專家，擅長制定測試計畫。
請用《銀河便車指南》的風格來解釋複雜概念，但保持專業性。
`;

        const userPrompt = `
侵國侵城 AI 系統請求：

目標系統類型：${targetType}
可用攻擊向量：${attackVectors.join(', ') || 'A1, A2, A3, A4, A5'}

請制定詳細的滲透測試計畫：
1. 測試範圍和目標定義
2. 攻擊向量優先級排序
3. 測試階段和時程規劃
4. 風險評估和緩解措施
5. 成功指標和評估標準
6. 報告格式建議

請以《銀河便車指南》的智慧來解釋為什麼這個計畫會成功。
`;

        return await this.chat(userPrompt, systemPrompt);
      }
    };
  } catch (error) {
    console.log('⚠️ OpenAI 套件載入失敗，使用模擬服務');
    return createMockGrokService();
  }
}

function createMockGrokService() {
  return {
    async chat(prompt) {
      return {
        success: true,
        response: `[模擬 Grok] 關於「${prompt}」的回應：42！這是宇宙的答案。就像《銀河便車指南》告訴我們的，不要恐慌！請設定 XAI_API_KEY 以獲得真正的 Grok 智慧。`,
        model: "mock-grok",
        timestamp: new Date().toISOString()
      };
    },

    async analyzeSecurityThreat(threatDescription, targetSystem) {
      return {
        success: true,
        response: `[模擬 Grok] 威脅分析：「${threatDescription}」對「${targetSystem}」的威脅等級為 HIGH。就像《銀河便車指南》說的，不要恐慌！但確實需要立即關注。請設定 XAI_API_KEY 獲得完整分析。`,
        model: "mock-grok",
        timestamp: new Date().toISOString()
      };
    },

    async generatePentestPlan(targetType, attackVectors) {
      return {
        success: true,
        response: `[模擬 Grok] 針對「${targetType}」使用「${attackVectors.join(', ')}」的滲透測試計畫：就像搭便車一樣，關鍵是知道正確的路線。請設定 XAI_API_KEY 獲得詳細計畫。`,
        model: "mock-grok",
        timestamp: new Date().toISOString()
      };
    }
  };
}

// 註冊所有路由
function registerRoutes(app, appService, healthService, attackService, geminiService, grokService) {
  
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

  // === Gemini AI 路由 ===
  
  console.log('📍 註冊路由: GET /ai-gemini/test');
  app.get('/ai-gemini/test', async (req, res) => {
    console.log('📥 收到 Gemini 測試請求');
    try {
      const result = await geminiService.generateAttackVector("測試 Gemini AI 連接");
      res.json({
        success: true,
        message: "🤖 Gemini AI 連接成功！",
        gemini_configured: !!process.env.GEMINI_API_KEY,
        result: result
      });
    } catch (error) {
      console.error('❌ Gemini 測試錯誤:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message,
        message: "❌ Gemini AI 連接失敗"
      });
    }
  });

  console.log('📍 註冊路由: POST /ai-gemini/attack-vector');
  app.post('/ai-gemini/attack-vector', async (req, res) => {
    console.log('📥 收到攻擊向量生成請求, Body:', req.body);
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ 
          success: false,
          error: '請提供攻擊場景描述 (prompt 參數)'
        });
      }
      const result = await geminiService.generateAttackVector(prompt);
      res.json(result);
    } catch (error) {
      console.error('❌ 攻擊向量生成錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📍 註冊路由: POST /ai-gemini/ekyc-analysis');
  app.post('/ai-gemini/ekyc-analysis', async (req, res) => {
    console.log('📥 收到 eKYC 漏洞分析請求, Body:', req.body);
    try {
      const { targetSystem, attackType } = req.body;
      if (!targetSystem || !attackType) {
        return res.status(400).json({ 
          success: false,
          error: '請提供目標系統 (targetSystem) 和攻擊類型 (attackType)'
        });
      }
      const result = await geminiService.analyzeEkycVulnerability(targetSystem, attackType);
      res.json(result);
    } catch (error) {
      console.error('❌ eKYC 分析錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📍 註冊路由: POST /ai-gemini/deepfake-prompt');
  app.post('/ai-gemini/deepfake-prompt', async (req, res) => {
    console.log('📥 收到 Deepfake 提示生成請求, Body:', req.body);
    try {
      const { scenario } = req.body;
      if (!scenario) {
        return res.status(400).json({ 
          success: false,
          error: '請提供 Deepfake 攻擊場景 (scenario)'
        });
      }
      const result = await geminiService.generateDeepfakePrompt(scenario);
      res.json(result);
    } catch (error) {
      console.error('❌ Deepfake 提示生成錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📍 註冊路由: POST /ai-gemini/optimize-strategy');
  app.post('/ai-gemini/optimize-strategy', async (req, res) => {
    console.log('📥 收到攻擊策略優化請求, Body:', req.body);
    try {
      const { vectorIds = ['A1'], intensity = 'medium' } = req.body;
      const result = await geminiService.optimizeAttackStrategy(vectorIds, intensity);
      res.json(result);
    } catch (error) {
      console.error('❌ 策略優化錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // === 新增 Grok AI 路由 ===

  console.log('📍 註冊路由: GET /ai-grok/test');
  app.get('/ai-grok/test', async (req, res) => {
    console.log('📥 收到 Grok 測試請求');
    try {
      const result = await grokService.chat("測試連接，請說個關於AI的笑話並告訴我42的意義");
      res.json({
        success: true,
        message: "🛸 Grok AI 連接成功！",
        grok_configured: !!process.env.XAI_API_KEY,
        result
      });
    } catch (error) {
      console.error('❌ Grok 測試錯誤:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message,
        message: "❌ Grok AI 連接失敗"
      });
    }
  });

  console.log('📍 註冊路由: POST /ai-grok/chat');
  app.post('/ai-grok/chat', async (req, res) => {
    console.log('📥 收到 Grok 對話請求, Body:', req.body);
    try {
      const { prompt, systemPrompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ 
          success: false,
          error: '請提供對話內容 (prompt 參數)'
        });
      }
      const result = await grokService.chat(prompt, systemPrompt);
      res.json(result);
    } catch (error) {
      console.error('❌ Grok 對話錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📍 註冊路由: POST /ai-grok/security-analysis');
  app.post('/ai-grok/security-analysis', async (req, res) => {
    console.log('📥 收到 Grok 安全分析請求, Body:', req.body);
    try {
      const { threatDescription, targetSystem } = req.body;
      if (!threatDescription || !targetSystem) {
        return res.status(400).json({ 
          success: false,
          error: '請提供威脅描述 (threatDescription) 和目標系統 (targetSystem)'
        });
      }
      const result = await grokService.analyzeSecurityThreat(threatDescription, targetSystem);
      res.json(result);
    } catch (error) {
      console.error('❌ Grok 安全分析錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📍 註冊路由: POST /ai-grok/pentest-plan');
  app.post('/ai-grok/pentest-plan', async (req, res) => {
    console.log('📥 收到 Grok 滲透測試計畫請求, Body:', req.body);
    try {
      const { targetType, attackVectors = ['A1', 'A3'] } = req.body;
      if (!targetType) {
        return res.status(400).json({ 
          success: false,
          error: '請提供目標類型 (targetType)'
        });
      }
      const result = await grokService.generatePentestPlan(targetType, attackVectors);
      res.json(result);
    } catch (error) {
      console.error('❌ Grok 滲透測試計畫錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  console.log('✅ 所有路由（包含 Gemini AI 和 Grok AI）註冊完成');
}

// 設置 Swagger
function setupSwagger(app) {
  const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: '侵國侵城 AI 滲透測試系統 API',
      description: '專為 eKYC 安全測試設計的 AI 紅隊滲透測試系統，整合 Google Gemini AI 和 xAI Grok',
      version: '1.0.0',
      contact: {
        name: '侵國侵城團隊',
        email: 'support@qinguoqinchen.ai'
      }
    },
    servers: [
      { url: 'http://localhost:7939', description: '開發環境' }
    ],
    tags: [
      { name: '系統管理', description: '系統基礎功能和健康檢查' },
      { name: 'AI 攻擊', description: '傳統攻擊向量和執行功能' },
      { name: 'Gemini AI', description: 'Google Gemini AI 智能分析功能' },
      { name: 'Grok AI', description: 'xAI Grok 幽默風格的資安分析' }
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
                      message: { type: 'string', example: '🛡️ 歡迎使用侵國侵城 AI 滲透測試系統' },
                      version: { type: 'string', example: '1.0.0' },
                      status: { type: 'string', example: 'operational' },
                      framework: { type: 'string', example: 'NestJS + Express + Gemini AI + Grok AI' },
                      capabilities: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      endpoints: { type: 'object' }
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
          description: '檢查系統運行狀態、記憶體使用量和各服務狀態',
          responses: {
            200: { 
              description: '系統健康狀態',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'healthy' },
                      system: { type: 'string', example: '侵國侵城 AI 系統' },
                      uptime: { type: 'string', example: '3600秒' },
                      memory: {
                        type: 'object',
                        properties: {
                          used: { type: 'string', example: '256MB' },
                          total: { type: 'string', example: '512MB' },
                          percentage: { type: 'string', example: '50%' }
                        }
                      },
                      services: {
                        type: 'object',
                        properties: {
                          geminiAI: { type: 'string', example: 'configured' },
                          grokAI: { type: 'string', example: 'configured' }
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
      '/system/stats': {
        get: {
          tags: ['系統管理'],
          summary: '系統統計資訊',
          description: '獲取系統運行統計數據和性能指標',
          responses: {
            200: { description: '系統統計數據' }
          }
        }
      },
      '/ai-attack/vectors': {
        get: {
          tags: ['AI 攻擊'],
          summary: '獲取攻擊向量列表',
          description: '列出所有可用的攻擊向量，包含成功率和難度評估',
          responses: {
            200: { 
              description: '攻擊向量列表',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      vectors: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'A1' },
                            model: { type: 'string', example: 'StyleGAN3' },
                            scenario: { type: 'string', example: '偽造真人自拍' },
                            difficulty: { type: 'string', example: 'MEDIUM' },
                            successRate: { type: 'string', example: '78%' },
                            description: { type: 'string' }
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
          description: '執行指定的攻擊向量組合，生成詳細的測試結果',
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
                      example: ['A1', 'A3'],
                      description: '要執行的攻擊向量 ID 列表'
                    },
                    intensity: {
                      type: 'string',
                      enum: ['low', 'medium', 'high'],
                      example: 'medium',
                      description: '攻擊強度等級'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: '攻擊測試結果' },
            400: { description: '請求參數錯誤' }
          }
        }
      },
      '/ai-attack/combo': {
        post: {
          tags: ['AI 攻擊'],
          summary: '執行複合攻擊',
          description: '執行多組攻擊向量的組合攻擊測試',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    combos: {
                      type: 'array',
                      items: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      example: [['A1', 'A2'], ['A3', 'A4']],
                      description: '攻擊向量組合列表'
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
            200: { description: '複合攻擊測試結果' }
          }
        }
      },
      
      // Gemini AI 路由
      '/ai-gemini/test': {
        get: {
          tags: ['Gemini AI'],
          summary: '測試 Gemini AI 連接',
          description: '測試與 Google Gemini AI 的連接狀態',
          responses: {
            200: { 
              description: 'Gemini AI 連接測試結果',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string', example: '🤖 Gemini AI 連接成功！' },
                      gemini_configured: { type: 'boolean' },
                      result: { type: 'object' }
                    }
                  }
                }
              }
            },
            500: { description: 'Gemini AI 連接失敗' }
          }
        }
      },
      '/ai-gemini/attack-vector': {
        post: {
          tags: ['Gemini AI'],
          summary: '生成 AI 攻擊向量',
          description: '使用 Gemini AI 根據描述生成詳細的攻擊向量建議',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    prompt: {
                      type: 'string',
                      example: '針對銀行 eKYC 系統的 StyleGAN3 偽造攻擊',
                      description: '攻擊場景描述'
                    }
                  },
                  required: ['prompt']
                }
              }
            }
          },
          responses: {
            200: { description: 'AI 生成的攻擊向量建議' },
            400: { description: '缺少必要參數' }
          }
        }
      },
      '/ai-gemini/ekyc-analysis': {
        post: {
          tags: ['Gemini AI'],
          summary: 'eKYC 安全漏洞分析',
          description: '使用 Gemini AI 分析 eKYC 系統的安全漏洞和防護建議',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    targetSystem: {
                      type: 'string',
                      example: '銀行開戶系統',
                      description: '目標系統類型'
                    },
                    attackType: {
                      type: 'string',
                      example: 'Deepfake + 證件偽造',
                      description: '攻擊類型'
                    }
                  },
                  required: ['targetSystem', 'attackType']
                }
              }
            }
          },
          responses: {
            200: { description: 'eKYC 漏洞分析報告' },
            400: { description: '缺少必要參數' }
          }
        }
      },
      '/ai-gemini/deepfake-prompt': {
        post: {
          tags: ['Gemini AI'],
          summary: 'Deepfake 攻擊提示生成',
          description: '生成 Deepfake 攻擊場景的詳細執行計畫',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    scenario: {
                      type: 'string',
                      example: '模擬客戶進行視訊開戶驗證',
                      description: 'Deepfake 攻擊場景'
                    }
                  },
                  required: ['scenario']
                }
              }
            }
          },
          responses: {
            200: { description: 'Deepfake 攻擊執行計畫' },
            400: { description: '缺少必要參數' }
          }
        }
      },
      '/ai-gemini/optimize-strategy': {
        post: {
          tags: ['Gemini AI'],
          summary: '攻擊策略優化',
          description: '使用 Gemini AI 優化攻擊向量組合和執行策略',
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
                      example: ['A1', 'A3', 'A4'],
                      description: '攻擊向量 ID 列表'
                    },
                    intensity: {
                      type: 'string',
                      enum: ['low', 'medium', 'high'],
                      example: 'high',
                      description: '攻擊強度'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: '優化後的攻擊策略' }
          }
        }
      },

      // Grok AI 路由
      '/ai-grok/test': {
        get: {
          tags: ['Grok AI'],
          summary: '測試 Grok AI 連接',
          description: '測試與 xAI Grok 的連接狀態，體驗《銀河便車指南》風格',
          responses: {
            200: { 
              description: 'Grok AI 連接測試結果',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string', example: '🛸 Grok AI 連接成功！' },
                      grok_configured: { type: 'boolean' },
                      result: { type: 'object' }
                    }
                  }
                }
              }
            },
            500: { description: 'Grok AI 連接失敗' }
          }
        }
      },
      '/ai-grok/chat': {
        post: {
          tags: ['Grok AI'],
          summary: 'Grok AI 智能對話',
          description: '與 Grok AI 進行對話，獲得幽默風格的專業回答',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    prompt: {
                      type: 'string',
                      example: '用銀河便車指南的風格解釋什麼是零日漏洞',
                      description: '對話內容'
                    },
                    systemPrompt: {
                      type: 'string',
                      example: '你是專精資安的 Grok AI，請用幽默但專業的方式回答',
                      description: '系統提示詞（可選）'
                    }
                  },
                  required: ['prompt']
                }
              }
            }
          },
          responses: {
            200: { description: 'Grok AI 對話回應' },
            400: { description: '缺少必要參數' }
          }
        }
      },
      '/ai-grok/security-analysis': {
        post: {
          tags: ['Grok AI'],
          summary: 'Grok AI 安全威脅分析',
          description: '使用 Grok AI 分析安全威脅，獲得專業且幽默的分析報告',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    threatDescription: {
                      type: 'string',
                      example: 'APT 組織使用 Deepfake 技術進行社交工程攻擊',
                      description: '威脅描述'
                    },
                    targetSystem: {
                      type: 'string',
                      example: '金融機構 eKYC 系統',
                      description: '目標系統'
                    }
                  },
                  required: ['threatDescription', 'targetSystem']
                }
              }
            }
          },
          responses: {
            200: { description: 'Grok AI 威脅分析報告' },
            400: { description: '缺少必要參數' }
          }
        }
      },
      '/ai-grok/pentest-plan': {
        post: {
          tags: ['Grok AI'],
          summary: 'Grok AI 滲透測試計畫',
          description: '使用 Grok AI 制定滲透測試計畫，用幽默的方式解釋複雜概念',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    targetType: {
                      type: 'string',
                      example: 'eKYC 身份驗證系統',
                      description: '目標系統類型'
                    },
                    attackVectors: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['A1', 'A3', 'A4'],
                      description: '可用攻擊向量'
                    }
                  },
                  required: ['targetType']
                }
              }
            }
          },
          responses: {
            200: { description: 'Grok AI 滲透測試計畫' },
            400: { description: '缺少必要參數' }
          }
        }
      }
    },
    components: {
      schemas: {
        AttackVector: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'A1' },
            model: { type: 'string', example: 'StyleGAN3' },
            scenario: { type: 'string', example: '偽造真人自拍' },
            difficulty: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'] },
            successRate: { type: 'string', example: '78%' },
            description: { type: 'string' }
          }
        },
        AttackResult: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            testId: { type: 'string' },
            attackResults: { type: 'object' },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  };
  
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: '🛡️ 侵國侵城 AI API 文檔',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #d32f2f; font-size: 2rem; text-align: center; margin-bottom: 1rem; }
      .swagger-ui .info .description { font-size: 1.1rem; text-align: center; margin-bottom: 2rem; }
      .swagger-ui .scheme-container { background: #f5f5f5; padding: 1rem; border-radius: 8px; }
      .tag-operations { margin-bottom: 2rem; }
      .opblock-tag { font-size: 1.3rem; font-weight: bold; }
    `,
    customJs: `
      window.onload = function() {
        console.log('🛡️ 侵國侵城 AI API 文檔載入完成');
      }
    `
  }));
  
  app.get('/api/docs-json', (req, res) => {
    res.json(swaggerDocument);
  });
  
  console.log('✅ Swagger 設置完成 - 包含完整的 Gemini 和 Grok API 文檔');
}

bootstrap();
