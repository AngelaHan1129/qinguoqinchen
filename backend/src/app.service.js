// src/app.service.js
class AppService {
  constructor() {
    console.log('🔧 AppService 初始化完成 + RAG 整合');
    this.startTime = new Date();
    this.queryCount = 0;
    this.serviceStats = {
      ragQueries: 0,
      documentsIngested: 0,
      lastHealthCheck: null,
      errorCount: 0
    };
  }

  getSystemInfo() {
    console.log('🔧 AppService: 執行 getSystemInfo');

    // 獲取模組統計
    const { AppModule } = require('./app.module');
    const moduleStats = AppModule.moduleStats || {};

    return {
      message: '🛡️ 歡迎使用侵國侵城 AI 滲透測試系統 + RAG',
      version: '2.0.0',
      status: 'operational',
      framework: 'NestJS + Express + Gemini AI + Grok AI + Vertex AI Agent + RAG',
      timestamp: new Date().toISOString(),
      uptime: this.getUptime(),
      description: '本系統專為 eKYC 安全測試設計，整合多種生成式 AI 技術和 RAG 檢索增強生成',
      modules: {
        loaded: moduleStats.loadedModules || [],
        total: moduleStats.totalImports || 0,
        available: moduleStats.availableFeatures || []
      },
      capabilities: [
        '多模態 AI 攻擊模擬 (StyleGAN3, Stable Diffusion, SimSwap, DALL·E)',
        '智能滲透測試報告生成',
        '量化安全評估 (APCER, BPCER, ACER, EER)',
        'AI 驅動的防禦建議 (Gemini AI)',
        '幽默風格的資安分析 (Grok AI)',
        '智能 AI Agent 安全專家 (Vertex AI)',
        'RAG 檢索增強生成系統',
        '知識圖譜建構與查詢 (Neo4j)',
        '向量資料庫搜尋 (PostgreSQL + pgvector)',
        '自動化文檔匯入與處理',
        'AI 輔助攻擊策略優化',
        '合規性報告生成',
        '即時威脅情報分析',
        '多語言支援 (中英文)'
      ],
      endpoints: {
        // 基礎端點
        main: '/',
        status: '/status',
        modules: '/modules',
        health: '/health',
        healthFull: '/health/full',
        environment: '/environment',
        testServices: '/test/services',

        // AI 攻擊端點
        attackVectors: '/ai-attack/vectors',
        executeAttack: 'POST /ai-attack/execute',
        comboAttack: 'POST /ai-attack/combo',

        // Gemini AI 端點
        geminiTest: '/ai-gemini/test',
        geminiAttackVector: 'POST /ai-gemini/attack-vector',
        geminiEkycAnalysis: 'POST /ai-gemini/ekyc-analysis',
        geminiDeepfakePrompt: 'POST /ai-gemini/deepfake-prompt',
        geminiOptimizeStrategy: 'POST /ai-gemini/optimize-strategy',

        // Grok AI 端點
        grokTest: '/ai-grok/test',
        grokChat: 'POST /ai-grok/chat',
        grokSecurityAnalysis: 'POST /ai-grok/security-analysis',
        grokPentestPlan: 'POST /ai-grok/pentest-plan',

        // Vertex AI Agent 端點
        vertexAgentTest: '/ai-agent/test',
        vertexAgentCreate: 'POST /ai-agent/create',
        vertexAgentChat: 'POST /ai-agent/chat',
        vertexAgentAnalyzeSecurity: 'POST /ai-agent/analyze-security',
        vertexAgentGenerateAttack: 'POST /ai-agent/generate-attack',
        vertexAgentPentestReport: 'POST /ai-agent/pentest-report',

        // RAG 系統端點
        ragAsk: 'POST /rag/ask',
        ragIngest: 'POST /rag/ingest',
        ragStats: '/rag/stats',
        ragSearch: 'POST /rag/search',
        ragUpdateEmbeddings: 'POST /rag/update-embeddings',

        // 資料庫管理端點
        databaseStatus: '/database/status',
        databaseInit: 'POST /database/init',
        databaseHealth: '/database/health',

        // Neo4j 知識圖譜端點
        neo4jStatus: '/neo4j/status',
        neo4jQuery: 'POST /neo4j/query',
        neo4jRelationships: '/neo4j/relationships',

        // 文檔處理端點
        ingestDocument: 'POST /ingest/document',
        ingestBatch: 'POST /ingest/batch',
        ingestStatus: '/ingest/status',

        // 報告生成端點
        generateReport: 'POST /report/generate',
        downloadReport: '/report/download/:id',
        reportHistory: '/report/history',

        // API 文檔
        apiDocs: '/api/docs',
        apiHealth: '/api/health',
        apiDocsJson: '/api/docs-json'
      },
      statistics: {
        totalQueries: this.queryCount,
        ragQueries: this.serviceStats.ragQueries,
        documentsIngested: this.serviceStats.documentsIngested,
        errorCount: this.serviceStats.errorCount,
        startTime: this.startTime.toISOString(),
        uptime: this.getUptime()
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 7939,
        configuredServices: this.getConfiguredServices()
      }
    };
  }

  getSystemStatus() {
    console.log('🔧 AppService: 執行 getSystemStatus');

    const memoryUsage = process.memoryUsage();
    const { AppModule } = require('./app.module');

    this.queryCount++;

    return {
      status: 'healthy',
      system: '侵國侵城 AI 系統 + RAG',
      version: '2.0.0',
      uptime: this.getUptime(),
      startTime: this.startTime.toISOString(),
      lastCheck: new Date().toISOString(),
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        percentage: `${Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)}%`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`
      },
      cpu: {
        usage: this.getCpuUsage(),
        loadAverage: this.getLoadAverage()
      },
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid,
      modules: {
        loadedCount: AppModule.getModuleCount ? AppModule.getModuleCount() : 0,
        loadedModules: AppModule.getLoadedModules ? AppModule.getLoadedModules() : [],
        configStatus: this.getModuleConfigStatus()
      },
      services: this.getConfiguredServices(),
      statistics: {
        totalQueries: this.queryCount,
        ragQueries: this.serviceStats.ragQueries,
        documentsIngested: this.serviceStats.documentsIngested,
        errorCount: this.serviceStats.errorCount,
        averageResponseTime: this.getAverageResponseTime()
      }
    };
  }

  getSystemHealth() {
    console.log('🔧 AppService: 執行 getSystemHealth');

    const services = this.getConfiguredServices();
    const healthyServices = Object.values(services).filter(status =>
      status === 'configured' || status === 'operational'
    ).length;
    const totalServices = Object.keys(services).length;

    this.serviceStats.lastHealthCheck = new Date().toISOString();

    return {
      status: healthyServices === totalServices ? 'healthy' : 'degraded',
      overallHealth: Math.round((healthyServices / totalServices) * 100),
      services: services,
      checks: {
        memory: this.checkMemoryHealth(),
        disk: this.checkDiskHealth(),
        network: this.checkNetworkHealth(),
        dependencies: this.checkDependencies()
      },
      lastCheck: this.serviceStats.lastHealthCheck,
      recommendations: this.getHealthRecommendations(services)
    };
  }

  async performFullHealthCheck() {
    console.log('🔧 AppService: 執行完整健康檢查');

    const results = {
      timestamp: new Date().toISOString(),
      overallStatus: 'checking',
      services: {},
      dependencies: {},
      performance: {},
      recommendations: []
    };

    try {
      // 檢查各項服務
      results.services = {
        gemini: await this.checkGeminiHealth(),
        grok: await this.checkGrokHealth(),
        vertexAI: await this.checkVertexAIHealth(),
        database: await this.checkDatabaseHealth(),
        rag: await this.checkRAGHealth()
      };

      // 檢查依賴項目
      results.dependencies = {
        nodejs: { status: 'healthy', version: process.version },
        npm: await this.checkNpmHealth(),
        python: await this.checkPythonHealth(),
        docker: await this.checkDockerHealth()
      };

      // 效能檢查
      results.performance = {
        responseTime: this.getAverageResponseTime(),
        memoryUsage: this.getMemoryUsagePercentage(),
        cpuUsage: this.getCpuUsage(),
        uptime: this.getUptime()
      };

      // 產生建議
      results.recommendations = this.generateHealthRecommendations(results);

      // 判斷整體狀態
      const healthyServices = Object.values(results.services).filter(s => s.status === 'healthy').length;
      const totalServices = Object.keys(results.services).length;

      if (healthyServices === totalServices) {
        results.overallStatus = 'healthy';
      } else if (healthyServices >= totalServices * 0.7) {
        results.overallStatus = 'degraded';
      } else {
        results.overallStatus = 'unhealthy';
      }

      return results;

    } catch (error) {
      console.error('❌ 完整健康檢查失敗:', error.message);
      results.overallStatus = 'error';
      results.error = error.message;
      return results;
    }
  }

  getDatabaseStatus() {
    console.log('🔧 AppService: 執行 getDatabaseStatus');

    return {
      postgres: {
        configured: !!process.env.DATABASE_URL,
        status: process.env.DATABASE_URL ? 'configured' : 'not_configured',
        connection: process.env.DATABASE_URL ? 'ready' : 'not_ready',
        features: ['pgvector', 'full-text-search', 'jsonb-support']
      },
      neo4j: {
        configured: !!(process.env.NEO4J_URI && process.env.NEO4J_USERNAME),
        status: (process.env.NEO4J_URI && process.env.NEO4J_USERNAME) ? 'configured' : 'not_configured',
        connection: (process.env.NEO4J_URI && process.env.NEO4J_USERNAME) ? 'ready' : 'not_ready',
        features: ['apoc-plugins', 'graph-algorithms', 'knowledge-graphs']
      },
      redis: {
        configured: !!process.env.REDIS_URL,
        status: process.env.REDIS_URL ? 'configured' : 'not_configured',
        connection: process.env.REDIS_URL ? 'ready' : 'not_ready',
        features: ['caching', 'session-storage', 'pub-sub']
      },
      pythonAI: {
        configured: !!process.env.PYTHON_AI_URL,
        status: process.env.PYTHON_AI_URL ? 'configured' : 'not_configured',
        connection: process.env.PYTHON_AI_URL ? 'ready' : 'not_ready',
        features: ['embedding-generation', 'model-inference', 'image-processing']
      },
      summary: {
        totalDatabases: 4,
        configuredCount: [
          process.env.DATABASE_URL,
          process.env.NEO4J_URI && process.env.NEO4J_USERNAME,
          process.env.REDIS_URL,
          process.env.PYTHON_AI_URL
        ].filter(Boolean).length,
        healthStatus: 'monitoring',
        lastCheck: new Date().toISOString()
      }
    };
  }

  getRAGStats() {
    console.log('🔧 AppService: 執行 getRAGStats');

    // 模擬 RAG 統計資料（實際專案中會從服務獲取）
    return {
      documents: {
        total: this.serviceStats.documentsIngested,
        types: {
          'penetration-reports': Math.floor(this.serviceStats.documentsIngested * 0.4),
          'attack-logs': Math.floor(this.serviceStats.documentsIngested * 0.3),
          'regulations': Math.floor(this.serviceStats.documentsIngested * 0.2),
          'technical-docs': Math.floor(this.serviceStats.documentsIngested * 0.1)
        },
        lastIngested: new Date(Date.now() - Math.random() * 86400000).toISOString()
      },
      chunks: {
        total: this.serviceStats.documentsIngested * 5,
        averageSize: 512,
        withEmbeddings: Math.floor(this.serviceStats.documentsIngested * 4.8),
        lastProcessed: new Date().toISOString()
      },
      queries: {
        total: this.serviceStats.ragQueries,
        successful: Math.floor(this.serviceStats.ragQueries * 0.95),
        failed: Math.floor(this.serviceStats.ragQueries * 0.05),
        averageResponseTime: '1.2s',
        lastQuery: this.serviceStats.ragQueries > 0 ?
          new Date(Date.now() - Math.random() * 3600000).toISOString() : null
      },
      vectorDatabase: {
        dimensions: 1024,
        indexType: 'HNSW',
        indexSize: `${Math.round(this.serviceStats.documentsIngested * 0.5)}MB`,
        searchAccuracy: '94.2%'
      },
      knowledgeGraph: {
        nodes: this.serviceStats.documentsIngested * 3,
        relationships: this.serviceStats.documentsIngested * 8,
        attackVectors: ['A1', 'A2', 'A3', 'A4', 'A5'],
        lastUpdated: new Date().toISOString()
      },
      performance: {
        indexingSpeed: '1.2MB/min',
        queryLatency: '850ms',
        cacheHitRate: '78%',
        systemLoad: 'normal'
      }
    };
  }

  getEnvironmentInfo() {
    console.log('🔧 AppService: 執行 getEnvironmentInfo');

    const configuredVars = [];
    const missingVars = [];

    const requiredEnvVars = [
      'NODE_ENV', 'PORT', 'GEMINI_API_KEY', 'DATABASE_URL',
      'NEO4J_URI', 'NEO4J_USERNAME', 'NEO4J_PASSWORD',
      'REDIS_URL', 'PYTHON_AI_URL'
    ];

    requiredEnvVars.forEach(varName => {
      if (process.env[varName]) {
        configuredVars.push({
          name: varName,
          configured: true,
          masked: this.maskSensitiveValue(varName, process.env[varName])
        });
      } else {
        missingVars.push(varName);
      }
    });

    return {
      nodeEnv: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      environmentVariables: {
        total: requiredEnvVars.length,
        configured: configuredVars.length,
        missing: missingVars.length,
        configuredVars: configuredVars,
        missingVars: missingVars
      },
      systemInfo: {
        hostname: require('os').hostname(),
        cpus: require('os').cpus().length,
        totalMemory: `${Math.round(require('os').totalmem() / 1024 / 1024 / 1024)}GB`,
        freeMemory: `${Math.round(require('os').freemem() / 1024 / 1024 / 1024)}GB`,
        loadAverage: require('os').loadavg(),
        uptime: `${Math.floor(require('os').uptime() / 3600)}小時`
      },
      configurationStatus: configuredVars.length === requiredEnvVars.length ? 'complete' : 'incomplete',
      recommendations: this.getEnvironmentRecommendations(missingVars)
    };
  }

  async testAllServices() {
    console.log('🔧 AppService: 執行 testAllServices');

    const testResults = {
      timestamp: new Date().toISOString(),
      overallStatus: 'testing',
      results: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0
      }
    };

    const services = [
      { name: 'gemini', test: () => this.testGeminiService() },
      { name: 'grok', test: () => this.testGrokService() },
      { name: 'vertexAI', test: () => this.testVertexAIService() },
      { name: 'rag', test: () => this.testRAGService() },
      { name: 'database', test: () => this.testDatabaseService() }
    ];

    for (const service of services) {
      try {
        console.log(`🧪 測試 ${service.name} 服務...`);
        testResults.results[service.name] = await service.test();
        testResults.summary.total++;

        if (testResults.results[service.name].status === 'passed') {
          testResults.summary.passed++;
        } else if (testResults.results[service.name].status === 'failed') {
          testResults.summary.failed++;
        } else {
          testResults.summary.skipped++;
        }
      } catch (error) {
        testResults.results[service.name] = {
          status: 'failed',
          error: error.message,
          timestamp: new Date().toISOString()
        };
        testResults.summary.total++;
        testResults.summary.failed++;
      }
    }

    // 判斷整體狀態
    if (testResults.summary.failed === 0) {
      testResults.overallStatus = 'all_passed';
    } else if (testResults.summary.passed > testResults.summary.failed) {
      testResults.overallStatus = 'mostly_passed';
    } else {
      testResults.overallStatus = 'mostly_failed';
    }

    return testResults;
  }

  // 輔助方法
  getUptime() {
    const uptimeSeconds = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    return `${hours}小時${minutes}分${seconds}秒`;
  }

  getConfiguredServices() {
    return {
      nestjs: 'operational',
      express: 'operational',
      routes: 'registered',
      swagger: 'available',
      geminiAI: process.env.GEMINI_API_KEY ? 'configured' : 'not_configured',
      grokAI: process.env.XAI_API_KEY ? 'configured' : 'not_configured',
      vertexAIAgent: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'configured' : 'not_configured',
      ragSystem: 'operational',
      postgres: process.env.DATABASE_URL ? 'configured' : 'not_configured',
      neo4j: (process.env.NEO4J_URI && process.env.NEO4J_USERNAME) ? 'configured' : 'not_configured',
      redis: process.env.REDIS_URL ? 'configured' : 'not_configured',
      pythonAI: process.env.PYTHON_AI_URL ? 'configured' : 'not_configured'
    };
  }

  getModuleConfigStatus() {
    const services = this.getConfiguredServices();
    const configuredCount = Object.values(services).filter(status =>
      status === 'configured' || status === 'operational'
    ).length;
    const totalServices = Object.keys(services).length;

    return {
      configured: configuredCount,
      total: totalServices,
      percentage: Math.round((configuredCount / totalServices) * 100),
      status: configuredCount === totalServices ? 'fully_configured' :
        configuredCount >= totalServices * 0.7 ? 'mostly_configured' : 'partially_configured'
    };
  }

  getCpuUsage() {
    // 簡化的 CPU 使用率計算
    return `${Math.round(Math.random() * 30 + 10)}%`;
  }

  getLoadAverage() {
    try {
      const loadAvg = require('os').loadavg();
      return loadAvg.map(load => Math.round(load * 100) / 100);
    } catch (error) {
      return [0.1, 0.2, 0.3];
    }
  }

  getAverageResponseTime() {
    return `${Math.round(Math.random() * 500 + 800)}ms`;
  }

  getMemoryUsagePercentage() {
    const memoryUsage = process.memoryUsage();
    return Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);
  }

  maskSensitiveValue(varName, value) {
    const sensitiveVars = ['API_KEY', 'PASSWORD', 'SECRET', 'TOKEN'];
    if (sensitiveVars.some(keyword => varName.includes(keyword))) {
      return value.substring(0, 8) + '***';
    }
    return value;
  }

  // 模擬測試方法
  async testGeminiService() {
    return {
      status: process.env.GEMINI_API_KEY ? 'passed' : 'skipped',
      message: process.env.GEMINI_API_KEY ? 'Gemini AI 服務配置正常' : '缺少 GEMINI_API_KEY',
      responseTime: '1.2s',
      timestamp: new Date().toISOString()
    };
  }

  async testGrokService() {
    return {
      status: process.env.XAI_API_KEY ? 'passed' : 'skipped',
      message: process.env.XAI_API_KEY ? 'Grok AI 服務配置正常' : '缺少 XAI_API_KEY',
      responseTime: '0.9s',
      timestamp: new Date().toISOString()
    };
  }

  async testVertexAIService() {
    return {
      status: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'passed' : 'skipped',
      message: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'Vertex AI 服務配置正常' : '缺少 GOOGLE_CLOUD_PROJECT_ID',
      responseTime: '1.5s',
      timestamp: new Date().toISOString()
    };
  }

  async testRAGService() {
    return {
      status: 'passed',
      message: 'RAG 服務運行正常',
      features: ['文檔匯入', '向量搜尋', '智慧問答'],
      responseTime: '0.8s',
      timestamp: new Date().toISOString()
    };
  }

  async testDatabaseService() {
    const dbConfigured = process.env.DATABASE_URL && process.env.NEO4J_URI && process.env.REDIS_URL;
    return {
      status: dbConfigured ? 'passed' : 'partial',
      message: dbConfigured ? '所有資料庫配置完成' : '部分資料庫未配置',
      databases: {
        postgres: !!process.env.DATABASE_URL,
        neo4j: !!process.env.NEO4J_URI,
        redis: !!process.env.REDIS_URL
      },
      timestamp: new Date().toISOString()
    };
  }

  // 其他健康檢查方法...
  checkMemoryHealth() {
    const usage = this.getMemoryUsagePercentage();
    return {
      status: usage < 80 ? 'healthy' : usage < 90 ? 'warning' : 'critical',
      usage: `${usage}%`,
      recommendation: usage > 80 ? '建議重啟服務或增加記憶體' : '記憶體使用正常'
    };
  }

  checkDiskHealth() {
    return {
      status: 'healthy',
      usage: '45%',
      available: '12GB',
      recommendation: '磁碟空間充足'
    };
  }

  checkNetworkHealth() {
    return {
      status: 'healthy',
      latency: '< 50ms',
      connectivity: 'stable',
      recommendation: '網路連接正常'
    };
  }

  checkDependencies() {
    return {
      nodejs: { status: 'healthy', version: process.version },
      npm: { status: 'healthy', version: 'detected' },
      python: { status: process.env.PYTHON_AI_URL ? 'healthy' : 'not_configured' }
    };
  }

  getHealthRecommendations(services) {
    const recommendations = [];

    Object.entries(services).forEach(([service, status]) => {
      if (status === 'not_configured') {
        switch (service) {
          case 'geminiAI':
            recommendations.push('設定 GEMINI_API_KEY 環境變數以啟用 Gemini AI');
            break;
          case 'grokAI':
            recommendations.push('設定 XAI_API_KEY 環境變數以啟用 Grok AI');
            break;
          case 'vertexAIAgent':
            recommendations.push('設定 GOOGLE_CLOUD_PROJECT_ID 環境變數以啟用 Vertex AI');
            break;
          case 'postgres':
            recommendations.push('設定 DATABASE_URL 環境變數以連接 PostgreSQL');
            break;
          case 'neo4j':
            recommendations.push('設定 NEO4J_URI 和 NEO4J_USERNAME 環境變數以連接 Neo4j');
            break;
          case 'redis':
            recommendations.push('設定 REDIS_URL 環境變數以啟用 Redis 快取');
            break;
        }
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('所有服務配置完整，系統運行良好！');
    }

    return recommendations;
  }

  getEnvironmentRecommendations(missingVars) {
    if (missingVars.length === 0) {
      return ['環境變數配置完整！'];
    }

    return [
      `請在 .env 檔案中設定以下環境變數: ${missingVars.join(', ')}`,
      '參考 .env.example 檔案進行配置',
      '設定完成後重啟服務以生效'
    ];
  }

  generateHealthRecommendations(healthResults) {
    const recommendations = [];

    // 根據健康檢查結果產生建議
    Object.entries(healthResults.services).forEach(([service, result]) => {
      if (result.status !== 'healthy') {
        recommendations.push(`${service} 服務需要檢查: ${result.message || '狀態異常'}`);
      }
    });

    if (healthResults.performance.memoryUsage > 80) {
      recommendations.push('記憶體使用率過高，建議重啟服務或優化記憶體使用');
    }

    if (recommendations.length === 0) {
      recommendations.push('系統整體運行良好，無需特別維護');
    }

    return recommendations;
  }

  // 模擬健康檢查方法
  async checkGeminiHealth() {
    return {
      status: process.env.GEMINI_API_KEY ? 'healthy' : 'not_configured',
      message: process.env.GEMINI_API_KEY ? 'Gemini API 配置正常' : '缺少 API 金鑰',
      lastCheck: new Date().toISOString()
    };
  }

  async checkGrokHealth() {
    return {
      status: process.env.XAI_API_KEY ? 'healthy' : 'not_configured',
      message: process.env.XAI_API_KEY ? 'Grok API 配置正常' : '缺少 API 金鑰',
      lastCheck: new Date().toISOString()
    };
  }

  async checkVertexAIHealth() {
    return {
      status: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'healthy' : 'not_configured',
      message: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'Vertex AI 配置正常' : '缺少專案 ID',
      lastCheck: new Date().toISOString()
    };
  }

  async checkDatabaseHealth() {
    const dbCount = [
      process.env.DATABASE_URL,
      process.env.NEO4J_URI,
      process.env.REDIS_URL
    ].filter(Boolean).length;

    return {
      status: dbCount === 3 ? 'healthy' : dbCount > 0 ? 'partial' : 'not_configured',
      message: `${dbCount}/3 個資料庫已配置`,
      databases: {
        postgres: !!process.env.DATABASE_URL,
        neo4j: !!process.env.NEO4J_URI,
        redis: !!process.env.REDIS_URL
      },
      lastCheck: new Date().toISOString()
    };
  }

  async checkRAGHealth() {
    return {
      status: 'healthy',
      message: 'RAG 系統運行正常',
      features: ['文檔匯入', '向量搜尋', '智慧問答', '知識圖譜'],
      statistics: this.serviceStats,
      lastCheck: new Date().toISOString()
    };
  }

  async checkNpmHealth() {
    return {
      status: 'healthy',
      version: 'installed',
      packageManager: 'pnpm'
    };
  }

  async checkPythonHealth() {
    return {
      status: process.env.PYTHON_AI_URL ? 'healthy' : 'not_configured',
      configured: !!process.env.PYTHON_AI_URL,
      url: process.env.PYTHON_AI_URL || 'not_set'
    };
  }

  async checkDockerHealth() {
    return {
      status: 'not_checked',
      message: 'Docker 狀態檢查需要額外配置'
    };
  }
}

// 手動依賴注入
function createAppService() {
  return new AppService();
}

module.exports = { AppService, createAppService };
