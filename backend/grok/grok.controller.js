const { Controller, Post, Get, Body } = require('@nestjs/common');
const { GrokService } = require('./grok.service');

@Controller('ai-grok')
class GrokController {
  constructor(grokService) {
    this.grokService = grokService;
  }

  @Get('test')
  async testGrok() {
    try {
      const result = await this.grokService.chat("說個關於程式設計師的笑話，並告訴我42的意義");
      return {
        success: true,
        message: "🛸 Grok AI 連接成功！",
        ...result
      };
    } catch (error) {
      return {
        success: false,
        message: "❌ Grok AI 連接失敗",
        error: error.message
      };
    }
  }

  @Post('chat')
  async chat(@Body() body) {
    const { prompt, systemPrompt } = body;
    
    if (!prompt) {
      return {
        success: false,
        error: '請提供對話內容 (prompt)'
      };
    }

    try {
      return await this.grokService.chat(prompt, systemPrompt);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('security-analysis')
  async analyzeSecurityThreat(@Body() body) {
    const { threatDescription, targetSystem } = body;
    
    if (!threatDescription || !targetSystem) {
      return {
        success: false,
        error: '請提供威脅描述 (threatDescription) 和目標系統 (targetSystem)'
      };
    }

    try {
      return await this.grokService.analyzeSecurityThreat(threatDescription, targetSystem);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('pentest-plan')
  async generatePentestPlan(@Body() body) {
    const { targetType, attackVectors } = body;
    
    if (!targetType) {
      return {
        success: false,
        error: '請提供目標系統類型 (targetType)'
      };
    }

    try {
      return await this.grokService.generatePentestPlan(targetType, attackVectors);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('optimize-strategy')
  async optimizeAttackStrategy(@Body() body) {
    const { vectorIds = ['A1', 'A3'], intensity = 'medium' } = body;

    try {
      return await this.grokService.optimizeAttackStrategy(vectorIds, intensity);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = { GrokController };
