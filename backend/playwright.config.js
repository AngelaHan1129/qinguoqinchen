// playwright.config.js - 完善版本
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  testMatch: [
    '**/tests/**/*.spec.js',
    '**/tests/**/*.test.js'
  ],

  projects: [
    {
      name: 'api-tests',
      testMatch: '**/tests/api/**/*.spec.js',
    },
    {
      name: 'ai-services',
      testMatch: '**/tests/ai/**/*.spec.js',
    },
    {
      name: 'unit-tests',
      testMatch: '**/tests/unit/**/*.spec.js',
    }
  ],

  reporter: [
    ['line'],
    ['allure-playwright', {
      resultsDir: 'allure-results',
      detail: true,
      suiteTitle: true,
      environmentInfo: {
        'Framework': 'Playwright',
        'Language': 'JavaScript',
        'Test Environment': 'Mock Servers',
        'AI Services': 'VertexAI, RAG, Attack Detection'
      }
    }]
  ],

  timeout: 30000,
  expect: { timeout: 5000 },
  outputDir: 'test-results/',
  retries: process.env.CI ? 2 : 0,

  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  }
});
