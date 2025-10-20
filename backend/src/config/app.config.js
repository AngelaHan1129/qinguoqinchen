// src/config/app.config.js
class AppConfig {
    static getConfig() {
        return {
            app: {
                name: '侵國侵城 AI 滲透測試系統',
                version: '1.0.0',
                description: 'eKYC 系統 AI 攻擊向量模擬平台',
                port: process.env.PORT || 7939,
                environment: process.env.NODE_ENV || 'development'
            },

            cors: {
                origin: process.env.CORS_ORIGIN || '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                allowedHeaders: ['Content-Type', 'Authorization']
            },

            logging: {
                level: process.env.LOG_LEVEL || 'info',
                format: 'combined'
            },

            rateLimit: {
                windowMs: 15 * 60 * 1000, // 15 分鐘
                max: 100 // 限制每 IP 最多 100 次請求
            }
        };
    }

    static validateEnvironment() {
        const required = [
            'GEMINI_API_KEY',
            'XAI_API_KEY',
            'GOOGLE_CLOUD_PROJECT_ID',
            'DATABASE_URL'
        ];

        const missing = required.filter(key => !process.env[key]);

        if (missing.length > 0) {
            console.warn('⚠️ 缺少環境變數:', missing.join(', '));
            return false;
        }

        return true;
    }
}

module.exports = AppConfig;
