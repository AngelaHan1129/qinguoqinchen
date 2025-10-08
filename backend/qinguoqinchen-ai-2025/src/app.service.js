const { Injectable } = require('@nestjs/common');

const AppServiceClass = class {
  getHello() {
    return {
      message: '侵國侵城 AI 滲透測試系統已啟動',
      version: '1.0.0',
      capabilities: [
        'AI 攻擊模擬',
        'eKYC 滲透測試',
        '系統健康監控'
      ]
    };
  }

  getSystemInfo() {
    return {
      name: '侵國侵城',
      description: 'AI 紅隊多模態滲透測試與防禦評估系統',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  }
};

const AppService = Injectable()(AppServiceClass);

module.exports = { AppService };
