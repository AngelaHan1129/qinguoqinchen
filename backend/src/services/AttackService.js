// src/services/AttackService.js
const ZAPService = require('./ZAPService');
const PentestGPTService = require('./PentestGPTService');
const defaultVectorMap = {
    A1: { model: 'StyleGAN3', scenario: '高擬真臉部', successRate: 78 },
    A2: { model: 'StableDiffusion', scenario: '螢幕翻拍攻擊', successRate: 65 },
    A3: { model: 'SimSwap', scenario: '即時換臉', successRate: 89 },
    A4: { model: 'DiffusionGAN', scenario: '偽造護照', successRate: 73 },
    A5: { model: 'DALL·E', scenario: '生成假證件', successRate: 82 }
};
class AttackService {
    constructor() {
        this.attackVectors = this.initializeAttackVectors();
        this.grok = grokService;
        this.zap = new ZAPService();  // 替代 XBOW
        this.pentestGPT = new PentestGPTService(geminiService);
    }

    initializeAttackVectors() {
        return [
            {
                id: 'A1',
                model: 'StyleGAN3',
                scenario: '偽造真人自拍',
                difficulty: 'MEDIUM',
                successRate: '78%',
                description: '使用 StyleGAN3 生成高擬真臉部影像'
            },
            {
                id: 'A2',
                model: 'StableDiffusion',
                scenario: '螢幕翻拍攻擊',
                difficulty: 'LOW',
                successRate: '65%',
                description: '模擬螢幕反射和拍攝偽像'
            },
            {
                id: 'A3',
                model: 'SimSwap',
                scenario: '即時換臉攻擊',
                difficulty: 'HIGH',
                successRate: '89%',
                description: '最危險的即時視訊換臉技術'
            },
            {
                id: 'A4',
                model: 'Diffusion+GAN',
                scenario: '偽造護照攻擊',
                difficulty: 'MEDIUM',
                successRate: '73%',
                description: '生成含 MRZ 和條碼的假證件'
            },
            {
                id: 'A5',
                model: 'DALL·E',
                scenario: '生成假證件',
                difficulty: 'EASY',
                successRate: '82%',
                description: '直接生成身分證件圖像'
            }
        ];
    }

    getAllVectors() {
        console.log('⚔️ 執行 getAllVectors');
        return {
            success: true,
            vectors: this.attackVectors,
            recommendedCombos: this.getRecommendedCombos(),
            statistics: this.calculateStatistics(),
            timestamp: new Date().toISOString()
        };
    }

    executeAttack(attackParams) {
        const { vectorIds = ['A1'], intensity = 'medium' } = attackParams;
        const results = this.processAttackVectors(vectorIds, intensity);
        const summary = this.generateSummary(results);

        return {
            success: true,
            testId: this.generateTestId(),
            attackResults: {
                vectors: results,          // 改成詳細陣列
                intensity,
                results,                   // 這是個重複項可以省略
                summary                    // 衝正 summary
            },
            timestamp: new Date().toISOString()
        };
    }

    processAttackVectors(vectorIds, intensity) {
        return vectorIds.map(vectorId => ({
            vectorId,
            model: this.getModelByVector(vectorId),
            scenario: this.getScenarioByVector(vectorId),
            success: Math.random() > 0.3,
            confidence: this.calculateConfidence(),
            bypassScore: this.calculateBypassScore(),
            processingTime: this.calculateProcessingTime(),
            timestamp: new Date()
        }));
    }

    getRecommendedCombos() {
        return [
            {
                combo: ['A2', 'A3'],
                description: 'Deepfake + 翻拍攻擊',
                estimatedSuccessRate: '92%'
            },
            {
                combo: ['A1', 'A4'],
                description: '假自拍 + 假護照',
                estimatedSuccessRate: '75%'
            }
        ];
    }

    calculateStatistics() {
        return {
            totalVectors: this.attackVectors.length,
            averageSuccessRate: '77.4%',
            mostEffective: 'A3 - SimSwap',
            leastEffective: 'A2 - StableDiffusion'
        };
    }

    generateTestId() {
        return `QQC_ATK_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }

    calculateConfidence() {
        return Math.round((Math.random() * 0.8 + 0.2) * 1000) / 1000;
    }

    calculateBypassScore() {
        return Math.random() > 0.5 ? Math.round(Math.random() * 0.4 + 0.6 * 1000) / 1000 : 0;
    }

    calculateProcessingTime() {
        return Math.round(1000 + Math.random() * 3000);
    }

    generateSummary(results) {
        const successfulAttacks = results.filter(r => r.success).length;
        const successRate = Math.round((successfulAttacks / results.length) * 100);

        return {
            totalAttacks: results.length,
            successfulAttacks,
            successRate: `${successRate}%`,
            averageConfidence: Math.round((results.reduce((sum, r) => sum + r.confidence, 0) / results.length) * 1000) / 1000,
            threatLevel: successRate >= 80 ? 'CRITICAL' : successRate >= 60 ? 'HIGH' : 'MEDIUM'
        };
    }

    getModelByVector(vectorId) {
        const models = {
            'A1': 'StyleGAN3', 'A2': 'StableDiffusion', 'A3': 'SimSwap',
            'A4': 'Diffusion+GAN', 'A5': 'DALL·E'
        };
        return models[vectorId] || 'Unknown';
    }

    getScenarioByVector(vectorId) {
        const scenarios = {
            'A1': '偽造真人自拍', 'A2': '翻拍攻擊', 'A3': '即時換臉',
            'A4': '偽造護照', 'A5': '生成假證件'
        };
        return scenarios[vectorId] || 'Unknown';
    }

    async executeEnhancedAttack(attackParams) {
        const { vectorIds, intensity, targetSystem, targetUrl } = attackParams;

        try {
            // 使用 ZAP 進行真實掃描
            const zapResults = await this.zap.executeAutomatedPentest(
                vectorIds,
                intensity,
                targetUrl || 'http://localhost:3000'
            );

            // 使用 PentestGPT 進行 AI 分析
            const aiResults = await this.pentestGPT.executeAIPentest(
                targetSystem,
                vectorIds,
                zapResults
            );

            // 結合結果
            return {
                success: true,
                scanId: `ENHANCED-${Date.now()}`,
                zapScan: zapResults,
                aiAnalysis: aiResults,
                combinedScore: this.calculateCombinedScore(zapResults, aiResults),
                recommendations: this.mergeRecommendations(zapResults, aiResults),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            Logger.error('增強攻擊執行失敗', error.message);
            throw error;
        }
    }

    calculateCombinedScore(zapResults, aiResults) {
        const zapScore = 100 - (zapResults.summary.highRisk * 20 +
            zapResults.summary.mediumRisk * 10 +
            zapResults.summary.lowRisk * 5);
        const aiScore = aiResults.analysis.score || 50;

        return Math.round((zapScore + aiScore) / 2);
    }

    mergeRecommendations(zapResults, aiResults) {
        const zapRecs = zapResults.vulnerabilities.map(v => v.solution);
        const aiRecs = aiResults.recommendations || [];

        return [...new Set([...zapRecs, ...aiRecs])].filter(Boolean);
    }

}

module.exports = AttackService;
