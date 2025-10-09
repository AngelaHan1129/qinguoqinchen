// src/app.module.js
const { Module } = require('@nestjs/common');
const { AppController } = require('./app.controller');
const { AppService } = require('./app.service');

// 基本模組，避免複雜依賴
let HealthModule, AttackModule, SystemModule;

class AppModule {
  static async forRoot() {
    // 動態載入避免循環依賴
    try {
      const healthModule = require('./health/health.module');
      HealthModule = healthModule.HealthModule;
    } catch (error) {
      console.log('⚠️ HealthModule 載入失敗，將跳過');
    }

    try {
      const attackModule = require('./attack/attack.module');
      AttackModule = attackModule.AttackModule;
    } catch (error) {
      console.log('⚠️ AttackModule 載入失敗，將跳過');
    }

    return AppModule;
  }
}

// 基本模組設定
Reflect.defineMetadata('controllers', [AppController], AppModule);
Reflect.defineMetadata('providers', [AppService], AppModule);
Reflect.defineMetadata('imports', [], AppModule);

module.exports = { AppModule };
