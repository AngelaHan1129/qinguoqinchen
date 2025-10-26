// scripts/diagnose-vertex-ai-agent.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

class VertexAIAgentDiagnostic {
    static async runCompleteDiagnostic() {
        console.log('🔍 Vertex AI Agent 完整診斷開始...\n');

        const results = {
            timestamp: new Date().toISOString(),
            overall_status: 'unknown',
            checks: []
        };

        try {
            // 1. 環境變數檢查
            console.log('📋 1. 檢查環境變數配置...');
            results.checks.push(await this.checkEnvironmentVariables());

            // 2. SDK 安裝檢查
            console.log('\n📦 2. 檢查 SDK 安裝狀態...');
            results.checks.push(this.checkSDKInstallation());

            // 3. 認證檢查
            console.log('\n🔐 3. 檢查認證配置...');
            results.checks.push(await this.checkAuthentication());

            // 4. API 啟用檢查
            console.log('\n🌐 4. 檢查 API 啟用狀態...');
            results.checks.push(await this.checkAPIStatus());

            // 5. Vertex AI Agent 特定檢查
            console.log('\n🤖 5. 檢查 Vertex AI Agent 服務...');
            results.checks.push(await this.checkVertexAIAgent());

            // 6. 模型可用性檢查
            console.log('\n🎯 6. 檢查模型可用性...');
            results.checks.push(await this.checkModelAvailability());

            // 計算整體狀態
            results.overall_status = this.calculateOverallStatus(results.checks);

            // 輸出診斷結果
            this.outputDiagnosticResults(results);

        } catch (error) {
            console.error('❌ 診斷過程發生錯誤:', error.message);
            results.overall_status = 'diagnostic_error';
            results.error = error.message;
        }

        return results;
    }

    static checkEnvironmentVariables() {
        const requiredVars = {
            'GOOGLE_CLOUD_PROJECT_ID': process.env.GOOGLE_CLOUD_PROJECT_ID,
            'GOOGLE_APPLICATION_CREDENTIALS': process.env.GOOGLE_APPLICATION_CREDENTIALS,
            'VERTEX_AI_LOCATION': process.env.VERTEX_AI_LOCATION,
            'GEMINI_API_KEY': process.env.GEMINI_API_KEY
        };

        const result = {
            name: '環境變數檢查',
            status: 'unknown',
            details: {},
            recommendations: []
        };

        let allPresent = true;

        for (const [key, value] of Object.entries(requiredVars)) {
            const isPresent = !!value;
            result.details[key] = {
                present: isPresent,
                value: key.includes('KEY') || key.includes('CREDENTIALS') ?
                    (value ? '***masked***' : 'not_set') : value || 'not_set'
            };

            if (!isPresent && key !== 'GEMINI_API_KEY') {
                allPresent = false;
                console.log(`  ❌ ${key}: 未設定`);
                result.recommendations.push(`設定 ${key} 環境變數`);
            } else {
                console.log(`  ✅ ${key}: ${result.details[key].value}`);
            }
        }

        // 檢查憑證檔案
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            const fs = require('fs');
            const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

            try {
                if (fs.existsSync(credPath)) {
                    result.details.credentials_file_exists = true;
                    console.log(`  ✅ 憑證檔案存在: ${credPath}`);

                    // 檢查憑證檔案內容
                    const content = JSON.parse(fs.readFileSync(credPath, 'utf8'));
                    result.details.credentials_type = content.type;
                    result.details.credentials_project_id = content.project_id;

                } else {
                    result.details.credentials_file_exists = false;
                    console.log(`  ❌ 憑證檔案不存在: ${credPath}`);
                    result.recommendations.push('確認憑證檔案路徑正確');
                    allPresent = false;
                }
            } catch (error) {
                result.details.credentials_error = error.message;
                console.log(`  ⚠️ 憑證檔案讀取錯誤: ${error.message}`);
                result.recommendations.push('檢查憑證檔案格式');
            }
        }

        result.status = allPresent ? 'success' : 'failed';
        return result;
    }

    static checkSDKInstallation() {
        const result = {
            name: 'SDK 安裝檢查',
            status: 'unknown',
            details: {},
            recommendations: []
        };

        const requiredPackages = [
            '@google-cloud/vertexai',
            '@google/generative-ai',
            'google-auth-library'
        ];

        let allInstalled = true;

        for (const packageName of requiredPackages) {
            try {
                const packageInfo = require(`${packageName}/package.json`);
                result.details[packageName] = {
                    installed: true,
                    version: packageInfo.version
                };
                console.log(`  ✅ ${packageName}: v${packageInfo.version}`);
            } catch (error) {
                result.details[packageName] = {
                    installed: false,
                    error: error.message
                };
                console.log(`  ❌ ${packageName}: 未安裝`);
                result.recommendations.push(`執行: npm install ${packageName}`);
                allInstalled = false;
            }
        }

        result.status = allInstalled ? 'success' : 'failed';
        return result;
    }

    static async checkAuthentication() {
        const result = {
            name: '認證檢查',
            status: 'unknown',
            details: {},
            recommendations: []
        };

        try {
            const { GoogleAuth } = require('google-auth-library');
            const auth = new GoogleAuth({
                scopes: ['https://www.googleapis.com/auth/cloud-platform']
            });

            const client = await auth.getClient();
            const projectId = await auth.getProjectId();

            result.details = {
                authenticated: true,
                project_id: projectId,
                client_type: client.constructor.name
            };

            console.log(`  ✅ 認證成功`);
            console.log(`  ✅ 專案 ID: ${projectId}`);
            console.log(`  ✅ 認證類型: ${client.constructor.name}`);

            result.status = 'success';

        } catch (error) {
            result.details = {
                authenticated: false,
                error: error.message
            };
            console.log(`  ❌ 認證失敗: ${error.message}`);
            result.recommendations.push('檢查服務帳戶金鑰檔案');
            result.recommendations.push('確認專案 ID 正確');
            result.status = 'failed';
        }

        return result;
    }

    static async checkAPIStatus() {
        const result = {
            name: 'API 啟用狀態檢查',
            status: 'unknown',
            details: {},
            recommendations: []
        };

        try {
            const { GoogleAuth } = require('google-auth-library');
            const auth = new GoogleAuth({
                scopes: ['https://www.googleapis.com/auth/cloud-platform']
            });

            const client = await auth.getClient();
            const projectId = await auth.getProjectId();

            const requiredAPIs = [
                'aiplatform.googleapis.com',
                'discoveryengine.googleapis.com',
                'generativelanguage.googleapis.com'
            ];

            let allEnabled = true;

            for (const apiName of requiredAPIs) {
                try {
                    const url = `https://serviceusage.googleapis.com/v1/projects/${projectId}/services/${apiName}`;
                    const response = await client.request({ url });

                    const isEnabled = response.data.state === 'ENABLED';
                    result.details[apiName] = {
                        enabled: isEnabled,
                        state: response.data.state
                    };

                    if (isEnabled) {
                        console.log(`  ✅ ${apiName}: 已啟用`);
                    } else {
                        console.log(`  ❌ ${apiName}: ${response.data.state}`);
                        result.recommendations.push(`啟用 ${apiName} API`);
                        allEnabled = false;
                    }

                } catch (error) {
                    result.details[apiName] = {
                        enabled: false,
                        error: error.message
                    };
                    console.log(`  ⚠️ ${apiName}: 檢查失敗 - ${error.message}`);
                    allEnabled = false;
                }
            }

            result.status = allEnabled ? 'success' : 'failed';

        } catch (error) {
            result.status = 'failed';
            result.error = error.message;
            console.log(`  ❌ API 狀態檢查失敗: ${error.message}`);
        }

        return result;
    }

    static async checkVertexAIAgent() {
        const result = {
            name: 'Vertex AI Agent 服務檢查',
            status: 'unknown',
            details: {},
            recommendations: []
        };

        try {
            console.log('  🔍 檢查 Vertex AI Agent Builder...');

            const { GoogleAuth } = require('google-auth-library');
            const auth = new GoogleAuth({
                scopes: ['https://www.googleapis.com/auth/cloud-platform']
            });

            const client = await auth.getClient();
            const projectId = await auth.getProjectId();
            const location = process.env.VERTEX_AI_LOCATION || 'us-central1';

            // 檢查 Agent Builder 可用性
            const agentBuilderUrl = `https://discoveryengine.googleapis.com/v1/projects/${projectId}/locations/${location}/collections/default_collection/dataStores`;

            try {
                const response = await client.request({ url: agentBuilderUrl });
                result.details.agent_builder_accessible = true;
                result.details.datastores_count = response.data.dataStores?.length || 0;
                console.log(`  ✅ Agent Builder 可訪問`);
                console.log(`  📊 資料存儲數量: ${result.details.datastores_count}`);
            } catch (error) {
                result.details.agent_builder_accessible = false;
                result.details.agent_builder_error = error.message;
                console.log(`  ⚠️ Agent Builder 訪問問題: ${error.message}`);
            }

            // 檢查基本 Vertex AI 服務
            try {
                const { VertexAI } = require('@google-cloud/vertexai');
                const vertexAI = new VertexAI({
                    project: projectId,
                    location: location
                });

                result.details.vertex_ai_sdk_initialized = true;
                console.log(`  ✅ Vertex AI SDK 初始化成功`);

                result.status = 'success';

            } catch (error) {
                result.details.vertex_ai_sdk_initialized = false;
                result.details.sdk_error = error.message;
                console.log(`  ❌ Vertex AI SDK 初始化失敗: ${error.message}`);
                result.recommendations.push('檢查 Vertex AI SDK 安裝');
                result.status = 'failed';
            }

        } catch (error) {
            result.status = 'failed';
            result.error = error.message;
            console.log(`  ❌ Vertex AI Agent 檢查失敗: ${error.message}`);
        }

        return result;
    }

    static async checkModelAvailability() {
        const result = {
            name: '模型可用性檢查',
            status: 'unknown',
            details: {},
            recommendations: []
        };

        try {
            const { VertexAI } = require('@google-cloud/vertexai');
            const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
            const location = process.env.VERTEX_AI_LOCATION || 'us-central1';

            const vertexAI = new VertexAI({
                project: projectId,
                location: location
            });

            const modelsToTest = [
                'gemini-1.5-pro',
                'gemini-1.5-flash',
                'gemini-1.0-pro',
                'gemini-pro'
            ];

            let workingModels = [];

            for (const modelName of modelsToTest) {
                try {
                    console.log(`  🧪 測試模型: ${modelName}`);

                    const model = vertexAI.getGenerativeModel({
                        model: modelName,
                        generationConfig: {
                            temperature: 0.1,
                            maxOutputTokens: 50
                        }
                    });

                    const testResult = await model.generateContent('Hello, test');
                    const response = await testResult.response;

                    workingModels.push({
                        name: modelName,
                        status: 'working',
                        response_preview: response.text().substring(0, 30)
                    });

                    console.log(`  ✅ ${modelName}: 可用 - ${response.text().substring(0, 30)}...`);

                } catch (error) {
                    result.details[modelName] = {
                        status: 'failed',
                        error: error.message
                    };
                    console.log(`  ❌ ${modelName}: ${error.message}`);
                }
            }

            result.details.working_models = workingModels;
            result.details.working_count = workingModels.length;

            if (workingModels.length > 0) {
                result.status = 'success';
                result.details.recommended_model = workingModels[0].name;
                console.log(`  🎯 推薦使用模型: ${workingModels[0].name}`);
            } else {
                result.status = 'failed';
                result.recommendations.push('檢查 Vertex AI 區域設定');
                result.recommendations.push('確認模型權限');
            }

        } catch (error) {
            result.status = 'failed';
            result.error = error.message;
            console.log(`  ❌ 模型可用性檢查失敗: ${error.message}`);
        }

        return result;
    }

    static calculateOverallStatus(checks) {
        const criticalChecks = ['環境變數檢查', 'SDK 安裝檢查', '認證檢查'];
        const criticalFailed = checks.filter(check =>
            criticalChecks.includes(check.name) && check.status === 'failed'
        ).length;

        const successCount = checks.filter(check => check.status === 'success').length;
        const totalCount = checks.length;

        if (criticalFailed > 0) return 'critical_failure';
        if (successCount === totalCount) return 'fully_operational';
        if (successCount >= totalCount * 0.7) return 'mostly_operational';
        return 'needs_attention';
    }

    static outputDiagnosticResults(results) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 Vertex AI Agent 診斷結果總結');
        console.log('='.repeat(60));

        const statusEmoji = {
            'fully_operational': '🎉',
            'mostly_operational': '⚠️',
            'needs_attention': '🔧',
            'critical_failure': '❌'
        };

        console.log(`\n整體狀態: ${statusEmoji[results.overall_status]} ${results.overall_status.toUpperCase()}`);

        console.log('\n檢查結果:');
        results.checks.forEach(check => {
            const emoji = check.status === 'success' ? '✅' : check.status === 'failed' ? '❌' : '⚠️';
            console.log(`${emoji} ${check.name}: ${check.status.toUpperCase()}`);

            if (check.recommendations && check.recommendations.length > 0) {
                check.recommendations.forEach(rec => {
                    console.log(`   💡 建議: ${rec}`);
                });
            }
        });

        console.log('\n' + '='.repeat(60));
    }
}

// 如果直接執行此腳本
if (require.main === module) {
    VertexAIAgentDiagnostic.runCompleteDiagnostic()
        .then(() => {
            console.log('\n🏁 診斷完成！');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n💥 診斷過程發生錯誤:', error);
            process.exit(1);
        });
}

module.exports = VertexAIAgentDiagnostic;
