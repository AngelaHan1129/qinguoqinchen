import { Injectable } from '@nestjs/common';
import { GoogleCloudService } from '../google-cloud/google-cloud.service.js';
import { Neo4jService } from '../neo4j/neo4j.service.js';

@Injectable()
export class VertexRagService {
  constructor(googleCloudService, neo4jService) {
    this.googleCloudService = googleCloudService;
    this.neo4jService = neo4jService;
  }

  // 存儲滲透測試數據到向量資料庫
  async storePenetrationTestData(testData, metadata = {}) {
    try {
      // 生成測試報告的文本描述
      const reportText = this.generateReportText(testData);
      
      // 使用 Vertex AI 生成嵌入向量
      const embedding = await this.googleCloudService.generateEmbedding(reportText);
      
      // 存儲到 Neo4j
      await this.storeInNeo4j(testData, embedding, reportText, metadata);
      
      console.log(`✅ 滲透測試數據已存儲: ${testData.attackId}`);
      
      return {
        success: true,
        testId: testData.attackId,
        embeddingDimension: embedding.length,
        storedAt: new Date()
      };
    } catch (error) {
      console.error('❌ 存儲滲透測試數據失敗:', error);
      throw error;
    }
  }

  // 搜尋相似的攻擊模式
  async searchSimilarAttackPatterns(query, options = {}) {
    try {
      const { 
        limit = 5, 
        threshold = 0.7, 
        category = null,
        timeRange = null 
      } = options;

      // 生成查詢嵌入
      const queryEmbedding = await this.googleCloudService.generateEmbedding(query);
      
      // 在 Neo4j 中搜尋相似模式
      const similarPatterns = await this.searchInNeo4j(queryEmbedding, {
        limit,
        threshold,
        category,
        timeRange
      });

      // 使用 Gemini 分析結果
      const analysis = await this.analyzeWithGemini(query, similarPatterns);

      return {
        query,
        foundPatterns: similarPatterns.length,
        patterns: similarPatterns,
        aiAnalysis: analysis,
        searchMetadata: {
          threshold,
          category,
          timestamp: new Date()
        }
      };
    } catch (error) {
      console.error('❌ 搜尋相似攻擊模式失敗:', error);
      throw error;
    }
  }

  // 生成 AI 驅動的防禦建議
  async generateDefenseRecommendations(attackData, contextData = {}) {
    try {
      // 搜尋相關的歷史案例
      const searchQuery = this.buildSearchQuery(attackData);
      const similarCases = await this.searchSimilarAttackPatterns(searchQuery, {
        limit: 10,
        category: 'eKYC_PENETRATION'
      });

      // 使用 Gemini 生成詳細建議
      const recommendations = await this.generateRecommendationsWithGemini(
        attackData, 
        similarCases,
        contextData
      );

      return recommendations;
    } catch (error) {
      console.error('❌ 生成防禦建議失敗:', error);
      throw error;
    }
  }

  // 生成測試報告文本
  generateReportText(testData) {
    const { attackId, vectors, results, penetrationMetrics } = testData;
    
    const successfulAttacks = results.filter(r => r.success);
    const successRate = (successfulAttacks.length / results.length * 100).toFixed(2);
    
    const reportText = `
滲透測試報告 ${attackId}
測試向量: ${vectors.join(', ')}
總攻擊數: ${results.length}
成功攻擊: ${successfulAttacks.length}
成功率: ${successRate}%

攻擊詳情:
${results.map(r => `- ${r.vectorId} (${r.model}): ${r.success ? '成功' : '失敗'}, 信心度: ${r.confidence.toFixed(3)}`).join('\n')}

安全指標:
- APCER: ${penetrationMetrics?.apcer?.toFixed(4) || 'N/A'}
- BPCER: ${penetrationMetrics?.bpcer?.toFixed(4) || 'N/A'} 
- ACER: ${penetrationMetrics?.acer?.toFixed(4) || 'N/A'}
- EER: ${penetrationMetrics?.eer?.toFixed(4) || 'N/A'}

威脅等級: ${this.calculateThreatLevel(testData)}
    `.trim();

    return reportText;
  }

  // 存儲到 Neo4j
  async storeInNeo4j(testData, embedding, reportText, metadata) {
    const session = this.neo4jService.getSession();
    
    try {
      await session.run(`
        CREATE (pt:PenetrationTest {
          testId: $testId,
          attackVectors: $attackVectors,
          results: $results,
          reportText: $reportText,
          embedding: $embedding,
          timestamp: datetime(),
          category: $category,
          threatLevel: $threatLevel,
          metrics: $metrics
        })
        
        WITH pt
        UNWIND $results as result
        CREATE (attack:Attack {
          vectorId: result.vectorId,
          model: result.model,
          scenario: result.scenario,
          success: result.success,
          confidence: result.confidence,
          bypassScore: result.bypassScore
        })
        CREATE (pt)-[:EXECUTED_ATTACK]->(attack)
      `, {
        testId: testData.attackId,
        attackVectors: JSON.stringify(testData.vectors),
        results: JSON.stringify(testData.results),
        reportText,
        embedding,
        category: metadata.category || 'eKYC_PENETRATION',
        threatLevel: this.calculateThreatLevel(testData),
        metrics: JSON.stringify(testData.penetrationMetrics || {})
      });
    } finally {
      await session.close();
    }
  }

  // 在 Neo4j 中搜尋
  async searchInNeo4j(queryEmbedding, options) {
    const session = this.neo4jService.getSession();
    
    try {
      const { limit, threshold, category, timeRange } = options;
      
      let whereClause = 'WHERE size(pt.embedding) = size($queryEmbedding)';
      if (category) whereClause += ' AND pt.category = $category';
      if (timeRange) whereClause += ' AND pt.timestamp > datetime($timeRange)';
      
      const result = await session.run(`
        MATCH (pt:PenetrationTest)
        ${whereClause}
        WITH pt,
             reduce(similarity = 0.0, i IN range(0, size($queryEmbedding)-1) | 
               similarity + ($queryEmbedding[i] * pt.embedding[i])) / 
             (sqrt(reduce(norm1 = 0.0, i IN range(0, size($queryEmbedding)-1) | norm1 + $queryEmbedding[i]^2)) *
              sqrt(reduce(norm2 = 0.0, i IN range(0, size(pt.embedding)-1) | norm2 + pt.embedding[i]^2))) AS cosineSimilarity
        WHERE cosineSimilarity >= $threshold
        RETURN pt.testId as testId,
               pt.attackVectors as attackVectors,
               pt.results as results,
               pt.reportText as reportText,
               pt.threatLevel as threatLevel,
               pt.metrics as metrics,
               cosineSimilarity
        ORDER BY cosineSimilarity DESC
        LIMIT $limit
      `, { 
        queryEmbedding, 
        category, 
        timeRange, 
        threshold, 
        limit 
      });

      return result.records.map(record => ({
        testId: record.get('testId'),
        attackVectors: JSON.parse(record.get('attackVectors')),
        results: JSON.parse(record.get('results')),
        reportText: record.get('reportText'),
        threatLevel: record.get('threatLevel'),
        metrics: JSON.parse(record.get('metrics')),
        similarity: record.get('cosineSimilarity')
      }));
    } finally {
      await session.close();
    }
  }

  // 使用 Gemini 分析搜尋結果
  async analyzeWithGemini(query, similarPatterns) {
    try {
      const model = this.googleCloudService.getGeminiModel();
      
      const prompt = `
作為 eKYC 安全專家，請分析以下搜尋查詢和相似的攻擊模式：

查詢: ${query}

找到的相似攻擊模式:
${similarPatterns.map((pattern, idx) => `
${idx + 1}. 測試ID: ${pattern.testId}
   攻擊向量: ${pattern.attackVectors.join(', ')}
   威脅等級: ${pattern.threatLevel}
   相似度: ${(pattern.similarity * 100).toFixed(2)}%
   
   報告摘要: ${pattern.reportText.substring(0, 200)}...
`).join('\n')}

請提供:
1. 攻擊模式趨勢分析
2. 主要威脅向量識別
3. 安全漏洞關聯性分析
4. 風險評估等級

請以繁體中文回應，保持專業和詳細。
      `;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('❌ Gemini 分析失敗:', error);
      return '分析暫時無法完成，請稍後再試。';
    }
  }

  // 使用 Gemini 生成防禦建議
  async generateRecommendationsWithGemini(attackData, similarCases, contextData) {
    try {
      const model = this.googleCloudService.getGeminiModel();
      
      const prompt = `
作為侵國侵城 AI 安全系統的防禦專家，請根據以下滲透測試結果生成詳細的防禦建議：

當前攻擊結果:
- 測試ID: ${attackData.attackId}
- 攻擊向量: ${attackData.vectors.join(', ')}
- 成功攻擊: ${attackData.results.filter(r => r.success).length}/${attackData.results.length}
- 整體繞過狀態: ${attackData.overallBypass ? '是' : '否'}

安全指標:
- APCER: ${attackData.penetrationMetrics?.apcer?.toFixed(4) || 'N/A'}
- BPCER: ${attackData.penetrationMetrics?.bpcer?.toFixed(4) || 'N/A'}
- ACER: ${attackData.penetrationMetrics?.acer?.toFixed(4) || 'N/A'}
- EER: ${attackData.penetrationMetrics?.eer?.toFixed(4) || 'N/A'}

歷史相似案例 (${similarCases.foundPatterns} 個):
${similarCases.patterns.slice(0, 3).map(p => `
- ${p.testId}: 威脅等級 ${p.threatLevel}, 相似度 ${(p.similarity * 100).toFixed(1)}%
`).join('')}

請提供以下格式的建議:

## 🔴 緊急修復項目
- [ ] 具體修復措施
- [ ] 預期修復時間
- [ ] 優先級評估

## 🟡 中期改善建議  
- [ ] 系統強化方案
- [ ] 技術升級建議
- [ ] 流程優化措施

## 🟢 長期防禦策略
- [ ] 架構改進方向
- [ ] 監控機制建立
- [ ] 人員培訓計劃

## 📊 具體實施步驟
1. 立即行動 (24小時內)
2. 短期目標 (1週內)  
3. 中期目標 (1個月內)
4. 長期目標 (3個月內)

## 💰 成本效益分析
- 修復成本估算
- 風險降低評估
- ROI 預期

請基於 OWASP、ISO 27001 標準，以繁體中文提供專業詳細的建議。
      `;

      const result = await model.generateContent(prompt);
      const recommendationText = result.response.text();

      // 解析建議並結構化
      const structuredRecommendations = this.parseGeminiRecommendations(recommendationText);

      return {
        rawRecommendations: recommendationText,
        structuredRecommendations,
        generatedAt: new Date(),
        basedOnCases: similarCases.foundPatterns,
        confidenceLevel: similarCases.foundPatterns > 5 ? 'HIGH' : 'MEDIUM'
      };
    } catch (error) {
      console.error('❌ Gemini 建議生成失敗:', error);
      throw error;
    }
  }

  // 解析 Gemini 回應為結構化數據
  parseGeminiRecommendations(text) {
    const sections = {
      critical: [],
      medium: [],
      longTerm: [],
      implementation: [],
      costBenefit: {}
    };

    // 簡化的解析邏輯
    const lines = text.split('\n');
    let currentSection = null;

    lines.forEach(line => {
      if (line.includes('🔴') || line.includes('緊急')) currentSection = 'critical';
      else if (line.includes('🟡') || line.includes('中期')) currentSection = 'medium';
      else if (line.includes('🟢') || line.includes('長期')) currentSection = 'longTerm';
      else if (line.includes('📊') || line.includes('實施')) currentSection = 'implementation';
      else if (line.includes('💰') || line.includes('成本')) currentSection = 'costBenefit';
      
      if (line.trim().startsWith('- [ ]') && currentSection && currentSection !== 'costBenefit') {
        sections[currentSection].push(line.trim().substring(5));
      }
    });

    return sections;
  }

  // 建立搜尋查詢
  buildSearchQuery(attackData) {
    const vectors = attackData.vectors.join(' ');
    const successfulModels = attackData.results
      .filter(r => r.success)
      .map(r => r.model)
      .join(' ');

    return `攻擊向量 ${vectors} ${successfulModels} eKYC 滲透測試`;
  }

  // 計算威脅等級
  calculateThreatLevel(testData) {
    const successRate = testData.results.filter(r => r.success).length / testData.results.length;
    const avgBypass = testData.results.reduce((sum, r) => sum + (r.bypassScore || 0), 0) / testData.results.length;
    
    if (successRate >= 0.8 || avgBypass >= 0.9) return 'CRITICAL';
    if (successRate >= 0.6 || avgBypass >= 0.7) return 'HIGH';
    if (successRate >= 0.3 || avgBypass >= 0.5) return 'MEDIUM';
    return 'LOW';
  }
}
