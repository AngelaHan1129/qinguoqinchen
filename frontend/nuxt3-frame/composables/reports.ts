// composables/reports.ts
import { onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import {
    generateComplianceReport,
    downloadFile,
    askRAG,
    generateSecuritySummary,
    uploadSecurityReport,
    getRAGStats,
    ingestTextToRAG,
    ingestFileToRAG,
    ingestLegalToRAG,
    searchRAGDocuments,
    getRAGDocument,
    deleteRAGDocument,
    batchIngestToRAG,
    chatWithAIAgent,  // 新增
    type AIAgentRequest,  // 新增
    type AIAgentResponse,
    type ComplianceReportRequest,
    type RAGAskRequest,
    type RAGAskResponse,
    type SecuritySummaryRequest,
    type SecuritySummaryResponse,
    type UploadSecurityReportRequest,
    type UploadSecurityReportResponse,
    type RAGStatsResponse,
    type RAGIngestTextRequest,
    type RAGIngestTextResponse,
    type RAGIngestFileRequest,
    type RAGIngestFileResponse,
    type RAGIngestLegalRequest,
    type RAGIngestLegalResponse,
    type RAGSearchRequest,
    type RAGSearchResponse,
    type RAGDocumentResponse,
    type RAGBatchIngestRequest,
    type RAGBatchIngestResponse
} from './getapi'

let chartInstance: echarts.ECharts | null = null
let isAnimating = false

function getCssVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function simulateReportGeneration() {
    const processingRows = document.querySelectorAll('.status-processing')

    processingRows.forEach(status => {
        setTimeout(() => {
            status.textContent = '完成'
            status.className = 'report-status status-completed'

            const downloadBtn = status.closest('.reports-grid')?.querySelector('.download-btn') as HTMLButtonElement | null
            if (downloadBtn) {
                downloadBtn.disabled = false
                downloadBtn.style.opacity = '1'
                downloadBtn.textContent = '📥 下載'
            }
        }, Math.random() * 10000 + 5000)
    })
}

function animateStatNumbers() {
    if (isAnimating) return
    isAnimating = true

    const statNumbers = document.querySelectorAll<HTMLElement>('.stat-number')
    const duration = 2500

    statNumbers.forEach((stat, idx) => {
        const target = parseInt(stat.dataset.value || '0', 10)
        let current = 0
        let startTime: number | null = null

        function step(timestamp: number) {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            current = Math.floor(progress * target)
            stat.textContent = current.toString()

            if (progress < 1) {
                requestAnimationFrame(step)
            } else {
                stat.textContent = target.toString()
                if (idx === statNumbers.length - 1) {
                    isAnimating = false
                }
            }
        }

        requestAnimationFrame(step)
    })
}

function initChart() {
    const chartDom = document.getElementById('riskTrendChart')
    if (!chartDom) return

    chartInstance = echarts.init(chartDom)

    const option: echarts.EChartsOption = {
        tooltip: { trigger: 'axis' },
        legend: {
            top: 30,
            textStyle: { color: getCssVar('--brand-gold') }
        },
        xAxis: {
            type: 'category',
            data: ['2025-09-12', '2025-09-13', '2025-09-14', '2025-09-15', '2025-09-16', '2025-09-17'],
            axisLine: { lineStyle: { color: getCssVar('--brand-gold') } },
            axisLabel: { color: getCssVar('--brand-gold') }
        },
        yAxis: {
            type: 'value',
            minInterval: 1,
            axisLine: { lineStyle: { color: getCssVar('--brand-gold') } },
            axisLabel: { color: getCssVar('--brand-gold') }
        },
        series: [
            {
                name: 'Critical',
                type: 'line',
                data: [1, 2, 2, 3, 3, 3],
                itemStyle: { color: '#FF4444' },
                smooth: true
            },
            {
                name: 'High',
                type: 'line',
                data: [8, 10, 11, 12, 12, 12],
                itemStyle: { color: getCssVar('--brand-orange') },
                smooth: true
            },
            {
                name: 'Medium',
                type: 'line',
                data: [20, 22, 25, 27, 28, 28],
                itemStyle: { color: getCssVar('--brand-gold') },
                smooth: true
            },
            {
                name: 'Low',
                type: 'line',
                data: [40, 42, 43, 44, 45, 45],
                itemStyle: { color: getCssVar('--neon-green') },
                smooth: true
            }
        ]
    }

    chartInstance.setOption(option)
}

function handleResize() {
    if (chartInstance) {
        chartInstance.resize()
    }
}

function destroyChart() {
    if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
    }
}

// 封裝成 composable 方法
export function useReports() {
    // 啟動：模擬 + 動畫 + 圖表初始化 + resize 監聽
    function start() {
        simulateReportGeneration()

        nextTick(() => {
            animateStatNumbers()
        })

        initChart()
        window.addEventListener('resize', handleResize)
    }

    function stop() {
        window.removeEventListener('resize', handleResize)
        destroyChart()
    }

    // 新增報告生成功能
    async function generateReport(options: {
        findingIds?: string[]
        format?: 'pdf' | 'excel'
        includeAuditTrail?: boolean
        frameworks?: string[]
    } = {}) {
        const request: ComplianceReportRequest = {
            findingIds: options.findingIds || ['pentest_001', 'pentest_002'],
            reportFormat: options.format || 'pdf',
            includeAuditTrail: options.includeAuditTrail ?? true,
            complianceFrameworks: options.frameworks || ['ISO_27001', 'OWASP']
        }

        try {
            console.log('正在生成合規報告...', request)
            const result = await generateComplianceReport(request)

            if (result.success && result.downloadUrl && result.filename) {
                // 自動下載文件
                downloadFile(result.downloadUrl, result.filename)
                return { success: true, message: '報告生成成功' }
            } else {
                return { success: false, message: result.error || '報告生成失敗' }
            }
        } catch (error) {
            console.error('報告生成錯誤:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : '未知錯誤'
            }
        }
    }

    // 批量生成報告
    async function generateBatchReports(reports: Array<{
        name: string
        findingIds: string[]
        format: 'pdf' | 'excel'
    }>) {
        const results = []

        for (const report of reports) {
            const result = await generateReport({
                findingIds: report.findingIds,
                format: report.format,
                includeAuditTrail: true,
                frameworks: ['ISO_27001', 'OWASP']
            })

            results.push({
                name: report.name,
                ...result
            })
        }

        return results
    }

    // RAG 智能問答
    async function askAI(question: string, filters?: { documentType?: string; category?: string }) {
        try {
            const request: RAGAskRequest = {
                question,
                filters
            }

            console.log('正在向 RAG 系統提問...', request)
            const result: RAGAskResponse = await askRAG(request)

            if (result.success) {
                return {
                    success: true,
                    answer: result.answer,
                    sources: result.sources,
                    confidence: result.confidence,
                    mode: result.mode,
                    documentsUsed: result.documentsUsed
                }
            } else {
                return {
                    success: false,
                    error: 'RAG 問答失敗'
                }
            }
        } catch (error) {
            console.error('RAG 問答錯誤:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : '未知錯誤'
            }
        }
    }

    // 🔥 新增：生成智能安全報告摘要
    async function generateSecurityReportSummary(question?: string) {
        try {
            const request: SecuritySummaryRequest = {
                question: question || '請分析系統安全狀況',
                filters: {
                    documentType: 'security',
                    category: 'technical'
                }
            }

            console.log('正在生成智能安全報告摘要...', request)
            const result: SecuritySummaryResponse = await generateSecuritySummary(request)

            if (result.success) {
                return {
                    success: true,
                    answer: result.answer,
                    sources: result.sources,
                    confidence: result.confidence,
                    mode: result.mode,
                    documentsUsed: result.documentsUsed,
                    reportType: result.reportType
                }
            } else {
                return {
                    success: false,
                    error: '安全報告摘要生成失敗'
                }
            }
        } catch (error) {
            console.error('安全報告摘要生成錯誤:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : '未知錯誤'
            }
        }
    }

    // 🔥 新增：上傳文件並生成智能安全報告
    async function uploadDocumentAndGenerateReport(file: File, metadata?: { title?: string; description?: string; category?: string }) {
        try {
            const request: UploadSecurityReportRequest = {
                document: file,
                metadata
            }

            console.log('正在上傳文件並生成安全報告...', { fileName: file.name, fileType: file.type })
            const result: UploadSecurityReportResponse = await uploadSecurityReport(request)

            if (result.success) {
                return {
                    success: true,
                    documentId: result.documentId,
                    fileType: result.fileType,
                    fileName: result.fileName,
                    securitySummary: result.securitySummary,
                    detailedAnalysis: result.detailedAnalysis,
                    sources: result.sources,
                    confidence: result.confidence,
                    mode: result.mode,
                    documentsUsed: result.documentsUsed,
                    recommendations: result.recommendations
                }
            } else {
                return {
                    success: false,
                    error: '文件上傳和報告生成失敗'
                }
            }
        } catch (error) {
            console.error('文件上傳和報告生成錯誤:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : '未知錯誤'
            }
        }
    }

    onUnmounted(() => {
        stop()
    })

    // 🔥 新增：RAG 系統統計
    async function getRAGSystemStats() {
        try {
            const result: RAGStatsResponse = await getRAGStats()
            return result
        } catch (error) {
            console.error('RAG 系統統計錯誤:', error)
            return {
                success: false,
                stats: {
                    documentsCount: 0,
                    chunksCount: 0,
                    status: 'error',
                    mode: 'unknown',
                    features: []
                },
                timestamp: new Date().toISOString()
            }
        }
    }

    // 🔥 新增：攝取文字到 RAG
    async function ingestText(text: string, metadata?: { title?: string; category?: string; source?: string; author?: string }) {
        try {
            const request: RAGIngestTextRequest = {
                text,
                metadata
            }
            const result: RAGIngestTextResponse = await ingestTextToRAG(request)
            return result
        } catch (error) {
            console.error('文字攝取錯誤:', error)
            return {
                success: false,
                documentId: '',
                chunksCreated: 0,
                message: '攝取失敗',
                timestamp: new Date().toISOString()
            }
        }
    }

    // 🔥 新增：上傳文件到 RAG
    async function ingestFile(file: File, metadata?: string) {
        try {
            const request: RAGIngestFileRequest = {
                document: file,
                metadata
            }
            const result: RAGIngestFileResponse = await ingestFileToRAG(request)
            return result
        } catch (error) {
            console.error('文件攝取錯誤:', error)
            return {
                success: false,
                documentId: '',
                chunksCreated: 0,
                message: '攝取失敗',
                timestamp: new Date().toISOString()
            }
        }
    }

    // 🔥 新增：攝取法律文件到 RAG
    async function ingestLegalDocument(legalData: RAGIngestLegalRequest) {
        try {
            const result: RAGIngestLegalResponse = await ingestLegalToRAG(legalData)
            return result
        } catch (error) {
            console.error('法律文件攝取錯誤:', error)
            return {
                success: false,
                documentId: '',
                chunksCreated: 0,
                message: '攝取失敗',
                timestamp: new Date().toISOString()
            }
        }
    }

    // 🔥 新增：搜尋 RAG 文件
    async function searchDocuments(query: string, filters?: { documentType?: string; category?: string; jurisdiction?: string; lawCategory?: string }, limit?: number) {
        try {
            const request: RAGSearchRequest = {
                query,
                filters,
                limit
            }
            const result: RAGSearchResponse = await searchRAGDocuments(request)
            return result
        } catch (error) {
            console.error('文件搜尋錯誤:', error)
            return {
                success: false,
                results: [],
                totalResults: 0,
                timestamp: new Date().toISOString()
            }
        }
    }

    // 🔥 新增：取得文件詳情
    async function getDocument(documentId: string) {
        try {
            const result: RAGDocumentResponse = await getRAGDocument(documentId)
            return result
        } catch (error) {
            console.error('取得文件詳情錯誤:', error)
            return {
                success: false,
                document: {
                    id: '',
                    title: '',
                    content: '',
                    category: '',
                    metadata: {},
                    createdAt: '',
                    updatedAt: ''
                },
                timestamp: new Date().toISOString()
            }
        }
    }

    // 🔥 新增：刪除文件
    async function deleteDocument(documentId: string) {
        try {
            const result = await deleteRAGDocument(documentId)
            return result
        } catch (error) {
            console.error('刪除文件錯誤:', error)
            return {
                success: false,
                message: '刪除失敗'
            }
        }
    }

    // 🔥 新增：批量攝取文件
    async function batchIngestDocuments(documents: Array<{ text: string; metadata: { title: string; category: string; source?: string } }>) {
        try {
            const request: RAGBatchIngestRequest = {
                documents
            }
            const result: RAGBatchIngestResponse = await batchIngestToRAG(request)
            return result
        } catch (error) {
            console.error('批量攝取錯誤:', error)
            return {
                success: false,
                results: [],
                totalDocuments: 0,
                totalChunks: 0,
                timestamp: new Date().toISOString()
            }
        }
    }

    return {
        start,
        stop,
        generateReport,
        generateBatchReports,
        askAI,
        generateSecurityReportSummary,
        uploadDocumentAndGenerateReport,
        // 新增的 RAG 功能
        getRAGSystemStats,
        ingestText,
        ingestFile,
        ingestLegalDocument,
        searchDocuments,
        getDocument,
        deleteDocument,
        batchIngestDocuments
    }
}