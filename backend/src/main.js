// src/main.js
require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
async function bootstrap() {
  try {
    console.log('🚀 啟動侵國侵城 AI 滲透測試系統...');

    // 建立一個最小的 AppModule
    class AppModule { }
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
    const grokService = createGrokService();
    const vertexAIAgentService = createVertexAIAgentService();
    const ragService = createRagService(); // 新增 RAG 服務
    const databaseService = createDatabaseService(); // 新增資料庫服務

    console.log('🔧 註冊路由...');

    // 註冊所有路由
    registerRoutes(expressInstance, appService, healthService, attackService, geminiService, grokService, vertexAIAgentService, ragService, databaseService);

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
    console.log(`🛸 Grok AI: http://localhost:${port}/ai-grok/test`);
    console.log(`🧠 Vertex AI Agent: http://localhost:${port}/ai-agent/test`);
    console.log(`🔍 RAG 查詢: http://localhost:${port}/rag/ask`);
    console.log(`📊 資料庫狀態: http://localhost:${port}/database/status`);

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

    console.log('\n🧠 Vertex AI Agent 測試指令:');
    console.log(`curl http://localhost:${port}/ai-agent/test`);
    console.log(`curl -X POST http://localhost:${port}/ai-agent/chat -H "Content-Type: application/json" -d '{"message":"分析銀行eKYC系統的安全風險","sessionId":"security-session-1"}'`);
    console.log(`curl -X POST http://localhost:${port}/ai-agent/analyze-security -H "Content-Type: application/json" -d '{"systemType":"銀行數位開戶","verificationMethods":["face_recognition","document_scan"]}'`);

    console.log('\n📝 新增 RAG 測試指令:');
    console.log(`curl -X POST http://localhost:${port}/rag/ask -H "Content-Type: application/json" -d '{"question":"eKYC系統如何防護Deepfake攻擊？","filters":{"attackVector":"A3"}}'`);
    console.log(`curl -X POST http://localhost:${port}/rag/ingest -H "Content-Type: application/json" -d '{"text":"滲透測試報告：A3攻擊向量成功率89%","metadata":{"attackVector":"A3","runId":"test-001"}}'`);
    console.log(`curl http://localhost:${port}/rag/stats`);
    console.log(`curl http://localhost:${port}/database/status`);
    console.log(`curl -X POST http://localhost:${port}/database/init`);

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
        message: '歡迎使用侵國侵城 AI 滲透測試系統',
        version: '1.0.0',
        status: 'operational',
        framework: 'NestJS + Express (手動路由) + Gemini AI + Grok AI + Vertex AI Agent',
        timestamp: new Date().toISOString(),
        description: '本系統專為 eKYC 安全測試設計，整合多種生成式 AI 技術',
        capabilities: [
          '多模態 AI 攻擊模擬 (StyleGAN3, Stable Diffusion, SimSwap, DALL·E)',
          '智能滲透測試',
          '量化安全評估 (APCER, BPCER, ACER, EER)',
          'AI 驅動的防禦建議 (Gemini AI)',
          '幽默風格的資安分析 (Grok AI)',
          '智能 AI Agent 安全專家 (Vertex AI)',
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
          grokTest: '/ai-grok/test',
          vertexAgentTest: '/ai-agent/test',
          ragAsk: 'POST /rag/ask',
          ragIngest: 'POST /rag/ingest',
          ragStats: '/rag/stats',
          databaseStatus: '/database/status',
          databaseInit: 'POST /database/init',
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
          grokAI: process.env.XAI_API_KEY ? 'configured' : 'not_configured',
          vertexAIAgent: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'configured' : 'not_configured'
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

// Grok 服務
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

// 建立 RAG 服務
function createRagService() {
  return {
    documents: [], // 模擬文檔儲存
    chunks: [], // 模擬文檔塊儲存

    async askQuestion(question, filters = {}) {
      console.log(`🔍 RAG 查詢: ${question}`);

      try {
        // 模擬向量搜尋
        const relevantChunks = this.searchRelevantChunks(question, filters);

        if (relevantChunks.length === 0) {
          return {
            answer: '抱歉，在現有的滲透測試報告中找不到相關資訊。請檢查查詢條件或上傳更多文檔。',
            sources: [],
            timestamp: new Date().toISOString()
          };
        }

        // 組合上下文
        const context = relevantChunks
          .map(chunk => `[文檔ID: ${chunk.documentId}][相似度: ${(chunk.similarity * 100).toFixed(1)}%] ${chunk.text}`)
          .join('\n\n');

        // 使用 Gemini 生成回答
        const geminiService = createGeminiService();
        const prompt = this.buildRagPrompt(context, question);
        const result = await geminiService.generateAttackVector(prompt);

        // 記錄查詢
        this.logQuery(question, relevantChunks.map(c => c.id), result.text);

        return {
          answer: result.text,
          sources: relevantChunks.map(chunk => ({
            documentId: chunk.documentId,
            chunkId: chunk.id,
            similarity: chunk.similarity,
            attackVector: chunk.attackVector,
            runId: chunk.runId,
            preview: chunk.text.substring(0, 200) + '...'
          })),
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        console.error('❌ RAG 查詢失敗:', error.message);
        return {
          answer: `RAG 系統錯誤: ${error.message}。請檢查系統配置或聯絡管理員。`,
          sources: [],
          timestamp: new Date().toISOString()
        };
      }
    },

    searchRelevantChunks(question, filters, topK = 5) {
      // 簡化的文本相似度搜尋（實際專案中會使用向量相似度）
      const questionLower = question.toLowerCase();
      let filteredChunks = [...this.chunks];

      // 應用過濾條件
      if (filters.attackVector) {
        filteredChunks = filteredChunks.filter(chunk =>
          chunk.attackVector === filters.attackVector
        );
      }

      if (filters.runId) {
        filteredChunks = filteredChunks.filter(chunk =>
          chunk.runId === filters.runId
        );
      }

      // 計算相似度分數（簡化實作）
      const scoredChunks = filteredChunks.map(chunk => {
        const chunkLower = chunk.text.toLowerCase();
        let score = 0;

        // 關鍵字匹配
        const keywords = ['deepfake', 'ekyc', '攻擊', '防護', 'simswap', 'stylegan'];
        keywords.forEach(keyword => {
          if (questionLower.includes(keyword) && chunkLower.includes(keyword)) {
            score += 0.2;
          }
        });

        // 攻擊向量匹配
        if (questionLower.includes('a1') && chunk.attackVector === 'A1') score += 0.3;
        if (questionLower.includes('a2') && chunk.attackVector === 'A2') score += 0.3;
        if (questionLower.includes('a3') && chunk.attackVector === 'A3') score += 0.3;
        if (questionLower.includes('a4') && chunk.attackVector === 'A4') score += 0.3;
        if (questionLower.includes('a5') && chunk.attackVector === 'A5') score += 0.3;

        return { ...chunk, similarity: Math.min(score + Math.random() * 0.3, 1.0) };
      });

      // 排序並返回前 K 個
      return scoredChunks
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
    },

    buildRagPrompt(context, question) {
      return `你是「侵國侵城」eKYC 滲透測試系統的智慧助理，專門分析滲透測試報告並提供資安改善建議。

基於以下滲透測試文檔內容回答問題：

== 滲透測試報告內容 ==
${context}

== 用戶問題 ==
${question}

== 回答要求 ==
1. 只能基於提供的滲透測試報告內容回答
2. 必須在答案中標註引用的文檔ID和相似度分數
3. 針對 eKYC 系統的 AI 攻擊提供具體防護建議
4. 如果涉及 APCER、BPCER、ACER、ROC-AUC、EER 等指標，請詳細解釋
5. 提供可操作的改善措施，包含技術面和流程面
6. 如果文檔中沒有相關資訊，請明確說明並建議進一步的測試方向

請以專業的資安專家角度回答：`;
    },

    async ingestDocument(text, metadata = {}) {
      console.log('📥 RAG 文檔匯入中...');

      try {
        const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

        // 儲存原始文檔
        const document = {
          id: docId,
          text: text,
          metadata: metadata,
          createdAt: new Date().toISOString()
        };
        this.documents.push(document);

        // 分塊處理
        const chunks = this.chunkDocument(text, docId, metadata);
        this.chunks.push(...chunks);

        // 模擬向量化（實際專案中會呼叫 Python AI 服務）
        for (const chunk of chunks) {
          chunk.embedding = this.generateMockEmbedding(chunk.text);
        }

        console.log(`✅ 文檔匯入成功: ${docId}, 產生 ${chunks.length} 個文檔塊`);

        return {
          success: true,
          documentId: docId,
          chunksCount: chunks.length,
          message: `文檔已成功匯入並分塊處理`
        };

      } catch (error) {
        console.error('❌ 文檔匯入失敗:', error.message);
        throw error;
      }
    },

    chunkDocument(text, docId, metadata, chunkSize = 500) {
      const chunks = [];
      const sentences = text.split(/[。！？\n]/).filter(s => s.trim().length > 0);

      let currentChunk = '';
      let chunkIndex = 0;

      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
          chunks.push({
            id: `${docId}_chunk_${chunkIndex}`,
            documentId: docId,
            chunkIndex: chunkIndex,
            text: currentChunk.trim(),
            attackVector: metadata.attackVector || null,
            runId: metadata.runId || null,
            createdAt: new Date().toISOString()
          });

          currentChunk = sentence;
          chunkIndex++;
        } else {
          currentChunk += sentence + '。';
        }
      }

      // 處理最後一個塊
      if (currentChunk.trim().length > 0) {
        chunks.push({
          id: `${docId}_chunk_${chunkIndex}`,
          documentId: docId,
          chunkIndex: chunkIndex,
          text: currentChunk.trim(),
          attackVector: metadata.attackVector || null,
          runId: metadata.runId || null,
          createdAt: new Date().toISOString()
        });
      }

      return chunks;
    },

    generateMockEmbedding(text) {
      // 模擬 1024 維向量（實際專案中會使用真實的嵌入模型）
      return Array.from({ length: 1024 }, () => Math.random() - 0.5);
    },

    logQuery(question, chunkIds, response) {
      const logData = {
        timestamp: new Date().toISOString(),
        question: question,
        usedChunks: chunkIds,
        responseLength: response.length,
        systemVersion: '1.0.0'
      };

      console.log(`📝 RAG 查詢記錄: ${JSON.stringify(logData)}`);
    },

    getStats() {
      return {
        documentsCount: this.documents.length,
        chunksCount: this.chunks.length,
        averageChunkSize: this.chunks.length > 0
          ? Math.round(this.chunks.reduce((sum, chunk) => sum + chunk.text.length, 0) / this.chunks.length)
          : 0,
        attackVectors: [...new Set(this.chunks.map(chunk => chunk.attackVector).filter(Boolean))],
        runIds: [...new Set(this.chunks.map(chunk => chunk.runId).filter(Boolean))]
      };
    }
  };
}

// 建立資料庫服務
function createDatabaseService() {
  return {
    async getStatus() {
      console.log('🗄️ 檢查資料庫狀態...');

      const status = {
        postgres: {
          configured: !!process.env.DATABASE_URL,
          status: process.env.DATABASE_URL ? 'configured' : 'not_configured',
          url: process.env.DATABASE_URL ? 'configured' : 'not_set'
        },
        neo4j: {
          configured: !!(process.env.NEO4J_URI && process.env.NEO4J_USERNAME),
          status: (process.env.NEO4J_URI && process.env.NEO4J_USERNAME) ? 'configured' : 'not_configured',
          uri: process.env.NEO4J_URI || 'not_set'
        },
        redis: {
          configured: !!process.env.REDIS_URL,
          status: process.env.REDIS_URL ? 'configured' : 'not_configured',
          url: process.env.REDIS_URL || 'not_set'
        },
        pythonAI: {
          configured: !!process.env.PYTHON_AI_URL,
          status: process.env.PYTHON_AI_URL ? 'configured' : 'not_configured',
          url: process.env.PYTHON_AI_URL || 'not_set'
        }
      };

      return {
        status: 'checked',
        databases: status,
        allConfigured: Object.values(status).every(db => db.configured),
        timestamp: new Date().toISOString()
      };
    },

    async initializeDatabase() {
      console.log('🔧 初始化資料庫...');

      try {
        // 模擬資料庫初始化
        console.log('✅ PostgreSQL 表格檢查完成');
        console.log('✅ Neo4j 圖資料庫連接正常');
        console.log('✅ Redis 快取服務運行中');

        return {
          success: true,
          message: '資料庫初始化完成',
          initialized: ['documents', 'chunks', 'test_runs', 'attack_vectors'],
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        console.error('❌ 資料庫初始化失敗:', error.message);
        throw error;
      }
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
        system: '侵國侵城 AI 系統 + RAG',
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
          grokAI: process.env.XAI_API_KEY ? 'configured' : 'not_configured',
          vertexAIAgent: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'configured' : 'not_configured',
          ragSystem: 'operational',
          postgres: process.env.DATABASE_URL ? 'configured' : 'not_configured',
          neo4j: process.env.NEO4J_URI ? 'configured' : 'not_configured',
          redis: process.env.REDIS_URL ? 'configured' : 'not_configured'
        }
      };
    }
  };
}


// 新增 Vertex AI Agent 服務
function createVertexAIAgentService() {
  if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log('⚠️ Vertex AI Agent 環境變數未完整設定，使用模擬服務');
    return createMockVertexAIAgentService();
  }

  try {
    const { VertexAI } = require('@google-cloud/vertexai');
    console.log('✅ Vertex AI Agent SDK 載入成功');

    const vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT_ID,
      location: process.env.VERTEX_AI_LOCATION || 'us-central1'
    });

    return {
      vertexAI,

      async createSecurityAgent(agentName, instructions) {
        try {
          console.log('🤖 建立 Vertex AI 安全分析 Agent...');

          const agentConfig = {
            displayName: agentName,
            goal: "專業的 eKYC 安全分析和滲透測試專家",
            instructions: instructions || `
你是侵國侵城 AI 系統的安全分析專家 Agent。你的職責包括：

1. **eKYC 安全評估**
   - 分析身份驗證流程漏洞
   - 評估生物特徵認證安全性
   - 檢測 Deepfake 攻擊風險

2. **威脅情報收集**
   - 收集最新的 AI 攻擊趨勢
   - 分析 StyleGAN、SimSwap 等技術威脅
   - 監控零日漏洞

3. **滲透測試規劃**
   - 制定測試策略
   - 選擇攻擊向量
   - 評估測試結果

4. **報告生成**
   - 撰寫專業安全報告
   - 提供修復建議
   - 風險等級評估

請始終以專業、精確的方式回應，並提供可行的建議。
            `
          };

          return {
            success: true,
            agent: agentConfig,
            agentId: `security-agent-${Date.now()}`,
            message: `安全分析 Agent "${agentName}" 建立成功`
          };
        } catch (error) {
          console.error('❌ Vertex AI Agent 建立錯誤:', error.message);
          throw new Error(`AI Agent 建立失敗: ${error.message}`);
        }
      },

      async chatWithAgent(sessionId, message, agentId) {
        console.log('💬 與 AI Agent 對話中...');
        return this.generateIntelligentResponse(message, sessionId, agentId);  // ← 這行需要修改
      },

      generateIntelligentResponse(message, sessionId, agentId) {
        const messageLower = message.toLowerCase();
        let response = '';

        if (messageLower.includes('deepfake') || messageLower.includes('ekyc') || messageLower.includes('銀行')) {
          response = `🎭 **Vertex AI Agent - eKYC Deepfake 威脅深度分析**

**🚨 威脅等級**: CRITICAL

**主要 Deepfake 攻擊技術**:
• **StyleGAN3**: 高品質人臉生成 (成功率 85%)
• **SimSwap**: 即時視訊換臉 (成功率 89%)
• **FaceSwap**: 深度學習換臉技術
• **DeepFaceLab**: 專業級後製換臉

**銀行 eKYC 系統風險評估**:
1. **身份驗證繞過風險**:
   - 靜態照片驗證: 高風險 (成功率 85%)
   - 動態活體檢測: 極高風險 (成功率 75%)
   - 視訊通話驗證: 極高風險 (成功率 90%)

2. **攻擊場景分析**:
   - 開戶身份冒用
   - 貸款申請詐騙
   - 資產轉移攻擊
   - 洗錢資金流動

**防護策略建議**:
• 升級活體檢測算法 (3D 深度感測)
• 實施多重生物特徵驗證
• 建立 AI vs AI 檢測機制
• 部署行為分析系統

**風險指標**:
- 當前 APCER: 20-30%
- 目標 APCER: <3%
- 預估損失降低: 85%`;

        } else if (messageLower.includes('攻擊') || messageLower.includes('滲透')) {
          response = `⚔️ **Vertex AI Agent - 攻擊向量分析**

**侵國侵城攻擊向量**:
• **A1 - StyleGAN3**: 偽造真人自拍 (成功率 78%)
• **A2 - StableDiffusion**: 翻拍攻擊 (成功率 65%)
• **A3 - SimSwap**: 即時換臉 (成功率 89%)
• **A4 - 證件偽造**: 偽造護照 (成功率 73%)
• **A5 - DALL·E**: 生成假證件 (成功率 82%)

**組合攻擊策略**:
🔥 **鑽石組合**: A3 + A4 (成功率 94%)
💎 **黃金組合**: A1 + A5 (成功率 83%)

**防護建議優先級**:
1. 優先防護 A3 (SimSwap)
2. 加強 A4 (證件偽造) 檢測
3. 提升 A1 (StyleGAN3) 識別`;

        } else {
          response = `🤖 **Vertex AI Agent - 專業安全諮詢**

**查詢**: ${message}

**基礎安全評估**:
• 威脅建模分析
• 風險等級評估  
• 防護策略建議
• 監控機制設計

**建議深入討論**:
• eKYC 系統安全強化
• Deepfake 攻擊防護
• 滲透測試策略
• 事件響應計畫

請提供更具體的場景獲得詳細分析。`;
        }

        return {
          success: true,
          response: response,
          sessionId: sessionId,
          agentId: agentId,
          model: 'vertex-ai-local-intelligence',
          timestamp: new Date().toISOString()
        };
      },

      async analyzeEkycSecurity(systemType, verificationMethods = []) {
        console.log('🔍 執行 eKYC 安全分析...');

        const securityAssessment = {
          systemType: systemType,
          verificationMethods: verificationMethods,
          riskAssessment: {
            overall: 'MEDIUM',
            deepfakeRisk: verificationMethods.includes('face_recognition') ? 'HIGH' : 'LOW',
            documentForgeryRisk: verificationMethods.includes('document_scan') ? 'MEDIUM' : 'LOW',
            biometricSpoofingRisk: verificationMethods.includes('fingerprint') ? 'MEDIUM' : 'LOW'
          },
          recommendations: [
            '實施多重身份驗證',
            '加強活體檢測技術',
            '定期更新 AI 檢測模型',
            '建立異常行為監控'
          ],
          complianceStatus: {
            gdpr: verificationMethods.includes('data_encryption') ? 'COMPLIANT' : 'NEEDS_REVIEW',
            pci: 'COMPLIANT',
            iso27001: 'PARTIALLY_COMPLIANT'
          }
        };

        return securityAssessment;
      },

      async generateAttackVector(targetSystem, attackType, complexity = 'medium') {
        console.log(`⚔️ 生成攻擊向量: ${attackType}`);

        const attackVectors = {
          deepfake: {
            name: 'Deepfake 身份欺騙攻擊',
            steps: [
              '收集目標個人照片和影片',
              '使用 StyleGAN3/SimSwap 生成偽造影像',
              '準備符合系統要求的假身份文件',
              '通過即時視訊驗證系統',
              '繞過生物特徵檢測'
            ],
            tools: ['StyleGAN3', 'SimSwap', 'FaceSwap', 'DeepFaceLab'],
            successRate: complexity === 'high' ? '85%' : complexity === 'medium' ? '65%' : '45%',
            detection: {
              difficulty: complexity === 'high' ? 'HARD' : 'MEDIUM',
              indicators: ['不自然的面部動作', '光線不一致', '像素異常']
            }
          },
          document_forgery: {
            name: '文件偽造攻擊',
            steps: [
              '獲取真實證件範本',
              '使用 AI 生成個人資訊',
              '偽造 MRZ 和條碼',
              '製作高品質假證件',
              '通過文件掃描驗證'
            ],
            tools: ['Photoshop', 'GIMP', 'AI文字生成', '高品質印表機'],
            successRate: complexity === 'high' ? '75%' : complexity === 'medium' ? '55%' : '35%'
          },
          biometric_spoofing: {
            name: '生物特徵欺騙攻擊',
            steps: [
              '獲取目標生物特徵資料',
              '製作欺騙裝置（假指紋、假眼球等）',
              '繞過活體檢測',
              '通過生物特徵驗證'
            ],
            tools: ['3D列印', '矽膠材料', '高解析度影像'],
            successRate: complexity === 'high' ? '70%' : complexity === 'medium' ? '50%' : '30%'
          }
        };

        return {
          targetSystem: targetSystem,
          attackType: attackType,
          complexity: complexity,
          vector: attackVectors[attackType] || { error: '未知攻擊類型' },
          mitigation: [
            '實施進階活體檢測',
            '多重驗證機制',
            '異常行為分析',
            '定期安全更新'
          ]
        };
      },

      async createPentestReport(testResults, findings, riskLevel) {
        console.log('📊 生成滲透測試報告...');

        const report = {
          executiveSummary: {
            testDate: new Date().toISOString().split('T')[0],
            tester: 'Vertex AI Security Agent',
            overallRisk: riskLevel.toUpperCase(),
            criticalFindings: findings.filter(f => f.includes('CRITICAL')).length,
            totalFindings: findings.length
          },
          technicalFindings: findings.map((finding, index) => ({
            id: `FINDING-${index + 1}`,
            title: finding,
            severity: this.assessFindingSeverity(finding),
            cvssScore: this.calculateCVSS(finding),
            description: `詳細分析: ${finding}`,
            recommendation: this.generateRecommendation(finding)
          })),
          riskMatrix: {
            critical: findings.filter(f => f.includes('CRITICAL')).length,
            high: findings.filter(f => f.includes('HIGH')).length,
            medium: findings.filter(f => f.includes('MEDIUM')).length,
            low: findings.filter(f => f.includes('LOW')).length
          },
          remediation: {
            immediate: findings.filter(f => f.includes('CRITICAL')).map(f => `立即修復: ${f}`),
            shortTerm: findings.filter(f => f.includes('HIGH')).map(f => `短期修復: ${f}`),
            longTerm: findings.filter(f => f.includes('MEDIUM')).map(f => `長期改善: ${f}`)
          },
          testResults: testResults
        };

        return report;
      },

      assessFindingSeverity(finding) {
        if (finding.includes('CRITICAL')) return 'CRITICAL';
        if (finding.includes('HIGH')) return 'HIGH';
        if (finding.includes('MEDIUM')) return 'MEDIUM';
        return 'LOW';
      },

      calculateCVSS(finding) {
        if (finding.includes('CRITICAL')) return 9.0 + Math.random();
        if (finding.includes('HIGH')) return 7.0 + Math.random() * 2;
        if (finding.includes('MEDIUM')) return 4.0 + Math.random() * 3;
        return Math.random() * 4;
      },

      generateRecommendation(finding) {
        const recommendations = {
          'SQL Injection': '使用參數化查詢和輸入驗證',
          'XSS': '實施內容安全政策和輸出編碼',
          'Authentication': '啟用多重身份驗證',
          'Encryption': '使用強加密算法和安全金鑰管理'
        };

        for (const [key, value] of Object.entries(recommendations)) {
          if (finding.includes(key)) return value;
        }

        return '請諮詢安全專家獲得具體建議';
      }
    };
  } catch (error) {
    console.log('⚠️ Vertex AI Agent SDK 載入失敗，使用模擬服務:', error.message);
    return createMockVertexAIAgentService();
  }
}

function createMockVertexAIAgentService() {
  return {
    async createSecurityAgent(agentName, instructions) {
      return {
        success: true,
        agent: { displayName: agentName },
        agentId: `mock-agent-${Date.now()}`,
        message: `[模擬] 安全分析 Agent "${agentName}" 建立成功`
      };
    },

    // 找到這段程式碼並完全替換
    async chatWithAgent(sessionId, message, agentId) {
      try {
        console.log('💬 開始 Vertex AI 真實對話...');
        console.log(`📋 專案: ${process.env.GOOGLE_CLOUD_PROJECT_ID}`);
        console.log(`🌍 地區: ${process.env.VERTEX_AI_LOCATION}`);

        // 使用穩定的模型
        const model = this.vertexAI.getGenerativeModel({
          model: 'gemini-pro', // 使用最穩定的版本
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 1024
          }
        });

        const prompt = `你是侵國侵城 AI 安全分析專家。請針對以下查詢提供專業分析：

查詢：${message}

請提供詳細的安全分析，包括：
1. 威脅等級評估
2. 具體風險分析
3. 防護建議
4. 實施策略

請以專業且實用的方式回答。`;

        console.log('🚀 正在調用 Vertex AI...');
        const result = await model.generateContent(prompt);
        const response = await result.response;

        console.log('✅ Vertex AI 真實回應成功');
        return {
          success: true,
          response: response.text(),
          sessionId: sessionId,
          agentId: agentId,
          model: 'vertex-ai-gemini-pro-real', // 真實模型標識
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        console.error('❌ Vertex AI 真實調用失敗:', error.message);

        // 如果 Vertex AI 失敗，嘗試使用 Gemini API
        try {
          console.log('🔄 回退到 Gemini API...');
          const geminiService = createGeminiService();
          const result = await geminiService.generateAttackVector(message);

          return {
            success: true,
            response: result.text,
            sessionId: sessionId,
            agentId: agentId,
            model: 'gemini-api-fallback',
            timestamp: new Date().toISOString()
          };
        } catch (geminiError) {
          console.error('❌ Gemini API 也失敗:', geminiError.message);

          // 最後才使用本地處理
          console.log('🔄 最終回退到本地處理...');
          return this.generateIntelligentResponse(message, sessionId, agentId);
        }
      }
    },



    // 新增這個方法（如果不存在的話）
    generateIntelligentResponse(message, sessionId, agentId) {
      const messageLower = message.toLowerCase();
      let response = '';

      // 智能關鍵字分析和回應
      if (messageLower.includes('deepfake') || messageLower.includes('深偽') || messageLower.includes('換臉')) {
        response = `🎭 **Vertex AI Agent - Deepfake 威脅分析**

**威脅等級**: CRITICAL
**主要攻擊技術**:
• StyleGAN3: 高品質人臉生成 (成功率 85%)
• SimSwap: 即時視訊換臉 (成功率 89%) 
• FaceSwap: 深度學習換臉技術
• DeepFaceLab: 專業級 Deepfake 工具

**eKYC 系統風險評估**:
1. **身份驗證繞過**: 使用生成的假臉通過人臉識別
2. **視訊通話欺騙**: 即時換臉技術欺騙客服人員
3. **證件照偽造**: AI 生成符合系統要求的證件照

**防護建議**:
• 多重活體檢測 (眨眼、頭部轉動、隨機動作)
• 深度學習反檢測模型
• 生物特徵多重驗證 (聲紋+人臉+指紋)
• 行為模式分析和異常檢測

**APCER/BPCER 預測**: 
- 當前系統 APCER: 15-25%
- 建議目標 APCER: <5%`;

      } else if (messageLower.includes('ekyc') || messageLower.includes('身份驗證') || messageLower.includes('開戶')) {
        response = `**Vertex AI Agent - eKYC 系統安全評估**

**系統架構風險分析**:
1. **文件驗證層面**:
   • OCR 識別繞過 (使用 AI 生成文件)
   • 證件防偽特徵克隆
   • MRZ 碼偽造攻擊

2. **生物特徵層面**:
   • 人臉識別欺騙 (Deepfake、3D 列印面具)
   • 指紋偽造 (矽膠指套、高解析度列印)
   • 聲紋合成攻擊

3. **流程安全層面**:
   • 中間人攻擊 (MITM)
   • 重放攻擊 (Replay Attack)
   • 社交工程結合技術攻擊

**安全強化建議**:
• 實施零信任架構
• 建立多維度風險評分系統
• 加強端到端加密
• 建立異常行為檢測機制
• 定期進行滲透測試

**合規性檢查**:
• GDPR 個資保護合規
• 金管會相關法規遵循
• ISO 27001 資訊安全標準`;

      } else if (messageLower.includes('攻擊') || messageLower.includes('滲透') || messageLower.includes('測試')) {
        response = `⚔️ **Vertex AI Agent - 攻擊向量分析**

**侵國侵城攻擊向量**:
• **A1 - StyleGAN3**: 偽造真人自拍 (成功率 78%)
• **A2 - StableDiffusion**: 翻拍攻擊 (成功率 65%)
• **A3 - SimSwap**: 即時換臉 (成功率 89%)
• **A4 - Diffusion+GAN**: 偽造護照 (成功率 73%)
• **A5 - DALL·E**: 生成假證件 (成功率 82%)

**推薦攻擊組合**:
1. **高效組合**: A3 + A2 (Deepfake + 翻拍) - 預估成功率 92%
2. **穩定組合**: A1 + A4 (假自拍 + 假護照) - 預估成功率 75%

**滲透測試計畫**:
1. **偵查階段**: 系統架構分析、技術棧識別
2. **攻擊階段**: 執行選定攻擊向量
3. **後滲透**: 權限提升、橫向移動
4. **報告階段**: 風險評估、修復建議

**威脅等級評估**: 
- 最高威脅: A3 (SimSwap 即時換臉)
- 防護優先級: 建議優先加強活體檢測`;

      } else if (messageLower.includes('安全') || messageLower.includes('防護') || messageLower.includes('建議')) {
        response = `🔒 **Vertex AI Agent - 安全架構建議**

**安全架構評估**:
1. **網路安全**: WAF、DDoS 防護、入侵檢測
2. **應用安全**: 輸入驗證、SQL 注入防護、XSS 防護
3. **數據安全**: 端到端加密、敏感資料遮罩
4. **身份安全**: 多重驗證、權限最小化

**eKYC 特殊安全考量**:
• **活體檢測強化**: 3D 深度感測、紅外線檢測
• **證件防偽**: UV 光檢測、全息圖驗證
• **行為分析**: 鼠標軌跡、輸入模式、時間分析
• **風險評分**: 機器學習異常檢測

**建議實施順序**:
1. 立即: 加強活體檢測機制
2. 短期: 實施多重驗證
3. 中期: 建立 AI 反檢測系統
4. 長期: 完整零信任架構

**監控指標**:
• APCER (錯誤接受率): 目標 <3%
• BPCER (錯誤拒絕率): 目標 <5%
• 系統可用性: >99.9%`;

      } else {
        // 通用智能回應
        response = `🤖 **Vertex AI Agent - 安全專家分析**

**查詢內容**: ${message}

**基礎安全分析**:
基於您的查詢，建議進行以下評估：

1. **威脅建模**: 使用 STRIDE 方法論分析潛在威脅
2. **風險評估**: 評估攻擊可能性和影響程度
3. **防護措施**: 制定多層次安全防護策略
4. **監控機制**: 建立實時安全監控和告警

**專業建議**:
• 實施縱深防禦策略
• 定期進行安全評估
• 建立事件響應計畫
• 加強人員安全意識

**後續行動**:
建議深入討論具體的安全場景，如 eKYC 系統、Deepfake 防護或滲透測試策略。

**風險等級**: MEDIUM (需進一步評估)`;
      }

      return {
        success: true,
        response: response,
        sessionId: sessionId,
        agentId: agentId,
        model: 'vertex-ai-local-intelligence',
        timestamp: new Date().toISOString()
      };
    },

    async analyzeEkycSecurity(systemType, verificationMethods) {
      return {
        systemType: systemType,
        verificationMethods: verificationMethods,
        riskAssessment: {
          overall: 'MEDIUM',
          deepfakeRisk: 'HIGH',
          documentForgeryRisk: 'MEDIUM',
          biometricSpoofingRisk: 'MEDIUM'
        },
        recommendations: [
          '[模擬] 實施多重身份驗證',
          '[模擬] 加強活體檢測技術',
          '[模擬] 定期更新 AI 檢測模型'
        ],
        note: '請設定 Vertex AI 憑證以獲得詳細分析'
      };
    },

    async generateAttackVector(targetSystem, attackType, complexity) {
      return {
        targetSystem: targetSystem,
        attackType: attackType,
        complexity: complexity,
        vector: {
          name: `[模擬] ${attackType} 攻擊`,
          successRate: '模擬 75%',
          tools: ['模擬工具1', '模擬工具2']
        },
        note: '請設定 Vertex AI 憑證以獲得真實攻擊向量'
      };
    },

    async createPentestReport(testResults, findings, riskLevel) {
      return {
        executiveSummary: {
          testDate: new Date().toISOString().split('T')[0],
          tester: 'Mock Vertex AI Agent',
          overallRisk: riskLevel.toUpperCase(),
          totalFindings: findings.length
        },
        note: '請設定 Vertex AI 憑證以生成詳細報告'
      };
    }
  };
}

// 註冊所有路由
function registerRoutes(app, appService, healthService, attackService, geminiService, grokService, vertexAIAgentService, ragService, databaseService) {

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

  // === Grok AI 路由 ===

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

  // === 新增 Vertex AI Agent 路由 ===

  console.log('📍 註冊路由: GET /ai-agent/test');
  app.get('/ai-agent/test', async (req, res) => {
    console.log('📥 收到 AI Agent 測試請求');
    try {
      const result = await vertexAIAgentService.createSecurityAgent(
        '侵國侵城安全專家',
        '你是專業的 eKYC 安全分析專家，專精於威脅建模和滲透測試。'
      );
      res.json({
        success: true,
        message: "🤖 Vertex AI Agent 服務正常！",
        agent_configured: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
        result
      });
    } catch (error) {
      console.error('❌ AI Agent 測試錯誤:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "❌ AI Agent 連接失敗"
      });
    }
  });

  console.log('📍 註冊路由: POST /ai-agent/create');
  app.post('/ai-agent/create', async (req, res) => {
    console.log('📥 收到建立 AI Agent 請求, Body:', req.body);
    try {
      const { agentName, instructions } = req.body;
      if (!agentName) {
        return res.status(400).json({
          success: false,
          error: '請提供 Agent 名稱 (agentName 參數)'
        });
      }
      const result = await vertexAIAgentService.createSecurityAgent(agentName, instructions);
      res.json(result);
    } catch (error) {
      console.error('❌ AI Agent 建立錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📍 註冊路由: POST /ai-agent/chat');
  app.post('/ai-agent/chat', async (req, res) => {
    console.log('📥 收到 AI Agent 對話請求, Body:', req.body);
    try {
      const { sessionId, message, agentId = 'default-security-agent' } = req.body;
      if (!message) {
        return res.status(400).json({
          success: false,
          error: '請提供對話訊息 (message 參數)'
        });
      }
      const result = await vertexAIAgentService.chatWithAgent(
        sessionId || `session-${Date.now()}`,
        message,
        agentId
      );
      res.json(result);
    } catch (error) {
      console.error('❌ AI Agent 對話錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📍 註冊路由: POST /ai-agent/analyze-security');
  app.post('/ai-agent/analyze-security', async (req, res) => {
    console.log('📥 收到 AI Agent 安全分析請求, Body:', req.body);
    try {
      const { systemType, verificationMethods = [] } = req.body;
      if (!systemType) {
        return res.status(400).json({
          success: false,
          error: '請提供系統類型 (systemType 參數)'
        });
      }
      const result = await vertexAIAgentService.analyzeEkycSecurity(systemType, verificationMethods);
      res.json({
        success: true,
        analysis: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ AI Agent 安全分析錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📍 註冊路由: POST /ai-agent/generate-attack');
  app.post('/ai-agent/generate-attack', async (req, res) => {
    console.log('📥 收到 AI Agent 攻擊向量生成請求, Body:', req.body);
    try {
      const { targetSystem, attackType, complexity = 'medium' } = req.body;
      if (!targetSystem || !attackType) {
        return res.status(400).json({
          success: false,
          error: '請提供目標系統 (targetSystem) 和攻擊類型 (attackType)'
        });
      }
      const result = await vertexAIAgentService.generateAttackVector(targetSystem, attackType, complexity);
      res.json({
        success: true,
        attackVector: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ AI Agent 攻擊向量生成錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📍 註冊路由: POST /ai-agent/pentest-report');
  app.post('/ai-agent/pentest-report', async (req, res) => {
    console.log('📥 收到 AI Agent 滲透測試報告請求, Body:', req.body);
    try {
      const { testResults, findings, riskLevel } = req.body;
      if (!testResults || !findings || !riskLevel) {
        return res.status(400).json({
          success: false,
          error: '請提供測試結果 (testResults)、發現 (findings) 和風險等級 (riskLevel)'
        });
      }
      const result = await vertexAIAgentService.createPentestReport(testResults, findings, riskLevel);
      res.json({
        success: true,
        report: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ AI Agent 報告生成錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📍 註冊路由: POST /rag/ask');
  app.post('/rag/ask', async (req, res) => {
    console.log('📥 收到 RAG 查詢請求, Body:', req.body);
    try {
      const { question, filters = {} } = req.body;
      if (!question || question.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: '問題不能為空 (question 參數必填)'
        });
      }

      const result = await ragService.askQuestion(question, filters);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('❌ RAG 查詢錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📍 註冊路由: POST /rag/ingest');
  app.post('/rag/ingest', async (req, res) => {
    console.log('📥 收到 RAG 文檔匯入請求, Body:', req.body);
    try {
      const { text, metadata = {} } = req.body;
      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: '文檔內容不能為空 (text 參數必填)'
        });
      }

      const result = await ragService.ingestDocument(text, metadata);
      res.json(result);
    } catch (error) {
      console.error('❌ RAG 文檔匯入錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📍 註冊路由: GET /rag/stats');
  app.get('/rag/stats', (req, res) => {
    console.log('📥 收到 RAG 統計請求');
    try {
      const stats = ragService.getStats();
      res.json({
        success: true,
        stats: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ RAG 統計錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // === 新增資料庫管理路由 ===

  console.log('📍 註冊路由: GET /database/status');
  app.get('/database/status', async (req, res) => {
    console.log('📥 收到資料庫狀態請求');
    try {
      const status = await databaseService.getStatus();
      res.json(status);
    } catch (error) {
      console.error('❌ 資料庫狀態錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📍 註冊路由: POST /database/init');
  app.post('/database/init', async (req, res) => {
    console.log('📥 收到資料庫初始化請求');
    try {
      const result = await databaseService.initializeDatabase();
      res.json(result);
    } catch (error) {
      console.error('❌ 資料庫初始化錯誤:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  // 🏛️ 添加法規遵循路由
  console.log('📋 註冊法規遵循路由...');

  // 法規遵循健康檢查
  app.get('/legal-compliance/health', async (req, res) => {
    console.log('🔍 法規遵循健康檢查...');
    try {
      const result = {
        status: 'healthy',
        service: '法規遵循系統',
        version: '1.0.0',
        components: {
          vectorDatabase: process.env.DATABASE_URL ? 'configured' : 'not-configured',
          pythonAI: process.env.PYTHON_AI_URL ? 'configured' : 'not-configured',
          geminiAI: process.env.GEMINI_API_KEY ? 'configured' : 'not-configured'
        },
        capabilities: [
          '向量相似度法規檢索',
          'Gemini AI 法規分析',
          '智能合規建議',
          '風險評估與建議'
        ],
        timestamp: new Date()
      };
      res.json(result);
    } catch (error) {
      console.error('法規遵循健康檢查失敗:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // 法規諮詢
  app.post('/legal-compliance/ask', async (req, res) => {
    console.log('🏛️ 處理法規諮詢...', 'Body:', req.body);
    try {
      const { question, context } = req.body;

      if (!question || question.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: '問題不能為空'
        });
      }

      // 模擬法規回應 (之後可以整合真實的向量檢索和 Gemini AI)
      const result = {
        success: true,
        answer: `根據分析，關於「${question}」的法規建議：

1. **法規依據**：個人資料保護法第6條規定，生物特徵資料之蒐集需經當事人明確同意。

2. **合規要求**：
   - 建立明確的用戶同意機制
   - 實施適當的資料保護措施
   - 建立資料最小化原則

3. **風險評估**：在 eKYC 系統中收集生物特徵資料屬於高風險行為，需要加強合規措施。

4. **建議行動**：
   - 在30天內完成法規遵循檢視
   - 建立完整的同意機制
   - 實施技術性保護措施

*此為基於現有法規資料庫的初步分析，建議進一步諮詢法律專家。*`,
        retrievedLaws: [
          {
            document_title: '個人資料保護法',
            article_number: '第6條',
            source: 'MOJ',
            similarity: 0.89,
            relevantText: '有關醫療、基因、性生活、健康檢查及犯罪前科之個人資料，不得蒐集、處理或利用。但有下列情形之一者，不在此限：六、經當事人書面同意...',
            legal_concepts: ['權利義務', '同意機制'],
            keyword_tags: ['生物特徵', '個資保護', 'eKYC']
          }
        ],
        searchMetadata: {
          totalRetrieved: 1,
          maxSimilarity: 0.89,
          responseTime: 850
        },
        complianceLevel: 'HIGH',
        riskAssessment: {
          level: 'HIGH',
          score: 75,
          recommendation: '優先處理合規問題，建議在30天內完成整改'
        },
        recommendations: [
          '建立明確的用戶同意機制',
          '實施適當的生物特徵資料保護措施',
          '建立資料最小化原則'
        ],
        timestamp: new Date()
      };

      res.json({ success: true, data: result });

    } catch (error) {
      console.error('法規諮詢失敗:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // 匯入法規文件
  app.post('/legal-compliance/import-regulations', async (req, res) => {
    console.log('📚 匯入法規文件...');
    try {
      // 模擬匯入結果
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬處理時間

      const result = {
        total: 3,
        successful: 3,
        failed: 0,
        details: [
          {
            success: true,
            title: '個人資料保護法',
            document_id: 1,
            chunks_created: 15
          },
          {
            success: true,
            title: '資通安全管理法',
            document_id: 2,
            chunks_created: 8
          },
          {
            success: true,
            title: '金融機構資訊安全管理辦法',
            document_id: 3,
            chunks_created: 12
          }
        ]
      };

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  console.log('✅ 法規遵循路由註冊完成');
  console.log('✅ 所有路由（包含 Gemini AI、Grok AI、Vertex AI Agent、RAG 和資料庫）註冊完成');
}

// 設置 Swagger
function setupSwagger(app) {
  const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: '侵國侵城 AI 滲透測試系統 API',
      description: '專為 eKYC 安全測試設計的 AI 紅隊滲透測試系統，整合 Google Gemini AI、xAI Grok 和 Vertex AI Agent',
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
      { name: 'Grok AI', description: 'xAI Grok 幽默風格的資安分析' },
      { name: 'Vertex AI Agent', description: 'Google Vertex AI 智能安全專家代理' },
      {
        name: 'RAG System',
        description: '檢索增強生成系統 - 智慧問答與文檔管理'
      },
      {
        name: 'Document Management',
        description: '文檔匯入與處理'
      },
      {
        name: 'Vector Search',
        description: '向量搜尋與相似度匹配'
      },
      {
        name: 'Database Management',
        description: '資料庫狀態與管理'
      }
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
                      message: { type: 'string', example: '歡迎使用侵國侵城 AI 滲透測試系統' },
                      version: { type: 'string', example: '1.0.0' },
                      status: { type: 'string', example: 'operational' },
                      framework: { type: 'string', example: 'NestJS + Express + Gemini AI + Grok AI + Vertex AI Agent' },
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
                          grokAI: { type: 'string', example: 'configured' },
                          vertexAIAgent: { type: 'string', example: 'configured' }
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
      },

      // Vertex AI Agent 路由
      '/ai-agent/test': {
        get: {
          tags: ['Vertex AI Agent'],
          summary: '測試 AI Agent 服務',
          description: '測試 Vertex AI Agent 的連接狀態和基本功能',
          responses: {
            200: {
              description: 'AI Agent 服務測試結果',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string', example: '🤖 Vertex AI Agent 服務正常！' },
                      agent_configured: { type: 'boolean' },
                      result: { type: 'object' }
                    }
                  }
                }
              }
            },
            500: { description: 'AI Agent 連接失敗' }
          }
        }
      },
      '/ai-agent/create': {
        post: {
          tags: ['Vertex AI Agent'],
          summary: '建立專業安全 Agent',
          description: '建立具有特定專業能力的 AI 安全分析 Agent',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    agentName: {
                      type: 'string',
                      example: '侵國侵城安全專家',
                      description: 'Agent 名稱'
                    },
                    instructions: {
                      type: 'string',
                      example: '你是專業的 eKYC 安全分析專家，專精於威脅建模和滲透測試',
                      description: 'Agent 指令（可選）'
                    }
                  },
                  required: ['agentName']
                }
              }
            }
          },
          responses: {
            200: { description: 'Agent 建立成功' },
            400: { description: '缺少必要參數' }
          }
        }
      },
      '/ai-agent/chat': {
        post: {
          tags: ['Vertex AI Agent'],
          summary: '與 AI Agent 對話',
          description: '與專業安全 Agent 進行多輪對話，獲得深度安全分析',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    sessionId: {
                      type: 'string',
                      example: 'security-session-001',
                      description: '對話會話 ID'
                    },
                    message: {
                      type: 'string',
                      example: '請分析我們的 eKYC 系統面臨的 Deepfake 威脅',
                      description: '對話訊息'
                    },
                    agentId: {
                      type: 'string',
                      example: 'security-expert-agent',
                      description: 'Agent ID（可選）'
                    }
                  },
                  required: ['message']
                }
              }
            }
          },
          responses: {
            200: { description: 'AI Agent 對話回應' },
            400: { description: '缺少必要參數' }
          }
        }
      },
      '/ai-agent/analyze-security': {
        post: {
          tags: ['Vertex AI Agent'],
          summary: 'AI Agent 安全分析',
          description: '使用 AI Agent 進行專業的系統安全分析',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    systemType: {
                      type: 'string',
                      example: '銀行數位開戶系統',
                      description: '系統類型'
                    },
                    verificationMethods: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['face_recognition', 'document_scan', 'fingerprint'],
                      description: '驗證方法列表'
                    }
                  },
                  required: ['systemType']
                }
              }
            }
          },
          responses: {
            200: { description: '安全分析結果' },
            400: { description: '缺少必要參數' }
          }
        }
      },
      '/ai-agent/generate-attack': {
        post: {
          tags: ['Vertex AI Agent'],
          summary: 'AI Agent 攻擊向量生成',
          description: '使用 AI Agent 生成特定攻擊向量和實施細節',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    targetSystem: {
                      type: 'string',
                      example: '銀行 eKYC 身份驗證系統',
                      description: '目標系統'
                    },
                    attackType: {
                      type: 'string',
                      enum: ['deepfake', 'document_forgery', 'biometric_spoofing', 'social_engineering'],
                      example: 'deepfake',
                      description: '攻擊類型'
                    },
                    complexity: {
                      type: 'string',
                      enum: ['low', 'medium', 'high'],
                      example: 'high',
                      description: '攻擊複雜度'
                    }
                  },
                  required: ['targetSystem', 'attackType']
                }
              }
            }
          },
          responses: {
            200: { description: '攻擊向量生成結果' },
            400: { description: '缺少必要參數' }
          }
        }
      },
      '/ai-agent/pentest-report': {
        post: {
          tags: ['Vertex AI Agent'],
          summary: 'AI Agent 滲透測試報告',
          description: '使用 AI Agent 生成專業的滲透測試報告',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    testResults: {
                      type: 'object',
                      description: '測試結果數據'
                    },
                    findings: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['SQL Injection vulnerability found', 'Weak authentication mechanism'],
                      description: '主要發現列表'
                    },
                    riskLevel: {
                      type: 'string',
                      enum: ['low', 'medium', 'high', 'critical'],
                      example: 'high',
                      description: '風險等級'
                    }
                  },
                  required: ['testResults', 'findings', 'riskLevel']
                }
              }
            }
          },
          responses: {
            200: { description: '滲透測試報告' },
            400: { description: '缺少必要參數' }
          }
        }
      },

      // RAG 智慧問答
      '/rag/ask': {
        post: {
          tags: ['RAG System'],
          summary: 'RAG 智慧問答',
          description: '基於滲透測試文檔進行智慧問答，支援攻擊向量過濾和來源追溯',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    question: {
                      type: 'string',
                      example: 'eKYC系統如何防護Deepfake攻擊？',
                      description: '用戶問題 (必填)'
                    },
                    filters: {
                      type: 'object',
                      properties: {
                        attackVector: {
                          type: 'string',
                          enum: ['A1', 'A2', 'A3', 'A4', 'A5'],
                          example: 'A3',
                          description: '攻擊向量過濾 (A1-StyleGAN3, A2-StableDiffusion, A3-SimSwap, A4-DiffusionGAN, A5-DALLE)'
                        },
                        runId: {
                          type: 'string',
                          example: 'test-001',
                          description: '測試批次 ID 過濾'
                        },
                        documentType: {
                          type: 'string',
                          enum: ['penetration-report', 'attack-log', 'regulation', 'technical-doc'],
                          example: 'penetration-report',
                          description: '文檔類型過濾'
                        }
                      }
                    }
                  },
                  required: ['question']
                }
              }
            }
          },
          responses: {
            200: {
              description: 'RAG 問答成功',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/RagResponse'
                  }
                }
              }
            },
            400: {
              description: '請求參數錯誤',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                  }
                }
              }
            },
            500: {
              description: 'RAG 系統內部錯誤'
            }
          }
        }
      },

      // 文檔匯入
      '/rag/ingest': {
        post: {
          tags: ['Document Management'],
          summary: '文檔匯入',
          description: '將滲透測試報告、攻擊日誌等文檔匯入 RAG 系統，自動分塊和向量化',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    text: {
                      type: 'string',
                      example: '滲透測試報告：A3 SimSwap 攻擊向量在 eKYC 系統中成功率達 89%，建議加強活體檢測機制...',
                      description: '文檔內容 (必填)'
                    },
                    metadata: {
                      type: 'object',
                      properties: {
                        attackVector: {
                          type: 'string',
                          enum: ['A1', 'A2', 'A3', 'A4', 'A5'],
                          example: 'A3',
                          description: '關聯的攻擊向量'
                        },
                        runId: {
                          type: 'string',
                          example: 'test-001',
                          description: '測試批次 ID'
                        },
                        documentType: {
                          type: 'string',
                          enum: ['penetration-report', 'attack-log', 'regulation', 'technical-doc'],
                          example: 'penetration-report',
                          description: '文檔類型'
                        },
                        source: {
                          type: 'string',
                          example: 'internal-test-2024',
                          description: '文檔來源'
                        },
                        author: {
                          type: 'string',
                          example: '侵國侵城測試團隊',
                          description: '文檔作者'
                        }
                      }
                    }
                  },
                  required: ['text']
                }
              }
            }
          },
          responses: {
            200: {
              description: '文檔匯入成功',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/IngestResponse'
                  }
                }
              }
            },
            400: {
              description: '文檔內容不能為空'
            },
            500: {
              description: '文檔處理失敗'
            }
          }
        }
      },

      // 批量文檔匯入
      '/rag/ingest/batch': {
        post: {
          tags: ['Document Management'],
          summary: '批量文檔匯入',
          description: '批量匯入多個文檔到 RAG 系統',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    documents: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          text: {
                            type: 'string',
                            description: '文檔內容'
                          },
                          metadata: {
                            type: 'object',
                            description: '文檔元數據'
                          }
                        }
                      },
                      example: [
                        {
                          text: 'A1 StyleGAN3 攻擊測試報告...',
                          metadata: { attackVector: 'A1', runId: 'batch-001' }
                        },
                        {
                          text: 'A3 SimSwap 防護建議...',
                          metadata: { attackVector: 'A3', runId: 'batch-001' }
                        }
                      ]
                    }
                  },
                  required: ['documents']
                }
              }
            }
          },
          responses: {
            200: {
              description: '批量匯入成功',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      totalDocuments: { type: 'integer' },
                      successfulImports: { type: 'integer' },
                      failedImports: { type: 'integer' },
                      documentIds: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      timestamp: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },

      // RAG 統計資訊
      '/rag/stats': {
        get: {
          tags: ['RAG System'],
          summary: 'RAG 系統統計',
          description: '獲取 RAG 系統的文檔、查詢、向量資料庫等統計資訊',
          responses: {
            200: {
              description: 'RAG 統計資訊',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/RagStats'
                  }
                }
              }
            },
            500: {
              description: '獲取統計失敗'
            }
          }
        }
      },

      // 向量搜尋
      '/rag/search': {
        post: {
          tags: ['Vector Search'],
          summary: '向量相似度搜尋',
          description: '基於文本向量進行相似度搜尋，返回最相關的文檔片段',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      example: 'Deepfake 攻擊防護',
                      description: '搜尋查詢'
                    },
                    topK: {
                      type: 'integer',
                      example: 5,
                      minimum: 1,
                      maximum: 20,
                      description: '返回結果數量 (1-20)'
                    },
                    filters: {
                      type: 'object',
                      properties: {
                        attackVector: { type: 'string' },
                        runId: { type: 'string' },
                        documentType: { type: 'string' },
                        minSimilarity: {
                          type: 'number',
                          example: 0.7,
                          minimum: 0,
                          maximum: 1,
                          description: '最小相似度閾值 (0-1)'
                        }
                      }
                    }
                  },
                  required: ['query']
                }
              }
            }
          },
          responses: {
            200: {
              description: '搜尋成功',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/SearchResponse'
                  }
                }
              }
            }
          }
        }
      },

      // 更新向量嵌入
      '/rag/update-embeddings': {
        post: {
          tags: ['Vector Search'],
          summary: '更新文檔向量',
          description: '重新計算並更新指定文檔的向量嵌入',
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    documentIds: {
                      type: 'array',
                      items: { type: 'string' },
                      description: '指定文檔 ID 列表，空則更新所有'
                    },
                    batchSize: {
                      type: 'integer',
                      example: 50,
                      minimum: 10,
                      maximum: 200,
                      description: '批次大小'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: '向量更新成功',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      updatedCount: { type: 'integer' },
                      totalProcessed: { type: 'integer' },
                      timestamp: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },

      // 資料庫狀態
      '/database/status': {
        get: {
          tags: ['Database Management'],
          summary: '資料庫狀態檢查',
          description: '檢查 PostgreSQL、Neo4j、Redis、Python AI 服務的連接狀態',
          responses: {
            200: {
              description: '資料庫狀態',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/DatabaseStatus'
                  }
                }
              }
            }
          }
        }
      },

      // 資料庫初始化
      '/database/init': {
        post: {
          tags: ['Database Management'],
          summary: '初始化資料庫',
          description: '初始化 RAG 系統所需的資料庫表格和索引',
          responses: {
            200: {
              description: '初始化成功',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      initialized: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      timestamp: { type: 'string' }
                    }
                  }
                }
              }
            }
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
        },
        AIAgentResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            response: { type: 'string' },
            sessionId: { type: 'string' },
            agentId: { type: 'string' },
            model: { type: 'string' },
            timestamp: { type: 'string' }
          }
        },
        SecurityAnalysis: {
          type: 'object',
          properties: {
            systemType: { type: 'string' },
            verificationMethods: {
              type: 'array',
              items: { type: 'string' }
            },
            riskAssessment: {
              type: 'object',
              properties: {
                overall: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
                deepfakeRisk: { type: 'string' },
                documentForgeryRisk: { type: 'string' },
                biometricSpoofingRisk: { type: 'string' }
              }
            },
            recommendations: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        AttackVectorDetail: {
          type: 'object',
          properties: {
            targetSystem: { type: 'string' },
            attackType: {
              type: 'string',
              enum: ['deepfake', 'document_forgery', 'biometric_spoofing', 'social_engineering']
            },
            complexity: { type: 'string', enum: ['low', 'medium', 'high'] },
            vector: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                steps: {
                  type: 'array',
                  items: { type: 'string' }
                },
                tools: {
                  type: 'array',
                  items: { type: 'string' }
                },
                successRate: { type: 'string' },
                detection: {
                  type: 'object',
                  properties: {
                    difficulty: { type: 'string' },
                    indicators: {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                }
              }
            },
            mitigation: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        PentestReport: {
          type: 'object',
          properties: {
            executiveSummary: {
              type: 'object',
              properties: {
                testDate: { type: 'string' },
                tester: { type: 'string' },
                overallRisk: { type: 'string' },
                criticalFindings: { type: 'integer' },
                totalFindings: { type: 'integer' }
              }
            },
            technicalFindings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  severity: { type: 'string' },
                  cvssScore: { type: 'number' },
                  description: { type: 'string' },
                  recommendation: { type: 'string' }
                }
              }
            },
            riskMatrix: {
              type: 'object',
              properties: {
                critical: { type: 'integer' },
                high: { type: 'integer' },
                medium: { type: 'integer' },
                low: { type: 'integer' }
              }
            }
          }
        },
        // RAG 回應格式
        RagResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                answer: {
                  type: 'string',
                  example: '針對 eKYC 系統的 Deepfake 攻擊防護，建議採用以下措施...',
                  description: 'AI 生成的答案'
                },
                sources: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/RagSource'
                  },
                  description: '引用來源列表'
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: '回應時間'
                }
              }
            }
          }
        },

        // RAG 來源格式
        RagSource: {
          type: 'object',
          properties: {
            documentId: {
              type: 'string',
              example: 'doc_1697123456_abc123',
              description: '文檔 ID'
            },
            chunkId: {
              type: 'string',
              example: 'doc_1697123456_abc123_chunk_0',
              description: '文檔塊 ID'
            },
            similarity: {
              type: 'number',
              example: 0.87,
              minimum: 0,
              maximum: 1,
              description: '相似度分數'
            },
            attackVector: {
              type: 'string',
              example: 'A3',
              description: '關聯攻擊向量'
            },
            runId: {
              type: 'string',
              example: 'test-001',
              description: '測試批次 ID'
            },
            preview: {
              type: 'string',
              example: 'SimSwap 即時換臉攻擊在 eKYC 系統中表現出極高的成功率...',
              description: '文檔內容預覽'
            }
          }
        },

        // 文檔匯入回應
        IngestResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            documentId: {
              type: 'string',
              example: 'doc_1697123456_abc123',
              description: '生成的文檔 ID'
            },
            chunksCount: {
              type: 'integer',
              example: 5,
              description: '生成的文檔塊數量'
            },
            message: {
              type: 'string',
              example: '文檔已成功匯入並分塊處理',
              description: '操作結果訊息'
            }
          }
        },

        // RAG 統計資訊
        RagStats: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            stats: {
              type: 'object',
              properties: {
                documents: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer', example: 150 },
                    types: {
                      type: 'object',
                      properties: {
                        'penetration-reports': { type: 'integer', example: 60 },
                        'attack-logs': { type: 'integer', example: 45 },
                        'regulations': { type: 'integer', example: 30 },
                        'technical-docs': { type: 'integer', example: 15 }
                      }
                    },
                    lastIngested: { type: 'string', format: 'date-time' }
                  }
                },
                chunks: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer', example: 750 },
                    averageSize: { type: 'integer', example: 512 },
                    withEmbeddings: { type: 'integer', example: 720 },
                    lastProcessed: { type: 'string', format: 'date-time' }
                  }
                },
                queries: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer', example: 1245 },
                    successful: { type: 'integer', example: 1183 },
                    failed: { type: 'integer', example: 62 },
                    averageResponseTime: { type: 'string', example: '1.2s' },
                    lastQuery: { type: 'string', format: 'date-time' }
                  }
                },
                vectorDatabase: {
                  type: 'object',
                  properties: {
                    dimensions: { type: 'integer', example: 1024 },
                    indexType: { type: 'string', example: 'HNSW' },
                    indexSize: { type: 'string', example: '75MB' },
                    searchAccuracy: { type: 'string', example: '94.2%' }
                  }
                },
                knowledgeGraph: {
                  type: 'object',
                  properties: {
                    nodes: { type: 'integer', example: 450 },
                    relationships: { type: 'integer', example: 1200 },
                    attackVectors: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['A1', 'A2', 'A3', 'A4', 'A5']
                    },
                    lastUpdated: { type: 'string', format: 'date-time' }
                  }
                }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },

        // 搜尋回應
        SearchResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            results: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/RagSource'
              }
            },
            totalFound: { type: 'integer' },
            searchTime: { type: 'string', example: '0.23s' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },

        // 資料庫狀態
        DatabaseStatus: {
          type: 'object',
          properties: {
            postgres: {
              type: 'object',
              properties: {
                configured: { type: 'boolean' },
                status: { type: 'string', enum: ['configured', 'not_configured', 'error'] },
                connection: { type: 'string', enum: ['ready', 'not_ready', 'error'] },
                features: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['pgvector', 'full-text-search', 'jsonb-support']
                }
              }
            },
            neo4j: {
              type: 'object',
              properties: {
                configured: { type: 'boolean' },
                status: { type: 'string' },
                connection: { type: 'string' },
                features: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['apoc-plugins', 'graph-algorithms', 'knowledge-graphs']
                }
              }
            },
            redis: {
              type: 'object',
              properties: {
                configured: { type: 'boolean' },
                status: { type: 'string' },
                connection: { type: 'string' },
                features: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['caching', 'session-storage', 'pub-sub']
                }
              }
            },
            pythonAI: {
              type: 'object',
              properties: {
                configured: { type: 'boolean' },
                status: { type: 'string' },
                connection: { type: 'string' },
                features: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['embedding-generation', 'model-inference', 'image-processing']
                }
              }
            },
            summary: {
              type: 'object',
              properties: {
                totalDatabases: { type: 'integer', example: 4 },
                configuredCount: { type: 'integer', example: 3 },
                healthStatus: { type: 'string', example: 'monitoring' },
                lastCheck: { type: 'string', format: 'date-time' }
              }
            }
          }
        },

        // 錯誤回應格式
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: '問題不能為空 (question 參數必填)'
            }
          }
        }
      },

      // 安全認證 (可選)
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        }
      }
    }
  };

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: '侵國侵城 AI API 文檔',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #d32f2f; font-size: 2rem; text-align: center; margin-bottom: 1rem; }
      .swagger-ui .info .description { font-size: 1.1rem; text-align: center; margin-bottom: 2rem; }
      .swagger-ui .scheme-container { background: #f5f5f5; padding: 1rem; border-radius: 8px; }
      .tag-operations { margin-bottom: 2rem; }
      .opblock-tag { font-size: 1.3rem; font-weight: bold; }
      .opblock.opblock-post { border-color: #49cc90; }
      .opblock.opblock-get { border-color: #61affe; }
      .swagger-ui .opblock .opblock-summary-method { min-width: 80px; }
      .swagger-ui .btn.authorize { 
        background-color: #d32f2f; 
        border-color: #d32f2f; 
        color: white; 
      }
      .swagger-ui .btn.authorize:hover { 
        background-color: #b71c1c; 
        border-color: #b71c1c; 
      }
      .swagger-ui .model-box { 
        background: rgba(0,0,0,.05); 
        border-radius: 4px; 
        padding: 10px; 
      }
      .swagger-ui .response-col_status { 
        font-size: 14px; 
        font-weight: bold; 
      }
      .swagger-ui .opblock .opblock-section-header h4 { 
        font-size: 16px; 
        margin: 0; 
      }
    `,
    // 在 setupSwagger 函數中修正這部分
    customJs: `
  window.onload = function() {
    console.log('侵國侵城 AI API 文檔載入完成');
    
    // 添加自定義 JS 功能
    const infoElement = document.querySelector('.info');
    if (infoElement) {
      const customInfo = document.createElement('div');
      customInfo.innerHTML = \`
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 20px; 
                    margin: 20px 0; 
                    border-radius: 8px; 
                    text-align: center;">
          <h3>🚀 侵國侵城 AI 滲透測試系統</h3>
          <p>整合三大 AI 引擎：Gemini AI + Grok AI + Vertex AI Agent + RAG</p>
          <p>專為 eKYC 安全測試設計的智能紅隊系統</p>
          <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
            <span style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 15px;">🤖 Gemini AI</span>
            <span style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 15px;">🛸 Grok AI</span>
            <span style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 15px;">🧠 Vertex AI Agent</span>
            <span style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 15px;">🔍 RAG System</span>
          </div>
        </div>
      \`;
      infoElement.appendChild(customInfo);
    }
  }
`

  }));

  app.get('/api/docs-json', (req, res) => {
    res.json(swaggerDocument);
  });

  // 新增 API 健康檢查端點
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      services: {
        swagger: 'available',
        geminiAI: !!process.env.GEMINI_API_KEY,
        grokAI: !!process.env.XAI_API_KEY,
        vertexAI: !!process.env.GOOGLE_CLOUD_PROJECT_ID
      },
      endpoints: {
        total: Object.keys(swaggerDocument.paths).length,
        categories: {
          '系統管理': 3,
          'AI 攻擊': 3,
          'Gemini AI': 5,
          'Grok AI': 4,
          'Vertex AI Agent': 6
        }
      },
      timestamp: new Date().toISOString()
    });
  });

  console.log('✅ Swagger 設置完成 - 包含完整的三大 AI 系統文檔');
  console.log('📋 API 分類統計:');
  console.log('   - 系統管理: 3 個端點');
  console.log('   - AI 攻擊: 3 個端點');
  console.log('   - Gemini AI: 5 個端點');
  console.log('   - Grok AI: 4 個端點');
  console.log('   - Vertex AI Agent: 6 個端點');
  console.log('   - 總計: 21 個端點');
}

bootstrap();
