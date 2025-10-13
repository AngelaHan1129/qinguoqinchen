// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  // 指定測試目錄
  testDir: './tests',
  
  // 測試檔案模式
  testMatch: [
    '**/tests/**/*.spec.js',
    '**/tests/**/*.test.js'
  ],
  
  // 專案配置
  projects: [
    {
      name: 'unit',
      testMatch: '**/tests/api/**/*.spec.js'
    },
    {
      name: 'e2e',
      testMatch: '**/tests/e2e/**/*.spec.js'
    }
  ],
  
  // 報告配置
  reporter: [
    ['line'],
    ['allure-playwright', {
      resultsDir: 'allure-results',
      detail: true,
      suiteTitle: true
    }]
  ],
  
  // 全域設定
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  
  outputDir: 'test-results/',
  retries: 0
});
