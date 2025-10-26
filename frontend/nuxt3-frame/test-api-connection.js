// test-api-connection.js - 測試 API 連接
const fetch = require('node-fetch');

async function testAPIConnection() {
    console.log('🔍 測試 API 連接...');

    const endpoints = [
        'http://localhost:7939/health',
        'http://localhost:7939/rag/stats',
        'http://localhost:7939/api/rag/stats'
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`📡 測試: ${endpoint}`);
            const response = await fetch(endpoint);
            const data = await response.text();
            console.log(`✅ 成功: ${response.status} - ${data.substring(0, 100)}...`);
        } catch (error) {
            console.log(`❌ 失敗: ${error.message}`);
        }
    }
}

testAPIConnection();
