// src/routes/ai.routes.js
const ErrorHandler = require('../utils/errorHandler');
const Logger = require('../utils/logger');

class AIRoutes {
    static register(app, services) {
        const { attackService, geminiService, grokService, vertexAIAgentService } = services;

        // 攻擊向量相關路由
        app.get('/ai-attack/vectors', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('取得攻擊向量列表');
            const result = attackService.getAllVectors();
            res.json(result);
        }));

        app.post('/ai-attack/execute', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('執行攻擊測試', { body: req.body });
            const result = attackService.executeAttack(req.body);
            res.json(result);
        }));

        // Gemini AI 相關路由
        app.post('/ai-gemini/attack-vector', ErrorHandler.asyncHandler(async (req, res) => {
            const { prompt } = req.body;
            if (!prompt) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要參數: prompt'
                });
            }

            Logger.info('Gemini AI 攻擊向量生成', { prompt: prompt.substring(0, 100) });
            const result = await geminiService.generateAttackVector(prompt);
            res.json(result);
        }));

        // Grok AI 相關路由
        app.post('/ai-grok/security-analysis', ErrorHandler.asyncHandler(async (req, res) => {
            const { threatDescription, targetSystem } = req.body;

            Logger.info('Grok AI 安全分析', { threatDescription, targetSystem });
            const result = await grokService.analyzeSecurityThreat(threatDescription, targetSystem);
            res.json(result);
        }));

        // Vertex AI Agent 相關路由
        app.post('/ai-agent/chat', ErrorHandler.asyncHandler(async (req, res) => {
            const { sessionId, message, agentId = 'default-security-agent' } = req.body;

            Logger.info('Vertex AI Agent 對話', { sessionId, agentId });
            const result = await vertexAIAgentService.chatWithAgent(sessionId, message, agentId);
            res.json(result);
        }));

        Logger.success('AI 路由註冊完成', { routes: 4 });
    }
}

module.exports = AIRoutes;
