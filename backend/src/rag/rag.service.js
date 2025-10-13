import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service.js';

@Injectable()
export class RagService {
  constructor(neo4jService) {
    this.neo4jService = neo4jService;
  }

  // 存儲滲透測試向量數據
  async storePenetrationVector(testData, embedding, metadata) {
    const session = this.neo4jService.getSession();
    
    try {
      await session.run(`
        CREATE (pt:PenetrationTest {
          testId: $testId,
          attackVectors: $attackVectors,
          results: $results,
          embedding: $embedding,
          timestamp: datetime(),
          category: $category,
          severity: $severity
        })
        CREATE (meta:TestMetadata {
          apcer: $apcer,
          bpcer: $bpcer,
          acer: $acer,
          eer: $eer,
          overallBypass: $overallBypass
        })
        CREATE (pt)-[:HAS_METRICS]->(meta)
      `, {
        testId: metadata.testId,
        attackVectors: JSON.stringify(testData.vectors),
        results: JSON.stringify(testData.results),
        embedding: embedding,
        category: metadata.category || 'eKYC_PENETRATION',
        severity: metadata.severity || 'MEDIUM',
        apcer: testData.penetrationMetrics?.apcer || 0,
        bpcer: testData.penetrationMetrics?.bpcer || 0,
        acer: testData.penetrationMetrics?.acer || 0,
        eer: testData.penetrationMetrics?.eer || 0,
        overallBypass: testData.overallBypass || false
      });

      console.log(`滲透測試數據已存儲: ${metadata.testId}`);
    } finally {
      await session.close();
    }
  }

  // 搜尋相似的攻擊模式
  async searchSimilarAttackPatterns(queryEmbedding, category = null, limit = 10) {
    const session = this.neo4jService.getSession();
    
    try {
      const categoryFilter = category ? 'AND pt.category = $category' : '';
      
      const result = await session.run(`
        MATCH (pt:PenetrationTest)-[:HAS_METRICS]->(meta:TestMetadata)
        WHERE size(pt.embedding) = size($queryEmbedding) ${categoryFilter}
        WITH pt, meta,
             reduce(similarity = 0.0, i IN range(0, size($queryEmbedding)-1) | 
               similarity + ($queryEmbedding[i] * pt.embedding[i])) AS cosineSimilarity
        RETURN pt.testId as testId,
               pt.attackVectors as attackVectors,
               pt.results as results,
               pt.severity as severity,
               meta.apcer as apcer,
               meta.bpcer as bpcer,
               meta.acer as acer,
               meta.overallBypass as overallBypass,
               cosineSimilarity
        ORDER BY cosineSimilarity DESC
        LIMIT $limit
      `, { queryEmbedding, category, limit });

      return result.records.map(record => ({
        testId: record.get('testId'),
        attackVectors: JSON.parse(record.get('attackVectors')),
        results: JSON.parse(record.get('results')),
        severity: record.get('severity'),
        metrics: {
          apcer: record.get('apcer'),
          bpcer: record.get('bpcer'),
          acer: record.get('acer'),
          overallBypass: record.get('overallBypass')
        },
        similarity: record.get('cosineSimilarity')
      }));
    } finally {
      await session.close();
    }
  }

  // 生成防禦建議
  async generateDefenseRecommendations(attackPattern) {
    const similarPatterns = await this.searchSimilarAttackPatterns(
      attackPattern.embedding, 
      'eKYC_PENETRATION', 
      5
    );

    const recommendations = [];
    
    // 根據歷史攻擊模式生成建議
    if (similarPatterns.some(p => p.metrics.apcer > 0.7)) {
      recommendations.push({
        priority: 'CRITICAL',
        category: 'DETECTION_ENHANCEMENT',
        suggestion: '強化攻擊樣本檢測能力，降低 APCER 至 0.5 以下',
        implementation: '調整檢測閾值、增加對抗性訓練樣本'
      });
    }

    if (similarPatterns.some(p => p.metrics.bpcer > 0.3)) {
      recommendations.push({
        priority: 'HIGH',
        category: 'FALSE_POSITIVE_REDUCTION',
        suggestion: '優化正常樣本分類，降低誤殺率',
        implementation: '重新訓練分類模型、調整決策邊界'
      });
    }

    return {
      totalRecommendations: recommendations.length,
      recommendations,
      basedOnPatterns: similarPatterns.length,
      confidence: similarPatterns.length > 3 ? 'HIGH' : 'MEDIUM'
    };
  }

  // 向量化攻擊數據
  async generateAttackEmbedding(attackData) {
    // 簡化的向量化過程，實際應整合 Google Vertex AI
    const features = [];
    
    // 攻擊向量特徵
    const vectorFeatures = attackData.vectors.map(v => {
      switch(v) {
        case 'A1': return [1, 0, 0, 0, 0]; // StyleGAN3
        case 'A2': return [0, 1, 0, 0, 0]; // StableDiffusion
        case 'A3': return [0, 0, 1, 0, 0]; // SimSwap
        case 'A4': return [0, 0, 0, 1, 0]; // Diffusion+GAN
        case 'A5': return [0, 0, 0, 0, 1]; // DALL·E
        default: return [0, 0, 0, 0, 0];
      }
    }).flat();

    // 成功率特徵
    const successRate = attackData.results.filter(r => r.success).length / attackData.results.length;
    
    // 信心度特徵
    const avgConfidence = attackData.results.reduce((sum, r) => sum + r.confidence, 0) / attackData.results.length;

    features.push(...vectorFeatures, successRate, avgConfidence);
    
    // 補齊到固定維度 (768 維，對應典型的 transformer 嵌入)
    while (features.length < 768) {
      features.push(Math.random() * 0.1 - 0.05); // 小隨機值
    }

    return features.slice(0, 768);
  }
}
