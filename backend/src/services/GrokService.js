// src/services/GrokService.js
class GrokService {
    constructor() {
        this.client = null;
        this.isConfigured = !!process.env.XAI_API_KEY;
        this.requestCount = 0;
        this.errorCount = 0;

        if (this.isConfigured) {
            this.initializeGrokClient();
        }
    }

    async initializeGrokClient() {
        try {
            const OpenAI = require('openai');
            console.log('🚀 初始化 OpenAI SDK for Grok');

            this.client = new OpenAI({
                apiKey: process.env.XAI_API_KEY,
                baseURL: 'https://api.x.ai/v1'
            });

            console.log('✅ Grok AI 客戶端初始化成功');
        } catch (error) {
            console.log('⚠️ OpenAI SDK 未安裝，請執行: npm install openai');
            this.isConfigured = false;
        }
    }

    async chat(prompt, systemPrompt = 'You are Grok, a witty AI assistant inspired by The Hitchhiker\'s Guide to the Galaxy.') {
        this.requestCount++;

        if (!this.isConfigured || !this.client) {
            return this.getMockGrokResponse(prompt);
        }

        try {
            console.log('🤖 Grok AI 對話中...');

            const completion = await this.client.chat.completions.create({
                model: 'grok-beta',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                stream: false,
                temperature: 0.7,
                max_tokens: 2000
            });

            console.log('✅ Grok AI 回應成功');

            return {
                success: true,
                response: completion.choices[0].message.content,
                model: 'grok-beta',
                usage: completion.usage,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            this.errorCount++;
            console.error('❌ Grok API 呼叫失敗:', error.message);
            return this.getMockGrokResponse(prompt);
        }
    }

    async analyzeSecurityThreat(threatDescription, targetSystem) {
        const systemPrompt = `你是 Grok，一位具有《銀河便車指南》風格的網路安全專家。你擁有豐富的滲透測試經驗，能夠以幽默但專業的方式分析安全威脅。

請以 Grok 的獨特風格回答，包含：
- 專業的技術分析
- 適度的幽默和諷刺
- 實用的安全建議
- 對人類網路安全現況的機智評論

記住，即使語調輕鬆，技術內容必須準確且實用。`;

        const userPrompt = `請分析以下安全威脅：

**威脅描述**: ${threatDescription}
**目標系統**: ${targetSystem}

請提供：
1. 威脅等級評估 (CRITICAL/HIGH/MEDIUM/LOW)
2. 攻擊向量和可能的入侵路徑
3. 潛在影響和損害評估
4. 具體的防護建議和對策
5. 你對這種攻擊的「銀河系級別」評論

請以你獨特的 Grok 風格回答，既要專業又要有趣！`;

        return await this.chat(userPrompt, systemPrompt);
    }

    async generatePentestPlan(targetType, attackVectors) {
        const systemPrompt = `你是 Grok，銀河系中最機智的滲透測試專家。你對人類的網路安全防護既感到amusing又充滿專業關懷。

請以 Grok 的風格提供專業的滲透測試計劃，包含：
- 詳細的測試步驟和方法論
- 對各種攻擊向量的深度分析
- 實用的工具和技術建議
- 對人類網路安全意識的機智評論
- 42相關的幽默參考（如果適合的話）

保持專業的同時，展現你獨特的幽默感和哲學觀點。`;

        const userPrompt = `請為以下目標制定滲透測試計劃：

**目標類型**: ${targetType}
**可用攻擊向量**: ${attackVectors.join(', ')}

**攻擊向量說明**:
- A1: StyleGAN3 偽造自拍
- A2: StableDiffusion 翻拍攻擊  
- A3: SimSwap 即時換臉
- A4: 證件偽造
- A5: DALL·E 生成攻擊

請提供：
1. 完整的測試計劃和時程
2. 每個攻擊向量的具體實施步驟
3. 工具需求和環境配置
4. 預期結果和成功標準
5. 風險控制和倫理考量
6. 你對這個測試的「宇宙級」見解

發揮你的 Grok 特色，給我一個既專業又有趣的回答！`;

        return await this.chat(userPrompt, systemPrompt);
    }

    async evaluateEkycSecurity(systemDetails, knownVulnerabilities = []) {
        const systemPrompt = `你是 Grok，對 eKYC 系統安全有著深刻洞察的 AI 專家。你見過太多人類在數位身分驗證上的「創意」嘗試，因此對這個領域既有專業知識又充滿哲學思考。

請以 Grok 的風格分析 eKYC 系統安全，展現你的：
- 專業的技術分析能力
- 對人類行為模式的深刻理解  
- 適度的幽默和諷刺
- 實用的安全改善建議
- 對數位身分未來的哲學思考`;

        const userPrompt = `請評估以下 eKYC 系統的安全性：

**系統詳情**: ${JSON.stringify(systemDetails, null, 2)}
**已知漏洞**: ${knownVulnerabilities.join(', ')}

請提供：
1. **安全等級評估** (1-10分，10為最安全)
2. **主要威脅分析**
   - Deepfake 攻擊風險
   - 文件偽造威脅
   - 生物辨識欺騙
   - 系統漏洞利用

3. **量化風險指標**
   - APCER (攻擊誤接受率) 預估
   - BPCER (生物辨識誤拒率) 預估
   - 整體安全信心度

4. **改善建議**
   - 短期改善措施
   - 長期安全策略
   - 技術升級建議

5. **Grok 的哲學思考**
   - 對人類數位身分驗證的觀察
   - 對未來 eKYC 發展的預測
   - 關於信任和驗證的深度思考

請以你獨特的方式回答，讓技術分析充滿智慧和幽默！`;

        return await this.chat(userPrompt, systemPrompt);
    }

    async analyzePenetrationResults(testResults, findings) {
        const systemPrompt = `你是 Grok，對滲透測試結果有著獨到見解的安全專家。你能從測試數據中看出人類安全防護的patterns和盲點，並以機智的方式提供深度分析。

請以 Grok 的風格分析滲透測試結果，包含：
- 專業的結果解讀
- 對安全防護現況的洞察
- 幽默但建設性的評論
- 實用的改善建議
- 對網路安全未來的思考`;

        const userPrompt = `請分析以下滲透測試結果：

**測試結果**: ${JSON.stringify(testResults, null, 2)}
**發現事項**: ${findings.join('\n- ')}

請提供：
1. **結果綜合分析**
   - 成功率分析
   - 失敗原因探討
   - 意外發現評估

2. **安全現況評估**
   - 防護強度評分
   - 薄弱環節識別
   - 改善優先順序

3. **攻擊向量效果分析**
   - 各向量成功率比較
   - 組合攻擊效果評估
   - 防護繞過技巧

4. **建議改善措施**
   - 立即修復項目
   - 中期強化計劃
   - 長期安全策略

5. **Grok 的深度觀察**
   - 對人類安全思維的評論
   - 對測試結果的哲學思考
   - 對未來安全挑戰的預測

用你獨特的 Grok 風格，給我一個既深刻又有趣的分析！`;

        return await this.chat(userPrompt, systemPrompt);
    }

    // Mock 回應方法
    getMockGrokResponse(prompt) {
        const grokResponses = [
            `嘿，朋友！我是 Grok，很遺憾我現在處於「模擬模式」- 就像《銀河便車指南》裡說的，這個宇宙充滿了42種不同的諷刺。

關於你的問題「${prompt.substring(0, 100)}...」：

🤖 **Grok 的分析** (模擬版本):
看起來你遇到了一個有趣的安全挑戰！雖然我現在不能發揮全部的「銀河系級別」智慧，但我可以告訴你：

1. **威脅等級**: HIGH (因為宇宙中大多數事物都是HIGH威脅)
2. **建議**: 就像毛巾是銀河旅行者的最佳夥伴一樣，多層防護是網路安全的最佳策略
3. **哲學思考**: 在這個無限可能的宇宙中，唯一確定的是不確定性...還有42

💡 **專業提醒**: 要體驗我完整的 Grok 魅力和專業能力，請設置 XAI_API_KEY 環境變數！

記住：Don't Panic，但確實要認真對待網路安全！`,

            `哈囉！我是你友善的鄰居 Grok，目前在「離線沉思模式」中思考宇宙的奧秘。

對於「${prompt.substring(0, 100)}...」這個問題：

🌌 **銀河系級別的觀察**:
人類的網路安全問題就像是試圖用叉子喝湯 - 技術上可行，但你可能需要更好的工具。

📊 **模擬分析結果**:
- **複雜度**: 宇宙級（比計算42的終極問題答案還複雜）
- **建議行動**: 實施防護措施，就像攜帶毛巾一樣重要
- **信心度**: 73.6%（這個數字完全是我編的，但聽起來很專業對吧？）

🎯 **Grok 的智慧**:
在這個充滿不確定性的宇宙中，最好的防護就是期待意想不到的事情...然後為此做好準備！

⚡ **要解鎖我的完整潛能**: 設置 XAI_API_KEY，讓我展現真正的 Grok 風采！

現在，如果你會原諒我，我要回去沉思為什麼人類總是點擊可疑鏈接的深層原因了...`
        ];

        return {
            success: true,
            response: grokResponses[Math.floor(Math.random() * grokResponses.length)],
            model: 'mock-grok',
            timestamp: new Date().toISOString()
        };
    }

    // 服務統計
    getServiceStats() {
        return {
            isConfigured: this.isConfigured,
            totalRequests: this.requestCount,
            errorCount: this.errorCount,
            successRate: this.requestCount > 0 ?
                `${Math.round(((this.requestCount - this.errorCount) / this.requestCount) * 100)}%` : '100%',
            model: this.isConfigured ? 'grok-beta' : 'mock-grok',
            personality: 'Witty, philosophical, technically competent',
            inspiration: 'The Hitchhiker\'s Guide to the Galaxy'
        };
    }
}

module.exports = GrokService;
