// tests/helpers/allure-steps.js
const { allure } = require('allure-playwright');

class AllureSteps {
    static async apiCall(name, apiFunction, expectedStatus = 200) {
        return await allure.step(name, async () => {
            const startTime = Date.now();
            try {
                const result = await apiFunction();
                const endTime = Date.now();
                const responseTime = endTime - startTime;

                await allure.parameter('執行時間', `${responseTime}ms`);
                await allure.parameter('狀態碼', result.status ? result.status().toString() : 'N/A');

                if (result.status && result.status() === expectedStatus) {
                    await allure.parameter('結果', '成功');
                }

                return result;
            } catch (error) {
                const endTime = Date.now();
                const responseTime = endTime - startTime;

                await allure.parameter('執行時間', `${responseTime}ms`);
                await allure.parameter('錯誤', error.message);
                await allure.attachment('錯誤詳情', error.stack || error.message, 'text/plain');
                throw error;
            }
        });
    }

    static async validateResponse(response, expectedFields = []) {
        return await allure.step('驗證回應內容', async () => {
            const data = await response.json();

            expectedFields.forEach(field => {
                if (!data.hasOwnProperty(field)) {
                    throw new Error(`回應中缺少必要欄位: ${field}`);
                }
            });

            await allure.attachment('回應內容', JSON.stringify(data, null, 2), 'application/json');
            return data;
        });
    }
}

module.exports = { AllureSteps };
