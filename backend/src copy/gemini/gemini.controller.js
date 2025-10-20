const { Controller, Post, Get, Body } = require('@nestjs/common');
const { GeminiService } = require('./gemini.service');

@Controller('ai-gemini')
class GeminiController {
  constructor(geminiService) {
    this.geminiService = geminiService;
  }

  @Post('attack-vector')
  async generateAttackVector(@Body() body) {
    const { prompt } = body;

    if (!prompt) {
      return {
        success: false,
        error: '請提供攻擊場景描述 (prompt 參數)'
      };
    }

    try {
      return await this.geminiService.generateAttackVector(prompt);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('ekyc-analysis')
  async analyzeEkycVulnerability(@Body() body) {
    const { targetSystem, attackType } = body;

    if (!targetSystem || !attackType) {
      return {
        success: false,
        error: '請提供目標系統 (targetSystem) 和攻擊類型 (attackType)'
      };
    }

    try {
      return await this.geminiService.analyzeEkycVulnerability(targetSystem, attackType);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('deepfake-prompt')
  async generateDeepfakePrompt(@Body() body) {
    const { scenario } = body;

    if (!scenario) {
      return {
        success: false,
        error: '請提供 Deepfake 攻擊場景 (scenario)'
      };
    }

    try {
      return await this.geminiService.generateDeepfakePrompt(scenario);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('optimize-strategy')
  async optimizeAttackStrategy(@Body() body) {
    const { vectorIds = ['A1'], intensity = 'medium' } = body;

    try {
      return await this.geminiService.optimizeAttackStrategy(vectorIds, intensity);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('test')
  async testGeminiConnection() {
    try {
      const result = await this.geminiService.generateAttackVector("測試 AI 連接");
      return {
        success: true,
        message: "🤖 Gemini AI 連接成功！",
        result: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "❌ Gemini AI 連接失敗"
      };
    }
  }
}

module.exports = { GeminiController };
