// src/routes/system.routes.js
const ErrorHandler = require('../utils/errorHandler');
const Logger = require('../utils/logger');

class SystemRoutes {
    static register(app, services) {
        const { appService, healthService } = services;

        // 首頁端點
        app.get('/', (req, res) => {
            Logger.info('訪問首頁');

            const welcomeMessage = {
                system: '侵國侵城 AI 滲透測試系統',
                version: '1.0.0',
                description: '專業的 eKYC 系統 AI 安全測試平台',
                status: 'operational',
                timestamp: new Date().toISOString(),

                quickStart: {
                    documentation: '/api/docs',
                    healthCheck: '/health',
                    systemInfo: '/system/info',
                    attackVectors: '/ai-attack/vectors'
                },

                capabilities: [
                    '🎯 多重 AI 攻擊向量模擬',
                    '🤖 Gemini AI 安全分析',
                    '🚀 Grok AI 威脅評估',
                    '🧠 Vertex AI 智能代理',
                    '📚 RAG 知識管理系統',
                    '🔍 量化風險評估 (APCER/BPCER)',
                    '📊 即時效能監控',
                    '🛡️ 企業級安全防護'
                ],

                team: '侵國侵城團隊',
                competition: '2025 InnoServe 大專校院資訊應用服務創新競賽',
                university: '國立臺中科技大學'
            };

            res.json(welcomeMessage);
        });

        // 系統資訊
        app.get('/system/info', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('取得系統資訊');
            const systemInfo = appService.getSystemInfo();
            res.json({
                success: true,
                ...systemInfo
            });
        }));

        // 健康檢查 (簡化版)
        app.get('/health', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('執行健康檢查');
            const health = healthService.getSystemHealth();

            // 設定適當的 HTTP 狀態碼
            const statusCode = health.status === 'healthy' ? 200 : 503;

            res.status(statusCode).json({
                success: health.status === 'healthy',
                ...health
            });
        }));

        // 深度健康檢查
        app.get('/health/deep', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('執行深度健康檢查');

            try {
                const deepHealth = await healthService.performDeepHealthCheck();
                const statusCode = deepHealth.overallStatus === 'healthy' ? 200 : 503;

                res.status(statusCode).json({
                    success: deepHealth.overallStatus === 'healthy',
                    ...deepHealth
                });
            } catch (error) {
                Logger.error('深度健康檢查失敗', { error: error.message });
                res.status(500).json({
                    success: false,
                    overallStatus: 'error',
                    error: '健康檢查執行失敗',
                    message: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        }));

        // 系統統計
        app.get('/system/statistics', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('取得系統統計');

            const statistics = {
                uptime: Math.floor(process.uptime()),
                memory: process.memoryUsage(),
                cpu: {
                    architecture: process.arch,
                    platform: process.platform,
                    nodeVersion: process.version
                },
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString(),

                // 應用程式統計
                application: {
                    startTime: new Date(Date.now() - process.uptime() * 1000).toISOString(),
                    processId: process.pid,
                    workingDirectory: process.cwd(),
                    execPath: process.execPath
                },

                // 功能使用統計
                features: {
                    aiServices: {
                        gemini: !!process.env.GEMINI_API_KEY,
                        grok: !!process.env.XAI_API_KEY,
                        vertexAI: !!process.env.GOOGLE_CLOUD_PROJECT_ID
                    },
                    databases: {
                        postgresql: !!process.env.DATABASE_URL,
                        neo4j: !!(process.env.NEO4J_URI && process.env.NEO4J_USERNAME),
                        redis: !!process.env.REDIS_URL
                    }
                }
            };

            res.json({
                success: true,
                statistics
            });
        }));

        // 系統狀態
        app.get('/system/status', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('取得系統狀態');

            const memoryUsage = process.memoryUsage();
            const uptime = process.uptime();

            const status = {
                status: 'operational',
                timestamp: new Date().toISOString(),
                uptime: {
                    seconds: Math.floor(uptime),
                    humanReadable: this.formatUptime(uptime)
                },

                resources: {
                    memory: {
                        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
                        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
                        percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
                        unit: 'MB'
                    },

                    load: {
                        current: this.getSystemLoad(),
                        status: this.getLoadStatus()
                    }
                },

                components: {
                    webServer: { status: 'running', port: process.env.PORT || 7939 },
                    apiEndpoints: { status: 'available', count: '35+' },
                    aiServices: {
                        status: this.getAIServicesStatus(),
                        configured: this.countConfiguredServices()
                    },
                    databases: {
                        status: this.getDatabasesStatus(),
                        configured: this.countConfiguredDatabases()
                    }
                },

                security: {
                    cors: 'enabled',
                    rateLimiting: 'enabled',
                    inputValidation: 'enabled',
                    errorHandling: 'centralized'
                }
            };

            res.json({
                success: true,
                ...status
            });
        }));

        // 系統版本資訊
        app.get('/system/version', (req, res) => {
            Logger.info('取得版本資訊');

            const packageInfo = require('../../../package.json');

            const versionInfo = {
                application: {
                    name: packageInfo.name || '侵國侵城 AI 滲透測試系統',
                    version: packageInfo.version || '1.0.0',
                    description: packageInfo.description,
                    author: packageInfo.author
                },

                runtime: {
                    node: process.version,
                    platform: process.platform,
                    architecture: process.arch
                },

                dependencies: {
                    framework: 'NestJS + Express',
                    ai: ['Gemini AI', 'Grok AI', 'Vertex AI'],
                    databases: ['PostgreSQL', 'Neo4j', 'Redis'],
                    other: ['Swagger', 'Multer', 'Bcrypt']
                },

                buildInfo: {
                    buildTime: process.env.BUILD_TIME || 'development',
                    commit: process.env.GIT_COMMIT || 'local',
                    branch: process.env.GIT_BRANCH || 'main',
                    environment: process.env.NODE_ENV || 'development'
                },

                timestamp: new Date().toISOString()
            };

            res.json({
                success: true,
                version: versionInfo
            });
        });

        // 系統配置資訊 (敏感資訊已隱藏)
        app.get('/system/config', (req, res) => {
            Logger.info('取得系統配置');

            const config = {
                server: {
                    port: process.env.PORT || 7939,
                    environment: process.env.NODE_ENV || 'development',
                    cors: process.env.CORS_ORIGIN || '*'
                },

                features: {
                    swagger: true,
                    rateLimiting: true,
                    fileUpload: true,
                    compression: true
                },

                ai: {
                    gemini: { configured: !!process.env.GEMINI_API_KEY, model: 'gemini-2.5-flash' },
                    grok: { configured: !!process.env.XAI_API_KEY, model: 'grok-beta' },
                    vertexAI: { configured: !!process.env.GOOGLE_CLOUD_PROJECT_ID, location: process.env.VERTEX_AI_LOCATION }
                },

                databases: {
                    postgresql: { configured: !!process.env.DATABASE_URL },
                    neo4j: { configured: !!(process.env.NEO4J_URI && process.env.NEO4J_USERNAME) },
                    redis: { configured: !!process.env.REDIS_URL }
                },

                limits: {
                    fileUpload: '10MB',
                    requestSize: '10MB',
                    rateLimit: '100 requests/15min'
                },

                timestamp: new Date().toISOString()
            };

            res.json({
                success: true,
                config
            });
        });

        // 系統日誌 (最近的錯誤和警告)
        app.get('/system/logs', (req, res) => {
            const { level = 'all', limit = 100 } = req.query;

            Logger.info('取得系統日誌', { level, limit });

            // 這裡應該從實際的日誌系統取得資料
            const logs = {
                summary: {
                    total: 0,
                    errors: 0,
                    warnings: 0,
                    info: 0
                },

                entries: [
                    {
                        timestamp: new Date().toISOString(),
                        level: 'INFO',
                        message: '系統正常運行',
                        source: 'system'
                    }
                ],

                disclaimer: '這是模擬資料，實際部署時需要整合真實的日誌系統',

                timestamp: new Date().toISOString()
            };

            res.json({
                success: true,
                logs
            });
        });

        // 輔助方法
        SystemRoutes.formatUptime = (uptimeSeconds) => {
            const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
            const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);
            const seconds = Math.floor(uptimeSeconds % 60);

            if (days > 0) return `${days}天 ${hours}小時 ${minutes}分鐘`;
            if (hours > 0) return `${hours}小時 ${minutes}分鐘`;
            if (minutes > 0) return `${minutes}分鐘 ${seconds}秒`;
            return `${seconds}秒`;
        };

        SystemRoutes.getSystemLoad = () => {
            const memoryUsage = process.memoryUsage();
            const heapUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
            return `${heapUsedPercent.toFixed(1)}%`;
        };

        SystemRoutes.getLoadStatus = () => {
            const memoryUsage = process.memoryUsage();
            const heapUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

            if (heapUsedPercent > 90) return 'critical';
            if (heapUsedPercent > 75) return 'high';
            if (heapUsedPercent > 50) return 'moderate';
            return 'low';
        };

        SystemRoutes.getAIServicesStatus = () => {
            const configured = [
                !!process.env.GEMINI_API_KEY,
                !!process.env.XAI_API_KEY,
                !!process.env.GOOGLE_CLOUD_PROJECT_ID
            ].filter(Boolean).length;

            if (configured === 3) return 'fully-configured';
            if (configured > 0) return 'partially-configured';
            return 'not-configured';
        };

        SystemRoutes.countConfiguredServices = () => {
            return [
                !!process.env.GEMINI_API_KEY,
                !!process.env.XAI_API_KEY,
                !!process.env.GOOGLE_CLOUD_PROJECT_ID
            ].filter(Boolean).length;
        };

        SystemRoutes.getDatabasesStatus = () => {
            const configured = [
                !!process.env.DATABASE_URL,
                !!(process.env.NEO4J_URI && process.env.NEO4J_USERNAME),
                !!process.env.REDIS_URL
            ].filter(Boolean).length;

            if (configured === 3) return 'fully-configured';
            if (configured > 0) return 'partially-configured';
            return 'not-configured';
        };

        SystemRoutes.countConfiguredDatabases = () => {
            return [
                !!process.env.DATABASE_URL,
                !!(process.env.NEO4J_URI && process.env.NEO4J_USERNAME),
                !!process.env.REDIS_URL
            ].filter(Boolean).length;
        };

        Logger.success('System 路由註冊完成', { routes: 8 });
        return 8;
    }
}

module.exports = SystemRoutes;
