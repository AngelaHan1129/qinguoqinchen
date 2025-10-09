// src/health/health.controller.js
const { Controller, Get } = require('@nestjs/common');
const { ApiTags, ApiOperation } = require('@nestjs/swagger');
const { RequestMethod } = require('@nestjs/common');

class HealthController {
  constructor(healthService) {
    this.healthService = healthService;
    console.log('🩺 HealthController 初始化完成');
  }

  getHealth() {
    return this.healthService.getSystemHealth();
  }
}

function setupHealthController() {
  // 控制器 metadata
  Reflect.defineMetadata('path', 'health', HealthController);
  Reflect.defineMetadata('__controller__', true, HealthController);
  
  // 依賴注入
  const { HealthService } = require('./health.service');
  Reflect.defineMetadata('design:paramtypes', [HealthService], HealthController);
  
  // 方法 metadata
  Reflect.defineMetadata('method', RequestMethod.GET, HealthController.prototype, 'getHealth');
  Reflect.defineMetadata('path', '', HealthController.prototype, 'getHealth');
  
  // Swagger metadata
  Reflect.defineMetadata('swagger/apiTags', ['系統管理'], HealthController);
  Reflect.defineMetadata('swagger/apiOperation', {
    summary: '系統健康檢查',
    description: '檢查系統運行狀態和效能指標'
  }, HealthController.prototype, 'getHealth');
  
  return HealthController;
}

module.exports = { HealthController: setupHealthController() };

