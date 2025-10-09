// src/attack/attack.controller.js
const { Controller, Get, Post, Body } = require('@nestjs/common');
const { ApiTags, ApiOperation } = require('@nestjs/swagger');
const { RequestMethod } = require('@nestjs/common');

class AttackController {
  constructor(attackService) {
    this.attackService = attackService;
    console.log('⚔️ AttackController 初始化完成');
  }

  async getVectors() {
    return this.attackService.getAllVectors();
  }

  async executeAttack(body) {
    return this.attackService.executeAttack(body);
  }
}

function setupAttackController() {
  // 控制器 metadata
  Reflect.defineMetadata('path', 'ai-attack', AttackController);
  Reflect.defineMetadata('__controller__', true, AttackController);
  
  // 依賴注入
  const { AttackService } = require('./attack.service');
  Reflect.defineMetadata('design:paramtypes', [AttackService], AttackController);
  
  // getVectors 方法
  Reflect.defineMetadata('method', RequestMethod.GET, AttackController.prototype, 'getVectors');
  Reflect.defineMetadata('path', 'vectors', AttackController.prototype, 'getVectors');
  
  // executeAttack 方法
  Reflect.defineMetadata('method', RequestMethod.POST, AttackController.prototype, 'executeAttack');
  Reflect.defineMetadata('path', 'execute', AttackController.prototype, 'executeAttack');
  
  // Swagger metadata
  Reflect.defineMetadata('swagger/apiTags', ['AI 攻擊'], AttackController);
  
  Reflect.defineMetadata('swagger/apiOperation', {
    summary: '獲取攻擊向量列表',
    description: '返回所有可用的 AI 攻擊向量和推薦組合'
  }, AttackController.prototype, 'getVectors');
  
  Reflect.defineMetadata('swagger/apiOperation', {
    summary: '執行 AI 攻擊測試',
    description: '執行指定的攻擊向量進行滲透測試'
  }, AttackController.prototype, 'executeAttack');
  
  return AttackController;
}

module.exports = { AttackController: setupAttackController() };

