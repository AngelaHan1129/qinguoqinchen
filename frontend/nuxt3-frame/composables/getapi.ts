// composables/getapi.ts
import { useApiFetch } from './useApiFetch'
export type AttackModVector = {
    id: string
    model: string
    difficulty: 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
    successRate: string
    scenario: string
    description?: string
}

// 新增合規報告相關類型
export type ComplianceReportRequest = {
    findingIds: string[]
    reportFormat: 'pdf' | 'excel'
    includeAuditTrail: boolean
    complianceFrameworks: string[]
}

export type ComplianceReportResponse = {
    success: boolean
    filename?: string
    downloadUrl?: string
    error?: string
}

// 攻擊執行相關類型
export type AttackExecuteRequest = {
    vectorIds: string[]
    intensity: 'low' | 'medium' | 'high'
    options?: {
        targetSystem?: string
        testMode?: boolean
        maxDuration?: number
    }
}

export type AttackResult = {
    vectorId: string
    success: boolean
    confidence: number
    bypassScore: number
    processingTime: number
    timestamp: string
}

export type AttackExecuteResponse = {
    success: boolean
    testId: string
    attackResults: {
        vectors: string[]
        intensity: string
        results: AttackResult[]
        summary: {
            totalAttacks: number
            successfulAttacks: number
            successRate: string
            threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
        }
    }
    timestamp: string
}

// RAG 問答相關類型
export type RAGAskRequest = {
    question: string
    filters?: {
        documentType?: string
        category?: string
    }
}

export type RAGSource = {
    id: string
    title: string
    similarity: number
    category: string
}

export type RAGAskResponse = {
    success: boolean
    answer: string
    sources: RAGSource[]
    confidence: number
    mode: 'RAG' | 'Direct' | 'Fallback'
    documentsUsed: number
    timestamp: string
}

/**
 * 取得 AI 攻擊模組資料
 */
export async function getAttackMod(): Promise<{ vectors: AttackModVector[] }> {
    try {
        const response = await useApiFetch('/ai-attack/vectors')

        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`)

        const json = await response.json()
        console.log('[getAttackMod] JSON result:', json)

        return json
    } catch (e) {
        console.error('[getAttackMod] Error:', e)
        throw e
    }
}

/**
 * 生成合規報告
 */
export async function generateComplianceReport(request: ComplianceReportRequest): Promise<ComplianceReportResponse> {
    try {
        const response = await fetch('/api/rag/compliance/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/pdf'
            },
            body: JSON.stringify(request)
        })

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        // 檢查是否為 PDF 文件
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/pdf')) {
            // 處理 PDF 下載
            const blob = await response.blob()
            const filename = getFilenameFromResponse(response) || `compliance_report_${new Date().toISOString().split('T')[0]}.pdf`

            // 創建下載鏈接
            const url = window.URL.createObjectURL(blob)

            return {
                success: true,
                filename,
                downloadUrl: url
            }
        } else {
            // 處理 JSON 響應（錯誤情況）
            const errorData = await response.json()
            throw new Error(errorData.message || 'Unknown error occurred')
        }
    } catch (error) {
        console.error('[generateComplianceReport] Error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}

/**
 * 從響應頭中提取文件名
 */
function getFilenameFromResponse(response: Response): string | null {
    const contentDisposition = response.headers.get('content-disposition')
    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
        return filenameMatch ? filenameMatch[1] : null
    }
    return null
}

/**
 * 執行 AI 攻擊測試
 */
export async function executeAttack(request: AttackExecuteRequest): Promise<AttackExecuteResponse> {
    try {
        const response = await fetch('/api/ai-attack/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log('[executeAttack] Result:', result)

        return result
    } catch (error) {
        console.error('[executeAttack] Error:', error)
        throw error
    }
}

/**
 * RAG 智能問答
 */
export async function askRAG(request: RAGAskRequest): Promise<RAGAskResponse> {
    try {
        const response = await fetch('/api/rag/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })

        if (!response.ok) {
            throw new Error(`RAG API request failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log('[askRAG] Result:', result)

        return result
    } catch (error) {
        console.error('[askRAG] Error:', error)
        throw error
    }
}

/**
 * 下載文件到本地
 */
export function downloadFile(url: string, filename: string): void {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 清理 URL 對象
    setTimeout(() => {
        window.URL.revokeObjectURL(url)
    }, 1000)
}

// 🔥 新增：智能安全報告摘要相關類型
export type SecuritySummaryRequest = {
    question?: string
    filters?: {
        documentType?: string
        category?: string
    }
}

export type SecuritySummaryResponse = {
    success: boolean
    answer: string
    sources: RAGSource[]
    confidence: number
    mode: 'Security-RAG' | 'Direct' | 'Fallback'
    documentsUsed: number
    reportType: 'security_summary'
    timestamp: string
    error?: string
}

export type UploadSecurityReportRequest = {
    document: File
    metadata?: {
        title?: string
        description?: string
        category?: string
    }
}

export type UploadSecurityReportResponse = {
    success: boolean
    documentId: string
    fileType: string
    fileName: string
    securitySummary: string
    detailedAnalysis: string
    sources: RAGSource[]
    confidence: number
    mode: string
    documentsUsed: number
    recommendations: {
        immediate: string[]
        shortTerm: string[]
        longTerm: string[]
    }
    timestamp: string
    error?: string
}

/**
 * 生成智能安全報告摘要
 */
export async function generateSecuritySummary(request: SecuritySummaryRequest = {}): Promise<SecuritySummaryResponse> {
    try {
        const response = await fetch('/api/rag/security-summary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })

        if (!response.ok) {
            throw new Error(`Security Summary API request failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log('[generateSecuritySummary] Result:', result)

        return result
    } catch (error) {
        console.error('[generateSecuritySummary] Error:', error)
        throw error
    }
}

/**
 * 上傳文件並生成智能安全報告
 */
export async function uploadSecurityReport(request: UploadSecurityReportRequest): Promise<UploadSecurityReportResponse> {
    try {
        const formData = new FormData()
        formData.append('document', request.document)

        if (request.metadata) {
            formData.append('metadata', JSON.stringify(request.metadata))
        }

        const response = await fetch('/api/rag/upload-security-report', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            throw new Error(`Upload Security Report API request failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log('[uploadSecurityReport] Result:', result)

        return result
    } catch (error) {
        console.error('[uploadSecurityReport] Error:', error)
        throw error
    }
}

// ==================== RAG 系統 API ====================

// RAG 統計相關類型
export type RAGStatsResponse = {
    success: boolean
    stats: {
        documentsCount: number
        chunksCount: number
        status: string
        mode: string
        features: string[]
    }
    timestamp: string
}

// RAG 文件攝取相關類型
export type RAGIngestTextRequest = {
    text: string
    metadata?: {
        title?: string
        category?: string
        source?: string
        author?: string
    }
}

export type RAGIngestTextResponse = {
    success: boolean
    documentId: string
    chunksCreated: number
    message: string
    timestamp: string
}

export type RAGIngestFileRequest = {
    document: File
    metadata?: string // JSON string
}

export type RAGIngestFileResponse = {
    success: boolean
    documentId: string
    chunksCreated: number
    message: string
    timestamp: string
}

export type RAGIngestLegalRequest = {
    title: string
    content: string
    source?: string
    documentType?: 'regulation' | 'law' | 'guideline'
    jurisdiction?: string
    lawCategory?: string
    articleNumber?: string
    effectiveDate?: string
    metadata?: object
}

export type RAGIngestLegalResponse = {
    success: boolean
    documentId: string
    chunksCreated: number
    message: string
    timestamp: string
}

// RAG 搜尋相關類型
export type RAGSearchRequest = {
    query: string
    filters?: {
        documentType?: string
        category?: string
        jurisdiction?: string
        lawCategory?: string
    }
    limit?: number
}

export type RAGSearchResponse = {
    success: boolean
    results: Array<{
        id: string
        title: string
        content: string
        similarity: number
        category: string
        metadata: object
    }>
    totalResults: number
    timestamp: string
}

// RAG 文件管理相關類型
export type RAGDocumentResponse = {
    success: boolean
    document: {
        id: string
        title: string
        content: string
        category: string
        metadata: object
        createdAt: string
        updatedAt: string
    }
    timestamp: string
}

export type RAGBatchIngestRequest = {
    documents: Array<{
        text: string
        metadata: {
            title: string
            category: string
            source?: string
        }
    }>
}

export type RAGBatchIngestResponse = {
    success: boolean
    results: Array<{
        documentId: string
        chunksCreated: number
        success: boolean
        error?: string
    }>
    totalDocuments: number
    totalChunks: number
    timestamp: string
}

// 在 frontend/nuxt3-frame/composables/getapi.ts 中添加

// AI Agent 相關類型
export type AIAgentRequest = {
    sessionId?: string
    message: string
    agentId?: 'default-security-agent' | 'ekyc-specialist' | 'penetration-tester'
    context?: {
        domain?: string
        systemType?: string
        previousAttacks?: string[]
    }
}

export type AIAgentResponse = {
    success: boolean
    response: string
    sessionId: string
    agentId: string
    suggestions?: string[]
    relatedAttackVectors?: string[]
    confidence: number
    conversationLength: number
    model: string
    timestamp: string
}

/**
 * AI Agent 智能對話
 */
export async function chatWithAIAgent(request: AIAgentRequest): Promise<AIAgentResponse> {
    try {
        const response = await fetch('/api/ai-agent/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(request)
        })

        if (!response.ok) {
            throw new Error(`AI Agent API request failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log('[chatWithAIAgent] Result:', result)
        return result
    } catch (error) {
        console.error('[chatWithAIAgent] Error:', error)
        throw error
    }
}

/**
 * 取得 RAG 系統統計
 */
export async function getRAGStats(): Promise<RAGStatsResponse> {
    const maxRetries = 3
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[getRAGStats] 嘗試 ${attempt}/${maxRetries}`)

            const response = await fetch('/api/rag/stats', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                // 添加超時設置
                signal: AbortSignal.timeout(10000) // 10秒超時
            })

            if (!response.ok) {
                throw new Error(`RAG Stats API request failed: ${response.status} ${response.statusText}`)
            }

            const result = await response.json()
            console.log('[getRAGStats] Result:', result)
            return result
        } catch (error) {
            lastError = error as Error
            console.error(`[getRAGStats] 嘗試 ${attempt} 失敗:`, error)

            if (attempt < maxRetries) {
                const delay = attempt * 1000 // 遞增延遲
                console.log(`[getRAGStats] ${delay}ms 後重試...`)
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }
    }

    // 所有重試都失敗了
    console.error('[getRAGStats] 所有重試都失敗了')
    throw lastError || new Error('RAG Stats API 連接失敗')
}

/**
 * 攝取文字到 RAG 系統
 */
export async function ingestTextToRAG(request: RAGIngestTextRequest): Promise<RAGIngestTextResponse> {
    try {
        const response = await fetch('/api/rag/ingest/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })

        if (!response.ok) {
            throw new Error(`RAG Ingest Text API request failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log('[ingestTextToRAG] Result:', result)
        return result
    } catch (error) {
        console.error('[ingestTextToRAG] Error:', error)
        throw error
    }
}

/**
 * 上傳文件到 RAG 系統
 */
export async function ingestFileToRAG(request: RAGIngestFileRequest): Promise<RAGIngestFileResponse> {
    try {
        const formData = new FormData()
        formData.append('document', request.document)

        if (request.metadata) {
            formData.append('metadata', request.metadata)
        }

        const response = await fetch('/api/rag/ingest/file', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            throw new Error(`RAG Ingest File API request failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log('[ingestFileToRAG] Result:', result)
        return result
    } catch (error) {
        console.error('[ingestFileToRAG] Error:', error)
        throw error
    }
}

/**
 * 攝取法律文件到 RAG 系統
 */
export async function ingestLegalToRAG(request: RAGIngestLegalRequest): Promise<RAGIngestLegalResponse> {
    try {
        const response = await fetch('/api/rag/ingest/legal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })

        if (!response.ok) {
            throw new Error(`RAG Ingest Legal API request failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log('[ingestLegalToRAG] Result:', result)
        return result
    } catch (error) {
        console.error('[ingestLegalToRAG] Error:', error)
        throw error
    }
}

/**
 * 搜尋 RAG 系統中的文件
 */
export async function searchRAGDocuments(request: RAGSearchRequest): Promise<RAGSearchResponse> {
    try {
        const response = await fetch('/api/rag/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })

        if (!response.ok) {
            throw new Error(`RAG Search API request failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log('[searchRAGDocuments] Result:', result)
        return result
    } catch (error) {
        console.error('[searchRAGDocuments] Error:', error)
        throw error
    }
}

/**
 * 取得特定文件詳情
 */
export async function getRAGDocument(documentId: string): Promise<RAGDocumentResponse> {
    try {
        const response = await fetch(`/api/rag/document/${documentId}`)
        if (!response.ok) {
            throw new Error(`RAG Document API request failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log('[getRAGDocument] Result:', result)
        return result
    } catch (error) {
        console.error('[getRAGDocument] Error:', error)
        throw error
    }
}

/**
 * 刪除特定文件
 */
export async function deleteRAGDocument(documentId: string): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch(`/api/rag/document/${documentId}`, {
            method: 'DELETE'
        })
        if (!response.ok) {
            throw new Error(`RAG Document Delete API request failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log('[deleteRAGDocument] Result:', result)
        return result
    } catch (error) {
        console.error('[deleteRAGDocument] Error:', error)
        throw error
    }
}

/**
 * 批量攝取文件到 RAG 系統
 */
export async function batchIngestToRAG(request: RAGBatchIngestRequest): Promise<RAGBatchIngestResponse> {
    try {
        const response = await fetch('/api/rag/batch/ingest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })

        if (!response.ok) {
            throw new Error(`RAG Batch Ingest API request failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log('[batchIngestToRAG] Result:', result)
        return result
    } catch (error) {
        console.error('[batchIngestToRAG] Error:', error)
        throw error
    }
}