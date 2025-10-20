// src/utils/validation.js
class ValidationUtils {
    /**
     * 驗證必要欄位是否存在
     * @param {Object} data - 要驗證的資料物件
     * @param {Array} requiredFields - 必要欄位陣列
     * @returns {Object} 驗證結果
     */
    static validateRequired(data, requiredFields) {
        const errors = [];
        const missing = [];

        if (!data || typeof data !== 'object') {
            return {
                valid: false,
                errors: ['資料必須是物件類型'],
                missing: requiredFields
            };
        }

        for (const field of requiredFields) {
            if (!(field in data) || data[field] === null || data[field] === undefined) {
                missing.push(field);
                errors.push(`缺少必要欄位: ${field}`);
            } else if (typeof data[field] === 'string' && data[field].trim() === '') {
                missing.push(field);
                errors.push(`欄位 ${field} 不能為空字串`);
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            missing
        };
    }

    /**
     * 驗證字串長度和格式
     * @param {string} value - 要驗證的字串
     * @param {number} minLength - 最小長度
     * @param {number} maxLength - 最大長度
     * @param {RegExp} pattern - 格式規則 (可選)
     * @returns {Object} 驗證結果
     */
    static validateString(value, minLength = 0, maxLength = Infinity, pattern = null) {
        const errors = [];

        if (typeof value !== 'string') {
            return {
                valid: false,
                errors: ['值必須是字串類型']
            };
        }

        if (value.length < minLength) {
            errors.push(`字串長度不能少於 ${minLength} 個字元`);
        }

        if (value.length > maxLength) {
            errors.push(`字串長度不能超過 ${maxLength} 個字元`);
        }

        if (pattern && !pattern.test(value)) {
            errors.push('字串格式不正確');
        }

        return {
            valid: errors.length === 0,
            errors,
            value: value.trim()
        };
    }

    /**
     * 驗證數字範圍
     * @param {number} value - 要驗證的數字
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @param {boolean} integer - 是否必須是整數
     * @returns {Object} 驗證結果
     */
    static validateNumber(value, min = -Infinity, max = Infinity, integer = false) {
        const errors = [];

        const numValue = Number(value);

        if (isNaN(numValue)) {
            return {
                valid: false,
                errors: ['值必須是數字類型']
            };
        }

        if (integer && !Number.isInteger(numValue)) {
            errors.push('值必須是整數');
        }

        if (numValue < min) {
            errors.push(`數值不能小於 ${min}`);
        }

        if (numValue > max) {
            errors.push(`數值不能大於 ${max}`);
        }

        return {
            valid: errors.length === 0,
            errors,
            value: numValue
        };
    }

    /**
     * 驗證陣列
     * @param {Array} value - 要驗證的陣列
     * @param {number} minLength - 最小長度
     * @param {number} maxLength - 最大長度
     * @param {Function} itemValidator - 陣列項目驗證函數 (可選)
     * @returns {Object} 驗證結果
     */
    static validateArray(value, minLength = 0, maxLength = Infinity, itemValidator = null) {
        const errors = [];

        if (!Array.isArray(value)) {
            return {
                valid: false,
                errors: ['值必須是陣列類型']
            };
        }

        if (value.length < minLength) {
            errors.push(`陣列長度不能少於 ${minLength}`);
        }

        if (value.length > maxLength) {
            errors.push(`陣列長度不能超過 ${maxLength}`);
        }

        // 驗證陣列項目
        if (itemValidator && typeof itemValidator === 'function') {
            const itemErrors = [];
            value.forEach((item, index) => {
                const itemResult = itemValidator(item, index);
                if (!itemResult.valid) {
                    itemErrors.push(`項目 ${index}: ${itemResult.errors.join(', ')}`);
                }
            });
            errors.push(...itemErrors);
        }

        return {
            valid: errors.length === 0,
            errors,
            value
        };
    }

    /**
     * 驗證物件結構
     * @param {Object} value - 要驗證的物件
     * @param {Object} schema - 結構規則
     * @returns {Object} 驗證結果
     */
    static validateObject(value, schema = {}) {
        const errors = [];

        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return {
                valid: false,
                errors: ['值必須是物件類型']
            };
        }

        // 驗證必要屬性
        if (schema.required) {
            const requiredValidation = this.validateRequired(value, schema.required);
            if (!requiredValidation.valid) {
                errors.push(...requiredValidation.errors);
            }
        }

        // 驗證屬性類型和格式
        if (schema.properties) {
            for (const [key, rules] of Object.entries(schema.properties)) {
                if (key in value) {
                    const propValue = value[key];

                    if (rules.type) {
                        const typeValid = this.validateType(propValue, rules.type);
                        if (!typeValid.valid) {
                            errors.push(`屬性 ${key}: ${typeValid.errors.join(', ')}`);
                        }
                    }

                    if (rules.validator && typeof rules.validator === 'function') {
                        const customResult = rules.validator(propValue);
                        if (!customResult.valid) {
                            errors.push(`屬性 ${key}: ${customResult.errors.join(', ')}`);
                        }
                    }
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            value
        };
    }

    /**
     * 驗證資料類型
     * @param {*} value - 要驗證的值
     * @param {string} expectedType - 預期類型
     * @returns {Object} 驗證結果
     */
    static validateType(value, expectedType) {
        const actualType = Array.isArray(value) ? 'array' : typeof value;

        if (actualType !== expectedType) {
            return {
                valid: false,
                errors: [`預期類型 ${expectedType}，實際類型 ${actualType}`]
            };
        }

        return {
            valid: true,
            errors: []
        };
    }

    /**
     * 驗證電子郵件格式
     * @param {string} email - 電子郵件地址
     * @returns {Object} 驗證結果
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return this.validateString(email, 5, 320, emailRegex);
    }

    /**
     * 驗證 URL 格式
     * @param {string} url - URL 地址
     * @returns {Object} 驗證結果
     */
    static validateURL(url) {
        try {
            new URL(url);
            return { valid: true, errors: [], value: url };
        } catch (error) {
            return { valid: false, errors: ['URL 格式不正確'] };
        }
    }

    /**
     * 驗證日期格式
     * @param {string} dateString - 日期字串
     * @param {string} format - 預期格式 (如 'YYYY-MM-DD')
     * @returns {Object} 驗證結果
     */
    static validateDate(dateString, format = 'ISO') {
        const errors = [];

        if (typeof dateString !== 'string') {
            return {
                valid: false,
                errors: ['日期必須是字串格式']
            };
        }

        let date;

        if (format === 'ISO') {
            date = new Date(dateString);
        } else if (format === 'YYYY-MM-DD') {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(dateString)) {
                errors.push('日期格式必須是 YYYY-MM-DD');
            } else {
                date = new Date(dateString);
            }
        }

        if (date && isNaN(date.getTime())) {
            errors.push('無效的日期');
        }

        return {
            valid: errors.length === 0,
            errors,
            value: date
        };
    }

    /**
     * 驗證 UUID 格式
     * @param {string} uuid - UUID 字串
     * @returns {Object} 驗證結果
     */
    static validateUUID(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return this.validateString(uuid, 36, 36, uuidRegex);
    }

    /**
     * 驗證攻擊向量 ID
     * @param {string} vectorId - 攻擊向量 ID
     * @returns {Object} 驗證結果
     */
    static validateAttackVectorId(vectorId) {
        const validVectors = ['A1', 'A2', 'A3', 'A4', 'A5'];

        if (!validVectors.includes(vectorId)) {
            return {
                valid: false,
                errors: [`無效的攻擊向量 ID，有效值: ${validVectors.join(', ')}`]
            };
        }

        return {
            valid: true,
            errors: [],
            value: vectorId
        };
    }

    /**
     * 驗證攻擊強度
     * @param {string} intensity - 攻擊強度
     * @returns {Object} 驗證結果
     */
    static validateIntensity(intensity) {
        const validIntensities = ['low', 'medium', 'high'];

        if (!validIntensities.includes(intensity)) {
            return {
                valid: false,
                errors: [`無效的攻擊強度，有效值: ${validIntensities.join(', ')}`]
            };
        }

        return {
            valid: true,
            errors: [],
            value: intensity
        };
    }

    /**
     * 驗證檔案大小
     * @param {number} size - 檔案大小 (bytes)
     * @param {number} maxSize - 最大檔案大小 (bytes)
     * @returns {Object} 驗證結果
     */
    static validateFileSize(size, maxSize = 10 * 1024 * 1024) { // 預設 10MB
        if (typeof size !== 'number' || size < 0) {
            return {
                valid: false,
                errors: ['檔案大小必須是正數']
            };
        }

        if (size > maxSize) {
            return {
                valid: false,
                errors: [`檔案大小超過限制 (${Math.round(maxSize / 1024 / 1024)}MB)`]
            };
        }

        return {
            valid: true,
            errors: [],
            value: size
        };
    }

    /**
     * 批次驗證
     * @param {Object} data - 要驗證的資料
     * @param {Array} validations - 驗證規則陣列
     * @returns {Object} 驗證結果
     */
    static batchValidate(data, validations) {
        const allErrors = [];
        const results = {};

        for (const validation of validations) {
            const { field, validator, args = [] } = validation;
            const value = data[field];

            let result;
            if (typeof validator === 'string') {
                // 使用內建驗證器
                if (this[validator]) {
                    result = this[validator](value, ...args);
                } else {
                    result = { valid: false, errors: [`未知的驗證器: ${validator}`] };
                }
            } else if (typeof validator === 'function') {
                // 使用自定義驗證器
                result = validator(value, ...args);
            } else {
                result = { valid: false, errors: ['無效的驗證器'] };
            }

            results[field] = result;

            if (!result.valid) {
                allErrors.push(...result.errors.map(error => `${field}: ${error}`));
            }
        }

        return {
            valid: allErrors.length === 0,
            errors: allErrors,
            results
        };
    }

    /**
     * 清理和規範化資料
     * @param {Object} data - 原始資料
     * @param {Object} rules - 清理規則
     * @returns {Object} 清理後的資料
     */
    static sanitizeData(data, rules = {}) {
        const cleaned = {};

        for (const [key, value] of Object.entries(data)) {
            const rule = rules[key] || {};

            if (typeof value === 'string') {
                let cleanedValue = value;

                // 移除前後空白
                if (rule.trim !== false) {
                    cleanedValue = cleanedValue.trim();
                }

                // 轉換大小寫
                if (rule.case === 'upper') {
                    cleanedValue = cleanedValue.toUpperCase();
                } else if (rule.case === 'lower') {
                    cleanedValue = cleanedValue.toLowerCase();
                }

                // 移除 HTML 標籤
                if (rule.stripHtml) {
                    cleanedValue = cleanedValue.replace(/<[^>]*>/g, '');
                }

                // 移除特殊字元
                if (rule.alphanumericOnly) {
                    cleanedValue = cleanedValue.replace(/[^a-zA-Z0-9\s]/g, '');
                }

                cleaned[key] = cleanedValue;
            } else {
                cleaned[key] = value;
            }
        }

        return cleaned;
    }
}

module.exports = ValidationUtils;
