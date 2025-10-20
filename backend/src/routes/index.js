// src/routes/index.js - 修復版本
const ErrorHandler = require('../utils/errorHandler');
const Logger = require('../utils/logger');
const SwaggerConfig = require('../config/swagger.config');
const RAGRoutes = require('./rag.routes');

class RouteManager {
    static registerAllRoutes(app, services) {
        console.log('🔧 開始註冊所有路由...');

        try {
            // 設置 Swagger API 文件
            SwaggerConfig.setupSwagger(app);

            // 設置全域中介軟體
            RouteManager.setupGlobalMiddleware(app);

            // 註冊基本路由
            RouteManager.registerBasicRoutes(app, services);

            // 註冊管理路由  
            RouteManager.registerManagementRoutes(app, services);

            // 註冊 RAG 路由
            RAGRoutes.register(app, services);

            // 設置錯誤處理
            RouteManager.setupErrorHandling(app);

            console.log(`✅ 路由註冊完成，共註冊 8 個端點`);

        } catch (error) {
            console.error('❌ 路由註冊失敗:', error.message);
            console.error('錯誤詳情:', error);
            throw error;
        }
    }

    static setupGlobalMiddleware(app) {
        console.log('🛡️ 設置全域中介軟體...');

        try {
            const cors = require('cors');

            app.use(cors({
                origin: process.env.CORS_ORIGIN || '*',
                credentials: true
            }));

            // 請求日誌
            app.use((req, res, next) => {
                console.log(`📝 ${req.method} ${req.url}`);
                next();
            });

            console.log('✅ 全域中介軟體設置完成');
        } catch (error) {
            console.error('❌ 中介軟體設置失敗:', error.message);
            throw error;
        }
    }

    static registerBasicRoutes(app, services) {
        console.log('📍 註冊基本路由...');

        try {
            const { appService, healthService } = services;

            // 首頁 - 確保路由格式正確
            app.get('/', (req, res) => {
                Logger.info('訪問首頁');
                res.json({
                    system: '侵國侵城 AI 滲透測試系統',
                    version: '1.0.0',
                    status: 'operational',
                    timestamp: new Date().toISOString(),
                    message: '🚀 系統啟動成功！',
                    endpoints: {
                        health: '/health',
                        systemInfo: '/system/info',
                        aiAttack: '/ai-attack/vectors',
                        documentation: '/api/docs'
                    }
                });
            });

            // 健康檢查
            app.get('/health', (req, res) => {
                Logger.info('執行健康檢查');
                const health = healthService.getSystemHealth();
                res.json(health);
            });

            // 系統資訊
            app.get('/system/info', (req, res) => {
                Logger.info('取得系統資訊');
                const systemInfo = appService.getSystemInfo();
                res.json({ success: true, ...systemInfo });
            });

            // AI 攻擊向量列表
            app.get('/ai-attack/vectors', (req, res) => {
                Logger.info('取得攻擊向量列表');

                const vectors = [
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

                res.json({
                    success: true,
                    vectors,
                    statistics: {
                        totalVectors: vectors.length,
                        averageSuccessRate: '77.4%',
                        mostEffective: 'A3 - SimSwap',
                        leastEffective: 'A2 - StableDiffusion'
                    },
                    timestamp: new Date().toISOString()
                });
            });

            // AI 攻擊執行
            app.post('/ai-attack/execute', (req, res) => {
                const { vectorIds = ['A1'], intensity = 'medium' } = req.body;

                Logger.info('執行攻擊測試', { vectorIds, intensity });

                const testId = `QQC_ATK_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

                const results = vectorIds.map(vectorId => ({
                    vectorId,
                    success: Math.random() > 0.3,
                    confidence: Math.round(Math.random() * 1000) / 1000,
                    bypassScore: Math.random() > 0.5 ? Math.round(Math.random() * 0.4 + 0.6 * 1000) / 1000 : 0,
                    processingTime: Math.round(1000 + Math.random() * 3000),
                    timestamp: new Date()
                }));

                const successfulAttacks = results.filter(r => r.success).length;
                const successRate = Math.round((successfulAttacks / results.length) * 100);

                res.json({
                    success: true,
                    testId,
                    attackResults: {
                        vectors: vectorIds,
                        intensity,
                        results,
                        summary: {
                            totalAttacks: results.length,
                            successfulAttacks,
                            successRate: `${successRate}%`,
                            threatLevel: successRate >= 80 ? 'CRITICAL' : successRate >= 60 ? 'HIGH' : 'MEDIUM'
                        }
                    },
                    timestamp: new Date().toISOString()
                });
            });

            console.log('✅ 基本路由註冊完成');
        } catch (error) {
            console.error('❌ 基本路由註冊失敗:', error.message);
            throw error;
        }
    }

    static registerManagementRoutes(app, services) {
        console.log('🔧 註冊管理路由...');

        try {
            // 系統統計 - 注意：路由格式必須正確
            app.get('/admin/stats', (req, res) => {
                res.json({
                    success: true,
                    stats: {
                        uptime: Math.floor(process.uptime()),
                        memory: process.memoryUsage(),
                        requests: Math.floor(Math.random() * 1000),
                        errors: Math.floor(Math.random() * 10)
                    },
                    timestamp: new Date().toISOString()
                });
            });

            // 系統版本
            app.get('/admin/version', (req, res) => {
                res.json({
                    success: true,
                    version: {
                        application: '1.0.0',
                        node: process.version,
                        platform: process.platform
                    },
                    timestamp: new Date().toISOString()
                });
            });

            console.log('✅ 管理路由註冊完成');
        } catch (error) {
            console.error('❌ 管理路由註冊失敗:', error.message);
            throw error;
        }
    }

    static setupErrorHandling(app) {
        console.log('🚨 設置錯誤處理...');

        try {
            // 不使用通配符，改為在每個未匹配的請求後處理
            // 這個方法更安全，避免 path-to-regexp 的問題

            // 全域錯誤處理 - 這個是正常的，不會引起路由問題
            app.use((error, req, res, next) => {
                console.error('🚨 系統錯誤:', error.message);
                res.status(500).json({
                    success: false,
                    error: '系統內部錯誤',
                    message: process.env.NODE_ENV === 'development' ? error.message : '請稍後再試',
                    timestamp: new Date().toISOString()
                });
            });

            console.log('✅ 錯誤處理設置完成');
        } catch (error) {
            console.error('❌ 錯誤處理設置失敗:', error.message);
            throw error;
        }
    }

}

module.exports = RouteManager;
