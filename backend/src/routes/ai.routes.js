// src/routes/ai.routes.js - 完整整合版本
const ErrorHandler = require('../utils/errorHandler');
const Logger = require('../utils/logger');

class AIRoutes {
    static register(app, services) {
        const {
            attackService,
            geminiService,
            grokService,
            vertexAIAgentService,
            recommendationService  // 如果有的話
        } = services;

        // ═══════════════════════════════════════════
        // 攻擊向量相關路由
        // ═══════════════════════════════════════════

        // 取得所有攻擊向量
        app.get('/ai-attack/vectors', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('📋 取得攻擊向量列表');
            const result = attackService.getAllVectors();
            res.json(result);
        }));

        // 執行攻擊測試
        app.post('/ai-attack/execute', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('⚔️ 執行攻擊測試', { body: req.body });
            const result = attackService.executeAttack(req.body);
            res.json(result);
        }));

        // 執行增強攻擊（如果有實作）
        app.post('/ai-attack/execute-enhanced', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('🔥 執行增強攻擊測試');

            if (!attackService.executeEnhancedAttack) {
                return res.status(501).json({
                    success: false,
                    error: '增強攻擊功能尚未實作',
                    message: '請使用 /ai-attack/execute 端點'
                });
            }

            const result = await attackService.executeEnhancedAttack(req.body);
            res.json(result);
        }));

        // 智能攻擊建議（如果有 recommendationService）
        app.post('/ai-attack/smart-recommend', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('🧠 生成智能攻擊建議');

            if (!recommendationService) {
                return res.status(501).json({
                    success: false,
                    error: 'recommendationService 尚未初始化',
                    message: '此功能暫時不可用'
                });
            }

            const { targetSystem, previousAttacks, riskLevel } = req.body;

            const recommendations = await recommendationService
                .generateSmartRecommendations(targetSystem, previousAttacks);

            res.json({
                success: true,
                recommendations,
                aiAgents: ['gemini', 'grok', 'vertex-ai'],
                confidence: recommendations.averageConfidence || 0.8,
                timestamp: new Date().toISOString()
            });
        }));

        // ═══════════════════════════════════════════
        // Gemini AI 相關路由
        // ═══════════════════════════════════════════

        app.post('/ai-gemini/attack-vector', ErrorHandler.asyncHandler(async (req, res) => {
            const { prompt } = req.body;

            if (!prompt) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要參數: prompt'
                });
            }

            Logger.info('🧠 Gemini AI 攻擊向量生成', {
                prompt: prompt.substring(0, 100)
            });

            const result = await geminiService.generateAttackVector(prompt);
            res.json(result);
        }));

        // ═══════════════════════════════════════════
        // Grok AI 相關路由（新增 + 原有）
        // ═══════════════════════════════════════════

        // 1. 生成完整滲透測試報告 ⭐ NEW
        app.post('/ai-grok/pentest-report', ErrorHandler.asyncHandler(async (req, res) => {
            const { attackResults, zapResults, systemContext } = req.body;

            if (!attackResults) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要參數：attackResults'
                });
            }

            Logger.info('📊 Grok 生成滲透測試報告');

            const report = await grokService.generatePentestReport(
                attackResults,
                zapResults,
                systemContext
            );

            res.json(report);
        }));

        // 2. 生成下次攻擊建議 ⭐ NEW
        app.post('/ai-grok/attack-recommendations', ErrorHandler.asyncHandler(async (req, res) => {
            const { attackResults, zapResults, previousAttempts } = req.body;

            if (!attackResults) {
                return res.status(400).json({
                    success: false,
                    error: '缺少必要參數：attackResults'
                });
            }

            Logger.info('⚔️ Grok 生成下次攻擊建議');

            const recommendations = await grokService.generateNextAttackRecommendations(
                attackResults,
                zapResults,
                previousAttempts || []
            );

            res.json(recommendations);
        }));

        // 3. 通用安全分析（原有）
        app.post('/ai-grok/security-analysis', ErrorHandler.asyncHandler(async (req, res) => {
            const { threatDescription, targetSystem, analysisType } = req.body;

            Logger.info('🔍 Grok AI 安全分析', {
                threatDescription,
                targetSystem,
                analysisType
            });

            // 檢查 grokService 是否有 analyzeSecurityThreat 方法
            if (!grokService.analyzeSecurityThreat) {
                // 如果沒有，使用通用 chat 方法
                const prompt = `
作為資訊安全專家，請分析以下安全威脅：

威脅描述：${threatDescription}
目標系統：${targetSystem}
分析類型：${analysisType || 'vulnerability'}

請提供：
1. 威脅評估
2. 潛在影響
3. 修復建議
4. 預防措施
`;
                const result = await grokService.chat(prompt);
                return res.json(result);
            }

            const result = await grokService.analyzeSecurityThreat(
                threatDescription,
                targetSystem
            );

            res.json(result);
        }));

        // 4. Grok 服務狀態 ⭐ NEW
        app.get('/ai-grok/status', ErrorHandler.asyncHandler(async (req, res) => {
            Logger.info('📊 查詢 Grok 服務狀態');

            const stats = grokService.getServiceStats();

            res.json({
                success: true,
                ...stats,
                timestamp: new Date().toISOString()
            });
        }));

        // ═══════════════════════════════════════════
        // Vertex AI Agent 相關路由
        // ═══════════════════════════════════════════

        app.post('/ai-agent/chat', ErrorHandler.asyncHandler(async (req, res) => {
            const {
                sessionId,
                message,
                agentId = 'default-security-agent'
            } = req.body;

            Logger.info('🤖 Vertex AI Agent 對話', { sessionId, agentId });

            const result = await vertexAIAgentService.chatWithAgent(
                sessionId,
                message,
                agentId
            );

            res.json(result);
        }));

        // ═══════════════════════════════════════════
        // 路由註冊完成
        // ═══════════════════════════════════════════

        const totalRoutes = [
            '/ai-attack/vectors',
            '/ai-attack/execute',
            '/ai-attack/execute-enhanced',
            '/ai-attack/smart-recommend',
            '/ai-gemini/attack-vector',
            '/ai-grok/pentest-report',
            '/ai-grok/attack-recommendations',
            '/ai-grok/security-analysis',
            '/ai-grok/status',
            '/ai-agent/chat'
        ];

        Logger.success(`✅ AI 路由註冊完成`, {
            totalRoutes: totalRoutes.length,
            routes: totalRoutes
        });
    }
}

module.exports = AIRoutes;
