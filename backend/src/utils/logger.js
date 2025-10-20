// src/utils/logger.js
class Logger {
    static log(level, message, meta = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            ...meta
        };

        const colorCodes = {
            INFO: '\x1b[36m',    // 青色
            WARN: '\x1b[33m',    // 黃色
            ERROR: '\x1b[31m',   // 紅色
            SUCCESS: '\x1b[32m', // 綠色
            DEBUG: '\x1b[35m'    // 紫色
        };

        const resetColor = '\x1b[0m';
        const color = colorCodes[level.toUpperCase()] || '';

        console.log(`${color}[${logEntry.timestamp}] ${logEntry.level}: ${message}${resetColor}`);

        if (Object.keys(meta).length > 0) {
            console.log(`${color}Meta:${resetColor}`, JSON.stringify(meta, null, 2));
        }
    }

    static info(message, meta = {}) {
        this.log('info', message, meta);
    }

    static warn(message, meta = {}) {
        this.log('warn', message, meta);
    }

    static error(message, meta = {}) {
        this.log('error', message, meta);
    }

    static success(message, meta = {}) {
        this.log('success', message, meta);
    }

    static debug(message, meta = {}) {
        if (process.env.NODE_ENV === 'development') {
            this.log('debug', message, meta);
        }
    }
}

module.exports = Logger;
