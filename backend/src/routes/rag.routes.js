// src/routes/rag.routes.js
const ErrorHandler = require('../utils/errorHandler');
const Logger = require('../utils/logger');
const { validateRequired, validateString, validateObject } = require('../utils/validation');
const multer = require('multer');

// 設定檔案上傳
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['text/plain', 'application/pdf', 'application/json'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('不支援的檔案類型'), false);
        }
    }
});

class RAGRoutes {
    static register(app, services) {
        const { ragService } = services;

        // 取得 RAG 系統統計
        app.get('/rag/stats', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('取得 RAG 系統統計');
            const stats = ragService.getStats();
            res.json({
                success: true,
                stats,
                timestamp: new Date().toISOString()
            });
        }));

        // RAG 問答
        app.post('/rag/ask', ErrorHandler.asyncHandler(async (req, res) => {
            const validation = validateRequired(req.body, ['question']);
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要參數',
                    details: validation.errors
                });
            }

            const { question, filters = {} } = req.body;

            Logger.info('RAG 問答', { question: question.substring(0, 100) });

            try {
                const result = await ragService.askQuestion(question, filters);
                res.json({
                    success: true,
                    ...result
                });
            } catch (error) {
                Logger.error('RAG 問答失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: 'RAG 問答失敗',
                    message: error.message
                });
            }
        }));

        // 攝取文件 (文字)
        app.post('/rag/ingest/text', ErrorHandler.asyncHandler(async (req, res) => {
            const validation = validateRequired(req.body, ['text']);
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要參數',
                    details: validation.errors
                });
            }

            const { text, metadata = {} } = req.body;

            if (!validateString(text, 10, 100000).valid) {
                return res.status(400).json({
                    success: false,
                    error: '文字長度必須在 10-100000 字元之間'
                });
            }

            Logger.info('RAG 文字攝取', { textLength: text.length });

            try {
                const result = await ragService.ingestDocument(text, metadata);
                Logger.success('文字攝取成功', { documentId: result.documentId });
                res.json(result);
            } catch (error) {
                Logger.error('文字攝取失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '文字攝取失敗',
                    message: error.message
                });
            }
        }));

        // 攝取檔案
        app.post('/rag/ingest/file', upload.single('document'), ErrorHandler.asyncHandler(async (req, res) => {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: '未提供檔案'
                });
            }

            const { metadata = '{}' } = req.body;
            let parsedMetadata = {};

            try {
                parsedMetadata = JSON.parse(metadata);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    error: '無效的 metadata JSON 格式'
                });
            }

            Logger.info('RAG 檔案攝取', {
                filename: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype
            });

            try {
                // 讀取檔案內容
                const fs = require('fs').promises;
                let fileContent = '';

                if (req.file.mimetype === 'text/plain') {
                    fileContent = await fs.readFile(req.file.path, 'utf8');
                } else if (req.file.mimetype === 'application/json') {
                    const jsonContent = await fs.readFile(req.file.path, 'utf8');
                    const jsonData = JSON.parse(jsonContent);
                    fileContent = JSON.stringify(jsonData, null, 2);
                } else if (req.file.mimetype === 'application/pdf') {
                    // 這裡可以整合 PDF 解析庫
                    fileContent = '待實作：PDF 內容解析';
                }

                // 清理暫存檔案
                await fs.unlink(req.file.path);

                const enrichedMetadata = {
                    ...parsedMetadata,
                    originalFilename: req.file.originalname,
                    fileSize: req.file.size,
                    mimeType: req.file.mimetype,
                    uploadedAt: new Date().toISOString()
                };

                const result = await ragService.ingestDocument(fileContent, enrichedMetadata);
                Logger.success('檔案攝取成功', { documentId: result.documentId });
                res.json(result);

            } catch (error) {
                // 確保清理暫存檔案
                try {
                    await require('fs').promises.unlink(req.file.path);
                } catch (cleanupError) {
                    Logger.warn('清理暫存檔案失敗', { error: cleanupError.message });
                }

                Logger.error('檔案攝取失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '檔案攝取失敗',
                    message: error.message
                });
            }
        }));

        // 攝取法律文件
        app.post('/rag/ingest/legal', ErrorHandler.asyncHandler(async (req, res) => {
            const validation = validateRequired(req.body, ['title', 'content']);
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要參數',
                    details: validation.errors
                });
            }

            const {
                title,
                content,
                source,
                documentType = 'regulation',
                jurisdiction = 'TW',
                lawCategory,
                articleNumber,
                effectiveDate,
                metadata = {}
            } = req.body;

            Logger.info('RAG 法律文件攝取', { title, documentType, jurisdiction });

            try {
                const legalData = {
                    title,
                    content,
                    source,
                    documentType,
                    jurisdiction,
                    lawCategory,
                    articleNumber,
                    effectiveDate,
                    metadata
                };

                const result = await ragService.ingestLegalDocument(legalData);
                Logger.success('法律文件攝取成功', { documentId: result.documentId });
                res.json(result);

            } catch (error) {
                Logger.error('法律文件攝取失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '法律文件攝取失敗',
                    message: error.message
                });
            }
        }));

        // 搜尋文件
        app.post('/rag/search', ErrorHandler.asyncHandler(async (req, res) => {
            const validation = validateRequired(req.body, ['query']);
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要參數',
                    details: validation.errors
                });
            }

            const {
                query,
                limit = 10,
                threshold = 0.7,
                documentTypes = [],
                timeRange = {}
            } = req.body;

            Logger.info('RAG 文件搜尋', { query: query.substring(0, 100), limit, threshold });

            try {
                const results = await ragService.searchDocuments({
                    query,
                    limit: Math.min(limit, 50), // 限制最大 50 筆
                    threshold: Math.max(0.1, Math.min(threshold, 1.0)), // 限制閾值範圍
                    documentTypes,
                    timeRange
                });

                res.json({
                    success: true,
                    results,
                    query,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                Logger.error('文件搜尋失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '文件搜尋失敗',
                    message: error.message
                });
            }
        }));

        // 取得文件詳情
        app.get('/rag/document/:documentId', ErrorHandler.asyncHandler(async (req, res) => {
            const { documentId } = req.params;

            if (!documentId) {
                return res.status(400).json({
                    success: false,
                    error: '缺少文件 ID'
                });
            }

            Logger.info('取得文件詳情', { documentId });

            try {
                const document = await ragService.getDocument(documentId);

                if (!document) {
                    return res.status(404).json({
                        success: false,
                        error: '找不到指定文件'
                    });
                }

                res.json({
                    success: true,
                    document,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                Logger.error('取得文件失敗', { error: error.message, documentId });
                res.status(500).json({
                    success: false,
                    error: '取得文件失敗',
                    message: error.message
                });
            }
        }));

        // 刪除文件
        app.delete('/rag/document/:documentId', ErrorHandler.asyncHandler(async (req, res) => {
            const { documentId } = req.params;
            const { cascade = true } = req.query;

            Logger.info('刪除文件', { documentId, cascade });

            try {
                const result = await ragService.deleteDocument(documentId, cascade === 'true');

                if (result.success) {
                    Logger.success('文件刪除成功', { documentId });
                } else {
                    Logger.warn('文件刪除失敗', { documentId, message: result.message });
                }

                res.json(result);

            } catch (error) {
                Logger.error('刪除文件失敗', { error: error.message, documentId });
                res.status(500).json({
                    success: false,
                    error: '刪除文件失敗',
                    message: error.message
                });
            }
        }));

        // 批次處理
        app.post('/rag/batch/ingest', ErrorHandler.asyncHandler(async (req, res) => {
            const { documents = [] } = req.body;

            if (!Array.isArray(documents) || documents.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: '必須提供文件陣列'
                });
            }

            if (documents.length > 50) {
                return res.status(400).json({
                    success: false,
                    error: '批次處理文件數量不能超過 50 個'
                });
            }

            Logger.info('批次文件攝取', { count: documents.length });

            try {
                const results = await ragService.batchIngestDocuments(documents);

                const successCount = results.filter(r => r.success).length;
                const failureCount = results.length - successCount;

                Logger.info('批次攝取完成', { total: results.length, success: successCount, failed: failureCount });

                res.json({
                    success: true,
                    results,
                    summary: {
                        total: results.length,
                        successful: successCount,
                        failed: failureCount,
                        successRate: `${Math.round((successCount / results.length) * 100)}%`
                    },
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                Logger.error('批次攝取失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '批次攝取失敗',
                    message: error.message
                });
            }
        }));

        Logger.success('RAG 路由註冊完成', { routes: 9 });
        return 9;
    }
}

module.exports = RAGRoutes;
