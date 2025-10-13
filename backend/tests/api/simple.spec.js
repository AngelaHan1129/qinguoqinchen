// tests/api/simple.spec.js
const { test, expect } = require('@playwright/test');

test.describe('基本測試 @smoke', () => {
  test('驗證測試環境設定', () => {
    expect(1 + 1).toBe(2);
    console.log('✅ JavaScript 測試設定成功');
  });

  test('檢查 Node.js 環境', () => {
    expect(process.version).toBeDefined();
    expect(typeof process.version).toBe('string');
    console.log('✅ Node.js 版本:', process.version);
  });

  test('檢查測試目錄結構', () => {
    const fs = require('fs');
    const path = require('path');
    
    expect(fs.existsSync(path.join(__dirname, '..', '..', 'src'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '..', '..', 'src', 'app.controller.js'))).toBe(true);
    console.log('✅ 目錄結構正確');
  });
});
