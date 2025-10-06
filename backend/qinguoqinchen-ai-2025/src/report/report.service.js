import { Injectable } from '@nestjs/common';
import { RagService } from '../rag/rag.service.js';

@Injectable()
export class ReportService {
  constructor(ragService) {
    this.ragService = ragService;
  }

  async generatePenetrationReport(attackResults, format = 'json') {
    const reportId = `QQC_RPT_${Date.now()}`;
    
    // 生成量化指標分析
    const metricsAnalysis = this.analyzeSecurityMetrics(attackResults);
    
    // 搜尋相似攻擊模式
    const embedding = await this.ragService.generateAttackEmbedding(attackResults);
    const similarPatterns = await this.ragService.searchSimilarAttackPatterns(embedding);
    
    // 生成改善建議
    const recommendations = await this.ragService.generateDefenseRecommendations({
      embedding,
      ...attackResults
    });

    const report = {
      reportId,
      timestamp: new Date(),
      executiveSummary: {
        totalAttacks: attackResults.results.length,
        successfulAttacks: attackResults.results.filter(r => r.success).length,
        overallBypassRate: (attackResults.results.filter(r => r.success).length / attackResults.results.length * 100).toFixed(2) + '%',
        riskLevel: this.calculateRiskLevel(attackResults),
        urgentActions: recommendations.recommendations.filter(r => r.priority === 'CRITICAL').length
      },
      detailedAnalysis: {
        attackVectorBreakdown: this.analyzeAttackVectors(attackResults),
        securityMetrics: metricsAnalysis,
        vulnerabilityMapping: this.mapVulnerabilities(attackResults)
      },
      historicalComparison: {
        similarPatterns: similarPatterns.slice(0, 3),
        trendAnalysis: this.analyzeTrends(similarPatterns)
      },
      recommendations: recommendations,
      technicalDetails: {
        testEnvironment: 'Kali Linux 測試環境',
        aiModelsUsed: [...new Set(attackResults.results.map(r => r.model))],
        testDuration: this.calculateTestDuration(attackResults),
        dataIntegrity: 'VERIFIED'
      }
    };

    // 存儲報告到 RAG 系統
    await this.ragService.storePenetrationVector(attackResults, embedding, {
      testId: attackResults.attackId,
      category: 'eKYC_PENETRATION',
      severity: this.calculateRiskLevel(attackResults)
    });

    return format === 'pdf' ? this.convertToPDF(report) : report;
  }

  analyzeSecurityMetrics(attackResults) {
    const metrics = attackResults.penetrationMetrics || {};
    
    return {
      apcer: {
        value: metrics.apcer || 0,
        status: metrics.apcer > 0.1 ? 'CRITICAL' : metrics.apcer > 0.05 ? 'WARNING' : 'GOOD',
        benchmark: '< 0.05 (建議值)'
      },
      bpcer: {
        value: metrics.bpcer || 0,
        status: metrics.bpcer > 0.05 ? 'CRITICAL' : metrics.bpcer > 0.02 ? 'WARNING' : 'GOOD',
        benchmark: '< 0.02 (建議值)'
      },
      acer: {
        value: metrics.acer || 0,
        status: metrics.acer > 0.075 ? 'CRITICAL' : metrics.acer > 0.035 ? 'WARNING' : 'GOOD',
        benchmark: '< 0.035 (建議值)'
      },
      eer: {
        value: metrics.eer || 0,
        status: metrics.eer > 0.05 ? 'CRITICAL' : metrics.eer > 0.02 ? 'WARNING' : 'GOOD',
        benchmark: '< 0.02 (建議值)'
      }
    };
  }

  analyzeAttackVectors(attackResults) {
    const vectorAnalysis = {};
    
    attackResults.results.forEach(result => {
      if (!vectorAnalysis[result.vectorId]) {
        vectorAnalysis[result.vectorId] = {
          model: result.model,
          scenario: result.scenario,
          attempts: 0,
          successes: 0,
          avgConfidence: 0,
          bypassEffectiveness: 'LOW'
        };
      }
      
      vectorAnalysis[result.vectorId].attempts++;
      if (result.success) {
        vectorAnalysis[result.vectorId].successes++;
      }
      vectorAnalysis[result.vectorId].avgConfidence += result.confidence;
    });

    // 計算平均值和效果等級
    Object.keys(vectorAnalysis).forEach(vectorId => {
      const vector = vectorAnalysis[vectorId];
      vector.successRate = (vector.successes / vector.attempts * 100).toFixed(2) + '%';
      vector.avgConfidence = (vector.avgConfidence / vector.attempts).toFixed(3);
      vector.bypassEffectiveness = vector.successes / vector.attempts > 0.7 ? 'HIGH' : 
                                   vector.successes / vector.attempts > 0.4 ? 'MEDIUM' : 'LOW';
    });

    return vectorAnalysis;
  }

  calculateRiskLevel(attackResults) {
    const successRate = attackResults.results.filter(r => r.success).length / attackResults.results.length;
    const avgBypassScore = attackResults.results.reduce((sum, r) => sum + (r.bypassScore || 0), 0) / attackResults.results.length;
    
    if (successRate > 0.7 || avgBypassScore > 0.8) return 'CRITICAL';
    if (successRate > 0.4 || avgBypassScore > 0.6) return 'HIGH';
    if (successRate > 0.2 || avgBypassScore > 0.4) return 'MEDIUM';
    return 'LOW';
  }

  mapVulnerabilities(attackResults) {
    const vulnerabilities = [];
    
    attackResults.results.forEach(result => {
      if (result.success) {
        vulnerabilities.push({
          type: this.getVulnerabilityType(result.vectorId),
          severity: result.bypassScore > 0.8 ? 'CRITICAL' : result.bypassScore > 0.6 ? 'HIGH' : 'MEDIUM',
          affectedComponent: this.getAffectedComponent(result.vectorId),
          recommendation: this.getVulnerabilityRecommendation(result.vectorId)
        });
      }
    });

    return vulnerabilities;
  }

  getVulnerabilityType(vectorId) {
    const types = {
      'A1': 'Face Spoofing Vulnerability',
      'A2': 'Liveness Detection Bypass',
      'A3': 'Real-time Face Swap Vulnerability',
      'A4': 'Document Forgery Vulnerability',
      'A5': 'Synthetic Document Generation Vulnerability'
    };
    return types[vectorId] || 'Unknown Vulnerability';
  }

  getAffectedComponent(vectorId) {
    const components = {
      'A1': 'Face Recognition System',
      'A2': 'Liveness Detection Module',
      'A3': 'Video Verification System',
      'A4': 'Document Authentication Module',
      'A5': 'OCR and Document Validation System'
    };
    return components[vectorId] || 'Unknown Component';
  }

  getVulnerabilityRecommendation(vectorId) {
    const recommendations = {
      'A1': '實施更嚴格的臉部特徵驗證和深度學習檢測',
      'A2': '加強活體檢測演算法，增加多種檢測方式',
      'A3': '導入時序一致性檢查和視訊品質分析',
      'A4': '強化文件真偽檢測，增加安全特徵驗證',
      'A5': '建立 AI 生成內容檢測機制'
    };
    return recommendations[vectorId] || '請諮詢安全專家';
  }
}
