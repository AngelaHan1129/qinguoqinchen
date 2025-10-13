// src/services/gemini-basic.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class BasicGeminiService {
  constructor() {
    // 檢查 API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('請在 .env 檔案中設定 GEMINI_API_KEY');
    }

    // 初始化 Gemini AI
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // 設定模型配置
    this.modelConfig = {
      temperature: 0.7,        // 創意程度 (0-1)
      topP: 0.8,              // 核心取樣
      topK: 40,               // 候選詞數量
      maxOutputTokens: 2048   // 最大輸出長度
    };

    // 初始化模型
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: this.modelConfig
    });

    console.log('✅ Gemini AI 服務已初始化');
  }

  // 基本文字生成
  async generateText(prompt) {
    try {
      console.log('🤖 發送請求到 Gemini...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini 回應成功');
      return {
        success: true,
        content: text,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Gemini API 錯誤:', error.message);
      throw error;
    }
  }

  // 對話式互動
  async startChat(history = []) {
    try {
      const chat = this.model.startChat({
        history: history,
        generationConfig: this.modelConfig
      });

      return {
        async sendMessage(message) {
          const result = await chat.sendMessage(message);
          const response = await result.response;
          return response.text();
        },
        
        async getHistory() {
          return await chat.getHistory();
        }
      };
    } catch (error) {
      console.error('❌ 建立對話失敗:', error.message);
      throw error;
    }
  }

  // 串流回應 (即時顯示結果)
  async generateStreamText(prompt) {
    try {
      const result = await this.model.generateContentStream(prompt);
      
      let fullText = '';
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        
        // 可以在這裡處理即時回應
        console.log('📝 即時回應:', chunkText);
      }
      
      return {
        success: true,
        content: fullText,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ 串流生成失敗:', error.message);
      throw error;
    }
  }
}

module.exports = BasicGeminiService;
