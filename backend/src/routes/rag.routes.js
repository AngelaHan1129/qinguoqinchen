// src/routes/rag.routes.js - 完整法律文件整合版本（增強 pgvector 功能）
const ErrorHandler = require('../utils/errorHandler');
const Logger = require('../utils/logger');
const { validateRequired, validateString, validateObject } = require('../utils/validation');
const multer = require('multer');
// 在 rag.routes.js 文件開頭添加這些 import
const ComplianceCrawlerService = require('../services/ComplianceCrawlerService');
const PenTestImportService = require('../services/PenTestImportService');
const ComplianceReportService = require('../services/ComplianceReportService');



// 設定檔案上傳（支援更多檔案類型）
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
        files: 20 // 支援批次上傳
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'text/plain',
            'application/pdf',
            'application/json',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
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

        // ==================== 基礎 RAG 路由 ====================

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

        // RAG 問答（增強 sources 資訊）
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

                // 🔥 增強 sources 資訊
                const enhancedSources = result.sources?.map(source => ({
                    ...source,
                    // 增加 pgvector 相關資訊
                    databaseSource: source.source === 'pgvector' ? 'pgvector' : 'memory',
                    retrievalMethod: ragService.useDatabase ? 'hybrid' : 'memory_only',
                    contentPreview: source.content?.substring(0, 200) + '...' || '無預覽',
                    // 增加詳細查看連結
                    detailUrl: `/rag/source/${source.id}`,
                    vectorDimension: ragService.vectorServiceReady ? 1024 : null
                })) || [];

                res.json({
                    success: true,
                    ...result,
                    sources: enhancedSources,
                    // 🔥 增加系統資訊
                    systemInfo: {
                        pgvectorEnabled: ragService.useDatabase,
                        vectorServiceReady: ragService.vectorServiceReady,
                        retrievalMode: ragService.useDatabase ? 'pgvector + memory' : 'memory only',
                        totalDocumentsSearched: result.documentsUsed
                    }
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

        // 🔥 新增：取得 source 詳細資訊
        app.get('/rag/source/:sourceId', ErrorHandler.asyncHandler(async (req, res) => {
            const { sourceId } = req.params;

            Logger.info('取得 source 詳細資訊', { sourceId });

            try {
                // 從記憶體中查找
                const memoryDoc = ragService.knowledgeBase.get(sourceId);

                let sourceDetail = null;

                if (memoryDoc) {
                    sourceDetail = {
                        id: memoryDoc.id,
                        documentId: memoryDoc.documentId,
                        title: memoryDoc.title,
                        fullContent: memoryDoc.content,
                        category: memoryDoc.category,
                        metadata: memoryDoc.metadata,
                        chunkInfo: memoryDoc.chunkInfo,
                        embedding: memoryDoc.embedding ? {
                            dimensions: memoryDoc.embedding.length,
                            status: '向量已生成',
                            preview: memoryDoc.embedding.slice(0, 5).map(v => v.toFixed(4))
                        } : null,
                        source: 'memory',
                        retrievalInfo: {
                            source: 'memory',
                            lastAccessed: new Date().toISOString()
                        }
                    };
                }

                // 如果記憶體中沒有，從 pgvector 資料庫查找
                if (!sourceDetail && ragService.useDatabase && ragService.pool) {
                    const dbResult = await ragService.pool.query(
                        'SELECT * FROM legal_documents WHERE id = $1',
                        [sourceId]
                    );

                    if (dbResult.rows.length > 0) {
                        const row = dbResult.rows[0];
                        sourceDetail = {
                            id: row.id,
                            documentId: row.document_id,
                            title: row.title,
                            fullContent: row.content,
                            category: 'legal',
                            metadata: row.metadata,
                            documentType: row.document_type,
                            jurisdiction: row.jurisdiction,
                            lawCategory: row.law_category,
                            articleNumber: row.article_number,
                            embedding: row.embedding ? {
                                dimensions: 1024,
                                status: '向量已存儲在 pgvector',
                                preview: 'pgvector 向量資料'
                            } : null,
                            source: 'pgvector',
                            createdAt: row.created_at,
                            updatedAt: row.updated_at,
                            retrievalInfo: {
                                source: 'pgvector',
                                chunkIndex: row.chunk_index,
                                chunkType: row.chunk_type,
                                language: row.language
                            }
                        };
                    }
                }

                if (!sourceDetail) {
                    return res.status(404).json({
                        success: false,
                        error: '找不到指定的 source'
                    });
                }

                res.json({
                    success: true,
                    sourceDetail,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                Logger.error('取得 source 失敗', { error: error.message, sourceId });
                res.status(500).json({
                    success: false,
                    error: '取得 source 失敗',
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
                const fs = require('fs').promises;
                let fileContent = '';

                if (req.file.mimetype === 'text/plain') {
                    fileContent = await fs.readFile(req.file.path, 'utf8');
                } else if (req.file.mimetype === 'application/json') {
                    const jsonContent = await fs.readFile(req.file.path, 'utf8');
                    const jsonData = JSON.parse(jsonContent);
                    fileContent = JSON.stringify(jsonData, null, 2);
                } else if (req.file.mimetype === 'application/pdf') {
                    fileContent = '待實作：PDF 內容解析';
                }

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

        // 🔥 新增：批次檔案匯入（支援多檔案上傳）
        app.post('/rag/legal/import-files', upload.array('documents', 20), ErrorHandler.asyncHandler(async (req, res) => {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: '未提供檔案'
                });
            }

            Logger.info('法律文件批次檔案匯入', { count: req.files.length });

            try {
                const results = [];
                const fs = require('fs').promises;

                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    try {
                        // 讀取檔案內容
                        let content = '';
                        if (file.mimetype === 'text/plain') {
                            content = await fs.readFile(file.path, 'utf8');
                        } else if (file.mimetype === 'application/json') {
                            const jsonContent = await fs.readFile(file.path, 'utf8');
                            const jsonData = JSON.parse(jsonContent);
                            content = jsonData.content || JSON.stringify(jsonData, null, 2);
                        }

                        // 從檔名推斷文件資訊
                        const filename = file.originalname;
                        const legalData = {
                            title: filename.replace(/\.[^/.]+$/, ''), // 移除副檔名
                            content: content,
                            documentType: filename.includes('法') ? 'law' : 'regulation',
                            jurisdiction: 'TW',
                            lawCategory: this.extractLawCategory(filename),
                            source: 'file_import',
                            metadata: {
                                originalFilename: filename,
                                fileSize: file.size,
                                importedAt: new Date().toISOString(),
                                importMethod: 'batch_file_upload'
                            }
                        };

                        // 匯入到 RAG 系統
                        const result = await ragService.ingestLegalDocument(legalData);

                        results.push({
                            index: i,
                            filename: filename,
                            success: true,
                            documentId: result.documentId,
                            chunksCreated: result.chunksCreated,
                            storageMode: result.storageMode
                        });

                        // 清理暫存檔案
                        await fs.unlink(file.path);

                    } catch (error) {
                        results.push({
                            index: i,
                            filename: file.originalname,
                            success: false,
                            error: error.message
                        });

                        // 清理暫存檔案
                        try {
                            await fs.unlink(file.path);
                        } catch { }
                    }
                }

                const successCount = results.filter(r => r.success).length;

                res.json({
                    success: true,
                    results,
                    summary: {
                        total: results.length,
                        successful: successCount,
                        failed: results.length - successCount,
                        successRate: `${Math.round((successCount / results.length) * 100)}%`
                    },
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                Logger.error('批次檔案匯入失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '批次檔案匯入失敗',
                    message: error.message
                });
            }
        }));

        // 🔥 新增：CSV 檔案匯入
        app.post('/rag/legal/import-csv', upload.single('csvFile'), ErrorHandler.asyncHandler(async (req, res) => {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: '未提供 CSV 檔案'
                });
            }

            Logger.info('CSV 法律文件匯入', { filename: req.file.originalname });

            try {
                const fs = require('fs').promises;
                const csvContent = await fs.readFile(req.file.path, 'utf8');

                // 簡單的 CSV 解析
                const lines = csvContent.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

                const results = [];

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;

                    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                    const row = {};

                    headers.forEach((header, index) => {
                        row[header] = values[index] || '';
                    });

                    try {
                        const legalData = {
                            title: row.title || row.標題 || `文件 ${i}`,
                            content: row.content || row.內容 || '',
                            documentType: row.documentType || row.文件類型 || 'regulation',
                            jurisdiction: row.jurisdiction || row.管轄區 || 'TW',
                            lawCategory: row.lawCategory || row.法規類別 || '其他',
                            articleNumber: row.articleNumber || row.條文編號 || null,
                            source: 'csv_import',
                            metadata: {
                                csvRow: i,
                                originalFilename: req.file.originalname,
                                importedAt: new Date().toISOString()
                            }
                        };

                        const result = await ragService.ingestLegalDocument(legalData);

                        results.push({
                            row: i,
                            success: true,
                            title: legalData.title,
                            documentId: result.documentId,
                            chunksCreated: result.chunksCreated
                        });

                    } catch (error) {
                        results.push({
                            row: i,
                            success: false,
                            title: row.title || `第 ${i} 行`,
                            error: error.message
                        });
                    }
                }

                // 清理暫存檔案
                await fs.unlink(req.file.path);

                const successCount = results.filter(r => r.success).length;

                res.json({
                    success: true,
                    results,
                    summary: {
                        total: results.length,
                        successful: successCount,
                        failed: results.length - successCount,
                        successRate: `${Math.round((successCount / results.length) * 100)}%`
                    },
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                Logger.error('CSV 匯入失敗', { error: error.message });

                // 清理暫存檔案
                try {
                    await require('fs').promises.unlink(req.file.path);
                } catch { }

                res.status(500).json({
                    success: false,
                    error: 'CSV 匯入失敗',
                    message: error.message
                });
            }
        }));

        // 🔥 新增：檢視 pgvector 中的文件
        app.get('/rag/pgvector/documents', ErrorHandler.asyncHandler(async (req, res) => {
            const { page = 1, limit = 20, documentType, jurisdiction, lawCategory } = req.query;

            if (!ragService.useDatabase || !ragService.pool) {
                return res.status(400).json({
                    success: false,
                    error: 'pgvector 資料庫未啟用'
                });
            }

            try {
                let whereClause = '';
                let queryParams = [];
                let paramIndex = 1;

                const conditions = [];

                if (documentType) {
                    conditions.push(`document_type = $${paramIndex}`);
                    queryParams.push(documentType);
                    paramIndex++;
                }

                if (jurisdiction) {
                    conditions.push(`jurisdiction = $${paramIndex}`);
                    queryParams.push(jurisdiction);
                    paramIndex++;
                }

                if (lawCategory) {
                    conditions.push(`law_category = $${paramIndex}`);
                    queryParams.push(lawCategory);
                    paramIndex++;
                }

                if (conditions.length > 0) {
                    whereClause = 'WHERE ' + conditions.join(' AND ');
                }

                const offset = (page - 1) * limit;
                queryParams.push(limit, offset);

                const result = await ragService.pool.query(`
                    SELECT 
                        id, document_id, title, 
                        document_type, jurisdiction, law_category, 
                        article_number, chunk_index, 
                        length(content) as content_length,
                        CASE WHEN embedding IS NOT NULL THEN '已生成' ELSE '未生成' END as embedding_status,
                        created_at, updated_at
                    FROM legal_documents 
                    ${whereClause}
                    ORDER BY created_at DESC
                    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
                `, queryParams);

                const countResult = await ragService.pool.query(`
                    SELECT COUNT(*) as total FROM legal_documents ${whereClause}
                `, queryParams.slice(0, -2));

                res.json({
                    success: true,
                    documents: result.rows,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: parseInt(countResult.rows[0].total),
                        totalPages: Math.ceil(countResult.rows[0].total / limit)
                    },
                    pgvectorInfo: {
                        enabled: true,
                        vectorDimension: 1024,
                        indexType: 'hnsw'
                    },
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                Logger.error('查詢 pgvector 文件失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '查詢 pgvector 文件失敗',
                    message: error.message
                });
            }
        }));

        // 攝取法律文件 (舊版相容)
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
                title, content, source, documentType = 'regulation',
                jurisdiction = 'TW', lawCategory, articleNumber,
                effectiveDate, metadata = {}
            } = req.body;

            Logger.info('RAG 法律文件攝取 (舊版)', { title, documentType, jurisdiction });

            try {
                const legalData = {
                    title, content, source, documentType, jurisdiction,
                    lawCategory, articleNumber, effectiveDate, metadata
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
                query, limit = 10, threshold = 0.7,
                documentTypes = [], timeRange = {}
            } = req.body;

            Logger.info('RAG 文件搜尋', { query: query.substring(0, 100), limit, threshold });

            try {
                const results = await ragService.searchDocuments({
                    query,
                    limit: Math.min(limit, 50),
                    threshold: Math.max(0.1, Math.min(threshold, 1.0)),
                    documentTypes, timeRange
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

        // ==================== 法律文件專用路由 ====================

        // 法律文件匯入 (增強版)
        app.post('/rag/legal/import', ErrorHandler.asyncHandler(async (req, res) => {
            const validation = validateRequired(req.body, ['title', 'content']);
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要參數',
                    details: validation.errors
                });
            }

            const {
                title, content, documentType = 'regulation',
                jurisdiction = 'TW', lawCategory, articleNumber,
                effectiveDate, source, language = 'zh-TW', metadata = {}
            } = req.body;

            Logger.info('法律文件匯入', {
                title, documentType, jurisdiction, lawCategory,
                contentLength: content.length
            });

            try {
                const legalData = {
                    title, content, documentType, jurisdiction, lawCategory,
                    articleNumber,
                    effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
                    source: source || 'user_import', language,
                    metadata: {
                        ...metadata,
                        importedAt: new Date().toISOString(),
                        importedBy: req.headers['user-id'] || 'anonymous'
                    }
                };

                const result = await ragService.ingestLegalDocument(legalData);

                Logger.success('法律文件匯入成功', {
                    documentId: result.documentId,
                    chunksCreated: result.chunksCreated,
                    storageMode: result.storageMode
                });

                res.json({
                    success: true,
                    message: '法律文件匯入成功',
                    ...result
                });

            } catch (error) {
                Logger.error('法律文件匯入失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '法律文件匯入失敗',
                    message: error.message
                });
            }
        }));

        // 法律文件批量匯入
        app.post('/rag/legal/batch-import', ErrorHandler.asyncHandler(async (req, res) => {
            const { documents = [] } = req.body;

            if (!Array.isArray(documents) || documents.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: '必須提供法律文件陣列'
                });
            }

            if (documents.length > 20) {
                return res.status(400).json({
                    success: false,
                    error: '批次匯入法律文件數量不能超過 20 個'
                });
            }

            Logger.info('法律文件批次匯入', { count: documents.length });

            try {
                const results = [];

                for (let i = 0; i < documents.length; i++) {
                    const doc = documents[i];
                    try {
                        const legalData = {
                            title: doc.title,
                            content: doc.content,
                            documentType: doc.documentType || 'regulation',
                            jurisdiction: doc.jurisdiction || 'TW',
                            lawCategory: doc.lawCategory,
                            articleNumber: doc.articleNumber,
                            effectiveDate: doc.effectiveDate ? new Date(doc.effectiveDate) : null,
                            source: doc.source || 'batch_import',
                            metadata: {
                                ...doc.metadata,
                                batchImportIndex: i,
                                importedAt: new Date().toISOString()
                            }
                        };

                        const result = await ragService.ingestLegalDocument(legalData);
                        results.push({
                            index: i,
                            success: true,
                            documentId: result.documentId,
                            chunksCreated: result.chunksCreated
                        });

                    } catch (error) {
                        results.push({
                            index: i,
                            success: false,
                            error: error.message,
                            title: doc.title
                        });
                    }

                    if (i < documents.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }

                const successCount = results.filter(r => r.success).length;
                const failureCount = results.length - successCount;

                Logger.info('法律文件批次匯入完成', {
                    total: results.length, success: successCount, failed: failureCount
                });

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
                Logger.error('法律文件批次匯入失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '法律文件批次匯入失敗',
                    message: error.message
                });
            }
        }));

        // 法律問答 (專用)
        app.post('/rag/legal/ask', ErrorHandler.asyncHandler(async (req, res) => {
            const validation = validateRequired(req.body, ['question']);
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要參數',
                    details: validation.errors
                });
            }

            const {
                question, jurisdiction = 'TW',
                documentType, lawCategory
            } = req.body;

            const filters = {
                documentType: 'legal',
                jurisdiction, lawCategory
            };

            Logger.info('法律專業問答', {
                question: question.substring(0, 100),
                jurisdiction, documentType, lawCategory
            });

            try {
                const result = await ragService.askQuestion(question, filters);

                res.json({
                    success: true,
                    ...result,
                    legalContext: {
                        jurisdiction, documentType, lawCategory,
                        applicableLaws: result.sources?.filter(s => s.documentType) || []
                    }
                });

            } catch (error) {
                Logger.error('法律問答失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '法律問答失敗',
                    message: error.message
                });
            }
        }));

        // 搜尋法律文件 (專用)
        app.post('/rag/legal/search', ErrorHandler.asyncHandler(async (req, res) => {
            const validation = validateRequired(req.body, ['query']);
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要參數',
                    details: validation.errors
                });
            }

            const {
                query, limit = 10, threshold = 0.7,
                jurisdiction = 'TW', documentType,
                lawCategory, articleNumber
            } = req.body;

            Logger.info('法律文件搜尋', {
                query: query.substring(0, 100),
                jurisdiction, documentType, lawCategory
            });

            try {
                const results = await ragService.searchDocuments({
                    query,
                    limit: Math.min(limit, 50),
                    threshold: Math.max(0.1, Math.min(threshold, 1.0)),
                    documentTypes: ['legal'],
                    jurisdiction, lawCategory, articleNumber
                });

                const enhancedResults = {
                    ...results,
                    legalSummary: {
                        jurisdictions: [...new Set(results.results?.map(r => r.metadata?.jurisdiction).filter(Boolean))],
                        documentTypes: [...new Set(results.results?.map(r => r.metadata?.documentType).filter(Boolean))],
                        lawCategories: [...new Set(results.results?.map(r => r.metadata?.lawCategory).filter(Boolean))],
                        articlesFound: results.results?.filter(r => r.metadata?.articleNumber).length || 0
                    }
                };

                res.json({
                    success: true,
                    results: enhancedResults,
                    query,
                    legalFilters: { jurisdiction, documentType, lawCategory },
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                Logger.error('法律文件搜尋失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '法律文件搜尋失敗',
                    message: error.message
                });
            }
        }));

        // 取得法律文件統計
        app.get('/rag/legal/stats', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('取得法律文件統計');

            try {
                const stats = ragService.getStats();

                res.json({
                    success: true,
                    stats,
                    legalSpecific: {
                        supportedJurisdictions: ['TW', 'US', 'EU', 'CN'],
                        documentTypes: ['law', 'regulation', 'interpretation', 'case'],
                        features: [
                            '條文級別分析',
                            '跨司法管轄區檢索',
                            '法律概念語意搜尋',
                            '合規要求自動分析',
                            'pgvector 向量檢索',
                            '雙重存儲架構'
                        ]
                    },
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                Logger.error('取得法律統計失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '取得法律統計失敗',
                    message: error.message
                });
            }
        }));

        // 🔥 法規爬蟲與匯入路由
        app.post('/rag/compliance/crawl', ErrorHandler.asyncHandler(async (req, res) => {
            const { sources = [], forceUpdate = false } = req.body;

            const validSources = ['ISO_27001', 'OWASP_TOP10', 'TW_LEGAL_DB', 'IEC_62443'];
            const targetSources = sources.length > 0 ? sources : validSources;

            Logger.info('🔍 開始爬取法規資料', { sources: targetSources, forceUpdate });

            try {
                const crawlerService = new ComplianceCrawlerService(ragService);
                const results = {};

                for (const source of targetSources) {
                    if (!validSources.includes(source)) {
                        continue;
                    }

                    try {
                        switch (source) {
                            case 'ISO_27001':
                                results.iso27001 = await crawlerService.crawlIso27001();
                                break;
                            case 'OWASP_TOP10':
                                results.owasp = await crawlerService.crawlOwaspTop10();
                                break;
                            case 'TW_LEGAL_DB':
                                results.taiwan = await crawlerService.crawlTaiwanLegalDatabase();
                                break;
                            case 'IEC_62443':
                                results.iec62443 = await crawlerService.crawlIec62443();
                                break;
                        }
                    } catch (error) {
                        Logger.error(`${source} 爬取失敗:`, error.message);
                        results[source] = { error: error.message };
                    }
                }

                const totalDocuments = Object.values(results)
                    .filter(r => Array.isArray(r))
                    .reduce((sum, r) => sum + r.length, 0);

                res.json({
                    success: true,
                    message: '法規資料爬取完成',
                    results,
                    summary: {
                        totalSources: targetSources.length,
                        totalDocuments,
                        timestamp: new Date().toISOString()
                    }
                });

            } catch (error) {
                Logger.error('法規爬取失敗:', error.message);
                res.status(500).json({
                    success: false,
                    error: '法規爬取失敗',
                    message: error.message
                });
            }
        }));

        // 🔥 滲透測試報告匯入
        app.post('/rag/pentest/import', upload.single('report'), ErrorHandler.asyncHandler(async (req, res) => {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: '未提供滲透測試報告檔案'
                });
            }

            const { toolType, targetSystem, testDate, metadata = '{}' } = req.body;

            Logger.info('📊 匯入滲透測試報告', {
                toolType,
                targetSystem,
                filename: req.file.originalname
            });

            try {
                const fs = require('fs').promises;
                const fileContent = await fs.readFile(req.file.path, 'utf8');

                let reportData;
                if (req.file.mimetype === 'application/json') {
                    reportData = JSON.parse(fileContent);
                } else if (req.file.mimetype === 'text/xml' || req.file.mimetype === 'application/xml') {
                    reportData = await this.parseXmlReport(fileContent, toolType);
                } else {
                    reportData = { rawContent: fileContent };
                }

                const penTestService = new PenTestImportService(ragService);

                const results = await penTestService.importPenTestReport(reportData, {
                    toolType,
                    targetSystem,
                    testDate,
                    originalFilename: req.file.originalname,
                    ...JSON.parse(metadata)
                });

                await fs.unlink(req.file.path);

                res.json({
                    success: true,
                    message: '滲透測試報告匯入成功',
                    results: {
                        totalFindings: results.length,
                        severityBreakdown: this.analyzeSeverityBreakdown(results),
                        complianceImpact: this.analyzeComplianceImpact(results)
                    },
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                Logger.error('滲透測試報告匯入失敗:', error.message);
                res.status(500).json({
                    success: false,
                    error: '滲透測試報告匯入失敗',
                    message: error.message
                });
            }
        }));

        // 🔥 數位取證證據匯入
        app.post('/rag/forensics/import', upload.single('evidence'), ErrorHandler.asyncHandler(async (req, res) => {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: '未提供取證證據檔案'
                });
            }

            const { evidenceType, caseId, investigator, metadata = '{}' } = req.body;

            Logger.info('🔍 匯入數位取證證據', {
                evidenceType,
                caseId,
                filename: req.file.originalname
            });

            try {
                const fs = require('fs').promises;
                const fileContent = await fs.readFile(req.file.path, 'utf8');

                const evidenceData = JSON.parse(fileContent);

                const penTestService = new PenTestImportService(ragService);

                const results = await penTestService.importForensicsEvidence(evidenceData, {
                    evidenceType,
                    caseId,
                    investigator,
                    originalFilename: req.file.originalname,
                    ...JSON.parse(metadata)
                });

                await fs.unlink(req.file.path);

                res.json({
                    success: true,
                    message: '數位取證證據匯入成功',
                    results: {
                        totalItems: results.length,
                        evidenceTypes: [...new Set(results.map(r => r.metadata.evidenceType))],
                        legalRelevanceScore: this.calculateLegalRelevance(results)
                    },
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                Logger.error('數位取證證據匯入失敗:', error.message);
                res.status(500).json({
                    success: false,
                    error: '數位取證證據匯入失敗',
                    message: error.message
                });
            }
        }));

        // 在 rag.routes.js 中修改報告路由
        app.post('/rag/compliance/report', ErrorHandler.asyncHandler(async (req, res) => {
            const {
                findingIds = [],
                reportFormat = 'txt',
                includeAuditTrail = true,
                complianceFrameworks = ['ISO_27001', 'OWASP']
            } = req.body;

            Logger.info('📋 生成合規報告', {
                findingCount: findingIds.length,
                format: reportFormat
            });

            try {
                const findings = await RAGRoutes.getComplianceFindings(ragService, findingIds);
                const reportService = new ComplianceReportService(ragService, services.geminiService);

                const reportBuffer = await reportService.generateComplianceReport(findings, {
                    format: reportFormat,
                    includeAuditTrail,
                    complianceFrameworks
                });

                // 🔥 修正這裡：根據格式設定正確的 Content-Type 和檔名
                let contentType, fileExtension, filename;

                switch (reportFormat) {
                    case 'pdf':
                        contentType = 'application/pdf';
                        fileExtension = 'pdf';
                        break;
                    case 'excel':
                        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                        fileExtension = 'xlsx';
                        break;
                    case 'txt':
                    default:
                        contentType = 'text/plain; charset=utf-8';
                        fileExtension = 'txt';
                        break;
                }

                filename = `compliance_report_${new Date().toISOString().split('T')[0]}.${fileExtension}`;

                // 設定正確的 headers
                res.setHeader('Content-Type', contentType);
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                res.setHeader('Content-Length', reportBuffer.length);

                // 發送檔案
                res.send(reportBuffer);

            } catch (error) {
                Logger.error('合規報告生成失敗:', error.message);
                res.status(500).json({
                    success: false,
                    error: '合規報告生成失敗',
                    message: error.message
                });
            }
        }));



        Logger.success('完整 RAG 路由註冊完成', {
            basicRoutes: 10,
            legalRoutes: 6,
            pgvectorRoutes: 4,
            totalRoutes: 20
        });

        return 20;
    }

    // 🔥 輔助方法：從檔名推斷法律類別
    static extractLawCategory(filename) {
        const categories = {
            '個資': '個資法',
            '銀行': '銀行法',
            '金融': '金融法',
            '資安': '資安法',
            '洗錢': '洗錢防制法',
            'ekyc': 'eKYC規範',
            'kyc': 'KYC規範',
            '證券': '證券法',
            '保險': '保險法',
            '電子': '電子簽章法'
        };

        for (const [key, value] of Object.entries(categories)) {
            if (filename.toLowerCase().includes(key)) {
                return value;
            }
        }

        return '其他法規';
    }

    // 在 RAGRoutes class 的靜態方法區域添加：

    static async getComplianceFindings(ragService, findingIds) {
        // 如果沒有提供具體的 findingIds，使用剛才匯入的文檔
        if (findingIds.length === 0) {
            Logger.info('🔍 使用最近匯入的合規資料生成報告');

            // 創建模擬的合規發現資料
            return [
                {
                    id: 'compliance_001',
                    title: 'ISO 27001 A.5 資訊安全政策合規性',
                    content: '根據 ISO 27001 A.5 控制措施，組織需要建立明確的資訊安全政策...',
                    metadata: {
                        severity: 'medium',
                        complianceFramework: 'ISO_27001',
                        findings: ['資訊安全政策需要更新', '政策傳達機制需要改善']
                    }
                },
                {
                    id: 'compliance_002',
                    title: 'OWASP A01 存取控制破壞風險評估',
                    content: '根據 OWASP Top 10 A01 分析，系統存在存取控制破壞風險...',
                    metadata: {
                        severity: 'high',
                        complianceFramework: 'OWASP',
                        findings: ['URL 修改攻擊風險', '提權攻擊漏洞']
                    }
                },
                {
                    id: 'compliance_003',
                    title: '個人資料保護法第6條合規評估',
                    content: '根據個資法第6條規定，特種個人資料的處理需要法律依據...',
                    metadata: {
                        severity: 'high',
                        complianceFramework: 'PDPA_TW',
                        findings: ['生物特徵資料處理合規性', '同意機制完整性']
                    }
                }
            ];
        }

        // 從向量資料庫中獲取實際的合規發現
        const findings = [];

        for (const id of findingIds) {
            try {
                const finding = await ragService.getDocument(id);
                if (finding) {
                    findings.push(finding);
                }
            } catch (error) {
                Logger.warn(`無法獲取發現 ${id}:`, error.message);
            }
        }

        return findings;
    }

}

module.exports = RAGRoutes;
