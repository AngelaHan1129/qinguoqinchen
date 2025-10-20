// backend/src/modules/legal-rag/legal-rag.controller.js
class LegalRagController {
    constructor(legalRagService, complianceScraperService) {
        this.legalRagService = legalRagService;
        this.complianceScraperService = complianceScraperService;
    }

    /**
     * 資安法規諮詢
     * @param {Object} body - 請求內容
     * @returns {Promise<Object>} - 法規建議
     */
    async askLegalCompliance(body) {
        const { question, context = {} } = body;

        if (!question || question.trim().length === 0) {
            throw new Error('問題不能為空');
        }

        return await this.legalRagService.askLegalCompliance(question, context);
    }

    /**
     * 匯入法規文件
     * @param {Object} body - 請求內容
     * @returns {Promise<Object>} - 匯入結果
     */
    async ingestLegalDocuments(body) {
        const { documents, options = {} } = body;

        if (!documents || !Array.isArray(documents) || documents.length === 0) {
            throw new Error('文件列表不能為空');
        }

        return await this.legalRagService.ingestLegalDocuments(documents, options);
    }

    /**
     * 匯入標準法規資料庫
     * @returns {Promise<Object>} - 匯入結果
     */
    async importStandardRegulations() {
        const regulations = await this.complianceScraperService.batchImportRegulations();
        return await this.legalRagService.ingestLegalDocuments(regulations);
    }

    /**
     * 取得最新法規更新
     * @param {Object} query - 查詢參數
     * @returns {Promise<Object>} - 最新更新
     */
    async getLatestUpdates(query) {
        return await this.complianceScraperService.getLatestUpdates({
            sources: query.sources?.split(','),
            timeRange: query.timeRange || '30d'
        });
    }

    /**
     * 法規系統健康檢查
     * @returns {Promise<Object>} - 健康狀態
     */
    async healthCheck() {
        return {
            status: 'healthy',
            service: '侵國侵城資安法規遵循系統',
            version: '1.0.0',
            features: [
                '智能法規查詢',
                '合規建議生成',
                '知識圖譜建構',
                '法規更新追蹤'
            ],
            timestamp: new Date()
        };
    }
}

function createLegalRagController(legalRagService, complianceScraperService) {
    return new LegalRagController(legalRagService, complianceScraperService);
}

module.exports = { LegalRagController, createLegalRagController };
