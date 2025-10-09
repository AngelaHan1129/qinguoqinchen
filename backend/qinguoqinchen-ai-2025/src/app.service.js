// src/app.service.js
class AppService {
  constructor() {
    console.log('🔧 AppService 初始化完成');
  }

  getSystemInfo() {
    return {
      message: '🛡️ 歡迎使用侵國侵城 AI 滲透測試系統',
      version: '1.0.0',
      status: 'operational',
      framework: 'NestJS + Express (JavaScript)',
      timestamp: new Date().toISOString(),
      description: '本系統專為 eKYC 安全測試設計，整合多種生成式 AI 技術',
      capabilities: [
        '多模態 AI 攻擊模擬 (StyleGAN3, Stable Diffusion, SimSwap, DALL·E)',
        '智能滲透測試',
        '量化安全評估 (APCER, BPCER, ACER, EER)',
        'AI 驅動的防禦建議',
        '自動化報告生成'
      ],
      endpoints: {
        health: '/health',
        attackVectors: '/ai-attack/vectors',
        executeAttack: 'POST /ai-attack/execute',
        comboAttack: 'POST /ai-attack/combo',
        systemStats: '/system/stats',
        apiDocs: '/api/docs'
      }
    };
  }
}

module.exports = { AppService };
