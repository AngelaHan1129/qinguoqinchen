// src/utils/errorHandler.js
class ErrorHandler {
    static handleError(error, req, res, next) {
        console.error('🚨 系統錯誤:', {
            message: error.message,
            stack: error.stack,
            url: req.url,
            method: req.method,
            timestamp: new Date().toISOString()
        });

        // 根據錯誤類型返回不同的回應
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: '輸入資料驗證失敗',
                details: error.message,
                timestamp: new Date().toISOString()
            });
        }

        if (error.name === 'UnauthorizedError') {
            return res.status(401).json({
                success: false,
                error: '未授權的請求',
                message: '請檢查 API 金鑰設定',
                timestamp: new Date().toISOString()
            });
        }

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                error: '服務暫時無法使用',
                message: '外部服務連線失敗',
                timestamp: new Date().toISOString()
            });
        }

        // 預設錯誤回應
        res.status(500).json({
            success: false,
            error: '系統內部錯誤',
            message: process.env.NODE_ENV === 'development' ? error.message : '請稍後再試',
            timestamp: new Date().toISOString()
        });
    }

    static asyncHandler(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }
}

module.exports = ErrorHandler;
