const { Injectable } = require('@nestjs/common');
const OpenAI = require('openai');
require('dotenv').config();

@Injectable()
class GrokService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: "https://api.x.ai/v1"
    });
  }

  async chat(prompt, systemPrompt = "你是 Grok，一個幽默且專業的 AI 助手，受《銀河便車指南》啟發。") {
    try {
      console.log('🤖 Grok AI 處理中...');
      
      const completion = await this.client.chat.completions.create({
        model: "grok-4-latest",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
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
      console.error('❌ Grok API 錯誤:', error);
      throw new Error(`Grok API 調用失敗: ${error.message}`);
    }
  }

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
  }

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

  async optimizeAttackStrategy(currentVectors, intensity = 'medium') {
    const systemPrompt = `
你是 Grok，攻擊策略優化專家。
請用幽默但專業的方式提供優化建議。
`;

    const userPrompt = `
侵國侵城系統攻擊策略優化：

當前攻擊向量：${currentVectors.join(', ')}
攻擊強度：${intensity}

向量說明：
- A1: StyleGAN3 偽造真人自拍
- A2: StableDiffusion 翻拍攻擊
- A3: SimSwap 即時換臉
- A4: Diffusion+GAN 偽造護照
- A5: DALL·E 生成假證件

請提供：
1. 最佳執行順序
2. 向量組合建議
3. 參數調整策略
4. 成功率提升方法
5. 風險控制措施
6. 備用執行方案

用《銀河便車指南》的邏輯來解釋最優策略。
`;

    return await this.chat(userPrompt, systemPrompt);
  }
}

module.exports = { GrokService };
