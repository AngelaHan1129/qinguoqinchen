// backend/src/routes/legal-compliance.routes.js
function registerLegalComplianceRoutes(app, legalRagController) {
    // 資安法規諮詢
    app.post('/legal-compliance/ask', async (req, res) => {
        try {
            const result = await legalRagController.askLegalCompliance(req.body);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: `法規查詢失敗: ${error.message}`
            });
        }
    });

    // 匯入法規文件
    app.post('/legal-compliance/ingest', async (req, res) => {
        try {
            const result = await legalRagController.ingestLegalDocuments(req.body);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: `文件匯入失敗: ${error.message}`
            });
        }
    });

    // 匯入標準法規資料庫
    app.post('/legal-compliance/import-regulations', async (req, res) => {
        try {
            const result = await legalRagController.importStandardRegulations();
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: `標準法規匯入失敗: ${error.message}`
            });
        }
    });

    // 取得最新法規更新
    app.get('/legal-compliance/latest-updates', async (req, res) => {
        try {
            const result = await legalRagController.getLatestUpdates(req.query);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: `取得更新失敗: ${error.message}`
            });
        }
    });

    // 健康檢查
    app.get('/legal-compliance/health', async (req, res) => {
        try {
            const result = await legalRagController.healthCheck();
            res.json(result);
        } catch (error) {
            res.status(500).json({
                status: 'unhealthy',
                error: error.message
            });
        }
    });

    console.log('✅ 法規遵循路由已註冊');
}

module.exports = { registerLegalComplianceRoutes };
