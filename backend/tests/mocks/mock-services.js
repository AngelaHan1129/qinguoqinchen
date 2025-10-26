// tests/mocks/mock-services.js
class MockRAGService {
    constructor() {
        this.mockData = new Map();
        this.initializeMockData();
    }

    initializeMockData() {
        this.mockData.set('GDPR 合規要求', {
            results: [
                {
                    id: 'gdpr_001',
                    title: 'GDPR合規要求分析',
                    content: 'GDPR（一般資料保護規定）對eKYC系統的合規要求包括：資料處理合法性、當事人同意機制、資料最小化原則、隱私權保護等。',
                    similarity: 0.95,
                    category: 'legal',
                    metadata: {
                        documentType: 'regulation',
                        jurisdiction: 'EU',
                        source: 'legal_database',
                        articleNumber: '第6條'
                    }
                }
            ]
        });

        this.mockData.set('deepfake_detection', {
            confidence: 0.92,
            threat_detected: true,
            detection_details: {
                algorithm: 'SimSwap Detection v2.1',
                processing_time: 1234,
                risk_level: 'HIGH',
                anomaly_score: 0.92
            },
            metadata: {
                model_version: '2.1.0',
                detection_type: 'deepfake',
                timestamp: new Date().toISOString()
            }
        });
    }

    async queryCompliance(query) {
        await new Promise(resolve => setTimeout(resolve, 100));

        if (query.includes('GDPR') || query.includes('合規要求')) {
            return this.mockData.get('GDPR 合規要求');
        }

        return { results: [] };
    }

    async detectAttack(inputData, detectionType) {
        await new Promise(resolve => setTimeout(resolve, 200));

        if (detectionType === 'deepfake') {
            return this.mockData.get('deepfake_detection');
        }

        return {
            confidence: 0.65,
            threat_detected: false,
            detection_details: {
                algorithm: 'Generic Detection',
                processing_time: 800,
                risk_level: 'LOW'
            }
        };
    }
}

module.exports = { MockRAGService };
