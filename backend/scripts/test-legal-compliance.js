// backend/scripts/test-legal-compliance.js
const axios = require('axios');

async function testLegalCompliance() {
    const baseURL = process.env.API_BASE_URL || 'http://localhost:7939';

    try {
        console.log('🧪 測試資安法規遵循系統...');

        // 1. 健康檢查
        console.log('\n1. 健康檢查...');
        const healthResponse = await axios.get(`${baseURL}/legal-compliance/health`);
        console.log('✅ 系統健康:', healthResponse.data.status);

        // 2. 匯入標準法規
        console.log('\n2. 匯入標準法規...');
        const importResponse = await axios.post(`${baseURL}/legal-compliance/import-regulations`);
        console.log('✅ 匯入結果:', {
            總計: importResponse.data.data.total,
            成功: importResponse.data.data.successful,
            失敗: importResponse.data.data.failed
        });

        // 3. 等待向量處理完成
        console.log('\n⏳ 等待向量處理...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 4. 測試法規查詢
        console.log('\n3. 測試法規查詢...');
        const queries = [
            {
                question: '我們的 eKYC 系統使用生物特徵資料進行身份驗證，需要遵循哪些台灣法規？',
                context: {
                    industryScope: 'finance',
                    jurisdiction: 'Taiwan',
                    organizationSize: 'large',
                    systemType: 'eKYC'
                }
            },
            {
                question: 'ISO 27001 對於資訊資產管理有哪些具體要求？',
                context: {
                    industryScope: 'technology',
                    jurisdiction: 'International',
                    regulationSource: 'ISO'
                }
            },
            {
                question: '金融機構如果發生資安事件，法律規定多久內要通報？罰款是多少？',
                context: {
                    industryScope: 'finance',
                    jurisdiction: 'Taiwan',
                    regulationSource: 'FSC'
                }
            }
        ];

        for (let i = 0; i < queries.length; i++) {
            const query = queries[i];
            console.log(`\n查詢 ${i + 1}: ${query.question.substring(0, 50)}...`);

            try {
                const response = await axios.post(`${baseURL}/legal-compliance/ask`, query);
                const result = response.data.data;

                console.log(`✅ 找到 ${result.regulations.length} 個相關法規`);
                console.log('📋 主要法規來源:', result.regulations.map(r => r.source).join(', '));
                console.log('⚖️ 風險評估:', result.riskAssessment ? '已生成' : '未生成');
                console.log('📝 答案長度:', result.answer.length, '字元');

                // 顯示部分答案
                if (result.answer) {
                    const shortAnswer = result.answer.substring(0, 200);
                    console.log('💡 部分答案:', shortAnswer + '...');
                }

            } catch (error) {
                console.log(`❌ 查詢失敗: ${error.message}`);
            }

            // 避免頻率限制
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // 5. 取得最新更新
        console.log('\n4. 取得最新法規更新...');
        const updatesResponse = await axios.get(`${baseURL}/legal-compliance/latest-updates?sources=MOJ,FSC&timeRange=30d`);
        console.log('📰 最新更新:', updatesResponse.data.data.totalFound, '項');

        console.log('\n🎉 測試完成！');

    } catch (error) {
        console.error('❌ 測試失敗:', error.message);
        if (error.response) {
            console.error('回應狀態:', error.response.status);
            console.error('回應內容:', error.response.data);
        }
    }
}

// 執行測試
if (require.main === module) {
    testLegalCompliance();
}

module.exports = { testLegalCompliance };
