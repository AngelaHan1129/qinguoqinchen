// src/routes/database.routes.js
const ErrorHandler = require('../utils/errorHandler');
const Logger = require('../utils/logger');

class DatabaseRoutes {
    static register(app, services) {
        const { databaseService } = services;

        // 取得資料庫狀態
        app.get('/database/status', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('取得資料庫狀態');
            const result = await databaseService.getStatus();
            res.json(result);
        }));

        // 初始化資料庫
        app.post('/database/initialize', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('初始化資料庫系統');

            try {
                const result = await databaseService.initializeDatabase();

                if (result.success) {
                    Logger.success('資料庫初始化成功');
                } else {
                    Logger.warn('資料庫初始化部分失敗');
                }

                res.json(result);
            } catch (error) {
                Logger.error('資料庫初始化失敗', { error: error.message });
                throw error;
            }
        }));

        // 取得資料庫指標
        app.get('/database/metrics', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('取得資料庫效能指標');
            const metrics = await databaseService.getDatabaseMetrics();
            res.json({
                success: true,
                metrics,
                timestamp: new Date().toISOString()
            });
        }));

        // 資料庫健康檢查
        app.get('/database/health', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('執行資料庫健康檢查');

            const healthChecks = {
                postgresql: await databaseService.testPostgreSQLConnection(),
                neo4j: await databaseService.testNeo4jConnection(),
                redis: await databaseService.testRedisConnection()
            };

            const overallHealth = Object.values(healthChecks).every(check => check.success)
                ? 'healthy'
                : 'degraded';

            res.json({
                success: true,
                overallHealth,
                checks: healthChecks,
                timestamp: new Date().toISOString()
            });
        }));

        // 執行資料庫遷移
        app.post('/database/migrate', ErrorHandler.asyncHandler(async (req, res) => {
            const { target = 'latest', dryRun = false } = req.body;

            Logger.info('執行資料庫遷移', { target, dryRun });

            try {
                const result = await databaseService.runMigrations(target, dryRun);
                res.json({
                    success: true,
                    migration: result,
                    message: dryRun ? '遷移預覽完成' : '遷移執行完成'
                });
            } catch (error) {
                Logger.error('資料庫遷移失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '資料庫遷移失敗',
                    message: error.message
                });
            }
        }));

        // 備份資料庫
        app.post('/database/backup', ErrorHandler.asyncHandler(async (req, res) => {
            const { includeData = true, compression = true } = req.body;

            Logger.info('開始資料庫備份', { includeData, compression });

            try {
                const result = await databaseService.createBackup({
                    includeData,
                    compression,
                    timestamp: new Date().toISOString()
                });

                res.json({
                    success: true,
                    backup: result,
                    message: '資料庫備份完成'
                });
            } catch (error) {
                Logger.error('資料庫備份失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '資料庫備份失敗',
                    message: error.message
                });
            }
        }));

        // 清理舊資料
        app.post('/database/cleanup', ErrorHandler.asyncHandler(async (req, res) => {
            const {
                olderThanDays = 90,
                tables = ['test_runs', 'attack_logs'],
                dryRun = false
            } = req.body;

            Logger.info('清理舊資料', { olderThanDays, tables, dryRun });

            try {
                const result = await databaseService.cleanupOldData({
                    olderThanDays,
                    tables,
                    dryRun
                });

                res.json({
                    success: true,
                    cleanup: result,
                    message: dryRun ? '清理預覽完成' : '資料清理完成'
                });
            } catch (error) {
                Logger.error('資料清理失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '資料清理失敗',
                    message: error.message
                });
            }
        }));

        // 優化資料庫效能
        app.post('/database/optimize', ErrorHandler.asyncHandler(async (req, res) => {
            const {
                vacuum = true,
                reindex = true,
                analyze = true,
                tables = []
            } = req.body;

            Logger.info('優化資料庫效能', { vacuum, reindex, analyze, tables });

            try {
                const result = await databaseService.optimizePerformance({
                    vacuum,
                    reindex,
                    analyze,
                    tables
                });

                res.json({
                    success: true,
                    optimization: result,
                    message: '資料庫優化完成'
                });
            } catch (error) {
                Logger.error('資料庫優化失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '資料庫優化失敗',
                    message: error.message
                });
            }
        }));

        // 資料庫統計資訊
        app.get('/database/statistics', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('取得資料庫統計資訊');

            try {
                const stats = await databaseService.getStatistics();
                res.json({
                    success: true,
                    statistics: stats,
                    generatedAt: new Date().toISOString()
                });
            } catch (error) {
                Logger.error('取得統計資訊失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '無法取得統計資訊',
                    message: error.message
                });
            }
        }));

        // 匯出資料
        app.post('/database/export', ErrorHandler.asyncHandler(async (req, res) => {
            const {
                format = 'json',
                tables = [],
                includeSchema = true,
                compression = false
            } = req.body;

            Logger.info('匯出資料庫資料', { format, tables, includeSchema });

            try {
                const result = await databaseService.exportData({
                    format,
                    tables,
                    includeSchema,
                    compression
                });

                res.json({
                    success: true,
                    export: result,
                    message: '資料匯出完成'
                });
            } catch (error) {
                Logger.error('資料匯出失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    error: '資料匯出失敗',
                    message: error.message
                });
            }
        }));

        Logger.success('Database 路由註冊完成', { routes: 10 });
        return 10;
    }
}

module.exports = DatabaseRoutes;
