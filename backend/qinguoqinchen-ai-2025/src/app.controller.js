import { Controller, Post, Body, Get } from '@nestjs/common';
import { AiAttackService } from './ai-attack/ai-attack.service.js';
import { ReportService } from './report/report.service.js';

@Controller('qinguoqinchen')
export class AppController {
  constructor(aiAttackService, reportService) {
    this.aiAttackService = aiAttackService;
    this.reportService = reportService;
  }

  @Post('penetration-test')
  async executePenetrationTest(@Body() testConfig) {
    const { vectors, combos, intensity = 'medium' } = testConfig;
    
    let results;
    if (combos && combos.length > 0) {
      results = await this.aiAttackService.executeComboAttack(combos);
    } else {
      results = await this.aiAttackService.executeMultiModalAttack(vectors || ['A1', 'A2', 'A3']);
    }

    // 生成詳細報告
    const report = await this.reportService.generatePenetrationReport(results);
    
    return {
      success: true,
      penetrationResults: results,
      securityReport: report,
      nextSteps: report.recommendations.recommendations.slice(0, 3)
    };
  }

  @Get('attack-vectors')
  getAvailableAttackVectors() {
    return {
      vectors: this.aiAttackService.attackVectors,
      recommendedCombos: [
        ['A2', 'A3'], // Deepfake + 翻拍
        ['A1', 'A4'], // 假自拍 + 假護照  
        ['A3', 'A5'], // 即時換臉 + 生成證件
        ['A2', 'A3', 'A5'] // 三重攻擊
      ]
    };
  }
}
