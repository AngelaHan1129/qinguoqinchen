// src/main.js - 最小修改版本
require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const express = require('express');
require('dotenv').config();

// 導入服務
const ServiceFactory = require('./factories/ServiceFactory');
const RouteManager = require('./routes/index');

async function bootstrap() {
  try {
    console.log('🚀 啟動侵國侵城 AI 滲透測試系統...');

    // 建立一個最小的 AppModule
    class AppModule { }
    Reflect.defineMetadata('imports', [], AppModule);
    Reflect.defineMetadata('controllers', [], AppModule);
    Reflect.defineMetadata('providers', [], AppModule);

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
      cors: true
    });

    // 獲取底層的 Express 應用
    const expressInstance = app.getHttpAdapter().getInstance();

    // 確保 JSON 解析
    expressInstance.use(express.json());
    expressInstance.use(express.urlencoded({ extended: true }));

    // 手動建立服務實例
    const services = ServiceFactory.createAllServices();

    // 註冊路由 - 使用靜態方法
    RouteManager.registerAllRoutes(expressInstance, services);

    // 啟動伺服器
    const port = process.env.PORT || 7939;
    await app.listen(port);

    console.log(`✅ 系統啟動成功！埠口：${port}`);
    console.log(`📍 主頁: http://localhost:${port}`);
    console.log(`📚 API 文檔: http://localhost:${port}/api/docs`); // 新增這行
    console.log(`🎯 健康檢查: http://localhost:${port}/health`);

  } catch (error) {
    console.error('❌ 系統啟動失敗:', error.message);
    process.exit(1);
  }
}

bootstrap();
