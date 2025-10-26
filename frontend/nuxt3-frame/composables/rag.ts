// composables/rag.ts - RAG 系統管理
import { ref, computed } from 'vue'
import {
    getRAGStats,
    ingestTextToRAG,
    ingestFileToRAG,
    ingestLegalToRAG,
    searchRAGDocuments,
    getRAGDocument,
    deleteRAGDocument,
    batchIngestToRAG,
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

// RAG 系統狀態
export function useRAG() {
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const stats = ref<RAGStatsResponse | null>(null)
    const searchResults = ref<RAGSearchResponse | null>(null)
    const currentDocument = ref<RAGDocumentResponse | null>(null)

    // 計算屬性
    const isSystemReady = computed(() => stats.value?.success && stats.value.stats.status === 'ready')
    const documentCount = computed(() => stats.value?.stats.documentsCount || 0)
    const chunkCount = computed(() => stats.value?.stats.chunksCount || 0)

    // 🔥 取得 RAG 系統統計
    async function fetchStats() {
        isLoading.value = true
        error.value = null

        try {
            const result = await getRAGStats()
            stats.value = result
            console.log('RAG 系統統計:', result)
            return result
        } catch (err) {
            error.value = err instanceof Error ? err.message : '取得統計失敗'
            console.error('RAG 統計錯誤:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 🔥 攝取文字到 RAG
    async function ingestText(text: string, metadata?: { title?: string; category?: string; source?: string; author?: string }) {
        isLoading.value = true
        error.value = null

        try {
            const request: RAGIngestTextRequest = {
                text,
                metadata
            }
            const result: RAGIngestTextResponse = await ingestTextToRAG(request)

            // 攝取成功後更新統計
            if (result.success) {
                await fetchStats()
            }

            return result
        } catch (err) {
            error.value = err instanceof Error ? err.message : '文字攝取失敗'
            console.error('文字攝取錯誤:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 🔥 上傳文件到 RAG
    async function ingestFile(file: File, metadata?: string) {
        isLoading.value = true
        error.value = null

        try {
            const request: RAGIngestFileRequest = {
                document: file,
                metadata
            }
            const result: RAGIngestFileResponse = await ingestFileToRAG(request)

            // 攝取成功後更新統計
            if (result.success) {
                await fetchStats()
            }

            return result
        } catch (err) {
            error.value = err instanceof Error ? err.message : '文件攝取失敗'
            console.error('文件攝取錯誤:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 🔥 攝取法律文件到 RAG
    async function ingestLegal(legalData: RAGIngestLegalRequest) {
        isLoading.value = true
        error.value = null

        try {
            const result: RAGIngestLegalResponse = await ingestLegalToRAG(legalData)

            // 攝取成功後更新統計
            if (result.success) {
                await fetchStats()
            }

            return result
        } catch (err) {
            error.value = err instanceof Error ? err.message : '法律文件攝取失敗'
            console.error('法律文件攝取錯誤:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 🔥 搜尋文件
    async function searchDocuments(query: string, filters?: { documentType?: string; category?: string; jurisdiction?: string; lawCategory?: string }, limit?: number) {
        isLoading.value = true
        error.value = null

        try {
            const request: RAGSearchRequest = {
                query,
                filters,
                limit
            }
            const result: RAGSearchResponse = await searchRAGDocuments(request)
            searchResults.value = result
            return result
        } catch (err) {
            error.value = err instanceof Error ? err.message : '文件搜尋失敗'
            console.error('文件搜尋錯誤:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 🔥 取得文件詳情
    async function fetchDocument(documentId: string) {
        isLoading.value = true
        error.value = null

        try {
            const result: RAGDocumentResponse = await getRAGDocument(documentId)
            currentDocument.value = result
            return result
        } catch (err) {
            error.value = err instanceof Error ? err.message : '取得文件失敗'
            console.error('取得文件錯誤:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 🔥 刪除文件
    async function removeDocument(documentId: string) {
        isLoading.value = true
        error.value = null

        try {
            const result = await deleteRAGDocument(documentId)

            // 刪除成功後更新統計
            if (result.success) {
                await fetchStats()
            }

            return result
        } catch (err) {
            error.value = err instanceof Error ? err.message : '刪除文件失敗'
            console.error('刪除文件錯誤:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 🔥 批量攝取文件
    async function batchIngest(documents: Array<{ text: string; metadata: { title: string; category: string; source?: string } }>) {
        isLoading.value = true
        error.value = null

        try {
            const request: RAGBatchIngestRequest = {
                documents
            }
            const result: RAGBatchIngestResponse = await batchIngestToRAG(request)

            // 攝取成功後更新統計
            if (result.success) {
                await fetchStats()
            }

            return result
        } catch (err) {
            error.value = err instanceof Error ? err.message : '批量攝取失敗'
            console.error('批量攝取錯誤:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 🔥 清空錯誤
    function clearError() {
        error.value = null
    }

    // 🔥 清空搜尋結果
    function clearSearchResults() {
        searchResults.value = null
    }

    // 🔥 清空當前文件
    function clearCurrentDocument() {
        currentDocument.value = null
    }

    return {
        // 狀態
        isLoading: readonly(isLoading),
        error: readonly(error),
        stats: readonly(stats),
        searchResults: readonly(searchResults),
        currentDocument: readonly(currentDocument),

        // 計算屬性
        isSystemReady,
        documentCount,
        chunkCount,

        // 方法
        fetchStats,
        ingestText,
        ingestFile,
        ingestLegal,
        searchDocuments,
        fetchDocument,
        removeDocument,
        batchIngest,
        clearError,
        clearSearchResults,
        clearCurrentDocument
    }
}

// RAG 文件管理
export function useRAGDocuments() {
    const documents = ref<Array<{
        id: string
        title: string
        category: string
        createdAt: string
        updatedAt: string
    }>>([])

    const selectedDocuments = ref<string[]>([])
    const isBatchProcessing = ref(false)

    // 計算屬性
    const selectedCount = computed(() => selectedDocuments.value.length)
    const hasSelection = computed(() => selectedCount.value > 0)

    // 🔥 選擇文件
    function selectDocument(documentId: string) {
        if (!selectedDocuments.value.includes(documentId)) {
            selectedDocuments.value.push(documentId)
        }
    }

    // 🔥 取消選擇文件
    function unselectDocument(documentId: string) {
        const index = selectedDocuments.value.indexOf(documentId)
        if (index > -1) {
            selectedDocuments.value.splice(index, 1)
        }
    }

    // 🔥 切換選擇狀態
    function toggleDocument(documentId: string) {
        if (selectedDocuments.value.includes(documentId)) {
            unselectDocument(documentId)
        } else {
            selectDocument(documentId)
        }
    }

    // 🔥 全選/取消全選
    function toggleSelectAll() {
        if (selectedDocuments.value.length === documents.value.length) {
            selectedDocuments.value = []
        } else {
            selectedDocuments.value = documents.value.map(doc => doc.id)
        }
    }

    // 🔥 批量刪除
    async function batchDelete(deleteFunction: (documentId: string) => Promise<any>) {
        if (selectedDocuments.value.length === 0) return

        isBatchProcessing.value = true
        const results = []

        try {
            for (const documentId of selectedDocuments.value) {
                try {
                    const result = await deleteFunction(documentId)
                    results.push({ documentId, success: true, result })
                } catch (error) {
                    results.push({ documentId, success: false, error })
                }
            }

            // 清空選擇
            selectedDocuments.value = []
            return results
        } finally {
            isBatchProcessing.value = false
        }
    }

    // 🔥 清空選擇
    function clearSelection() {
        selectedDocuments.value = []
    }

    return {
        documents,
        selectedDocuments: readonly(selectedDocuments),
        isBatchProcessing: readonly(isBatchProcessing),
        selectedCount,
        hasSelection,
        selectDocument,
        unselectDocument,
        toggleDocument,
        toggleSelectAll,
        batchDelete,
        clearSelection
    }
}
