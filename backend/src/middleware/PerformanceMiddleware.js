// src/middleware/PerformanceMiddleware.js
class PerformanceMiddleware {
    constructor() {
        this.metrics = {
            requests: new Map(),
            responseTime: [],
            errorCount: 0,
            totalRequests: 0
        };
    }

    performanceTracker() {
        return (req, res, next) => {
            const start = process.hrtime.bigint();
            const startMemory = process.memoryUsage();

            const originalSend = res.send;
            res.send = (body) => {
                const end = process.hrtime.bigint();
                const endMemory = process.memoryUsage();

                const responseTime = Number(end - start) / 1000000; // 轉換為毫秒
                const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;

                // 記錄效能指標
                this.recordMetrics({
                    method: req.method,
                    path: req.path,
                    statusCode: res.statusCode,
                    responseTime,
                    memoryDelta,
                    timestamp: new Date().toISOString(),
                    userAgent: req.get('User-Agent'),
                    ip: req.ip
                });

                // 在開發環境顯示效能資訊
                if (process.env.NODE_ENV === 'development') {
                    console.log(`⏱️  ${req.method} ${req.path} - ${res.statusCode} - ${responseTime.toFixed(2)}ms - Memory: ${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
                }

                return originalSend.call(this, body);
            };

            next();
        };
    }

    recordMetrics(metrics) {
        this.metrics.totalRequests++;
        this.metrics.responseTime.push(metrics.responseTime);

        if (metrics.statusCode >= 400) {
            this.metrics.errorCount++;
        }

        // 保持最近 1000 筆記錄
        if (this.metrics.responseTime.length > 1000) {
            this.metrics.responseTime = this.metrics.responseTime.slice(-1000);
        }

        // 按路徑記錄請求統計
        const pathKey = `${metrics.method}:${metrics.path}`;
        if (!this.metrics.requests.has(pathKey)) {
            this.metrics.requests.set(pathKey, {
                count: 0,
                totalTime: 0,
                errors: 0,
                averageTime: 0
            });
        }

        const pathMetrics = this.metrics.requests.get(pathKey);
        pathMetrics.count++;
        pathMetrics.totalTime += metrics.responseTime;
        pathMetrics.averageTime = pathMetrics.totalTime / pathMetrics.count;

        if (metrics.statusCode >= 400) {
            pathMetrics.errors++;
        }
    }

    getMetrics() {
        const responseTimeSorted = [...this.metrics.responseTime].sort((a, b) => a - b);
        const p95Index = Math.floor(responseTimeSorted.length * 0.95);
        const p99Index = Math.floor(responseTimeSorted.length * 0.99);

        return {
            summary: {
                totalRequests: this.metrics.totalRequests,
                errorCount: this.metrics.errorCount,
                errorRate: this.metrics.totalRequests > 0
                    ? `${((this.metrics.errorCount / this.metrics.totalRequests) * 100).toFixed(2)}%`
                    : '0%',
                successRate: this.metrics.totalRequests > 0
                    ? `${(((this.metrics.totalRequests - this.metrics.errorCount) / this.metrics.totalRequests) * 100).toFixed(2)}%`
                    : '100%'
            },

            responseTime: {
                average: responseTimeSorted.length > 0
                    ? `${(responseTimeSorted.reduce((a, b) => a + b, 0) / responseTimeSorted.length).toFixed(2)}ms`
                    : '0ms',
                median: responseTimeSorted.length > 0
                    ? `${responseTimeSorted[Math.floor(responseTimeSorted.length / 2)].toFixed(2)}ms`
                    : '0ms',
                p95: responseTimeSorted.length > 0
                    ? `${responseTimeSorted[p95Index].toFixed(2)}ms`
                    : '0ms',
                p99: responseTimeSorted.length > 0
                    ? `${responseTimeSorted[p99Index].toFixed(2)}ms`
                    : '0ms',
                min: responseTimeSorted.length > 0
                    ? `${responseTimeSorted[0].toFixed(2)}ms`
                    : '0ms',
                max: responseTimeSorted.length > 0
                    ? `${responseTimeSorted[responseTimeSorted.length - 1].toFixed(2)}ms`
                    : '0ms'
            },

            endpoints: this.getEndpointMetrics(),
            timestamp: new Date().toISOString()
        };
    }

    getEndpointMetrics() {
        const endpoints = [];

        for (const [path, metrics] of this.metrics.requests) {
            endpoints.push({
                endpoint: path,
                requests: metrics.count,
                averageResponseTime: `${metrics.averageTime.toFixed(2)}ms`,
                errors: metrics.errors,
                errorRate: `${((metrics.errors / metrics.count) * 100).toFixed(2)}%`,
                successRate: `${(((metrics.count - metrics.errors) / metrics.count) * 100).toFixed(2)}%`
            });
        }

        return endpoints.sort((a, b) => b.requests - a.requests);
    }

    healthCheck() {
        const metrics = this.getMetrics();
        const avgResponseTime = parseFloat(metrics.responseTime.average);
        const errorRate = parseFloat(metrics.summary.errorRate);

        let status = 'healthy';
        const issues = [];

        if (avgResponseTime > 1000) {
            status = 'degraded';
            issues.push('High average response time');
        }

        if (errorRate > 5) {
            status = 'degraded';
            issues.push('High error rate');
        }

        if (errorRate > 20) {
            status = 'unhealthy';
        }

        return {
            status,
            issues,
            metrics: {
                averageResponseTime: metrics.responseTime.average,
                errorRate: metrics.summary.errorRate,
                totalRequests: metrics.summary.totalRequests
            },
            recommendations: this.generateRecommendations(avgResponseTime, errorRate)
        };
    }

    generateRecommendations(avgResponseTime, errorRate) {
        const recommendations = [];

        if (avgResponseTime > 500) {
            recommendations.push('考慮優化慢速端點或增加快取');
        }

        if (errorRate > 2) {
            recommendations.push('檢查錯誤日誌並修復常見問題');
        }

        if (this.metrics.totalRequests > 10000) {
            recommendations.push('考慮實施更進階的效能監控');
        }

        return recommendations;
    }

    reset() {
        this.metrics = {
            requests: new Map(),
            responseTime: [],
            errorCount: 0,
            totalRequests: 0
        };

        console.log('📊 效能指標已重置');
        return { success: true, message: '效能指標已重置' };
    }
}

module.exports = PerformanceMiddleware;
