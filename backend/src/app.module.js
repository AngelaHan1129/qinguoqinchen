// src/app.module.js
const { Module } = require('@nestjs/common');
const { ConfigModule } = require('@nestjs/config');

// 導入控制器和服務
const { AppController } = require('./app.controller');
const { AppService } = require('./app.service');

// 基本模組變數，避免複雜依賴
let HealthModule, AttackModule, GeminiModule, RagModule, DatabaseModule, Neo4jModule, IngestModule, ReportModule;

console.log('🔧 正在載入 AppModule...');

class AppModule {
  static async forRoot() {
    console.log('📦 開始動態載入模組...');

    // 動態載入避免循環依賴
    try {
      const healthModule = require('./health/health.module');
      HealthModule = healthModule.HealthModule;
      console.log('✅ HealthModule 載入成功');
    } catch (error) {
      console.log('⚠️ HealthModule 載入失敗，將跳過:', error.message);
    }

    try {
      const attackModule = require('./attack/attack.module');
      AttackModule = attackModule.AttackModule;
      console.log('✅ AttackModule 載入成功');
    } catch (error) {
      console.log('⚠️ AttackModule 載入失敗，將跳過:', error.message);
    }

    try {
      const geminiModule = require('./gemini/gemini.module');
      GeminiModule = geminiModule.GeminiModule;
      console.log('✅ GeminiModule 載入成功');
    } catch (error) {
      console.log('⚠️ GeminiModule 載入失敗，將跳過:', error.message);
    }

    // 新增 RAG 模組載入
    try {
      const ragModule = require('./rag/rag.module');
      RagModule = ragModule.RagModule;
      console.log('✅ RagModule 載入成功');
    } catch (error) {
      console.log('⚠️ RagModule 載入失敗，將跳過:', error.message);
    }

    // 新增資料庫模組載入
    try {
      const databaseModule = require('./database/database.module');
      DatabaseModule = databaseModule.DatabaseModule;
      console.log('✅ DatabaseModule 載入成功');
    } catch (error) {
      console.log('⚠️ DatabaseModule 載入失敗，將跳過:', error.message);
    }

    // 新增 Neo4j 模組載入
    try {
      const neo4jModule = require('./neo4j/neo4j.module');
      Neo4jModule = neo4jModule.Neo4jModule;
      console.log('✅ Neo4jModule 載入成功');
    } catch (error) {
      console.log('⚠️ Neo4jModule 載入失敗，將跳過:', error.message);
    }

    // 新增文檔匯入模組載入
    try {
      const ingestModule = require('./ingest/ingest.module');
      IngestModule = ingestModule.IngestModule;
      console.log('✅ IngestModule 載入成功');
    } catch (error) {
      console.log('⚠️ IngestModule 載入失敗，將跳過:', error.message);
    }

    // 新增報告生成模組載入
    try {
      const reportModule = require('./report/report.module');
      ReportModule = reportModule.ReportModule;
      console.log('✅ ReportModule 載入成功');
    } catch (error) {
      console.log('⚠️ ReportModule 載入失敗，將跳過:', error.message);
    }

    console.log('📋 模組載入完成，開始配置 AppModule...');
    return AppModule;
  }

  static getLoadedModules() {
    const loadedModules = [];

    if (HealthModule) loadedModules.push('Health');
    if (AttackModule) loadedModules.push('Attack');
    if (GeminiModule) loadedModules.push('Gemini');
    if (RagModule) loadedModules.push('RAG');
    if (DatabaseModule) loadedModules.push('Database');
    if (Neo4jModule) loadedModules.push('Neo4j');
    if (IngestModule) loadedModules.push('Ingest');
    if (ReportModule) loadedModules.push('Report');

    return loadedModules;
  }

  static getModuleCount() {
    return this.getLoadedModules().length;
  }
}

// 建立導入清單
const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env.local', '.env'],
    cache: true,
    expandVariables: true,
    validationOptions: {
      allowUnknown: true,
      abortEarly: false,
    },
  })
];

// 動態添加模組到導入清單
console.log('🔗 開始動態添加模組...');

if (HealthModule) {
  imports.push(HealthModule);
  console.log('📌 已添加 HealthModule');
}

if (AttackModule) {
  imports.push(AttackModule);
  console.log('📌 已添加 AttackModule');
}

if (GeminiModule) {
  imports.push(GeminiModule);
  console.log('📌 已添加 GeminiModule');
}

if (RagModule) {
  imports.push(RagModule);
  console.log('📌 已添加 RagModule');
}

if (DatabaseModule) {
  imports.push(DatabaseModule);
  console.log('📌 已添加 DatabaseModule');
}

if (Neo4jModule) {
  imports.push(Neo4jModule);
  console.log('📌 已添加 Neo4jModule');
}

if (IngestModule) {
  imports.push(IngestModule);
  console.log('📌 已添加 IngestModule');
}

if (ReportModule) {
  imports.push(ReportModule);
  console.log('📌 已添加 ReportModule');
}

// 建立 providers 陣列
const providers = [AppService];

// 建立 controllers 陣列
const controllers = [AppController];

// 設定模組元數據
Reflect.defineMetadata('imports', imports, AppModule);
Reflect.defineMetadata('controllers', controllers, AppModule);
Reflect.defineMetadata('providers', providers, AppModule);

// 添加模組配置統計
const moduleStats = {
  totalImports: imports.length,
  coreModules: 1, // ConfigModule
  featureModules: imports.length - 1,
  loadedModules: AppModule.getLoadedModules(),
  availableFeatures: [
    '基礎健康檢查 (Health)',
    'AI 攻擊向量 (Attack)',
    'Gemini AI 整合 (Gemini)',
    'RAG 檢索增強生成 (RAG)',
    '資料庫管理 (Database)',
    '知識圖譜 (Neo4j)',
    '文檔匯入 (Ingest)',
    '報告生成 (Report)'
  ].slice(0, AppModule.getModuleCount()),
  timestamp: new Date().toISOString()
};

console.log(`📊 AppModule 配置完成！`);
console.log(`📦 總計載入 ${moduleStats.totalImports} 個模組`);
console.log(`🎯 核心模組: ${moduleStats.coreModules} 個`);
console.log(`⚡ 功能模組: ${moduleStats.featureModules} 個`);
console.log(`🔥 已載入功能: ${moduleStats.loadedModules.join(', ')}`);

// 環境驗證
const requiredEnvVars = [
  'GEMINI_API_KEY',
  'DATABASE_URL',
  'NEO4J_URI',
  'NEO4J_USERNAME',
  'NEO4J_PASSWORD',
  'REDIS_URL',
  'PYTHON_AI_URL'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.log('⚠️ 缺少環境變數:', missingEnvVars.join(', '));
  console.log('💡 請檢查 .env 檔案配置');
} else {
  console.log('✅ 所有必要環境變數已配置');
}

// 導出模組統計資訊供其他地方使用
AppModule.moduleStats = moduleStats;

module.exports = { AppModule };
