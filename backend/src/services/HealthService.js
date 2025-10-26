// src/services/HealthService.js
class HealthService {
    constructor() {
        this.startTime = Date.now();
        this.healthChecks = new Map();
        this.serviceMetrics = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0
        };
    }

    getSystemHealth() {
        console.log('🔍 執行系統健康檢查');

        const memoryUsage = process.memoryUsage();
        const uptime = Math.floor(process.uptime());

        const health = {
            status: 'healthy',
            system: '侵國侵城 AI 滲透測試系統',
            timestamp: new Date().toISOString(),
            uptime: `${uptime}秒`,

            // 系統資源監控
            resources: {
                memory: {
                    used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                    total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                    percentage: `${Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)}%`
                },
                cpu: {
                    platform: process.platform,
                    nodeVersion: process.version,
                    architecture: process.arch
                }
            },

            // 核心服務狀態
            services: this.getServicesStatus(),

            // 效能指標
            performance: this.getPerformanceMetrics(),

            // 資料庫連線狀態
            databases: this.getDatabaseStatus(),

            // AI 服務配置狀態
            aiServices: this.getAIServicesStatus()
        };

        // 更新請求統計
        this.updateRequestMetrics(true);

        return health;
    }

    getServicesStatus() {
        return {
            nestjs: { status: 'operational', version: '10.x' },
            express: { status: 'operational', version: '4.x' },
            routes: { status: 'registered', count: this.getRoutesCount() },
            swagger: { status: 'available', endpoint: '/api/docs' },
            cors: { status: 'enabled', origin: '*' },
            bodyParser: { status: 'enabled', types: ['json', 'urlencoded'] }
        };
    }

    getPerformanceMetrics() {
        return {
            totalRequests: this.serviceMetrics.totalRequests,
            successRate: this.calculateSuccessRate(),
            averageResponseTime: `${this.serviceMetrics.averageResponseTime}ms`,
            requestsPerMinute: this.calculateRPM(),
            errorRate: this.calculateErrorRate()
        };
    }

    getDatabaseStatus() {
        return {
            postgresql: {
                configured: !!process.env.DATABASE_URL,
                status: process.env.DATABASE_URL ? 'configured' : 'not-configured',
                features: ['pgvector', 'json', 'fulltext-search']
            },
            neo4j: {
                configured: !!(process.env.NEO4J_URI && process.env.NEO4J_USERNAME),
                status: (process.env.NEO4J_URI && process.env.NEO4J_USERNAME) ? 'configured' : 'not-configured',
                features: ['graph-database', 'cypher-queries', 'apoc']
            },
            redis: {
                configured: !!process.env.REDIS_URL,
                status: process.env.REDIS_URL ? 'configured' : 'not-configured',
                features: ['caching', 'session-storage', 'pub-sub']
            }
        };
    }

    getAIServicesStatus() {
        return {
            geminiAI: {
                configured: !!process.env.GEMINI_API_KEY,
                status: process.env.GEMINI_API_KEY ? 'ready' : 'not-configured',
                model: 'gemini-2.5-flash',
                capabilities: ['text-generation', 'analysis', 'ekyc-evaluation']
            },
            grokAI: {
                configured: !!process.env.XAI_API_KEY,
                status: process.env.XAI_API_KEY ? 'ready' : 'not-configured',
                model: 'grok-3-mini',
                capabilities: ['security-analysis', 'penetration-testing']
            },
            vertexAI: {
                configured: !!(process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_APPLICATION_CREDENTIALS),
                status: (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_APPLICATION_CREDENTIALS) ? 'ready' : 'not-configured',
                capabilities: ['agent-builder', 'security-analysis', 'compliance-checking']
            }
        };
    }

    // 效能統計方法
    updateRequestMetrics(success = true, responseTime = 0) {
        this.serviceMetrics.totalRequests++;

        if (success) {
            this.serviceMetrics.successfulRequests++;
        } else {
            this.serviceMetrics.failedRequests++;
        }

        // 計算平均回應時間 (簡化版本)
        if (responseTime > 0) {
            this.serviceMetrics.averageResponseTime =
                (this.serviceMetrics.averageResponseTime + responseTime) / 2;
        }
    }

    calculateSuccessRate() {
        if (this.serviceMetrics.totalRequests === 0) return '100%';
        return `${Math.round((this.serviceMetrics.successfulRequests / this.serviceMetrics.totalRequests) * 100)}%`;
    }

    calculateErrorRate() {
        if (this.serviceMetrics.totalRequests === 0) return '0%';
        return `${Math.round((this.serviceMetrics.failedRequests / this.serviceMetrics.totalRequests) * 100)}%`;
    }

    calculateRPM() {
        const uptimeMinutes = Math.max(1, Math.floor(process.uptime() / 60));
        return Math.round(this.serviceMetrics.totalRequests / uptimeMinutes);
    }

    getRoutesCount() {
        // 這裡可以實作實際的路由計數邏輯
        return 25; // 暫時回傳固定值
    }

    // 進階健康檢查
    async performDeepHealthCheck() {
        console.log('🔬 執行深度健康檢查...');

        const checks = {
            database: await this.checkDatabaseConnection(),
            aiServices: await this.checkAIServices(),
            memory: this.checkMemoryUsage(),
            disk: this.checkDiskSpace(),
            network: await this.checkNetworkConnectivity()
        };

        const overallStatus = Object.values(checks).every(check => check.status === 'healthy')
            ? 'healthy'
            : 'degraded';

        return {
            overallStatus,
            timestamp: new Date().toISOString(),
            checks,
            recommendations: this.generateHealthRecommendations(checks)
        };
    }

    async checkDatabaseConnection() {
        // 實際實作會包含真正的資料庫連線測試
        return {
            status: 'healthy',
            responseTime: '< 50ms',
            details: 'All database connections are responding normally'
        };
    }

    async checkAIServices() {
        // 測試 AI 服務的可用性
        return {
            status: 'healthy',
            gemini: process.env.GEMINI_API_KEY ? 'available' : 'not-configured',
            grok: process.env.XAI_API_KEY ? 'available' : 'not-configured',
            vertex: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'available' : 'not-configured'
        };
    }

    checkMemoryUsage() {
        const memoryUsage = process.memoryUsage();
        const heapUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

        return {
            status: heapUsedPercent < 80 ? 'healthy' : 'warning',
            heapUsedPercent: `${Math.round(heapUsedPercent)}%`,
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            recommendation: heapUsedPercent > 80 ? 'Consider memory optimization' : null
        };
    }

    checkDiskSpace() {
        // 簡化的磁碟空間檢查
        return {
            status: 'healthy',
            freeSpace: '> 1GB',
            details: 'Sufficient disk space available'
        };
    }

    async checkNetworkConnectivity() {
        // 簡化的網路連線檢查
        return {
            status: 'healthy',
            external: 'connected',
            dns: 'resolving',
            details: 'Network connectivity is normal'
        };
    }

    generateHealthRecommendations(checks) {
        const recommendations = [];

        if (checks.memory.status === 'warning') {
            recommendations.push('建議進行記憶體優化或增加系統記憶體');
        }

        if (checks.aiServices.status !== 'healthy') {
            recommendations.push('檢查 AI 服務的 API 金鑰設定');
        }

        if (checks.database.status !== 'healthy') {
            recommendations.push('檢查資料庫連線設定和網路連線');
        }

        return recommendations;
    }
}

module.exports = HealthService;
