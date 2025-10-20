// src/attack/attack.module.js
const { Module } = require('@nestjs/common');

// 延遲載入避免循環依賴
let AttackController, AttackService, VectorService, MetricsService;

class AttackModule {
  static async forRoot() {
    // 動態載入模組
    if (!AttackController) {
      const attackController = require('./attack.controller');
      const attackService = require('./attack.service');
      const vectorService = require('./vector.service');
      const metricsService = require('./metrics.service');
      
      AttackController = attackController.AttackController;
      AttackService = attackService.AttackService;
      VectorService = vectorService.VectorService;
      MetricsService = metricsService.MetricsService;
    }
    
    return AttackModule;
  }
}

// 設定模組裝飾器
Reflect.defineMetadata('controllers', [
  () => require('./attack.controller').AttackController
], AttackModule);

Reflect.defineMetadata('providers', [
  () => require('./attack.service').AttackService,
  () => require('./vector.service').VectorService,
  () => require('./metrics.service').MetricsService
], AttackModule);

module.exports = { AttackModule };
