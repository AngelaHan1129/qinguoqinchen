// src/app.controller.js
const { Controller, Get } = require('@nestjs/common');
const { ApiTags, ApiOperation, ApiResponse } = require('@nestjs/swagger');
const { RequestMethod } = require('@nestjs/common');

class AppController {
  constructor(appService) {
    this.appService = appService;
    console.log('🎮 AppController 初始化完成');
  }

  getSystemInfo() {
    return this.appService.getSystemInfo();
  }
}

// 正確的裝飾器設置方式
function setupControllerMetadata() {
  // 設置控制器基本 metadata
  Reflect.defineMetadata('path', '', AppController);
  Reflect.defineMetadata('__controller__', true, AppController);
  
  // 設置依賴注入
  const { AppService } = require('./app.service');
  Reflect.defineMetadata('design:paramtypes', [AppService], AppController);
  
  // 設置方法 metadata - 使用正確的 RequestMethod
  const getSystemInfoDescriptor = Object.getOwnPropertyDescriptor(AppController.prototype, 'getSystemInfo');
  
  // HTTP 方法設置
  Reflect.defineMetadata('method', RequestMethod.GET, AppController.prototype, 'getSystemInfo');
  Reflect.defineMetadata('path', '', AppController.prototype, 'getSystemInfo');
  
  // Swagger metadata
  Reflect.defineMetadata('swagger/apiTags', ['系統管理'], AppController);
  Reflect.defineMetadata('swagger/apiOperation', {
    summary: '系統首頁',
    description: '獲取侵國侵城 AI 滲透測試系統的基本資訊'
  }, AppController.prototype, 'getSystemInfo');
  
  return AppController;
}

module.exports = { AppController: setupControllerMetadata() };
