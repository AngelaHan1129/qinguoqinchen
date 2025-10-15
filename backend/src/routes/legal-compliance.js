// backend/src/routes/legal-compliance.js
const { createLegalRagWithGemini } = require('../services/legal-rag-with-gemini.js');
const { importDefaultRegulations } = require('../../scripts/import-legal-regulations.js');

function registerLegalComplianceRoutes(app) {
    const legalRag = createLegalRagWithGemini();

    // 法規諮詢
    app.post('/legal-compliance/ask', async (req, res) => {
        try {
            const { question, context } = req.body;

            if (!question || question.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    error: '問題不能為空'
                });
            }

            const result = await legalRag.askLegalQuestion(question, context);
            res.json({ success: true, data: result });

        } catch (error) {
            console.error('法規諮詢失敗:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // 匯入法規文件
    app.post('/legal-compliance/import-regulations', async (req, res) => {
        try {
            const result = await importDefaultRegulations();
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // 健康檢查
    app.get('/legal-compliance/health', async (req, res) => {
        try {
            const health = await legalRag.healthCheck();
            res.json(health);
        } catch (error) {
            res.status(500).json({
                status: 'unhealthy',
                error: error.message
            });
        }
    });

    console.log('🏛️ 法規遵循路由註冊完成');
}

module.exports = { registerLegalComplianceRoutes };
