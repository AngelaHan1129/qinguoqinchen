// test-gemini-models.js - 測試 Gemini AI 模型可用性
require('dotenv').config();

async function testGeminiModels() {
    console.log('🤖 測試 Gemini AI 模型可用性...');

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY 未設定');
        return;
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const models = [
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.0-pro',
        'gemini-pro'
    ];

    for (const modelName of models) {
        try {
            console.log(`\n🔍 測試模型: ${modelName}`);

            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 100,
                }
            });

            const result = await model.generateContent('Hello, this is a test.');
            const response = await result.response;
            const text = response.text();

            console.log(`✅ ${modelName} 可用`);
            console.log(`📝 回應: ${text.substring(0, 50)}...`);

        } catch (error) {
            console.error(`❌ ${modelName} 不可用:`, error.message);
        }
    }
}

testGeminiModels().catch(console.error);
