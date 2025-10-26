// src/services/GrokService.js - 完整版（含兩個新方法）
class GrokService {
    constructor() {
        this.client = null;
        this.isConfigured = !!process.env.XAI_API_KEY;
        this.requestCount = 0;
        this.errorCount = 0;

        if (this.isConfigured) {
            this.initializeGrokClient();
        } else {
            console.log('⚠️ Grok API 未配置（使用模擬模式）');
        }
    }

    async initializeGrokClient() {
        try {
            const OpenAI = require('openai');

            this.client = new OpenAI({
                apiKey: process.env.XAI_API_KEY,
                baseURL: 'https://api.x.ai/v1'
            });

            console.log('✅ Grok AI 客戶端初始化成功');
        } catch (error) {
            console.log('⚠️ OpenAI SDK 未安裝');
            console.log('請執行: npm install openai');
            this.isConfigured = false;
        }
    }

    // ═══════════════════════════════════════════
    // ⭐ 新方法 1: 生成完整滲透測試報告
    // ═══════════════════════════════════════════
    async generatePentestReport(attackResults, zapResults, systemContext) {
        console.log('📊 [GrokService] 生成完整滲透測試報告...');

        const systemPrompt = `你是世界頂級的資訊安全專家和滲透測試報告撰寫專家。請使用繁體中文撰寫專業報告。`;

        const userPrompt = `請基於以下滲透測試結果，生成一份完整的專業滲透測試報告：

【測試執行摘要】
- 總攻擊次數：${attackResults.summary?.totalAttacks || 0}
- 成功攻擊：${attackResults.summary?.successfulAttacks || 0}
- 整體成功率：${attackResults.summary?.overallSuccessRate || '0%'}
- 風險等級：${attackResults.summary?.riskLevel || 'UNKNOWN'}

【攻擊向量測試結果】
${attackResults.results?.map((r, i) => `
${i + 1}. ${r.vectorName || 'Unknown'} (${r.vectorId || 'N/A'})
   - 成功: ${r.success ? '是' : '否'}
   - 信心度: ${(r.confidence * 100).toFixed(1)}%
   - 繞過得分: ${r.bypassScore || 0}
`).join('\n')}

${systemContext ? `【目標系統】
- 類型: ${systemContext.type}
- 版本: ${systemContext.version}
- 產業: ${systemContext.industry}` : ''}

請生成包含以下部分的完整報告：

# 📋 滲透測試報告

## 1. 執行摘要
## 2. 測試範圍與方法
## 3. 詳細發現（每個成功的攻擊向量）
## 4. 風險評估與量化指標
## 5. 修復建議（依優先順序）
## 6. 長期安全策略

請以專業、清晰、可執行的方式撰寫。`;

        return await this.chat(userPrompt, systemPrompt);
    }

    // ═══════════════════════════════════════════
    // ⭐ 新方法 2: 生成下次攻擊建議
    // ═══════════════════════════════════════════
    async generateNextAttackRecommendations(attackResults, zapResults, previousAttempts = []) {
        console.log('⚔️ [GrokService] 生成下次攻擊建議（紅隊視角）...');

        const systemPrompt = `你是一位經驗豐富的紅隊滲透測試專家。請用繁體中文提供實戰導向的攻擊建議。`;

        const successfulAttacks = attackResults.results?.filter(r => r.success) || [];
        const failedAttacks = attackResults.results?.filter(r => !r.success) || [];

        const userPrompt = `基於以下滲透測試結果，為紅隊提供下次攻擊的策略建議：

【本次測試結果統計】
- 總攻擊次數：${attackResults.results?.length || 0}
- 成功攻擊：${successfulAttacks.length} 次
- 失敗攻擊：${failedAttacks.length} 次
- 整體成功率：${attackResults.summary?.overallSuccessRate || '0%'}

【成功的攻擊向量】
${successfulAttacks.map((a, i) => `${i + 1}. ${a.vectorName} - 成功率: ${(a.bypassScore * 100).toFixed(1)}%`).join('\n')}

【失敗的攻擊向量】
${failedAttacks.map((a, i) => `${i + 1}. ${a.vectorName} - 被檢測: ${a.detectionMethod || '未知'}`).join('\n')}

請提供下次攻擊建議：

# ⚔️ 紅隊下次攻擊策略

## 1. 🎯 優先攻擊向量（推薦前3個）
## 2. 💎 推薦攻擊組合（2-3個組合）
## 3. 🔧 繞過技巧（針對失敗的攻擊）
## 4. ⏰ 最佳攻擊時機
## 5. 🗺️ 多階段攻擊路徑（3-5個階段）
## 6. 📊 成功率預估

請提供實戰可行的建議。`;

        return await this.chat(userPrompt, systemPrompt);
    }

    // ═══════════════════════════════════════════
    // 基礎 Chat 方法（原有）
    // ═══════════════════════════════════════════
    async chat(prompt, systemPrompt = "You are Grok, a helpful AI assistant.") {
        this.requestCount++;

        if (!this.isConfigured || !this.client) {
            console.warn('⚠️ Grok API 未配置，返回模擬回應');
            return this.getMockGrokResponse(prompt);
        }

        try {
            console.log(`🤖 [Grok] 處理請求 #${this.requestCount}...`);

            const completion = await this.client.chat.completions.create({
                model: 'grok-3-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                stream: false,
                temperature: 0.7,
                max_tokens: 4000
            });

            console.log('✅ [Grok] 回應成功');

            return {
                success: true,
                response: completion.choices[0].message.content,
                model: 'grok-3-mini',
                usage: completion.usage,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            this.errorCount++;
            console.error('❌ [Grok] API 錯誤:', error.message);
            return this.getMockGrokResponse(prompt);
        }
    }

    // ═══════════════════════════════════════════
    // 模擬回應（當 API 不可用時）
    // ═══════════════════════════════════════════
    getMockGrokResponse(prompt) {
        console.log('🔄 [Grok] 使用模擬回應');

        if (prompt.includes('滲透測試報告') || prompt.includes('執行摘要')) {
            return {
                success: true,
                response: `# 📋 侵國侵城 AI 滲透測試報告

## 1. 執行摘要

本次滲透測試針對 eKYC 系統進行了全面的安全評估。

### 主要發現
- 🔴 **Critical**: 2 個高危漏洞
- 🟠 **High**: 3 個高風險問題
- 🟡 **Medium**: 5 個中等風險問題

### 整體風險等級
**HIGH** - 系統存在可被利用的重大安全漏洞

## 2. 詳細發現

### SimSwap 即時換臉攻擊（A3）
- **風險等級**: CRITICAL
- **成功率**: 89%
- **影響**: 可完全繞過人臉辨識系統

## 3. 修復建議
1. 升級活體檢測演算法
2. 實施 3D 深度分析
3. 加入挑戰反應機制

⚠️ 此為模擬報告。請設定 XAI_API_KEY 以使用 Grok AI 生成完整報告。`,
                model: 'mock-grok',
                timestamp: new Date().toISOString()
            };
        }

        if (prompt.includes('下次攻擊') || prompt.includes('紅隊') || prompt.includes('策略')) {
            return {
                success: true,
                response: `# ⚔️ 紅隊下次攻擊策略建議

## 1. 🎯 優先攻擊向量

### 第一優先：A3 - SimSwap
- **原因**: 成功率高達 89%
- **預期成功率**: 90-95%

### 第二優先：A4 - 證件偽造
- **原因**: 文件驗證漏洞
- **預期成功率**: 75-85%

## 2. 💎 推薦攻擊組合

### 鑽石組合：A3 + A4
- **預期成功率**: 94%
- **風險等級**: CRITICAL

⚠️ 此為模擬建議。請設定 XAI_API_KEY 以使用 Grok AI 生成完整建議。`,
                model: 'mock-grok',
                timestamp: new Date().toISOString()
            };
        }

        return {
            success: true,
            response: '⚠️ Grok API 未配置。請設定 XAI_API_KEY 環境變數。',
            model: 'mock-grok',
            timestamp: new Date().toISOString()
        };
    }

    // ═══════════════════════════════════════════
    // 服務統計
    // ═══════════════════════════════════════════
    getServiceStats() {
        return {
            isConfigured: this.isConfigured,
            totalRequests: this.requestCount,
            errorCount: this.errorCount,
            successRate: this.requestCount > 0 ?
                Math.round(((this.requestCount - this.errorCount) / this.requestCount) * 100) :
                100,
            model: this.isConfigured ? 'grok-3-mini' : 'mock-grok',
            personality: 'Red Team Expert & Security Report Writer'
        };
    }
}

module.exports = GrokService;
