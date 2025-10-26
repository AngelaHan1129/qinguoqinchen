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

    // 在 GeminiService.js 中新增

    // ═══════════════════════════════════════════
    // ⭐ 核心方法 1: 基於 Grok 報告生成企業改善建議
    // ═══════════════════════════════════════════
    async generateEnterpriseRemediation(grokReport, ragContext = []) {
        this.requestCount++;

        if (!this.isConfigured || !this.ai) {
            return this.getMockEnterpriseRemediation(grokReport);
        }

        try {
            console.log('🛡️ [Gemini] 基於 Grok 報告生成企業改善建議...');

            const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

            // 構建 RAG 上下文
            const ragContextText = ragContext.length > 0
                ? ragContext.map((doc, i) => `
【參考文獻 ${i + 1}】
標題：${doc.title || '安全文檔'}
內容：${doc.content || doc.text || ''}
相關度：${doc.similarity || 'N/A'}
`).join('\n')
                : '（無額外參考文獻）';

            const prompt = `你是世界頂級的企業資訊安全顧問，專精於 eKYC 系統安全強化和合規性改善。

請基於以下紅隊滲透測試報告，為企業提供完整的改善建議：

【🔴 紅隊滲透測試報告（由 Grok AI 生成）】
${grokReport}

【📚 相關安全知識庫（RAG 檢索結果）】
${ragContextText}

請為企業提供以下內容的詳細改善建議：

# 🛡️ 企業安全改善建議報告

## 1. 執行摘要（Executive Summary）
- 當前安全態勢評估
- 主要風險識別
- 改善優先順序概覽
- 預估投資回報率 (ROI)

## 2. 立即修復措施（Immediate Actions - 1-3 天內）
針對報告中的 CRITICAL 和 HIGH 風險，提供：
- **問題描述**：具體的安全漏洞
- **業務影響**：如果不修復的潛在損失
- **修復方案**：詳細的技術步驟
- **所需資源**：人力、時間、預算
- **驗證方法**：如何確認修復成功

### 2.1 人臉辨識系統強化
### 2.2 活體檢測機制升級
### 2.3 證件驗證流程加固

## 3. 短期改善計畫（1-4 週內）
- **技術架構優化**
- **AI 檢測系統部署**
- **監控告警機制建立**
- **員工安全培訓**

## 4. 中期戰略升級（1-3 個月）
- **完整安全框架建立**
- **多層防禦體系**
- **自動化檢測系統**
- **持續改進機制**

## 5. 量化改善指標
基於報告中的 APCER、BPCER、ACER 等指標，提供：
- **當前指標**：現況分析
- **目標指標**：改善後預期
- **改善幅度**：量化提升百分比
- **達成時程**：預估達成時間

### 目標設定
- APCER：從 X% 降低至 ≤3%
- BPCER：從 X% 降低至 ≤5%
- ACER：整體改善 X%
- 系統韌性：提升 X%

## 6. 技術實施方案
針對報告中提到的每個攻擊向量，提供對應的防護措施：

### 6.1 對抗 AI 生成攻擊（StyleGAN3、DALL·E）
- **檢測技術**：Deepfake 檢測模型部署
- **防護層級**：多模態驗證機制
- **實施步驟**：1. 2. 3. 4. 5.

### 6.2 活體檢測強化（對抗 SimSwap）
- **3D 深度感測**：硬體設備升級
- **挑戰-反應機制**：隨機動作驗證
- **實施步驟**：1. 2. 3. 4. 5.

### 6.3 證件驗證加固（對抗偽造文件）
- **區塊鏈驗證**：不可竄改記錄
- **多源交叉驗證**：政府資料庫串接
- **實施步驟**：1. 2. 3. 4. 5.

## 7. 合規性對應
基於報告的風險等級，對應相關法規要求：

### 7.1 ISO 27001 控制措施
- A.9 存取控制
- A.12 營運安全
- A.14 系統取得、開發及維護

### 7.2 金融監管合規
- 金融監督管理委員會規範
- 個人資料保護法遵循
- 洗錢防制法要求

### 7.3 國際標準對應
- NIST Cybersecurity Framework
- OWASP ASVS (Application Security Verification Standard)
- PCI DSS (如涉及支付)

## 8. 成本效益分析
- **總投資預算**：新台幣 X - Y 萬元
- **分階段投入**：
  - 立即措施：X 萬元
  - 短期計畫：Y 萬元
  - 中期升級：Z 萬元
- **預期效益**：
  - 風險降低：X%
  - 合規達成率：Y%
  - 潛在損失避免：Z 萬元/年
- **投資回報期**：X 個月

## 9. 風險管理矩陣
將報告中的所有風險按照「發生機率 × 影響程度」排序：

| 風險項目 | 當前等級 | 改善後等級 | 優先順序 | 預估工期 |
|---------|---------|-----------|---------|---------|
| ... | ... | ... | ... | ... |

## 10. 實施路線圖（Roadmap）

### Phase 1：緊急處理（Week 1）
- [ ] 任務 1
- [ ] 任務 2
- [ ] 任務 3

### Phase 2：基礎強化（Week 2-4）
- [ ] 任務 1
- [ ] 任務 2
- [ ] 任務 3

### Phase 3：系統升級（Month 2-3）
- [ ] 任務 1
- [ ] 任務 2
- [ ] 任務 3

### Phase 4：持續改進（Ongoing）
- [ ] 定期滲透測試
- [ ] 安全態勢監控
- [ ] 威脅情報更新

## 11. 關鍵成功因素
- **高層支持**：確保預算和資源
- **跨部門協作**：技術、業務、法務配合
- **專業團隊**：引入外部專家輔導
- **持續投入**：安全是持續的過程

## 12. 監控與驗證機制
- **KPI 設定**：量化改善指標
- **定期檢視**：每月安全會議
- **第三方稽核**：獨立驗證成效
- **持續測試**：定期紅隊演練

請提供專業、可執行、符合台灣法規環境的建議。
每項建議都要包含具體步驟、時程、預算、負責單位。`;

            const result = await model.generateContent(prompt);
            const response = await result.response;

            console.log('✅ [Gemini] 企業改善建議生成成功');

            return {
                success: true,
                remediationPlan: response.text(),
                model: 'gemini-2.5-flash',
                ragSourcesUsed: ragContext.length,
                confidence: this.calculateConfidence(ragContext.length),
                timestamp: new Date().toISOString(),
                tokenUsage: this.estimateTokenUsage(prompt, response.text())
            };

        } catch (error) {
            this.errorCount++;
            console.error('❌ [Gemini] 企業改善建議生成失敗:', error.message);
            return this.getMockEnterpriseRemediation(grokReport);
        }
    }

    // ═══════════════════════════════════════════
    // ⭐ 核心方法 2: 基於 Grok 攻擊建議生成防禦策略
    // ═══════════════════════════════════════════
    async generateDefenseStrategy(grokAttackRecommendations, ragContext = []) {
        this.requestCount++;

        if (!this.isConfigured || !this.ai) {
            return this.getMockDefenseStrategy(grokAttackRecommendations);
        }

        try {
            console.log('🛡️ [Gemini] 基於 Grok 攻擊建議生成防禦策略...');

            const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const ragContextText = ragContext.length > 0
                ? ragContext.map((doc, i) => `【參考 ${i + 1}】${doc.title}: ${doc.content}`).join('\n')
                : '（無額外參考）';

            const prompt = `你是企業資訊安全防禦專家，請基於紅隊的攻擊建議，制定對應的防禦策略。

【🔴 紅隊下次攻擊建議（由 Grok AI 生成）】
${grokAttackRecommendations}

【📚 安全知識庫參考】
${ragContextText}

請提供防禦策略：

# 🛡️ 防禦策略與對策

## 1. 威脅情報分析
- 識別紅隊建議中的關鍵攻擊路徑
- 評估每個攻擊向量的真實威脅程度
- 預測攻擊時機和方法

## 2. 防禦優先順序
基於紅隊建議，按優先順序部署防禦：

### 🔴 Priority 1 (Critical)
針對紅隊「優先攻擊向量」的防禦

### 🟠 Priority 2 (High)
針對「攻擊組合」的防禦

### 🟡 Priority 3 (Medium)
針對「繞過技巧」的對策

## 3. 具體防禦措施
針對報告中提到的每個攻擊策略，提供對應防禦：

### 3.1 檢測機制強化
### 3.2 預警系統建立
### 3.3 反制技術部署

## 4. 實施時程與資源
- 立即部署項目
- 短期強化項目
- 中期戰略項目

請提供可執行的專業建議。`;

            const result = await model.generateContent(prompt);
            const response = await result.response;

            return {
                success: true,
                defenseStrategy: response.text(),
                model: 'gemini-2.5-flash',
                ragSourcesUsed: ragContext.length,
                confidence: this.calculateConfidence(ragContext.length),
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            this.errorCount++;
            console.error('❌ [Gemini] 防禦策略生成失敗:', error.message);
            return this.getMockDefenseStrategy(grokAttackRecommendations);
        }
    }

    // ═══════════════════════════════════════════
    // 輔助方法
    // ═══════════════════════════════════════════

    calculateConfidence(ragSourcesCount) {
        // 基於 RAG 來源數量計算信心度
        if (ragSourcesCount >= 5) return 0.95;
        if (ragSourcesCount >= 3) return 0.85;
        if (ragSourcesCount >= 1) return 0.75;
        return 0.6; // 無 RAG 來源時的基準信心度
    }

    getMockEnterpriseRemediation(grokReport) {
        return {
            success: true,
            remediationPlan: `# 🛡️ 企業安全改善建議（模擬）

## 1. 執行摘要
基於滲透測試報告，系統存在可改善的安全漏洞。

## 2. 立即修復措施
- 升級活體檢測機制
- 強化證件驗證流程
- 部署 AI 檢測系統

## 3. 改善時程
- Week 1-2: 緊急修復
- Month 1-2: 系統強化
- Month 3+: 持續改進

⚠️ 此為模擬建議。請設定 GEMINI_API_KEY 以使用完整 AI 功能。`,
            model: 'mock-gemini',
            ragSourcesUsed: 0,
            confidence: 0.5,
            timestamp: new Date().toISOString()
        };
    }

    getMockDefenseStrategy(grokAttackRecommendations) {
        return {
            success: true,
            defenseStrategy: `# 🛡️ 防禦策略（模擬）

## 威脅分析
基於紅隊建議，識別主要威脅向量。

## 防禦措施
- 多層防護部署
- 實時監控系統
- 異常行為檢測

⚠️ 此為模擬策略。請設定 GEMINI_API_KEY 以使用完整 AI 功能。`,
            model: 'mock-gemini',
            ragSourcesUsed: 0,
            confidence: 0.5,
            timestamp: new Date().toISOString()
        };
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
