// src/services/GeminiService.js
class GeminiService {
    constructor() {
        this.ai = null;
        this.isConfigured = !!process.env.GEMINI_API_KEY;
        this.requestCount = 0;
        this.errorCount = 0;

        if (this.isConfigured) {
            this.initializeGeminiAI();
        }
    }

    async initializeGeminiAI() {
        try {
            const { GoogleGenerativeAI } = require('@google/generative-ai');
            this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            console.log('✅ Gemini AI SDK 初始化成功');
        } catch (error) {
            console.log('⚠️ Gemini SDK 未安裝，請執行: npm install @google/generative-ai');
            this.isConfigured = false;
        }
    }

    async generateAttackVector(prompt) {
        this.requestCount++;

        if (!this.isConfigured || !this.ai) {
            return this.getMockResponse(prompt, 'generateAttackVector');
        }

        try {
            console.log('🤖 呼叫 Gemini AI 生成攻擊向量...');

            const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const enhancedPrompt = `你是一位專業的 AI 安全專家，專精於 eKYC 系統滲透測試。

${prompt}

請提供：
1. 技術分析和攻擊步驟
2. 成功率預估和風險評估
3. APCER、BPCER、ACER 等量化指標
4. 防護建議和對策
5. 合規性影響評估

請以專業且詳細的方式回答。`;

            const result = await model.generateContent(enhancedPrompt);
            const response = await result.response;

            console.log('✅ Gemini AI 回應成功');

            return {
                text: response.text(),
                success: true,
                timestamp: new Date().toISOString(),
                model: 'gemini-2.5-flash',
                tokenUsage: this.estimateTokenUsage(prompt, response.text())
            };

        } catch (error) {
            this.errorCount++;
            console.error('❌ Gemini API 呼叫失敗:', error.message);

            // 提供智能降級回應
            return this.getIntelligentFallback(prompt, 'generateAttackVector');
        }
    }

    async analyzeEkycVulnerability(targetSystem, attackType) {
        this.requestCount++;

        if (!this.isConfigured || !this.ai) {
            return this.getMockEkycAnalysis(targetSystem, attackType);
        }

        try {
            console.log('🔍 Gemini AI 進行 eKYC 漏洞分析...');

            const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const prompt = `作為專業的 AI 安全顧問，請針對以下 eKYC 系統進行深度安全分析：

**目標系統**: ${targetSystem}
**攻擊類型**: ${attackType}

請提供完整的安全評估報告，包含：

1. **漏洞分析**
   - 識別潛在的安全弱點
   - 評估攻擊路徑和入侵方法
   - 分析系統架構的脆弱性

2. **風險量化評估**
   - APCER (攻擊展示錯誤接受率): ≤3%
   - BPCER (生物辨識錯誤拒絕率): ≤5%
   - ACER (平均分類錯誤率)
   - EER (等錯誤率)
   - ROC-AUC 曲線分析

3. **攻擊情境模擬**
   - StyleGAN3、SimSwap、StableDiffusion 等 AI 攻擊
   - 文件偽造和生物辨識欺騙
   - 預估成功率和檢測難度

4. **防護建議**
   - 多層防護策略
   - AI vs AI 對抗技術
   - 實時檢測和預警機制

5. **合規性評估**
   - GDPR、PCI DSS 合規要求
   - 金融監管法規遵循
   - 資料保護和隱私要求

請提供專業且可行的建議。`;

            const result = await model.generateContent(prompt);
            const response = await result.response;

            return {
                vulnerabilityAnalysis: response.text(),
                system: targetSystem,
                attackType: attackType,
                riskLevel: this.assessRiskLevel(response.text()),
                recommendations: this.extractRecommendations(response.text()),
                success: true,
                timestamp: new Date().toISOString(),
                model: 'gemini-2.5-flash'
            };

        } catch (error) {
            this.errorCount++;
            console.error('❌ eKYC 漏洞分析失敗:', error.message);
            return this.getMockEkycAnalysis(targetSystem, attackType);
        }
    }

    async generateDeepfakePrompt(scenario) {
        this.requestCount++;

        if (!this.isConfigured || !this.ai) {
            return this.getMockDeepfakePrompt(scenario);
        }

        try {
            console.log('🎭 Gemini AI 生成 Deepfake 提示詞...');

            const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const prompt = `作為專業的 Deepfake 檢測專家，請針對「${scenario}」情境生成完整的分析報告：

1. **技術實現分析**
   - StyleGAN3: 高擬真臉部生成技術
   - SimSwap: 實時換臉算法
   - 訓練數據需求和模型複雜度

2. **攻擊向量設計**
   - 攻擊步驟和技術細節
   - 所需工具和資源評估
   - 成功率預估

3. **檢測挑戰**
   - APCER、BPCER 指標分析
   - 檢測算法的局限性
   - 對抗樣本生成技術

4. **防護策略**
   - 多模態檢測技術
   - 生物活體檢測增強
   - AI 行為模式分析

5. **實際案例分析**
   - 真實攻擊案例研究
   - 金融業影響評估
   - 法律和合規考量

請提供技術深度的專業分析。`;

            const result = await model.generateContent(prompt);
            const response = await result.response;

            return {
                deepfakePrompt: response.text(),
                scenario: scenario,
                technicalComplexity: this.assessComplexity(response.text()),
                detectionDifficulty: this.assessDetectionDifficulty(response.text()),
                success: true,
                timestamp: new Date().toISOString(),
                model: 'gemini-2.5-flash'
            };

        } catch (error) {
            this.errorCount++;
            console.error('❌ Deepfake 提示詞生成失敗:', error.message);
            return this.getMockDeepfakePrompt(scenario);
        }
    }

    async optimizeAttackStrategy(vectorIds, intensity) {
        this.requestCount++;

        if (!this.isConfigured || !this.ai) {
            return this.getMockOptimization(vectorIds, intensity);
        }

        try {
            console.log('⚔️ Gemini AI 優化攻擊策略...');

            const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const vectorDescriptions = this.getVectorDescriptions();

            const prompt = `作為專業的滲透測試專家，請為以下攻擊向量組合制定最佳化策略：

**選擇的攻擊向量**: ${vectorIds.join(', ')}
**攻擊強度**: ${intensity}

**可用向量詳情**:
${vectorDescriptions}

請提供：

1. **策略優化分析**
   - 向量組合的協同效應
   - 攻擊順序和時機規劃
   - 資源分配和優先級

2. **成功率提升方案**
   - 單一向量vs組合攻擊效果
   - 預估成功率改善幅度
   - 風險/回報比分析

3. **技術實施細節**
   - 具體的攻擊步驟
   - 工具鏈和技術棧建議
   - 環境配置和準備工作

4. **檢測規避策略**
   - 現有防護機制分析
   - 規避和對抗技術
   - 隱蔽性和持續性考量

5. **防護建議**
   - 針對性的防護措施
   - 檢測算法改進建議
   - 系統強化策略

6. **合規和倫理考量**
   - 測試範圍和邊界
   - 法律風險評估
   - 責任歸屬和報告要求

請提供可執行的專業建議。`;

            const result = await model.generateContent(prompt);
            const response = await result.response;

            return {
                optimizedStrategy: response.text(),
                vectors: vectorIds,
                intensity: intensity,
                estimatedImprovement: this.calculateImprovement(vectorIds, intensity),
                riskAssessment: this.assessStrategyRisk(vectorIds, intensity),
                success: true,
                timestamp: new Date().toISOString(),
                model: 'gemini-2.5-flash'
            };

        } catch (error) {
            this.errorCount++;
            console.error('❌ 攻擊策略優化失敗:', error.message);
            return this.getMockOptimization(vectorIds, intensity);
        }
    }

    async generateResponseWithContext(question, relevantChunks) {
        this.requestCount++;

        if (!this.isConfigured || !this.ai) {
            return this.getMockContextResponse(question, relevantChunks);
        }

        try {
            console.log('📚 Gemini AI 基於上下文生成回應...');

            const model = this.ai.getGenerativeModel({ model: '5-flash' });

            const context = relevantChunks
                .map(chunk => `[文件 ${chunk.chunkIndex}] ${chunk.content}`)
                .join('\n\n');

            const prompt = `基於以下文件內容回答問題：

**上下文資料**:
${context}

**問題**: ${question}

請提供：
1. 基於提供文件的詳細回答
2. 引用具體的文件片段作為依據
3. 如果涉及 eKYC 安全，請提供專業建議
4. 如果涉及 AI 攻擊向量，請評估風險指標
5. 提供相關的防護措施建議

請確保回答準確且有依據。`;

            const result = await model.generateContent(prompt);
            const response = await result.response;

            return {
                text: response.text(),
                success: true,
                timestamp: new Date().toISOString(),
                model: 'gemini-2.5-flash',
                contextUsed: relevantChunks.length,
                citations: this.extractCitations(response.text(), relevantChunks)
            };

        } catch (error) {
            this.errorCount++;
            console.error('❌ Gemini AI 上下文回應失敗:', error.message);
            return this.getMockContextResponse(question, relevantChunks);
        }
    }

    // 輔助方法
    getVectorDescriptions() {
        return `
A1 - StyleGAN3: 偽造真人自拍 (成功率 78%)
A2 - StableDiffusion: 螢幕翻拍攻擊 (成功率 65%)
A3 - SimSwap: 即時換臉攻擊 (成功率 89%)
A4 - Diffusion+GAN: 偽造護照攻擊 (成功率 73%)
A5 - DALL·E: 生成假證件 (成功率 82%)

**組合攻擊效果**:
- A2+A3 (Deepfake + 翻拍): 預估成功率 92%
- A1+A4 (假自拍 + 假護照): 預估成功率 75%`;
    }

    estimateTokenUsage(input, output) {
        return {
            inputTokens: Math.ceil(input.length / 4),
            outputTokens: Math.ceil(output.length / 4),
            totalTokens: Math.ceil((input.length + output.length) / 4)
        };
    }

    assessRiskLevel(analysisText) {
        const criticalKeywords = ['critical', 'severe', 'high risk', '高風險', '嚴重'];
        const highKeywords = ['high', 'significant', '顯著', '高度'];
        const mediumKeywords = ['medium', 'moderate', '中等', '一般'];

        const text = analysisText.toLowerCase();

        if (criticalKeywords.some(keyword => text.includes(keyword))) return 'CRITICAL';
        if (highKeywords.some(keyword => text.includes(keyword))) return 'HIGH';
        if (mediumKeywords.some(keyword => text.includes(keyword))) return 'MEDIUM';
        return 'LOW';
    }

    extractRecommendations(analysisText) {
        // 簡化的建議提取邏輯
        const recommendations = [];

        if (analysisText.includes('多層')) recommendations.push('實施多層防護策略');
        if (analysisText.includes('AI') && analysisText.includes('檢測')) recommendations.push('部署 AI 檢測系統');
        if (analysisText.includes('生物辨識')) recommendations.push('強化生物辨識安全');
        if (analysisText.includes('監控')) recommendations.push('建立實時監控機制');

        return recommendations.length > 0 ? recommendations : ['定期進行安全評估', '更新防護機制'];
    }

    assessComplexity(analysisText) {
        if (analysisText.includes('complex') || analysisText.includes('sophisticated') || analysisText.includes('複雜')) {
            return 'HIGH';
        }
        if (analysisText.includes('moderate') || analysisText.includes('中等')) {
            return 'MEDIUM';
        }
        return 'LOW';
    }

    assessDetectionDifficulty(analysisText) {
        if (analysisText.includes('difficult') || analysisText.includes('challenging') || analysisText.includes('困難')) {
            return 'HARD';
        }
        if (analysisText.includes('moderate') || analysisText.includes('中等')) {
            return 'MEDIUM';
        }
        return 'EASY';
    }

    calculateImprovement(vectorIds, intensity) {
        const baseRate = vectorIds.length * 15; // 基礎改善率
        const intensityMultiplier = { 'low': 1.0, 'medium': 1.3, 'high': 1.6 };
        const improvement = baseRate * (intensityMultiplier[intensity] || 1.0);

        return `${Math.min(improvement, 40).toFixed(1)}%`;
    }

    assessStrategyRisk(vectorIds, intensity) {
        if (vectorIds.includes('A3') && intensity === 'high') return 'CRITICAL';
        if (vectorIds.length > 2 && intensity !== 'low') return 'HIGH';
        if (vectorIds.length > 1) return 'MEDIUM';
        return 'LOW';
    }

    extractCitations(responseText, relevantChunks) {
        // 簡化的引用提取邏輯
        const citations = [];

        relevantChunks.forEach((chunk, index) => {
            if (responseText.includes(`文件 ${chunk.chunkIndex}`) ||
                responseText.includes(chunk.content.substring(0, 50))) {
                citations.push({
                    chunkIndex: chunk.chunkIndex,
                    documentId: chunk.documentId,
                    relevance: 'high'
                });
            }
        });

        return citations;
    }

    // Mock 回應方法
    getMockResponse(prompt, method) {
        const responses = {
            generateAttackVector: `基於「${prompt}」的分析：

1. **技術實現路徑**
   - StyleGAN3 深度學習模型訓練
   - GPU 運算資源需求評估
   - 預估成功率: 75-85%

2. **風險評估**
   - 威脅等級: HIGH
   - 檢測難度: MEDIUM

3. **防護建議**
   - 部署 Deepfake 檢測模型
   - 強化活體檢測機制

注意: 這是模擬回應，請設置 GEMINI_API_KEY 以啟用 AI 功能。`
        };

        return {
            text: responses[method] || '模擬回應，請配置 Gemini API',
            success: true,
            timestamp: new Date().toISOString(),
            model: 'mock-service'
        };
    }

    getMockEkycAnalysis(targetSystem, attackType) {
        return {
            vulnerabilityAnalysis: `${targetSystem} 系統針對 ${attackType} 攻擊的安全分析：

1. **系統脆弱性**
   - 生物辨識繞過風險: CRITICAL
   - 預估 APCER: 15-25%

2. **攻擊路徑分析**
   - 主要威脅向量已識別
   - 建議立即強化防護

注意: 這是模擬分析，請設置 GEMINI_API_KEY 以獲得 AI 深度分析。`,
            system: targetSystem,
            attackType: attackType,
            riskLevel: 'HIGH',
            success: true,
            timestamp: new Date().toISOString(),
            model: 'mock-service'
        };
    }

    // 服務統計方法
    getServiceStats() {
        return {
            isConfigured: this.isConfigured,
            totalRequests: this.requestCount,
            errorCount: this.errorCount,
            successRate: this.requestCount > 0 ?
                `${Math.round(((this.requestCount - this.errorCount) / this.requestCount) * 100)}%` : '100%',
            model: this.isConfigured ? 'gemini-2.5-flash' : 'mock-service'
        };
    }
}

module.exports = GeminiService;
