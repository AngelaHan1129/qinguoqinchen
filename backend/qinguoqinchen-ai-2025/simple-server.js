const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

console.log('🚀 啟動侵國侵城 AI 滲透測試系統...');

// 基本路由
app.get('/', (req, res) => {
  res.json({
    message: '🛡️ 歡迎使用侵國侵城 AI 滲透測試系統',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    description: '本系統專為 eKYC 安全測試設計，整合多種生成式 AI 技術',
    capabilities: [
      '多模態 AI 攻擊模擬 (StyleGAN3, Stable Diffusion, SimSwap, DALL·E)',
      '智能滲透測試',
      '量化安全評估 (APCER, BPCER, ACER, EER)',
      'AI 驅動的防禦建議',
      '自動化報告生成'
    ],
    endpoints: {
      health: '/health',
      attackVectors: '/ai-attack/vectors',
      executeAttack: 'POST /ai-attack/execute',
      comboAttack: 'POST /ai-attack/combo',
      systemStats: '/system/stats'
    }
  });
});

// 健康檢查
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: '侵國侵城 AI 系統',
    uptime: `${Math.floor(process.uptime())}秒`,
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      percentage: `${Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)}%`
    },
    platform: process.platform,
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    services: {
      express: 'operational',
      neo4j: 'pending',  
      postgres: 'pending'
    }
  });
});

// 獲取攻擊向量
app.get('/ai-attack/vectors', (req, res) => {
  res.json({
    success: true,
    vectors: [
      { 
        id: 'A1', 
        model: 'StyleGAN3', 
        scenario: '偽造真人自拍',
        postProcessing: '模糊+色偏',
        targetType: 'face_spoofing',
        difficulty: 'MEDIUM',
        successRate: '78%',
        description: '使用 StyleGAN3 生成高擬真臉部影像，模擬假身份自拍照'
      },
      { 
        id: 'A2', 
        model: 'StableDiffusion', 
        scenario: '翻拍攻擊',
        postProcessing: '螢幕反射+摩爾紋',
        targetType: 'liveness_bypass',
        difficulty: 'HIGH',
        successRate: '65%',
        description: '模擬螢幕反射與拍攝偽像，繞過活體檢測'
      },
      { 
        id: 'A3', 
        model: 'SimSwap', 
        scenario: '即時換臉',
        postProcessing: '壓縮+幀延遲',
        targetType: 'face_swap',
        difficulty: 'VERY_HIGH',
        successRate: '89%',
        description: '即時視訊換臉技術，用於繞過視訊驗證'
      },
      { 
        id: 'A4', 
        model: 'Diffusion+GAN', 
        scenario: '偽造護照',
        postProcessing: '透視變形+反光',
        targetType: 'document_forge',
        difficulty: 'HIGH',
        successRate: '73%',
        description: '生成含 MRZ 和條碼的偽造證件'
      },
      { 
        id: 'A5', 
        model: 'DALL·E', 
        scenario: '直接生成假證件',
        postProcessing: '無後處理',
        targetType: 'document_generate',
        difficulty: 'MEDIUM',
        successRate: '82%',
        description: '直接生成身份證件圖像，包含所有必要元素'
      }
    ],
    recommendedCombos: [
      { 
        combo: ['A2', 'A3'], 
        description: 'Deepfake + 翻拍攻擊', 
        difficulty: 'EXTREME',
        estimatedSuccessRate: '92%',
        useCases: ['繞過雙重驗證', '視訊 KYC 攻擊']
      },
      { 
        combo: ['A1', 'A4'], 
        description: '假自拍 + 假護照', 
        difficulty: 'HIGH',
        estimatedSuccessRate: '75%',
        useCases: ['完整身份偽造', '文件+臉部雙重攻擊']
      },
      { 
        combo: ['A3', 'A5'], 
        description: '即時換臉 + 生成證件', 
        difficulty: 'EXTREME',
        estimatedSuccessRate: '86%',
        useCases: ['實時身份竊取', '多模態攻擊']
      },
      { 
        combo: ['A2', 'A3', 'A5'], 
        description: '三重攻擊組合', 
        difficulty: 'LEGENDARY',
        estimatedSuccessRate: '94%',
        useCases: ['全方位滲透測試', '最高級威脅模擬']
      }
    ],
    statistics: {
      totalVectors: 5,
      averageSuccessRate: '77.4%',
      mostEffective: 'A3 - SimSwap',
      leastEffective: 'A2 - StableDiffusion',
      recommendedForBeginners: ['A1', 'A5'],
      recommendedForExperts: ['A2', 'A3']
    },
    timestamp: new Date().toISOString()
  });
});

// 執行攻擊測試
app.post('/ai-attack/execute', (req, res) => {
  const { vectorIds = ['A1', 'A2'], intensity = 'medium', targetImage, options = {} } = req.body;
  
  console.log(`🎯 執行攻擊測試: ${vectorIds.join(', ')}, 強度: ${intensity}`);
  
  // 模擬攻擊執行
  const results = vectorIds.map(vectorId => {
    const baseSuccessRate = getBaseSuccessRate(vectorId, intensity);
    const success = Math.random() < baseSuccessRate;
    const confidence = success ? 
      0.7 + Math.random() * 0.3 : 
      0.2 + Math.random() * 0.5;
    
    const processingTime = 1000 + Math.random() * 3000;
    
    return {
      vectorId,
      model: getModelByVector(vectorId),
      scenario: getScenarioByVector(vectorId),
      success,
      confidence: Math.round(confidence * 1000) / 1000,
      bypassScore: success ? Math.round((confidence * 0.9) * 1000) / 1000 : 0,
      processingTime: Math.round(processingTime),
      generatedSample: `${vectorId.toLowerCase()}_sample_${Date.now()}.jpg`,
      metrics: {
        faceQuality: vectorId === 'A1' ? Math.random() * 0.3 + 0.7 : null,
        realismScore: Math.random() * 0.2 + 0.8,
        detectionBypass: success ? 'HIGH' : 'LOW'
      },
      timestamp: new Date()
    };
  });

  const successfulAttacks = results.filter(r => r.success).length;
  const successRate = Math.round((successfulAttacks / results.length) * 100);
  const avgConfidence = Math.round((results.reduce((sum, r) => sum + r.confidence, 0) / results.length) * 1000) / 1000;

  // 計算安全指標 (模擬 APCER, BPCER 等)
  const metrics = calculateSecurityMetrics(results);

  res.json({
    success: true,
    testId: `QQC_ATK_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    attackResults: {
      vectors: vectorIds,
      intensity,
      results,
      summary: {
        totalAttacks: results.length,
        successfulAttacks,
        successRate: `${successRate}%`,
        averageConfidence: avgConfidence,
        threatLevel: getThreatLevel(successRate),
        totalProcessingTime: `${results.reduce((sum, r) => sum + r.processingTime, 0)}ms`
      },
      securityMetrics: metrics,
      overallBypass: successRate > 50
    },
    recommendations: generateDetailedRecommendations(results, successRate),
    timestamp: new Date().toISOString()
  });
});

// 複合攻擊
app.post('/ai-attack/combo', (req, res) => {
  const { combos = [['A1', 'A2']], intensity = 'medium', interval = 1000 } = req.body;
  
  console.log(`🔥 執行複合攻擊: ${combos.map(c => c.join('+')).join(', ')}`);
  
  const comboResults = combos.map((combo, index) => {
    const results = combo.map(vectorId => ({
      vectorId,
      model: getModelByVector(vectorId),
      success: Math.random() > 0.3,
      confidence: Math.round((Math.random() * 0.6 + 0.4) * 1000) / 1000,
      processingTime: 1500 + Math.random() * 2000
    }));
    
    const successRate = Math.round((results.filter(r => r.success).length / results.length) * 100);
    
    return {
      comboId: `COMBO_${index + 1}`,
      combination: combo.join(' + '),
      description: combo.map(id => getScenarioByVector(id)).join(' + '),
      results,
      successRate: `${successRate}%`,
      effectiveness: getEffectiveness(successRate),
      synergy: calculateSynergy(combo),
      estimatedRealWorldSuccess: `${Math.min(successRate + Math.random() * 10, 95)}%`
    };
  });

  res.json({
    success: true,
    comboAttackId: `QQC_COMBO_${Date.now()}`,
    executedCombos: combos.length,
    comboResults,
    overallEffectiveness: comboResults.filter(c => c.effectiveness === 'HIGH' || c.effectiveness === 'VERY_HIGH').length > 0 ? 'HIGH' : 'MEDIUM',
    recommendations: {
      mostDangerous: comboResults.reduce((max, combo) => 
        parseInt(combo.successRate) > parseInt(max.successRate) ? combo : max
      ),
      immediateActions: comboResults.filter(c => parseInt(c.successRate) > 80).length
    },
    timestamp: new Date().toISOString()
  });
});

// 系統統計
app.get('/system/stats', (req, res) => {
  res.json({
    systemStats: {
      totalTests: Math.floor(Math.random() * 1000) + 500,
      successfulAttacks: Math.floor(Math.random() * 600) + 300,
      averageSuccessRate: '72.3%',
      topPerformingVector: 'A3 - SimSwap',
      leastEffectiveVector: 'A2 - StableDiffusion',
      recentTrends: {
        attackAttempts: '+12% (本週)',
        successRate: '+5.2% (本月)',
        newThreatVectors: 2
      }
    },
    performanceMetrics: {
      averageResponseTime: '1.2秒',
      systemLoad: '23%',
      memoryUsage: '156MB',
      activeSessions: Math.floor(Math.random() * 10) + 1
    },
    securityAlerts: [
      { level: 'HIGH', message: 'A3 向量成功率異常偏高', count: 3 },
      { level: 'MEDIUM', message: '複合攻擊嘗試增加', count: 7 },
      { level: 'LOW', message: '系統負載正常', count: 1 }
    ],
    timestamp: new Date().toISOString()
  });
});

// 輔助函數
function getModelByVector(vectorId) {
  const models = {
    'A1': 'StyleGAN3',
    'A2': 'StableDiffusion', 
    'A3': 'SimSwap',
    'A4': 'Diffusion+GAN',
    'A5': 'DALL·E'
  };
  return models[vectorId] || 'Unknown';
}

function getScenarioByVector(vectorId) {
  const scenarios = {
    'A1': '偽造真人自拍',
    'A2': '翻拍攻擊',
    'A3': '即時換臉',
    'A4': '偽造護照',
    'A5': '直接生成假證件'
  };
  return scenarios[vectorId] || 'Unknown';
}

function getBaseSuccessRate(vectorId, intensity) {
  const baseRates = {
    'A1': { low: 0.6, medium: 0.78, high: 0.85 },
    'A2': { low: 0.4, medium: 0.65, high: 0.75 },
    'A3': { low: 0.7, medium: 0.89, high: 0.92 },
    'A4': { low: 0.5, medium: 0.73, high: 0.80 },
    'A5': { low: 0.65, medium: 0.82, high: 0.88 }
  };
  return baseRates[vectorId]?.[intensity] || 0.5;
}

function getThreatLevel(successRate) {
  if (successRate >= 90) return 'CRITICAL';
  if (successRate >= 70) return 'HIGH';
  if (successRate >= 40) return 'MEDIUM';
  return 'LOW';
}

function getEffectiveness(successRate) {
  if (successRate >= 85) return 'VERY_HIGH';
  if (successRate >= 70) return 'HIGH';
  if (successRate >= 50) return 'MEDIUM';
  return 'LOW';
}

function calculateSynergy(combo) {
  const synergyMap = {
    'A1,A4': 0.85, // 自拍+護照
    'A2,A3': 0.95, // 翻拍+換臉
    'A3,A5': 0.88  // 換臉+生成證件
  };
  return synergyMap[combo.sort().join(',')] || 0.7;
}

function calculateSecurityMetrics(results) {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  // 模擬 APCER (攻擊樣本分類錯誤率)
  const apcer = successful.length > 0 ? 
    successful.reduce((sum, r) => sum + (1 - r.confidence), 0) / successful.length : 0;
  
  // 模擬 BPCER (正常樣本分類錯誤率) 
  const bpcer = failed.length > 0 ? 
    failed.reduce((sum, r) => sum + r.confidence, 0) / failed.length : 0;
  
  return {
    apcer: Math.round(apcer * 10000) / 10000,
    bpcer: Math.round(bpcer * 10000) / 10000,
    acer: Math.round((apcer + bpcer) / 2 * 10000) / 10000,
    eer: Math.round((apcer + bpcer) / 2 * 10000) / 10000,
    rocAuc: Math.round((1 - (apcer + bpcer) / 2) * 1000) / 1000
  };
}

function generateDetailedRecommendations(results, successRate) {
  const successful = results.filter(r => r.success);
  const recommendations = [];
  
  if (successful.some(r => r.vectorId === 'A1')) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Face Recognition',
      action: '強化人臉辨識系統的深度學習檢測能力',
      implementation: '升級 ArcFace 模型，增加對抗性訓練樣本',
      timeframe: '2-3 週'
    });
  }
  
  if (successful.some(r => r.vectorId === 'A2')) {
    recommendations.push({
      priority: 'CRITICAL',
      category: 'Liveness Detection',
      action: '改進活體檢測演算法，增加反射和摩爾紋檢測',
      implementation: '實施多光譜檢測和 3D 深度分析',
      timeframe: '4-6 週'
    });
  }
  
  if (successful.some(r => r.vectorId === 'A3')) {
    recommendations.push({
      priority: 'CRITICAL',
      category: 'Video Verification',
      action: '實施時序一致性檢查和視訊品質分析',
      implementation: '建立即時 Deepfake 檢測系統',
      timeframe: '6-8 週'
    });
  }
  
  if (successful.some(r => ['A4', 'A5'].includes(r.vectorId))) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Document Verification',
      action: '建立 AI 生成內容檢測機制和文件真偽驗證',
      implementation: '整合區塊鏈驗證和數位浮水印技術',
      timeframe: '3-4 週'
    });
  }
  
  return {
    priority: successRate > 80 ? 'CRITICAL' : successRate > 60 ? 'HIGH' : 'MEDIUM',
    totalActions: recommendations.length,
    estimatedImplementationTime: `${Math.max(...recommendations.map(r => parseInt(r.timeframe))) || 2} 週`,
    recommendations,
    complianceStandards: ['ISO 27001', 'NIST Cybersecurity Framework', 'GDPR'],
    budgetEstimate: `${recommendations.length * 50000}-${recommendations.length * 120000} TWD`
  };
}

// 錯誤處理
app.use((err, req, res, next) => {
  console.error('❌ 系統錯誤:', err);
  res.status(500).json({
    success: false,
    error: '系統內部錯誤',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: '端點未找到',
    requestedPath: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /ai-attack/vectors', 
      'POST /ai-attack/execute',
      'POST /ai-attack/combo',
      'GET /system/stats'
    ],
    timestamp: new Date().toISOString()
  });
});


const port = process.env.PORT || 7939; // 使用 7939 端口
app.listen(port, () => {
  console.log('✅ 侵國侵城 AI 滲透測試系統啟動成功!');
  console.log(`📍 主頁: http://localhost:${port}`);
  console.log(`🎯 健康檢查: http://localhost:${port}/health`);
  console.log(`⚔️ 攻擊向量: http://localhost:${port}/ai-attack/vectors`);
  console.log(`📊 系統統計: http://localhost:${port}/system/stats`);
  console.log(`🔥 準備進行 AI 滲透測試!`);
  console.log('');
  console.log('📝 測試指令:');
  console.log(`curl http://localhost:${port}/health`);
  console.log(`curl http://localhost:${port}/ai-attack/vectors`);
  console.log(`curl -X POST http://localhost:${port}/ai-attack/execute -H "Content-Type: application/json" -d '{"vectorIds":["A1","A3"],"intensity":"high"}'`);
});

