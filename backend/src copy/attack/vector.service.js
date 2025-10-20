// src/attack/vector.service.js
const { Injectable } = require('@nestjs/common');

const VectorService = class VectorService {
  getAllVectors() {
    return {
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
    };
  }

  getModelByVector(vectorId) {
    const models = {
      'A1': 'StyleGAN3',
      'A2': 'StableDiffusion', 
      'A3': 'SimSwap',
      'A4': 'Diffusion+GAN',
      'A5': 'DALL·E'
    };
    return models[vectorId] || 'Unknown';
  }

  getScenarioByVector(vectorId) {
    const scenarios = {
      'A1': '偽造真人自拍',
      'A2': '翻拍攻擊',
      'A3': '即時換臉',
      'A4': '偽造護照',
      'A5': '直接生成假證件'
    };
    return scenarios[vectorId] || 'Unknown';
  }

  getBaseSuccessRate(vectorId, intensity) {
    const baseRates = {
      'A1': { low: 0.6, medium: 0.78, high: 0.85 },
      'A2': { low: 0.4, medium: 0.65, high: 0.75 },
      'A3': { low: 0.7, medium: 0.89, high: 0.92 },
      'A4': { low: 0.5, medium: 0.73, high: 0.80 },
      'A5': { low: 0.65, medium: 0.82, high: 0.88 }
    };
    return baseRates[vectorId]?.[intensity] || 0.5;
  }
};

Object.defineProperty(VectorService, Symbol.for('__injectable:decorator__'), {
  value: Injectable()
});

module.exports = { VectorService };
