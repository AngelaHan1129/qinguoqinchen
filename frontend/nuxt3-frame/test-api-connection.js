// test-api-connection.js - 測試 API 連接
const fetch = require('node-fetch');

async function testAPIConnection() {
    console.log('🔍 測試 API 連接...');

    const endpoints = [
        `${process.env.NUXT_PUBLIC_API_BASE_URL}/health`,
        `${process.env.NUXT_PUBLIC_API_BASE_URL}/rag/stats`,
        `${process.env.NUXT_PUBLIC_API_BASE_URL}/api/rag/stats`
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
