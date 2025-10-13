const { Injectable, HttpException, HttpStatus } = require('@nestjs/common');
const { ConfigService } = require('@nestjs/config');
const axios = require('axios');

@Injectable()
class GrokService {
  constructor(configService) {
    this.configService = configService;
    this.apiKey = this.configService.get('GROK_API_KEY');
    this.baseUrl = this.configService.get('GROK_API_URL') || 'https://api.x.ai/v1';
    
    this.axiosConfig = {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    };
  }

  async generatePenetrationReport(testData) {
    try {
      if (!this.apiKey) {
        throw new Error('GROK_API_KEY 未設定');
      }

      const prompt = this.buildPenetrationTestPrompt(testData);
      
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'grok-beta',
          messages: [
            {
              role: 'system',
              content: `你是侵國侵城系統的專業滲透測試分析師。
                專精於eKYC系統安全評估，熟悉以下技術：
                - AI攻擊技術：StyleGAN3、StableDiffusion、SimSwap、DALL·E
                - 防禦指標：APCER、BPCER、ACER、ROC-AUC、EER
                - 攻擊場景：A1-A5攻擊向量分析
                請提供專業、量化、可操作的分析報告。`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2500,
          temperature: 0.7
        },
        this.axiosConfig
      );

      const analysis = response.data.choices[0].message.content;
      
      return {
        reportId: this.generateReportId(),
        timestamp: new Date().toISOString(),
        analysis,
        riskLevel: this.extractRiskLevel(analysis),
        vulnerabilities: this.extractVulnerabilities(analysis),
        recommendations: this.extractRecommendations(analysis),
        metrics: this.processMetrics(testData),
        attackVectorAnalysis: this.analyzeAttackVectors(testData.attackVectors || [])
      };
    } catch (error) {
      console.error('Grok API 錯誤:', error.message);
      throw new HttpException(
        `Grok滲透測試報告生成失敗: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async analyzeAttackPatterns(attackData) {
    try {
      if (!this.apiKey) {
        return this.generateFallbackAnalysis(attackData);
      }

      const prompt = this.buildAttackAnalysisPrompt(attackData);

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'grok-beta',
          messages: [
            {
              role: 'system',
              content: '專精於AI攻擊模式分析，熟悉StyleGAN3、StableDiffusion、SimSwap、DALL·E等生成模型的攻擊特徵。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.6
        },
        this.axiosConfig
      );

      const analysis = response.data.choices[0].message.content;
      
      return {
        analysisId: this.generateAnalysisId(),
        analysis,
        attackVectors: this.categorizeAttackVectors(attackData),
        riskScore: this.calculateAttackRiskScore(attackData),
        recommendations: this.extractAttackRecommendations(analysis),
        priorityActions: this.identifyPriorityActions(attackData)
      };
    } catch (error) {
      console.error('攻擊模式分析錯誤:', error.message);
      return this.generateFallbackAnalysis(attackData);
    }
  }

  // 建構滲透測試提示
  buildPenetrationTestPrompt(testData) {
    return `
      侵國侵城eKYC系統滲透測試分析：
      
      === 測試指標 ===
      APCER (攻擊樣本分類錯誤率): ${testData.apcer || 0}%
      BPCER (正常樣本分類錯誤率): ${testData.bpcer || 0}%
      ACER (平均分類錯誤率): ${testData.acer || 0}%
      ROC-AUC: ${testData.rocAuc || 'N/A'}
      EER (等錯誤率): ${testData.eer || 0}%
      
      === 攻擊向量 ===
      ${(testData.attackVectors || []).map((v, i) => 
        `${i+1}. ${v.type || 'Unknown'}: ${v.description || ''} (成功率: ${v.successRate || 0}%)`
      ).join('\n')}
      
      === 複合攻擊 ===
      ${(testData.compositeAttacks || []).join('\n')}
      
      === 系統防禦狀態 ===
      人臉辨識: ${testData.defenses?.faceRecognition ? '啟用' : '未啟用'}
      活體檢測: ${testData.defenses?.livenessDetection ? '啟用' : '未啟用'}
      文件驗證: ${testData.defenses?.documentVerification ? '啟用' : '未啟用'}
      
      請提供：
      1. 風險等級評估 (CRITICAL/HIGH/MEDIUM/LOW)
      2. 攻擊向量效果分析
      3. 防禦薄弱點識別
      4. 量化指標解讀
      5. 改善建議排序
    `;
  }

  buildAttackAnalysisPrompt(attackData) {
    const vectorMapping = {
      'A1': 'StyleGAN3偽造真人自拍',
      'A2': 'StableDiffusion翻拍攻擊',
      'A3': 'SimSwap即時換臉',
      'A4': 'Diffusion+GAN證件合成',
      'A5': 'DALL·E生成假證件'
    };

    return `
      分析侵國侵城A1-A5攻擊向量執行結果：
      
      ${(attackData.vectors || []).map(v => `
      ${v.id}: ${vectorMapping[v.id] || '未知攻擊'}
      - 執行狀態: ${v.status || 'unknown'}
      - 成功率: ${v.successRate || 0}%
      - 檢測規避: ${v.bypassDetection ? '成功' : '失敗'}
      `).join('\n')}
      
      複合攻擊: ${(attackData.compositeAttacks || []).join(', ')}
      目標系統: ${attackData.targetSystem || 'eKYC'}
      
      請分析各攻擊向量威脅程度與防禦建議。
    `;
  }

  // 處理指標數據
  processMetrics(testData) {
    return {
      apcer: parseFloat(testData.apcer) || 0,
      bpcer: parseFloat(testData.bpcer) || 0,
      acer: parseFloat(testData.acer) || 0,
      rocAuc: parseFloat(testData.rocAuc) || 0,
      eer: parseFloat(testData.eer) || 0
    };
  }

  // 分析攻擊向量
  analyzeAttackVectors(vectors) {
    return vectors.map(vector => ({
      type: vector.type,
      description: vector.description,
      successRate: vector.successRate || 0,
      threatLevel: this.assessThreatLevel(vector.successRate || 0),
      mitigation: this.suggestMitigation(vector.type)
    }));
  }

  assessThreatLevel(successRate) {
    if (successRate >= 80) return 'CRITICAL';
    if (successRate >= 60) return 'HIGH';
    if (successRate >= 30) return 'MEDIUM';
    return 'LOW';
  }

  suggestMitigation(vectorType) {
    const mitigations = {
      'A1': '強化深度偽造檢測機制',
      'A2': '實施螢幕反射檢測',
      'A3': '加強即時活體驗證',
      'A4': '完善文件真偽驗證',
      'A5': 'AI生成內容檢測'
    };
    return mitigations[vectorType] || '通用防禦機制';
  }

  // 解析分析結果
  extractRiskLevel(content) {
    const match = content.match(/(CRITICAL|HIGH|MEDIUM|LOW)/i);
    return match ? match[1].toUpperCase() : 'MEDIUM';
  }

  extractVulnerabilities(content) {
    const vulnSection = content.match(/弱點[：:](.*?)(?=建議|改善|$)/s);
    if (!vulnSection) return [];
    
    return vulnSection[1]
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim().replace(/^\d+\.\s*/, ''));
  }

  extractRecommendations(content) {
    const recSection = content.match(/建議[：:]?(.*?)$/s);
    if (!recSection) return [];
    
    return recSection[1]
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim().replace(/^\d+\.\s*/, ''));
  }

  categorizeAttackVectors(attackData) {
    const vectors = attackData.vectors || [];
    return {
      generative: vectors.filter(v => ['A1', 'A2', 'A4', 'A5'].includes(v.id)),
      realtime: vectors.filter(v => v.id === 'A3'),
      composite: attackData.compositeAttacks || []
    };
  }

  calculateAttackRiskScore(attackData) {
    const vectors = attackData.vectors || [];
    if (vectors.length === 0) return 0;
    
    const avgSuccessRate = vectors.reduce((sum, v) => sum + (v.successRate || 0), 0) / vectors.length;
    const complexityMultiplier = (attackData.compositeAttacks?.length || 0) * 0.1;
    
    return Math.min(100, avgSuccessRate + (complexityMultiplier * 10));
  }

  extractAttackRecommendations(analysis) {
    const recommendations = analysis.match(/建議[：:]\s*(.*?)(?=\n|$)/g) || [];
    return recommendations.map(rec => rec.replace(/建議[：:]\s*/, '').trim());
  }

  identifyPriorityActions(attackData) {
    const actions = [];
    const vectors = attackData.vectors || [];
    
    const highRiskVectors = vectors.filter(v => (v.successRate || 0) > 70);
    if (highRiskVectors.length > 0) {
      actions.push('緊急加強高風險攻擊向量防護');
    }
    
    if (vectors.some(v => ['A4', 'A5'].includes(v.id))) {
      actions.push('升級文件防偽驗證系統');
    }
    
    if (attackData.compositeAttacks?.length > 0) {
      actions.push('實施多模態交叉驗證');
    }
    
    return actions;
  }

  // 備用分析（當API不可用時）
  generateFallbackAnalysis(attackData) {
    return {
      analysisId: this.generateAnalysisId(),
      analysis: '系統正在離線模式運行，基於內建規則進行基礎分析',
      attackVectors: this.categorizeAttackVectors(attackData),
      riskScore: this.calculateAttackRiskScore(attackData),
      recommendations: [
        '檢查AI API連接狀態',
        '執行基礎安全檢查',
        '監控系統狀態'
      ],
      priorityActions: ['恢復AI分析服務']
    };
  }

  generateReportId() {
    return `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  }

  generateAnalysisId() {
    return `ANA-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  }
}

module.exports = GrokService;
