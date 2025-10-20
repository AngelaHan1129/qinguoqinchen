const { Injectable } = require('@nestjs/common');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

@Injectable()
class GeminiService {
  constructor() {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`
    this.ai = new GoogleGenAI({});
  }

  async generateAttackVector(prompt) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `你是一個AI滲透測試專家。請基於以下情境生成攻擊向量建議：${prompt}`,
      });
      
      return {
        text: response.text,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Gemini API 錯誤:', error);
      throw new Error(`Gemini AI 攻擊向量生成失敗: ${error.message}`);
    }
  }

  async analyzeEkycVulnerability(targetSystem, attackType) {
    try {
      const prompt = `
      分析 eKYC 系統安全漏洞：
      - 目標系統：${targetSystem}
      - 攻擊類型：${attackType}
      - 請提供具體的滲透測試建議
      - 包含風險評估和防護建議
      `;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      
      return {
        vulnerability_analysis: response.text,
        system: targetSystem,
        attack_type: attackType,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ eKYC 漏洞分析失敗:', error);
      throw new Error(`eKYC 漏洞分析失敗: ${error.message}`);
    }
  }

  async generateDeepfakePrompt(scenario) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
        生成 Deepfake 攻擊場景的詳細提示詞：
        場景：${scenario}
        
        請提供：
        1. StyleGAN3 參數設定
        2. 攻擊執行步驟
        3. 成功率預估
        4. 防護對策建議
        `,
      });
      
      return {
        deepfake_prompt: response.text,
        scenario: scenario,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Deepfake 提示生成失敗:', error);
      throw new Error(`Deepfake 提示生成失敗: ${error.message}`);
    }
  }

  async optimizeAttackStrategy(vectorIds, intensity) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
        優化 AI 攻擊策略：
        - 攻擊向量：${vectorIds.join(', ')}
        - 攻擊強度：${intensity}
        
        請提供：
        1. 最佳執行順序
        2. 參數調整建議
        3. 成功率提升方法
        4. 風險緩解策略
        `,
      });
      
      return {
        optimized_strategy: response.text,
        vectors: vectorIds,
        intensity: intensity,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ 攻擊策略優化失敗:', error);
      throw new Error(`攻擊策略優化失敗: ${error.message}`);
    }
  }
}

module.exports = { GeminiService };
