class SecurityAnalysisService {
    constructor(ragService, geminiService) {
        this.rag = ragService
        this.gemini = geminiService
    }

    async analyzeAndRecommend(penetrationResults) {
        // 分析滲透測試結果
        const analysis = await this.rag.generateSecurityReportSummary(
            `分析這些滲透測試結果: ${JSON.stringify(penetrationResults)}`
        )

        // 生成具體修復建議
        const recommendations = await this.generateActionableRecommendations(
            penetrationResults.vulnerabilities
        )

        // 產生合規報告
        const complianceReport = await this.generateComplianceReport(
            penetrationResults,
            { format: 'pdf', includeAuditTrail: true }
        )

        return { analysis, recommendations, complianceReport }
    }
}
