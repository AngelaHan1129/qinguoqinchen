// tests/api/app.controller.spec.js
const { test, expect } = require('@playwright/test');

// 確保 reflect-metadata 載入
require('reflect-metadata');

// 模擬 AppService
class MockAppService {
  getSystemInfo() {
    return {
      name: '侵國侵城 AI 紅隊多模態滲透測試與防禦評估系統',
      version: '0.0.1',
      status: 'running',
      timestamp: new Date().toISOString(),
      environment: 'test',
      features: [
        'AI 攻擊向量生成',
        'deepfake 檢測',
        'eKYC 系統測試',
        '多模態安全評估'
      ],
      endpoints: {
        health: '/health',
        docs: '/api/docs',
        attack: '/ai-attack',
        system: '/system'
      }
    };
  }
}

test.describe('AppController 單元測試 @unit', () => {
  let appController;
  let mockAppService;

  test.beforeEach(() => {
    // 設定模擬服務
    mockAppService = new MockAppService();
    
    // 載入 AppController
    const { AppController } = require('../../src/app.controller');
    appController = new AppController(mockAppService);
    
    console.log('✅ 測試環境初始化完成');
  });

  test('應該成功實例化 AppController', () => {
    expect(appController).toBeDefined();
    expect(appController.appService).toBe(mockAppService);
    expect(typeof appController.getSystemInfo).toBe('function');
  });

  test('getSystemInfo 應該返回系統資訊', () => {
    const result = appController.getSystemInfo();
    
    expect(result).toBeDefined();
    expect(result.name).toBe('侵國侵城 AI 紅隊多模態滲透測試與防禦評估系統');
    expect(result.version).toBe('0.0.1');
    expect(result.status).toBe('running');
    expect(result.environment).toBe('test');
  });

  test('getSystemInfo 應該返回正確的功能列表', () => {
    const result = appController.getSystemInfo();
    
    expect(Array.isArray(result.features)).toBe(true);
    expect(result.features).toContain('AI 攻擊向量生成');
    expect(result.features).toContain('deepfake 檢測');
    expect(result.features).toContain('eKYC 系統測試');
    expect(result.features).toContain('多模態安全評估');
  });

  test('getSystemInfo 應該返回正確的端點資訊', () => {
    const result = appController.getSystemInfo();
    
    expect(result.endpoints).toBeDefined();
    expect(result.endpoints.health).toBe('/health');
    expect(result.endpoints.docs).toBe('/api/docs');
    expect(result.endpoints.attack).toBe('/ai-attack');
    expect(result.endpoints.system).toBe('/system');
  });

  test('getSystemInfo 應該返回有效的時間戳', () => {
    const result = appController.getSystemInfo();
    
    expect(result.timestamp).toBeDefined();
    expect(typeof result.timestamp).toBe('string');
    expect(new Date(result.timestamp).getTime()).not.toBeNaN();
  });

  test('AppController 應該正確處理依賴注入', () => {
    // 測試不同的 AppService 實例
    const anotherMockService = {
      getSystemInfo: () => ({ customData: 'test' })
    };
    
    const { AppController } = require('../../src/app.controller');
    const anotherController = new AppController(anotherMockService);
    const result = anotherController.getSystemInfo();
    
    expect(result.customData).toBe('test');
  });
});

test.describe('AppController 錯誤處理測試', () => {
  test('應該正確處理 AppService 拋出的錯誤', () => {
    const errorService = {
      getSystemInfo: () => {
        throw new Error('服務暫時不可用');
      }
    };
    
    const { AppController } = require('../../src/app.controller');
    const controller = new AppController(errorService);
    
    expect(() => controller.getSystemInfo()).toThrow('服務暫時不可用');
  });
});
