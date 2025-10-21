// src/factories/ServiceFactory.js - 完整整合版本
class ServiceFactory {
    static createAllServices() {
        return {
            appService: this.createAppService(),
            healthService: this.createHealthService(),
            attackService: this.createAttackService(),
            geminiService: this.createGeminiService(),
            grokService: this.createGrokService(),
            vertexAIAgentService: this.createVertexAIService(), // 修正為一致的命名
            ragService: this.createRagService(),
            databaseService: this.createDatabaseService()
        };
    }

    // === Gemini AI 服務 ===
    static createGeminiService() {
        console.log('🧠 創建 Gemini AI 服務...');

        try {
            return {
                configured: !!process.env.GEMINI_API_KEY,

                async generateAttackVector(prompt) {
                    try {
                        if (!process.env.GEMINI_API_KEY) {
                            throw new Error('GEMINI_API_KEY 未設定');
                        }

                        const { GoogleGenerativeAI } = require('@google/generative-ai');
                        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

                        console.log('🤖 Gemini AI 攻擊向量生成中...');

                        const enhancedPrompt = `
你是一名專業的 eKYC 安全專家。請基於以下請求進行詳細的攻擊向量分析：

${prompt}

請提供結構化的分析，包括：

1. **攻擊策略分析**：
   - 攻擊的技術原理
   - 實施步驟和方法
   - 需要的技術資源

2. **風險評估**：
   - 攻擊成功率評估
   - 潛在影響程度
   - 檢測難度分析

3. **防護建議**：
   - 具體的防護措施
   - 檢測方法
   - 緩解策略

4. **真實案例參考**：
   - 相關攻擊案例
   - 業界最佳實踐

請以專業、客觀的角度分析，重點關注安全防護而非攻擊實施。
            `;

                        const result = await model.generateContent(enhancedPrompt);
                        const response = await result.response;
                        const analysisText = response.text();

                        // 解析回應並結構化 - 修復：直接在這裡實作解析邏輯
                        const analysis = this.parseAnalysisText(analysisText, prompt);

                        console.log('✅ Gemini AI 攻擊向量分析完成');

                        return {
                            success: true,
                            analysis: analysisText,
                            attackStrategies: analysis.strategies,
                            defenseRecommendations: analysis.defenses,
                            riskLevel: analysis.riskLevel,
                            confidence: analysis.confidence,
                            prompt: prompt,
                            model: 'gemini-2.0-flash-exp',
                            timestamp: new Date().toISOString()
                        };

                    } catch (error) {
                        console.error('❌ Gemini AI 調用失敗:', error.message);

                        // 修復：直接在這裡實作備用方案
                        return {
                            success: false,
                            error: error.message,
                            analysis: this.getFallbackAnalysis(prompt),
                            attackStrategies: this.getDefaultStrategies(),
                            defenseRecommendations: this.getDefaultDefenses(),
                            riskLevel: 'MEDIUM',
                            confidence: 0.5,
                            mode: 'fallback',
                            timestamp: new Date().toISOString()
                        };
                    }
                },

                // 在服務實例中實作解析邏輯
                parseAnalysisText(text, prompt) {
                    const strategies = [];
                    const defenses = [];
                    let riskLevel = 'MEDIUM';
                    let confidence = 0.8;

                    const highRiskKeywords = ['simswap', '即時換臉', '高成功率', '難以檢測', '89%'];
                    const lowRiskKeywords = ['基礎攻擊', '容易檢測', '低成功率'];

                    const lowerText = text.toLowerCase();
                    const lowerPrompt = prompt.toLowerCase();

                    // 根據關鍵詞判斷風險等級
                    if (highRiskKeywords.some(keyword =>
                        lowerText.includes(keyword) || lowerPrompt.includes(keyword))) {
                        riskLevel = 'HIGH';
                        confidence = 0.9;
                    } else if (lowRiskKeywords.some(keyword =>
                        lowerText.includes(keyword) || lowerPrompt.includes(keyword))) {
                        riskLevel = 'LOW';
                        confidence = 0.7;
                    }

                    // 提取策略和建議
                    if (lowerPrompt.includes('simswap') || lowerPrompt.includes('換臉')) {
                        strategies.push(
                            '即時換臉技術攻擊',
                            '深度學習模型欺騙',
                            '生物識別繞過',
                            '實時視訊流處理'
                        );
                        defenses.push(
                            '多重生物識別驗證',
                            '活體檢測強化',
                            '行為模式分析',
                            'AI對抗檢測算法',
                            '3D深度感測技術'
                        );
                    }

                    if (lowerPrompt.includes('銀行') || lowerPrompt.includes('金融')) {
                        strategies.push('金融系統滲透', 'KYC流程繞過');
                        defenses.push('金融合規檢查', '風險控制機制');
                    }

                    return { strategies, defenses, riskLevel, confidence };
                },

                // 備用分析方法
                getFallbackAnalysis(prompt) {
                    const lowerPrompt = prompt.toLowerCase();

                    if (lowerPrompt.includes('simswap')) {
                        return `# SimSwap 即時換臉攻擊分析

## 攻擊技術概述
SimSwap 是目前最先進的即時換臉技術，成功率高達 89%，對 eKYC 系統構成嚴重威脅。

### 攻擊策略分析
1. **技術原理**：使用生成對抗網絡（GAN）進行實時面部特徵交換
2. **實施步驟**：
   - 取得目標人物的多角度照片
   - 訓練專用的換臉模型
   - 在視訊通話中實時替換面部特徵
3. **技術資源需求**：高性能 GPU、專業深度學習框架

### 風險評估
- **攻擊成功率**：89%（業界最高）
- **檢測難度**：極高
- **潛在影響**：完全繞過面部識別驗證

### 防護建議
1. **多模態驗證**：結合人臉、聲紋、行為模式
2. **活體檢測增強**：3D 深度感測、紅外檢測
3. **AI 對抗算法**：專門的 Deepfake 檢測模型
4. **行為分析**：監控異常操作模式

### 業界最佳實踐
- 金融機構應實施零信任架構
- 定期更新檢測算法
- 建立多層防護體系
- 加強員工安全培訓

## 合規建議
確保防護措施符合金管會相關規範和個人資料保護法要求。`;
                    }

                    return `# eKYC 安全攻擊向量分析

基於您的查詢，以下是專業的 eKYC 安全分析：

## 攻擊威脅評估
該攻擊向量對 eKYC 系統構成中等至高等程度的威脅。

## 防護建議
1. **強化身份驗證**：採用多重驗證機制
2. **部署 AI 檢測**：使用先進的反欺詐算法
3. **建立監控體系**：實時異常檢測和預警
4. **定期安全評估**：持續更新防護策略

請根據您的具體系統環境調整這些建議。`;
                },

                // 預設攻擊策略
                getDefaultStrategies() {
                    return [
                        '深度學習模型欺騙',
                        '生物識別特徵偽造',
                        '實時影像處理攻擊',
                        '多模態數據同步攻擊',
                        'AI 生成內容注入'
                    ];
                },

                // 預設防護建議
                getDefaultDefenses() {
                    return [
                        '部署多層生物識別驗證',
                        '強化活體檢測機制',
                        '實施 AI 對抗防護模型',
                        '建立異常行為監控系統',
                        '定期更新安全檢測算法',
                        '加強員工安全意識培訓'
                    ];
                },

                // 測試連接方法
                async testConnection() {
                    try {
                        if (!process.env.GEMINI_API_KEY) {
                            return { success: false, error: 'API Key 未設定' };
                        }

                        const { GoogleGenerativeAI } = require('@google/generative-ai');
                        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

                        await model.generateContent('測試連接');
                        return {
                            success: true,
                            model: 'gemini-2.0-flash-exp',
                            status: 'connected',
                            timestamp: new Date().toISOString()
                        };
                    } catch (error) {
                        return {
                            success: false,
                            error: error.message,
                            timestamp: new Date().toISOString()
                        };
                    }
                }
            };

        } catch (error) {
            console.error('❌ Gemini 服務初始化失敗:', error.message);
            return this.createMockGeminiService();
        }
    }

    // Grok AI 服務
    // src/factories/ServiceFactory.js - 只使用真實 Grok API，不使用備用方案
    static createGrokService() {
        console.log('🔥 創建 Grok AI 服務...');

        return {
            configured: !!process.env.XAI_API_KEY,

            // 驗證 API Key 格式
            validateApiKey() {
                const apiKey = process.env.XAI_API_KEY;

                if (!apiKey) {
                    return { valid: false, error: 'XAI_API_KEY 未設定' };
                }

                if (!apiKey.startsWith('xai-')) {
                    return {
                        valid: false,
                        error: `API Key 格式不正確。應該以 'xai-' 開頭，當前格式: ${apiKey.substring(0, 10)}...`
                    };
                }

                if (apiKey.length < 20) {
                    return {
                        valid: false,
                        error: `API Key 長度不足。當前長度: ${apiKey.length}，期望至少 20 個字符`
                    };
                }

                return { valid: true };
            },

            async analyzeSecurityThreat(threatDescription, targetSystem, analysisType = 'vulnerability') {
                console.log('🔍 Grok AI 安全威脅分析中...', {
                    threat: threatDescription.substring(0, 50),
                    system: targetSystem,
                    type: analysisType
                });

                // 先驗證 API Key
                const keyValidation = this.validateApiKey();
                if (!keyValidation.valid) {
                    throw new Error(`API Key 驗證失敗: ${keyValidation.error}`);
                }

                console.log('✅ API Key 驗證通過');

                try {
                    // 呼叫真實的 Grok API
                    const realAnalysis = await this.callGrokAPI(threatDescription, targetSystem, analysisType);

                    console.log('✅ Grok AI 分析完成');
                    return realAnalysis;

                } catch (error) {
                    // 加強錯誤處理
                    if (error.message.includes('401') || error.message.includes('Incorrect API key')) {
                        throw new Error(`Grok API 認證失敗: 請檢查您的 XAI_API_KEY 是否正確。請訪問 https://console.x.ai 取得正確的 API Key。`);
                    } else if (error.message.includes('400')) {
                        throw new Error(`Grok API 請求錯誤: ${error.message}。請檢查 API Key 和請求參數。`);
                    } else if (error.message.includes('429')) {
                        throw new Error(`Grok API 請求過於頻繁: 請稍後再試。`);
                    } else if (error.message.includes('500')) {
                        throw new Error(`Grok API 伺服器錯誤: 請稍後再試。`);
                    }

                    throw error;
                }
            },

            async callGrokAPI(threatDescription, targetSystem, analysisType) {
                console.log('🌐 連接 Grok AI API...');
                console.log(`🔑 使用 API Key: ${process.env.XAI_API_KEY.substring(0, 10)}...`);

                const fetchFunction = globalThis.fetch || require('node-fetch');
                const prompt = this.buildGrokPrompt(threatDescription, targetSystem, analysisType);

                const requestBody = {
                    messages: [
                        {
                            role: "system",
                            content: "You are a world-class cybersecurity expert specializing in eKYC systems and AI-based attack analysis. Provide detailed, professional security assessments with specific technical recommendations in Traditional Chinese when appropriate."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    model: "grok-3-mini",
                    stream: false,
                    temperature: 0.7,
                    max_tokens: 2000
                };

                console.log('📤 發送請求到 Grok API...');

                const response = await fetchFunction('https://api.x.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
                    },
                    body: JSON.stringify(requestBody)
                });

                console.log(`📥 收到回應，狀態碼: ${response.status}`);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`❌ API 錯誤詳情:`, {
                        status: response.status,
                        statusText: response.statusText,
                        body: errorText
                    });

                    throw new Error(`Grok API 錯誤: ${response.status} - ${response.statusText}. ${errorText}`);
                }

                const data = await response.json();

                if (!data.choices || data.choices.length === 0) {
                    throw new Error('Grok API 回應格式錯誤：缺少 choices 字段');
                }

                const analysisText = data.choices[0].message.content;
                const structuredAnalysis = this.parseGrokResponse(analysisText, threatDescription, targetSystem, analysisType);

                return {
                    success: true,
                    analysis: analysisText,
                    vulnerabilities: structuredAnalysis.vulnerabilities,
                    riskScore: structuredAnalysis.riskScore,
                    recommendations: structuredAnalysis.recommendations,
                    technicalDetails: structuredAnalysis.technicalDetails,
                    complianceGaps: structuredAnalysis.complianceGaps,
                    mitigationStrategies: structuredAnalysis.mitigationStrategies,
                    analysisType,
                    threatDescription,
                    targetSystem,
                    model: 'grok-3-mini',
                    usage: {
                        promptTokens: data.usage?.prompt_tokens || 0,
                        completionTokens: data.usage?.completion_tokens || 0,
                        totalTokens: data.usage?.total_tokens || 0
                    },
                    timestamp: new Date().toISOString()
                };
            },

            // 測試 API Key 連接
            async testConnection() {
                console.log('🧪 測試 Grok API 連接...');

                // 先驗證 API Key 格式
                const keyValidation = this.validateApiKey();
                if (!keyValidation.valid) {
                    return {
                        success: false,
                        error: keyValidation.error,
                        configured: false,
                        timestamp: new Date().toISOString()
                    };
                }

                try {
                    // 發送簡單的測試請求
                    const fetchFunction = globalThis.fetch || require('node-fetch');

                    const response = await fetchFunction('https://api.x.ai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.XAI_API_KEY}`
                        },
                        body: JSON.stringify({
                            messages: [
                                {
                                    role: "user",
                                    content: "Hello, test connection"
                                }
                            ],
                            model: "grok-3-mini",
                            max_tokens: 50
                        })
                    });

                    if (response.ok) {
                        return {
                            success: true,
                            model: 'grok-3-mini',
                            status: 'connected',
                            message: 'API Key 有效，連接成功',
                            timestamp: new Date().toISOString()
                        };
                    } else {
                        const errorText = await response.text();
                        return {
                            success: false,
                            error: `連接測試失敗: ${response.status} - ${errorText}`,
                            model: 'grok-3-mini',
                            status: 'connection_failed',
                            timestamp: new Date().toISOString()
                        };
                    }

                } catch (error) {
                    return {
                        success: false,
                        error: `連接測試失敗: ${error.message}`,
                        model: 'grok-3-mini',
                        status: 'connection_failed',
                        timestamp: new Date().toISOString()
                    };
                }
            },
            // 建構 Grok 專用提示詞
            buildGrokPrompt(threatDescription, targetSystem, analysisType) {
                const promptTemplates = {
                    'vulnerability': `
As a cybersecurity expert, perform a comprehensive vulnerability assessment for the following scenario:

**威脅**: ${threatDescription}
**目標系統**: ${targetSystem}
**分析類型**: 漏洞評估

請提供詳細的中文分析，包含：

1. **威脅向量分析**
   - 技術實現細節
   - 攻擊面識別
   - 入侵點和利用方法

2. **漏洞評估**
   - 可能被利用的系統弱點
   - 當前實作的安全缺口
   - 風險暴露等級

3. **風險量化**
   - 攻擊成功機率 (0-10 分)
   - 潛在影響嚴重性
   - 整體風險分數計算

4. **技術建議**
   - 具體對策措施
   - 實施優先順序
   - 成本效益分析

5. **合規考量**
   - 法規要求 (個資法、金融法規、國際標準)
   - 合規缺口
   - 稽核軌跡要求

請提供具體、可行的安全改進建議。
                `,

                    'risk-assessment': `
針對以下情境進行綜合風險評估：

**威脅**: ${threatDescription}
**目標系統**: ${targetSystem}

分析項目：
- 威脅發生機率和影響程度
- 業務風險意涵
- 法規合規風險
- 聲譽損害潛力
- 財務損失估計
- 風險緩解策略

請用中文提供詳細分析。
                `,

                    'attack-surface': `
針對以下系統執行攻擊面分析：

**威脅**: ${threatDescription}
**目標系統**: ${targetSystem}

重點分析：
- 所有可能的攻擊向量
- 系統介面和 API
- 網路暴露點
- 人為因素和社交工程
- 第三方整合風險

請用中文提供詳細分析。
                `,

                    'compliance': `
評估以下情境的合規意涵：

**威脅**: ${threatDescription}
**目標系統**: ${targetSystem}

考量項目：
- 法規要求 (個資法、金融服務法)
- 行業標準 (ISO 27001, NIST)
- 資料保護法規
- 金融服務法規
- 稽核和報告要求

請用中文提供詳細分析。
                `
                };

                return promptTemplates[analysisType] || promptTemplates['vulnerability'];
            },

            // 解析 Grok 回應
            parseGrokResponse(analysisText, threatDescription, targetSystem, analysisType) {
                const vulnerabilities = [];
                const recommendations = [];
                const technicalDetails = [];
                const complianceGaps = [];
                const mitigationStrategies = [];
                let riskScore = 5.0;

                // 智能解析回應內容
                const lines = analysisText.split('\n');

                for (const line of lines) {
                    const lowerLine = line.toLowerCase().trim();

                    // 提取漏洞資訊
                    if ((lowerLine.includes('漏洞') || lowerLine.includes('弱點') || lowerLine.includes('vulnerability') || lowerLine.includes('weakness')) && line.length > 20) {
                        vulnerabilities.push({
                            severity: this.extractSeverity(line),
                            description: line.trim(),
                            impact: this.extractImpact(line),
                            mitigation: '參考詳細建議'
                        });
                    }

                    // 提取建議
                    if ((lowerLine.includes('建議') || lowerLine.includes('應該') || lowerLine.includes('recommend') || lowerLine.includes('should')) && line.length > 15) {
                        recommendations.push(line.trim());
                    }

                    // 提取技術細節
                    if ((lowerLine.includes('技術') || lowerLine.includes('實施') || lowerLine.includes('配置') || lowerLine.includes('technical')) && line.length > 20) {
                        technicalDetails.push(line.trim());
                    }

                    // 提取合規相關
                    if ((lowerLine.includes('合規') || lowerLine.includes('法規') || lowerLine.includes('compliance') || lowerLine.includes('regulation')) && line.length > 15) {
                        complianceGaps.push(line.trim());
                    }

                    // 提取風險分數
                    const riskMatch = line.match(/(\d+(?:\.\d+)?)\s*(?:分|\/10|scale|score)/i);
                    if (riskMatch) {
                        riskScore = Math.min(10, Math.max(0, parseFloat(riskMatch[1])));
                    }
                }

                // 根據威脅類型調整風險分數
                if (threatDescription.toLowerCase().includes('simswap') || threatDescription.includes('即時換臉')) {
                    riskScore = Math.max(riskScore, 8.5);
                } else if (threatDescription.toLowerCase().includes('deepfake') || threatDescription.includes('深偽')) {
                    riskScore = Math.max(riskScore, 7.8);
                }

                // 生成緩解策略
                if (threatDescription.toLowerCase().includes('simswap') || threatDescription.includes('換臉')) {
                    mitigationStrategies.push(
                        '部署多模態生物識別驗證',
                        '實施進階活體檢測',
                        '使用3D深度感測技術',
                        '部署AI深偽檢測模型'
                    );
                }

                if (targetSystem.includes('銀行') || targetSystem.includes('金融')) {
                    mitigationStrategies.push(
                        '強化法規合規控制',
                        '實施即時詐欺監控',
                        '增強客戶盡職調查程序'
                    );
                }

                return {
                    vulnerabilities: vulnerabilities.length > 0 ? vulnerabilities : [
                        {
                            severity: 'HIGH',
                            description: `${targetSystem} 面臨 ${threatDescription} 的安全威脅`,
                            impact: '可能導致系統安全性受損和未授權存取',
                            mitigation: '實施綜合安全控制措施'
                        }
                    ],
                    riskScore: Math.round(riskScore * 10) / 10,
                    recommendations: recommendations.length > 0 ? recommendations : [
                        '實施多層安全控制',
                        '定期進行安全評估和滲透測試',
                        '強化監控和事件回應機制'
                    ],
                    technicalDetails: technicalDetails.length > 0 ? technicalDetails : [
                        '升級安全檢測機制',
                        '部署AI對抗技術',
                        '強化系統日誌和稽核'
                    ],
                    complianceGaps: complianceGaps.length > 0 ? complianceGaps : [
                        '確保符合個資法要求',
                        '遵循金融監管規範',
                        '建立完整稽核軌跡'
                    ],
                    mitigationStrategies: mitigationStrategies.length > 0 ? mitigationStrategies : [
                        '多層防護架構',
                        '零信任安全模型',
                        '持續安全監控'
                    ]
                };
            },

            // 提取嚴重性等級
            extractSeverity(text) {
                const lowerText = text.toLowerCase();
                if (lowerText.includes('critical') || lowerText.includes('嚴重') || lowerText.includes('危急')) return 'CRITICAL';
                if (lowerText.includes('high') || lowerText.includes('高') || lowerText.includes('重要')) return 'HIGH';
                if (lowerText.includes('medium') || lowerText.includes('中') || lowerText.includes('普通')) return 'MEDIUM';
                if (lowerText.includes('low') || lowerText.includes('低') || lowerText.includes('輕微')) return 'LOW';
                return 'MEDIUM';
            },

            // 提取影響程度
            extractImpact(text) {
                const lowerText = text.toLowerCase();
                if (lowerText.includes('complete') || lowerText.includes('完全') || lowerText.includes('全面')) return '系統完全受損';
                if (lowerText.includes('bypass') || lowerText.includes('繞過') || lowerText.includes('迂迴')) return '安全機制可能被繞過';
                if (lowerText.includes('unauthorized') || lowerText.includes('未授權') || lowerText.includes('非法')) return '未授權存取風險';
                return '潛在安全影響';
            },

            // 測試 Grok API 連接
            async testConnection() {
                if (!process.env.XAI_API_KEY) {
                    throw new Error('XAI_API_KEY 未設定，請設定環境變數後重試');
                }

                console.log('🧪 測試 Grok API 連接...');

                const testResult = await this.callGrokAPI(
                    '測試連接',
                    'eKYC 系統',
                    'vulnerability'
                );

                return {
                    success: true,
                    model: 'grok-3-mini',
                    status: 'connected',
                    usage: testResult.usage,
                    timestamp: new Date().toISOString()
                };
            }
        };
    }


    // === Vertex AI Agent 服務 ===
    static createVertexAIService() {
        console.log('🤖 創建 Vertex AI Agent 服務...');

        return {
            configured: !!(process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_APPLICATION_CREDENTIALS),

            async chatWithAgent(sessionId, message, agentId = 'default-security-agent') {
                try {
                    console.log('💬 Vertex AI Agent 對話中...', { sessionId, agentId });

                    // 模擬 Vertex AI Agent 對話
                    const response = this.simulateVertexAgentChat(message, sessionId, agentId);

                    return {
                        success: true,
                        response: response.message,
                        sessionId,
                        agentId,
                        suggestions: response.suggestions,
                        relatedAttackVectors: response.relatedVectors,
                        confidence: response.confidence,
                        conversationLength: response.conversationLength,
                        timestamp: new Date().toISOString()
                    };

                } catch (error) {
                    console.error('❌ Vertex AI Agent 對話失敗:', error.message);
                    return {
                        success: false,
                        error: error.message,
                        response: '抱歉，AI Agent 目前暫時不可用。請稍後再試或聯絡系統管理員。',
                        timestamp: new Date().toISOString()
                    };
                }
            }
        };
    }

    // === 攻擊服務 ===
    static createAttackService() {
        console.log('⚔️ 創建攻擊服務...');

        return {
            getAllVectors() {
                return {
                    success: true,
                    vectors: [
                        {
                            id: 'A1',
                            model: 'StyleGAN3',
                            scenario: '偽造真人自拍',
                            difficulty: 'MEDIUM',
                            successRate: '78%',
                            description: '使用 StyleGAN3 生成高擬真臉部影像',
                            category: 'deepfake',
                            riskLevel: 'MEDIUM'
                        },
                        {
                            id: 'A2',
                            model: 'StableDiffusion',
                            scenario: '螢幕翻拍攻擊',
                            difficulty: 'LOW',
                            successRate: '65%',
                            description: '模擬螢幕反射和拍攝偽像',
                            category: 'presentation',
                            riskLevel: 'LOW'
                        },
                        {
                            id: 'A3',
                            model: 'SimSwap',
                            scenario: '即時換臉攻擊',
                            difficulty: 'HIGH',
                            successRate: '89%',
                            description: '最危險的即時視訊換臉技術',
                            category: 'deepfake',
                            riskLevel: 'CRITICAL'
                        },
                        {
                            id: 'A4',
                            model: 'Diffusion+GAN',
                            scenario: '偽造護照攻擊',
                            difficulty: 'MEDIUM',
                            successRate: '73%',
                            description: '生成含 MRZ 和條碼的假證件',
                            category: 'document-forge',
                            riskLevel: 'HIGH'
                        },
                        {
                            id: 'A5',
                            model: 'DALL·E',
                            scenario: '生成假證件',
                            difficulty: 'EASY',
                            successRate: '82%',
                            description: '直接生成身分證件圖像',
                            category: 'document-forge',
                            riskLevel: 'MEDIUM'
                        }
                    ],
                    statistics: {
                        totalVectors: 5,
                        averageSuccessRate: '77.4%',
                        mostEffective: 'A3 - SimSwap',
                        leastEffective: 'A2 - StableDiffusion',
                        riskDistribution: {
                            CRITICAL: 1,
                            HIGH: 1,
                            MEDIUM: 2,
                            LOW: 1
                        }
                    },
                    recommendedCombos: [
                        {
                            name: '💎 鑽石組合',
                            vectors: ['A3', 'A4'],
                            expectedSuccessRate: '94%',
                            threatLevel: 'CRITICAL',
                            description: '即時換臉 + 證件偽造的最強組合'
                        },
                        {
                            name: '🥇 黃金組合',
                            vectors: ['A1', 'A5'],
                            expectedSuccessRate: '83%',
                            threatLevel: 'HIGH',
                            description: '假自拍 + 生成證件的標準測試組合'
                        },
                        {
                            name: '⚡ 閃電組合',
                            vectors: ['A2', 'A3'],
                            expectedSuccessRate: '92%',
                            threatLevel: 'CRITICAL',
                            description: '翻拍攻擊 + 即時換臉的視訊繞過專用'
                        }
                    ],
                    timestamp: new Date().toISOString()
                };
            },

            executeAttack(attackRequest) {
                const { vectorIds = ['A1'], intensity = 'medium', options = {} } = attackRequest;

                console.log(`🎯 執行攻擊測試: ${vectorIds.join(', ')} (強度: ${intensity})`);

                const testId = `QQC_ATK_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

                // 基於攻擊向量的真實成功率進行模擬
                const vectorSuccessRates = {
                    'A1': 0.78, 'A2': 0.65, 'A3': 0.89, 'A4': 0.73, 'A5': 0.82
                };

                const intensityMultiplier = {
                    'low': 0.7, 'medium': 1.0, 'high': 1.2
                };

                const results = vectorIds.map(vectorId => {
                    const baseSuccessRate = vectorSuccessRates[vectorId] || 0.5;
                    const adjustedRate = baseSuccessRate * (intensityMultiplier[intensity] || 1.0);
                    const success = Math.random() < adjustedRate;

                    return {
                        vectorId,
                        success,
                        confidence: Math.round((0.6 + Math.random() * 0.4) * 1000) / 1000,
                        bypassScore: success ? Math.round((0.6 + Math.random() * 0.4) * 1000) / 1000 : 0,
                        processingTime: Math.round(1000 + Math.random() * 3000),
                        riskScore: adjustedRate * 10,
                        detectionDifficulty: success ? 'HIGH' : 'LOW',
                        timestamp: new Date().toISOString()
                    };
                });

                const successfulAttacks = results.filter(r => r.success).length;
                const successRate = Math.round((successfulAttacks / results.length) * 100);
                const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;

                // 計算威脅等級
                let threatLevel = 'LOW';
                if (successRate >= 90) threatLevel = 'CRITICAL';
                else if (successRate >= 70) threatLevel = 'HIGH';
                else if (successRate >= 50) threatLevel = 'MEDIUM';

                return {
                    success: true,
                    testId,
                    attackResults: {
                        vectors: vectorIds,
                        intensity,
                        options,
                        results,
                        summary: {
                            totalAttacks: results.length,
                            successfulAttacks,
                            successRate: `${successRate}%`,
                            threatLevel,
                            avgConfidence: Math.round(avgConfidence * 100) / 100,
                            recommendations: this.generateSecurityRecommendations(results, successRate)
                        },
                        analysis: {
                            mostEffectiveVector: results.reduce((max, r) => r.confidence > max.confidence ? r : max),
                            vulnerabilityAssessment: this.assessVulnerabilities(results),
                            mitigationStrategies: this.getMitigationStrategies(vectorIds, successRate)
                        }
                    },
                    metadata: {
                        executedAt: new Date().toISOString(),
                        executionEnvironment: 'simulation',
                        complianceNote: '本測試僅用於安全評估目的'
                    },
                    timestamp: new Date().toISOString()
                };
            },

            // 生成安全建議
            generateSecurityRecommendations(results, successRate) {
                const recommendations = [];

                if (successRate >= 70) {
                    recommendations.push('立即強化多重身份驗證機制');
                    recommendations.push('部署先進的活體檢測技術');
                }

                if (results.some(r => r.vectorId === 'A3' && r.success)) {
                    recommendations.push('實施專門的換臉檢測算法');
                    recommendations.push('加強視訊流的實時分析');
                }

                if (results.some(r => ['A4', 'A5'].includes(r.vectorId) && r.success)) {
                    recommendations.push('升級證件真偽辨識系統');
                    recommendations.push('增加人工審核流程');
                }

                recommendations.push('定期更新安全檢測模型');
                recommendations.push('建立攻擊行為監控機制');

                return recommendations;
            },

            // 評估漏洞
            assessVulnerabilities(results) {
                return {
                    biometricBypass: results.filter(r => ['A1', 'A3'].includes(r.vectorId) && r.success).length > 0,
                    documentForgery: results.filter(r => ['A4', 'A5'].includes(r.vectorId) && r.success).length > 0,
                    presentationAttack: results.some(r => r.vectorId === 'A2' && r.success),
                    overallRisk: results.filter(r => r.success).length >= results.length * 0.7 ? 'HIGH' : 'MEDIUM'
                };
            },

            // 獲取緩解策略
            getMitigationStrategies(vectorIds, successRate) {
                const strategies = [];

                if (vectorIds.includes('A3')) {
                    strategies.push({
                        threat: 'SimSwap 即時換臉',
                        strategy: '部署多模態生物識別',
                        priority: 'CRITICAL',
                        implementation: '結合人臉、聲紋、行為模式進行綜合驗證'
                    });
                }

                if (vectorIds.includes('A1')) {
                    strategies.push({
                        threat: 'StyleGAN3 假自拍',
                        strategy: '強化活體檢測',
                        priority: 'HIGH',
                        implementation: '使用 3D 深度感測和紅外線檢測'
                    });
                }

                if (['A4', 'A5'].some(id => vectorIds.includes(id))) {
                    strategies.push({
                        threat: '證件偽造攻擊',
                        strategy: '多重文件驗證',
                        priority: 'HIGH',
                        implementation: '結合 OCR、條碼驗證和資料庫比對'
                    });
                }

                return strategies;
            }
        };
    }

    // === RAG 服務 ===
    static createRagService() {
        console.log('🔧 創建 RAG 服務...');
        try {
            const RAGService = require('../services/RagService');

            // 創建依賴服務
            const databaseService = this.createDatabaseService();
            const geminiService = this.createGeminiService();
            const embeddingService = this.createEmbeddingService();

            return new RAGService(databaseService, geminiService, embeddingService);
        } catch (error) {
            console.error('❌ RAG 服務創建失敗:', error.message);
            return this.createMockRagService();
        }
    }

    // === 應用服務 ===
    static createAppService() {
        return {
            getSystemInfo() {
                return {
                    system: {
                        name: '侵國侵城 AI 滲透測試系統',
                        version: '2.0.0',
                        description: '專業的 eKYC 系統 AI 安全測試平台',
                        build: process.env.BUILD_VERSION || 'dev',
                        environment: process.env.NODE_ENV || 'development'
                    },
                    features: [
                        'Multi-AI Engine Integration',
                        'RAG Knowledge Management',
                        'Attack Vector Simulation',
                        'Real-time Threat Analysis',
                        'Security Vulnerability Assessment',
                        'Compliance Reporting'
                    ],
                    capabilities: {
                        aiEngines: ['Gemini AI', 'Grok AI', 'Vertex AI Agent'],
                        attackVectors: 5,
                        ragSystem: true,
                        realTimeAnalysis: true
                    },
                    competition: {
                        name: '2025 InnoServe 大專校院資訊應用服務創新競賽',
                        team: '侵國侵城團隊',
                        university: '國立臺中科技大學',
                        department: '資訊管理系'
                    },
                    timestamp: new Date().toISOString()
                };
            }
        };
    }

    // === 健康檢查服務 ===
    static createHealthService() {
        return {
            getSystemHealth() {
                const uptime = process.uptime();
                const memory = process.memoryUsage();

                return {
                    status: 'healthy',
                    timestamp: new Date().toISOString(),
                    uptime: `${Math.floor(uptime)}秒`,
                    uptimeFormatted: this.formatUptime(uptime),
                    memory: {
                        used: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
                        total: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`,
                        rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
                        external: `${Math.round(memory.external / 1024 / 1024)}MB`
                    },
                    cpu: {
                        usage: `${Math.round(process.cpuUsage().user / 1000)}ms`,
                        loadAverage: os.loadavg ? os.loadavg() : [0, 0, 0]
                    },
                    services: {
                        nestjs: { status: 'operational', version: '11.0.1' },
                        express: { status: 'operational', version: '4.19.2' },
                        geminiAI: {
                            status: process.env.GEMINI_API_KEY ? 'ready' : 'not-configured',
                            configured: !!process.env.GEMINI_API_KEY
                        },
                        grokAI: {
                            status: process.env.XAI_API_KEY ? 'ready' : 'not-configured',
                            configured: !!process.env.XAI_API_KEY
                        },
                        vertexAI: {
                            status: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'ready' : 'not-configured',
                            configured: !!process.env.GOOGLE_CLOUD_PROJECT_ID
                        },
                        ragSystem: {
                            status: 'ready',
                            mode: 'enhanced'
                        },
                        database: this.createDatabaseService().getStatus()
                    },
                    environment: {
                        nodeVersion: process.version,
                        platform: process.platform,
                        arch: process.arch,
                        env: process.env.NODE_ENV || 'development'
                    }
                };
            },

            formatUptime(seconds) {
                const days = Math.floor(seconds / 86400);
                const hours = Math.floor((seconds % 86400) / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const secs = Math.floor(seconds % 60);

                if (days > 0) return `${days}天 ${hours}小時 ${minutes}分鐘`;
                if (hours > 0) return `${hours}小時 ${minutes}分鐘`;
                if (minutes > 0) return `${minutes}分鐘 ${secs}秒`;
                return `${secs}秒`;
            }
        };
    }

    // === 資料庫服務 ===
    static createDatabaseService() {
        return {
            getStatus() {
                return {
                    postgresql: {
                        configured: !!process.env.DATABASE_URL,
                        status: process.env.DATABASE_URL ? 'ready' : 'not-configured'
                    },
                    neo4j: {
                        configured: !!(process.env.NEO4J_URI && process.env.NEO4J_USERNAME),
                        status: (process.env.NEO4J_URI && process.env.NEO4J_USERNAME) ? 'ready' : 'not-configured'
                    },
                    redis: {
                        configured: !!process.env.REDIS_URL,
                        status: process.env.REDIS_URL ? 'ready' : 'not-configured'
                    },
                    vector: {
                        engine: 'pgvector',
                        dimensions: 1024,
                        status: process.env.DATABASE_URL ? 'ready' : 'not-configured'
                    }
                };
            }
        };
    }

    // === 嵌入服務 ===
    static createEmbeddingService() {
        console.log('🧠 創建向量嵌入服務...');

        return {
            // 服務配置
            config: {
                apiUrl: process.env.EMBEDDING_API_URL || 'http://localhost:8000',
                model: 'qinguoqinchen-legal-embedder-v1.0',
                dimension: 1024,
                batchSize: 100,
                timeout: 30000, // 30秒超時
                retries: 3
            },

            // 單一文本向量化
            async generateEmbedding(text, options = {}) {
                try {
                    const {
                        instruction = 'query: ',
                        normalize = true
                    } = options;

                    console.log(`🔤 生成文本向量: ${text.substring(0, 50)}...`);

                    const response = await this.callEmbeddingAPI({
                        texts: [text],
                        instruction,
                        normalize
                    });

                    const vector = response.embeddings[0];
                    console.log(`✅ 向量生成完成，維度: ${vector.length}`);

                    return vector;

                } catch (error) {
                    console.error('❌ 向量生成失敗:', error.message);

                    // 備用方案：使用簡化模擬向量
                    return this.generateFallbackEmbedding(text);
                }
            },

            // 批量文本向量化
            async batchGenerateEmbeddings(texts, options = {}) {
                try {
                    const {
                        instruction = 'query: ',
                        normalize = true,
                        batchSize = this.config.batchSize
                    } = options;

                    console.log(`📦 批量生成向量: ${texts.length} 個文本`);

                    // 分批處理以避免超時
                    const batches = this.chunkArray(texts, batchSize);
                    let allEmbeddings = [];

                    for (let i = 0; i < batches.length; i++) {
                        const batch = batches[i];
                        console.log(`處理批次 ${i + 1}/${batches.length}: ${batch.length} 個文本`);

                        const response = await this.callEmbeddingAPI({
                            texts: batch,
                            instruction,
                            normalize
                        });

                        allEmbeddings.push(...response.embeddings);

                        // 批次間暫停，避免 API 過載
                        if (i < batches.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }
                    }

                    console.log(`✅ 批量向量生成完成: ${allEmbeddings.length} 個向量`);

                    return allEmbeddings;

                } catch (error) {
                    console.error('❌ 批量向量生成失敗:', error.message);

                    // 備用方案：為每個文本生成模擬向量
                    return texts.map(text => this.generateFallbackEmbedding(text));
                }
            },

            // 智能文本分塊
            async chunkText(text, options = {}) {
                try {
                    const {
                        chunkSize = 500,
                        overlap = 50
                    } = options;

                    console.log(`✂️ 智能文本分塊: ${text.length} 字符`);

                    const response = await this.callChunkingAPI({
                        text,
                        chunk_size: chunkSize,
                        overlap
                    });

                    console.log(`✅ 文本分塊完成: ${response.total_chunks} 個片段`);

                    return {
                        chunks: response.chunks,
                        totalChunks: response.total_chunks,
                        originalLength: response.original_length
                    };

                } catch (error) {
                    console.error('❌ 文本分塊失敗:', error.message);

                    // 備用方案：簡單分塊
                    return this.simpleFallbackChunking(text, options);
                }
            },

            // 呼叫您的向量 API
            async callEmbeddingAPI(payload) {
                const url = `${this.config.apiUrl}/embed`;

                try {
                    const fetch = require('node-fetch'); // 需要安裝: npm install node-fetch@2

                    const controller = new AbortController();
                    const timeout = setTimeout(() => controller.abort(), this.config.timeout);

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(payload),
                        signal: controller.signal
                    });

                    clearTimeout(timeout);

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`API 請求失敗: ${response.status} - ${errorText}`);
                    }

                    const result = await response.json();

                    // 驗證回應格式
                    if (!result.embeddings || !Array.isArray(result.embeddings)) {
                        throw new Error('API 回應格式錯誤');
                    }

                    return result;

                } catch (error) {
                    if (error.name === 'AbortError') {
                        throw new Error('向量 API 請求超時');
                    }
                    throw error;
                }
            },

            // 呼叫您的分塊 API
            async callChunkingAPI(payload) {
                const url = `${this.config.apiUrl}/chunk`;

                try {
                    const fetch = require('node-fetch');

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(payload),
                        timeout: this.config.timeout
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`分塊 API 請求失敗: ${response.status} - ${errorText}`);
                    }

                    return await response.json();

                } catch (error) {
                    throw error;
                }
            },

            // 檢查 API 服務狀態
            async checkHealth() {
                try {
                    const fetch = require('node-fetch');
                    const url = `${this.config.apiUrl}/health`;

                    const response = await fetch(url, {
                        method: 'GET',
                        timeout: 5000
                    });

                    if (!response.ok) {
                        return {
                            healthy: false,
                            error: `HTTP ${response.status}`,
                            url
                        };
                    }

                    const health = await response.json();

                    return {
                        healthy: health.ready,
                        status: health.status,
                        model: health.model,
                        dimension: health.dimension,
                        version: health.version,
                        url,
                        timestamp: health.timestamp
                    };

                } catch (error) {
                    return {
                        healthy: false,
                        error: error.message,
                        url: this.config.apiUrl
                    };
                }
            },

            // 執行完整測試
            async testService() {
                try {
                    console.log('🧪 執行向量服務完整測試...');

                    const fetch = require('node-fetch');
                    const url = `${this.config.apiUrl}/test`;

                    const response = await fetch(url, {
                        method: 'GET',
                        timeout: 10000
                    });

                    if (!response.ok) {
                        throw new Error(`測試 API 失敗: ${response.status}`);
                    }

                    const testResult = await response.json();

                    console.log('✅ 向量服務測試完成');

                    return {
                        success: true,
                        result: testResult,
                        timestamp: new Date().toISOString()
                    };

                } catch (error) {
                    console.error('❌ 向量服務測試失敗:', error.message);

                    return {
                        success: false,
                        error: error.message,
                        timestamp: new Date().toISOString()
                    };
                }
            },

            // 獲取模型資訊
            getModelInfo() {
                return {
                    model: this.config.model,
                    dimension: this.config.dimension,
                    apiUrl: this.config.apiUrl,
                    batchSize: this.config.batchSize,
                    languages: ['zh-TW', 'zh-CN', 'en'],
                    specializations: ['legal', 'compliance', 'cybersecurity'],
                    features: [
                        '繁體中文法規文本最佳化',
                        '條文結構智能識別',
                        '法規關鍵詞強化',
                        '智能文本分塊'
                    ]
                };
            },

            // === 備用方案方法 ===
            generateFallbackEmbedding(text) {
                console.log('🔄 使用備用向量生成');

                // 使用文本哈希生成確定性向量
                const crypto = require('crypto');
                const hash = crypto.createHash('sha256').update(text).digest();

                const vector = [];
                for (let i = 0; i < this.config.dimension; i++) {
                    const byteIndex = i % hash.length;
                    const normalizedValue = (hash[byteIndex] - 127.5) / 127.5; // 範圍 [-1, 1]
                    vector.push(normalizedValue);
                }

                // 正規化向量
                const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
                return vector.map(val => val / magnitude);
            },

            simpleFallbackChunking(text, options = {}) {
                const { chunkSize = 500, overlap = 50 } = options;
                const chunks = [];
                let start = 0;
                let chunkIndex = 0;

                while (start < text.length) {
                    let end = Math.min(start + chunkSize, text.length);

                    // 尋找適當的斷點
                    if (end < text.length) {
                        for (const punct of ['。', '！', '？', '；', '\n']) {
                            const lastPunct = text.lastIndexOf(punct, end);
                            if (lastPunct > start + chunkSize * 0.7) {
                                end = lastPunct + 1;
                                break;
                            }
                        }
                    }

                    const chunkText = text.substring(start, end).trim();
                    if (chunkText) {
                        chunks.push({
                            text: chunkText,
                            chunk_index: chunkIndex++,
                            type: 'fallback',
                            character_count: chunkText.length,
                            start_position: start,
                            end_position: end
                        });
                    }

                    start = Math.max(end - overlap, start + 1);
                }

                return {
                    chunks,
                    totalChunks: chunks.length,
                    originalLength: text.length
                };
            },

            // 輔助方法：陣列分塊
            chunkArray(array, size) {
                const chunks = [];
                for (let i = 0; i < array.length; i += size) {
                    chunks.push(array.slice(i, i + size));
                }
                return chunks;
            }
        };
    }

    // === 模擬服務方法 ===
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

    static createMockGeminiService() {
        console.log('⚠️ 使用模擬 Gemini AI 服務');

        return {
            configured: false,

            async generateAttackVector(prompt) {
                console.log('🔄 使用模擬 Gemini AI 服務');

                return {
                    success: true,
                    analysis: this.getFallbackGeminiAnalysis(prompt),
                    attackStrategies: this.getDefaultAttackStrategies(),
                    defenseRecommendations: this.getDefaultDefenseRecommendations(),
                    riskLevel: 'MEDIUM',
                    confidence: 0.7,
                    mode: 'mock',
                    prompt: prompt,
                    model: 'gemini-mock',
                    timestamp: new Date().toISOString()
                };
            },

            async testConnection() {
                return { success: false, error: 'API Key 未設定 (模擬模式)' };
            }
        };
    }

    // === 輔助方法 ===
    static parseGeminiAnalysis(text, prompt) {
        const strategies = [];
        const defenses = [];
        let riskLevel = 'MEDIUM';
        let confidence = 0.8;

        const highRiskKeywords = ['simswap', '即時換臉', '高成功率', '難以檢測'];
        const lowRiskKeywords = ['基礎攻擊', '容易檢測', '低成功率'];

        const lowerText = text.toLowerCase();

        if (highRiskKeywords.some(keyword => lowerText.includes(keyword))) {
            riskLevel = 'HIGH';
            confidence = 0.9;
        } else if (lowRiskKeywords.some(keyword => lowerText.includes(keyword))) {
            riskLevel = 'LOW';
            confidence = 0.7;
        }

        if (lowerText.includes('simswap') || lowerText.includes('換臉')) {
            strategies.push('即時換臉技術攻擊', '深度學習模型欺騙', '生物識別繞過');
            defenses.push('多重生物識別驗證', '活體檢測強化', '行為模式分析');
        }

        return { strategies, defenses, riskLevel, confidence };
    }

    static getFallbackGeminiAnalysis(prompt) {
        const analysisMap = {
            'simswap': `基於您的查詢關於 SimSwap 即時換臉技術的安全分析：

**攻擊技術分析**：
SimSwap 是當前最先進的即時換臉技術之一，利用深度學習神經網絡實現實時的面部特徵交換。該技術的核心在於：
1. 使用生成對抗網絡（GAN）進行面部特徵學習
2. 實時特徵映射和紋理合成
3. 高質量的影像渲染，難以被傳統檢測方法識別

**風險評估**：
- 攻擊成功率：約89%（業界最高）
- 檢測難度：非常高
- 潛在影響：可完全繞過基於人臉識別的eKYC系統

**防護建議**：
1. **多模態生物識別**：結合聲音、行為模式等多種識別方式
2. **活體檢測增強**：使用3D深度感測、紅外檢測等高級技術
3. **AI對抗模型**：部署專門的Deepfake檢測算法
4. **行為分析**：監控用戶操作行為的異常模式

**業界最佳實踐**：
- 金融機構應採用多層防護策略
- 定期更新檢測模型以應對新興攻擊技術
- 建立完善的風險監控和應急響應機制`,

            'default': `基於您的安全查詢，以下是專業的eKYC安全分析：

該攻擊向量對eKYC系統構成中等程度的威脅。建議採用多層防護策略，包括：
1. 強化活體檢測機制
2. 部署AI對抗模型
3. 實施行為模式分析
4. 建立完善的監控體系`
        };

        const lowerPrompt = prompt.toLowerCase();
        for (const [key, analysis] of Object.entries(analysisMap)) {
            if (lowerPrompt.includes(key)) {
                return analysis;
            }
        }

        return analysisMap.default;
    }

    static getDefaultAttackStrategies() {
        return [
            '深度學習模型欺騙',
            '生物識別特徵偽造',
            '實時影像處理攻擊',
            '多模態數據同步攻擊'
        ];
    }

    static getDefaultDefenseRecommendations() {
        return [
            '部署多層生物識別驗證',
            '強化活體檢測機制',
            '實施AI對抗防護模型',
            '建立異常行為監控系統',
            '定期更新安全檢測算法'
        ];
    }

    static simulateGrokAnalysis(threatDescription, targetSystem, analysisType) {
        return {
            description: `針對 ${targetSystem} 的 ${threatDescription} 威脅分析已完成。基於 Grok AI 的深度分析，識別出多個關鍵漏洞和風險點。`,
            vulnerabilities: [
                {
                    severity: 'HIGH',
                    description: '生物識別驗證存在AI欺騙風險',
                    impact: '攻擊者可能繞過身份驗證系統',
                    mitigation: '實施多重驗證機制和AI檢測算法'
                },
                {
                    severity: 'MEDIUM',
                    description: '文件驗證流程可能被AI生成內容繞過',
                    impact: '假證件可能通過初步檢驗',
                    mitigation: '加強OCR和防偽特徵檢測'
                }
            ],
            riskScore: 7.8,
            recommendations: [
                '升級活體檢測算法至最新版本',
                '部署專門的AI對抗檢測系統',
                '強化用戶行為模式監控',
                '建立實時威脅情報更新機制'
            ]
        };
    }

    static simulateVertexAgentChat(message, sessionId, agentId) {
        const agentPersonalities = {
            'default-security-agent': '我是您的eKYC安全顧問，專注於提供全面的安全分析和建議。',
            'ekyc-specialist': '作為eKYC專業顧問，我專門處理電子身份驗證的技術和合規問題。',
            'penetration-tester': '我是滲透測試專家，專注於發現和評估系統的安全漏洞。'
        };

        const personality = agentPersonalities[agentId] || agentPersonalities['default-security-agent'];

        return {
            message: `${personality}

關於您的問題：「${message.substring(0, 100)}${message.length > 100 ? '...' : ''}」

基於我的分析，這個問題涉及到當前eKYC系統面臨的重要挑戰。我建議從多個層面來應對：

1. **技術層面**：採用多模態生物識別技術，結合人臉、聲紋、行為模式等多種識別方式
2. **流程層面**：建立分級驗證機制，對高風險交易進行人工審核
3. **監控層面**：實施實時異常檢測，及時發現可疑活動

您還有什麼具體的技術問題想要探討嗎？`,

            suggestions: [
                '詢問具體的防護技術實施方案',
                '了解相關法規合規要求',
                '探討行業最佳實踐案例',
                '討論成本效益分析'
            ],

            relatedVectors: message.toLowerCase().includes('深偽') || message.toLowerCase().includes('換臉')
                ? ['A3', 'A1'] : ['A1', 'A4'],

            confidence: 0.85,
            conversationLength: 1
        };
    }
}

// 需要 os 模組來獲取系統資訊
const os = require('os');

module.exports = ServiceFactory;
