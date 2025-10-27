// src/middleware/SecurityMiddleware.js
class SecurityMiddleware {
    static rateLimiter() {
        const requests = new Map();

        return (req, res, next) => {
            const clientIp = req.ip || req.connection.remoteAddress;
            const now = Date.now();
            const windowMs = 15 * 60 * 1000; // 15 分鐘
            const maxRequests = 100;

            if (!requests.has(clientIp)) {
                requests.set(clientIp, { count: 1, resetTime: now + windowMs });
                return next();
            }

            const clientRequests = requests.get(clientIp);

            if (now > clientRequests.resetTime) {
                clientRequests.count = 1;
                clientRequests.resetTime = now + windowMs;
                return next();
            }

            if (clientRequests.count >= maxRequests) {
                return res.status(429).json({
                    success: false,
                    error: '請求過於頻繁',
                    message: '請稍後再試',
                    retryAfter: Math.ceil((clientRequests.resetTime - now) / 1000)
                });
            }

            clientRequests.count++;
            next();
        };
    }

    static requestLogger() {
        return (req, res, next) => {
            const start = Date.now();

            const originalSend = res.send;
            res.send = function (body) {
                const duration = Date.now() - start;

                console.log(`📝 ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);

                if (process.env.NODE_ENV === 'development') {
                    console.log(`   Headers: ${JSON.stringify(req.headers, null, 2)}`);
                    if (req.body && Object.keys(req.body).length > 0) {
                        console.log(`   Body: ${JSON.stringify(req.body, null, 2)}`);
                    }
                }

                return originalSend.call(this, body);
            };

            next();
        };
    }

    static validateApiKey() {
        const validApiKeys = new Set([
            process.env.API_KEY,
            'demo-key-for-testing',
            'qinguoqinchen-2025'
        ].filter(Boolean));

        return (req, res, next) => {
            // 對於某些公開端點，跳過 API 金鑰檢查
            const publicEndpoints = ['/', '/health', '/api/docs', '/system/info'];
            if (publicEndpoints.includes(req.path)) {
                return next();
            }

            const apiKey = req.headers['x-api-key'] || req.query.api_key;

            if (!apiKey) {
                return res.status(401).json({
                    success: false,
                    error: '缺少 API 金鑰',
                    message: '請在 header 中提供 X-API-Key 或在查詢參數中提供 api_key'
                });
            }

            if (!validApiKeys.has(apiKey)) {
                return res.status(403).json({
                    success: false,
                    error: '無效的 API 金鑰',
                    message: '請檢查您的 API 金鑰是否正確'
                });
            }

            next();
        };
    }

    static corsHandler() {
        return (req, res, next) => {
            const allowedOrigins = [
                'http://localhost:3000',
                process.env.API_BASE_URL || 'http://localhost:7939',
                'https://qinguoqinchen.ai',
                process.env.FRONTEND_URL
            ].filter(Boolean);

            const origin = req.headers.origin;
            if (allowedOrigins.includes(origin)) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }

            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            if (req.method === 'OPTIONS') {
                return res.status(200).end();
            }

            next();
        };
    }

    static inputSanitizer() {
        return (req, res, next) => {
            if (req.body) {
                req.body = this.sanitizeObject(req.body);
            }

            if (req.query) {
                req.query = this.sanitizeObject(req.query);
            }

            next();
        };
    }

    static sanitizeObject(obj) {
        if (typeof obj !== 'object' || obj === null) return obj;

        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                // 基本的 XSS 防護
                sanitized[key] = value
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
                    .replace(/javascript:/gi, '')
                    .trim();
            } else if (typeof value === 'object') {
                sanitized[key] = this.sanitizeObject(value);
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }

    static errorHandler() {
        return (error, req, res, next) => {
            console.error('🚨 未處理的錯誤:', {
                message: error.message,
                stack: error.stack,
                url: req.url,
                method: req.method,
                body: req.body,
                timestamp: new Date().toISOString()
            });

            // 根據錯誤類型回應不同訊息
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    error: '資料驗證失敗',
                    details: error.message,
                    timestamp: new Date().toISOString()
                });
            }

            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({
                    success: false,
                    error: '檔案過大',
                    message: '上傳檔案大小超過限制',
                    timestamp: new Date().toISOString()
                });
            }

            if (error.code === 'ECONNREFUSED') {
                return res.status(503).json({
                    success: false,
                    error: '外部服務無法使用',
                    message: '請稍後再試',
                    timestamp: new Date().toISOString()
                });
            }

            // 預設錯誤回應
            res.status(500).json({
                success: false,
                error: '系統內部錯誤',
                message: process.env.NODE_ENV === 'production'
                    ? '請聯繫系統管理員'
                    : error.message,
                timestamp: new Date().toISOString()
            });
        };
    }
}

module.exports = SecurityMiddleware;
