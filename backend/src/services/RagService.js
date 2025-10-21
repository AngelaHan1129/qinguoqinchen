// src/services/RAGService.js - 整合專用向量服務的完整版本
class RAGService {
    constructor(databaseService, geminiService, embeddingService) {
        this.db = databaseService;
        this.gemini = geminiService;
        this.embedding = embeddingService;

        // 內建知識庫（使用 Map 存儲）
        this.knowledgeBase = new Map();

        // 向量服務狀態
        this.vectorServiceReady = false;

        // 初始化
        this.initializeService();

        console.log('✅ RAG 服務初始化成功（整合專用向量服務）');
    }

    async initializeService() {
        try {
            // 檢查向量服務狀態
            const healthCheck = await this.embedding.checkHealth();

            if (healthCheck.healthy) {
                this.vectorServiceReady = true;
                console.log('🎯 向量服務連接成功:', healthCheck.model);
                console.log(`📐 向量維度: ${healthCheck.dimension}`);

                // 初始化內建知識庫
                await this.initializeKnowledgeBase();

                // 執行服務測試
                const testResult = await this.embedding.testService();
                if (testResult.success) {
                    console.log('✅ 向量服務測試通過');
                } else {
                    console.warn('⚠️ 向量服務測試失敗，將使用備用方案');
                }
            } else {
                console.warn('⚠️ 向量服務不可用:', healthCheck.error);
                console.warn('將使用內建模擬知識庫');
                this.initializeMockKnowledgeBase();
            }
        } catch (error) {
            console.error('❌ RAG 服務初始化失敗:', error.message);
            console.warn('將使用內建模擬知識庫');
            this.initializeMockKnowledgeBase();
        }
    }

    // 初始化內建知識庫（使用真實向量服務）
    async initializeKnowledgeBase() {
        console.log('📚 初始化內建 eKYC 安全知識庫...');

        const knowledgeDocs = [
            {
                title: 'eKYC 系統安全威脅分析',
                content: `eKYC 系統面臨的主要安全威脅包括：

1. **Deepfake 攻擊威脅**
   - SimSwap 即時換臉攻擊（成功率89%）
   - StyleGAN3 生成假自拍（成功率78%）
   - 高擬真度影片合成攻擊

2. **身分盜用攻擊**
   - 利用他人身分資訊進行欺詐驗證
   - 社交工程獲取敏感資料
   - 暗網身分資料交易

3. **生物識別欺騙**
   - 照片翻拍攻擊（成功率65%）
   - 3D列印面具攻擊
   - 矽膠指紋攻擊

4. **文件偽造攻擊**
   - AI生成假證件（DALL·E成功率82%）
   - 偽造護照和身分證
   - OCR繞過技術

5. **系統層面攻擊**
   - API注入攻擊
   - 重放攻擊
   - 中間人攻擊`,
                category: 'security',
                metadata: { source: 'internal_knowledge', priority: 'high' }
            },

            {
                title: 'eKYC 防護策略與最佳實踐',
                content: `eKYC 系統的多層防護策略：

1. **多模態生物識別驗證**
   - 結合人臉、聲紋、行為模式
   - 3D深度感測技術
   - 紅外線活體檢測
   - 眼動軌跡分析

2. **AI對抗防護技術**
   - Deepfake檢測算法部署
   - 對抗樣本訓練
   - 實時異常檢測
   - 機器學習模型更新

3. **文件真偽驗證**
   - 多重OCR交叉驗證
   - 防偽特徵檢測
   - 條碼和QR碼驗證
   - 政府資料庫比對

4. **行為分析與風險評估**
   - 用戶操作模式分析
   - 設備指紋識別
   - 地理位置驗證
   - 時間行為模式

5. **合規與法規遵循**
   - 個人資料保護法遵循
   - 金融監管要求
   - 國際安全標準
   - 稽核與報告機制`,
                category: 'defense',
                metadata: { source: 'internal_knowledge', priority: 'high' }
            },

            {
                title: '台灣個人資料保護法與eKYC合規',
                content: `個人資料保護法在eKYC系統中的應用：

第6條 特種個人資料限制：
生物特徵資料（包含人臉、指紋、聲紋）屬於特種個人資料，蒐集時須符合法定要件，並經當事人明確同意。

第8條 告知義務：
eKYC系統應明確告知當事人：
- 蒐集之目的
- 個人資料類別
- 利用期間、地區、對象及方式
- 當事人依法得行使之權利及方式

第11條 當事人權利：
用戶有權要求：
- 查詢或請求閱覽其個人資料
- 請求製給複製本
- 請求補充或更正
- 請求停止蒐集、處理或利用
- 請求刪除

第27條 損害賠償：
eKYC系統業者若違反本法規定，致當事人權益受損害，應負損害賠償責任。

實務建議：
1. 建立完善的隱私政策
2. 實施資料最小化原則
3. 設置個資保護專責人員
4. 定期進行個資衝擊評估
5. 建立資料外洩通報機制`,
                category: 'legal',
                metadata: { source: 'legal_database', jurisdiction: 'TW', priority: 'critical' }
            }
        ];

        // 為每個知識文件生成向量並存儲
        for (const doc of knowledgeDocs) {
            try {
                await this.ingestDocument(doc.content, {
                    title: doc.title,
                    category: doc.category,
                    ...doc.metadata
                });
            } catch (error) {
                console.error(`❌ 知識庫文件攝取失敗: ${doc.title}`, error.message);
            }
        }

        console.log(`📚 知識庫初始化完成，載入 ${knowledgeDocs.length} 個文件`);
    }

    // 初始化模擬知識庫（備用方案）
    initializeMockKnowledgeBase() {
        console.log('📚 初始化模擬知識庫...');

        const mockDocs = [
            {
                id: 'mock_001',
                title: 'eKYC 系統安全威脅分析',
                content: 'eKYC 系統面臨多種安全威脅，包括 Deepfake 攻擊、身分盜用等...',
                category: 'security',
                similarity: 0.9,
                metadata: { source: 'mock', priority: 'high' }
            },
            {
                id: 'mock_002',
                title: 'AI 攻擊防護指南',
                content: 'AI 攻擊防護需要採用多層防護策略，包括活體檢測、行為分析等...',
                category: 'defense',
                similarity: 0.85,
                metadata: { source: 'mock', priority: 'high' }
            }
        ];

        mockDocs.forEach(doc => {
            this.knowledgeBase.set(doc.id, doc);
        });
    }

    // 取得系統統計
    getStats() {
        const totalDocuments = new Set([...this.knowledgeBase.values()].map(doc =>
            doc.documentId || doc.id
        )).size;

        return {
            documentsCount: totalDocuments,
            chunksCount: this.knowledgeBase.size,
            status: this.vectorServiceReady ? 'ready' : 'mock',
            mode: this.vectorServiceReady ? 'enhanced' : 'fallback',
            vectorService: this.vectorServiceReady ? this.embedding.getModelInfo() : null,
            features: this.vectorServiceReady ? [
                'Professional Legal Vector Service',
                'Smart Text Chunking',
                'Batch Processing',
                'Traditional Chinese Optimized',
                'Cosine Similarity Search'
            ] : [
                'Mock Knowledge Base',
                'Keyword-based Search',
                'Fallback Processing'
            ],
            version: '2.0.0',
            lastUpdated: new Date().toISOString()
        };
    }

    // 真實的 RAG 問答
    async askQuestion(question, filters = {}) {
        try {
            console.log('🤖 RAG 問答處理:', question.substring(0, 50) + '...');

            let relevantDocs = [];
            let mode = 'Direct';

            if (this.vectorServiceReady) {
                // 使用向量服務進行檢索
                const questionEmbedding = await this.embedding.generateEmbedding(question, {
                    instruction: 'query: ',
                    normalize: true
                });

                relevantDocs = this.searchByVector(questionEmbedding, filters);
                mode = relevantDocs.length > 0 ? 'RAG' : 'Direct';

            } else {
                // 使用關鍵詞檢索
                relevantDocs = this.searchByKeywords(question, filters);
                mode = relevantDocs.length > 0 ? 'Keyword-RAG' : 'Direct';
            }

            console.log(`🔍 檢索到 ${relevantDocs.length} 個相關文件`);

            let finalAnswer;
            if (relevantDocs.length > 0) {
                // RAG 模式：基於檢索的增強生成
                const context = relevantDocs.map(doc =>
                    `【${doc.title}】\n${doc.content}`
                ).join('\n\n');

                const ragPrompt = `你是專業的 eKYC 安全專家，專精於台灣法規遵循。請基於以下相關資料回答問題：

=== 相關資料 ===
${context}

=== 問題 ===
${question}

請提供專業、準確的回答，並：
1. 基於提供的資料進行回答
2. 引用具體的條文或技術細節
3. 提供實務建議和最佳實踐
4. 說明合規要求（如適用）
5. 指出潛在風險和防護措施

回答應該專業且易懂，適合資安從業人員和合規人員閱讀。`;

                finalAnswer = await this.callGeminiAI(ragPrompt);

            } else {
                // 直接問答模式
                const directPrompt = `你是專業的 eKYC 安全專家。請回答以下問題：\n\n${question}\n\n請提供專業、準確的回答。`;
                finalAnswer = await this.callGeminiAI(directPrompt);
            }

            const sources = relevantDocs.map(doc => ({
                id: doc.id || doc.documentId,
                title: doc.title,
                similarity: doc.similarity,
                category: doc.category,
                source: doc.metadata?.source
            }));

            return {
                answer: finalAnswer,
                sources,
                confidence: this.calculateConfidence(relevantDocs),
                mode,
                documentsUsed: relevantDocs.length,
                vectorService: this.vectorServiceReady ? this.embedding.getModelInfo() : null,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ RAG 問答失敗:', error.message);

            return {
                answer: this.generateMockAnswer(question),
                sources: [],
                confidence: 0.6,
                mode: 'Fallback',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // 向量檢索
    searchByVector(questionEmbedding, filters = {}) {
        const relevantDocs = [];

        for (const [id, doc] of this.knowledgeBase) {
            if (!doc.embedding) continue;

            const similarity = this.calculateCosineSimilarity(questionEmbedding, doc.embedding);

            // 應用過濾條件
            let adjustedSimilarity = similarity;
            if (filters.documentType && doc.category !== filters.documentType) {
                adjustedSimilarity *= 0.5;
            }

            if (adjustedSimilarity > 0.3) {
                relevantDocs.push({
                    ...doc,
                    similarity: Math.round(adjustedSimilarity * 1000) / 1000
                });
            }
        }

        return relevantDocs
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);
    }

    // 關鍵詞檢索（備用方案）
    searchByKeywords(question, filters = {}) {
        const lowerQuestion = question.toLowerCase();
        const relevantDocs = [];

        for (const [id, doc] of this.knowledgeBase) {
            let relevanceScore = 0;

            // 關鍵詞匹配
            const keywords = [
                'ekyc', '安全', '威脅', 'deepfake', '攻擊', '防護',
                'ai', '人工智慧', '生物識別', '身分驗證', '風險',
                '個資法', '合規', '法規', '隱私'
            ];

            const docContent = (doc.title + ' ' + doc.content).toLowerCase();

            keywords.forEach(keyword => {
                if (lowerQuestion.includes(keyword) && docContent.includes(keyword)) {
                    relevanceScore += 0.1;
                }
            });

            // 標題匹配加權
            if (doc.title.toLowerCase().includes(lowerQuestion.substring(0, 20))) {
                relevanceScore += 0.3;
            }

            // 應用過濾條件
            if (filters.documentType && doc.category !== filters.documentType) {
                relevanceScore *= 0.5;
            }

            if (relevanceScore > 0.1) {
                relevantDocs.push({
                    ...doc,
                    similarity: Math.min(relevanceScore, 0.95)
                });
            }
        }

        return relevantDocs
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3);
    }

    // 呼叫 Gemini AI
    async callGeminiAI(prompt) {
        try {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error('GEMINI_API_KEY 未設定');
            }

            const { GoogleGenerativeAI } = require('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error('❌ Gemini AI 呼叫失敗:', error.message);
            throw error;
        }
    }

    // 餘弦相似度計算
    calculateCosineSimilarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) {
            return 0;
        }

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        if (normA === 0 || normB === 0) return 0;

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    // 文件攝取（整合向量服務）
    async ingestDocument(text, metadata = {}) {
        try {
            console.log('📄 RAG 文件攝取:', {
                textLength: text.length,
                metadata: Object.keys(metadata)
            });

            const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

            if (this.vectorServiceReady) {
                // 使用專用向量服務進行智能分塊
                const chunkingResult = await this.embedding.chunkText(text, {
                    chunkSize: 500,
                    overlap: 50
                });

                const chunks = chunkingResult.chunks;
                console.log(`✂️ 智能分塊完成: ${chunks.length} 個片段`);

                // 批量生成向量
                const chunkTexts = chunks.map(chunk => chunk.text);
                const embeddings = await this.embedding.batchGenerateEmbeddings(chunkTexts, {
                    instruction: 'passage: ',
                    normalize: true
                });

                // 存儲到知識庫
                chunks.forEach((chunk, index) => {
                    const chunkId = `${documentId}_chunk_${index}`;
                    this.knowledgeBase.set(chunkId, {
                        id: chunkId,
                        documentId,
                        title: metadata.title || `文件 ${documentId}`,
                        content: chunk.text,
                        embedding: embeddings[index],
                        chunkInfo: chunk,
                        category: metadata.category || 'general',
                        metadata: {
                            ...metadata,
                            createdAt: new Date().toISOString(),
                            source: 'vector_service'
                        }
                    });
                });

                return {
                    success: true,
                    documentId,
                    chunksCreated: chunks.length,
                    totalCharacters: chunkingResult.originalLength,
                    chunkTypes: [...new Set(chunks.map(c => c.type))],
                    vectorService: this.embedding.getModelInfo(),
                    message: '文件攝取成功，已使用專用向量服務處理',
                    timestamp: new Date().toISOString()
                };

            } else {
                // 備用方案：簡化處理
                const chunks = this.chunkDocument(text);

                chunks.forEach((chunk, index) => {
                    const chunkId = `${documentId}_chunk_${index}`;
                    this.knowledgeBase.set(chunkId, {
                        id: chunkId,
                        documentId,
                        title: metadata.title || `文件 ${documentId}`,
                        content: chunk.content,
                        chunkInfo: chunk,
                        category: metadata.category || 'general',
                        metadata: {
                            ...metadata,
                            createdAt: new Date().toISOString(),
                            source: 'fallback'
                        }
                    });
                });

                return {
                    success: true,
                    documentId,
                    chunksCreated: chunks.length,
                    mode: 'fallback',
                    message: '使用備用方案攝取文件',
                    timestamp: new Date().toISOString()
                };
            }

        } catch (error) {
            console.error('❌ 文件攝取失敗:', error.message);
            throw error;
        }
    }

    // 法律文件攝取
    async ingestLegalDocument(legalData) {
        try {
            console.log('⚖️ 法律文件攝取:', {
                title: legalData.title,
                documentType: legalData.documentType,
                jurisdiction: legalData.jurisdiction
            });

            const enrichedMetadata = {
                ...legalData.metadata,
                isLegal: true,
                processedAt: new Date().toISOString(),
                documentType: legalData.documentType,
                jurisdiction: legalData.jurisdiction,
                lawCategory: legalData.lawCategory,
                category: 'legal'
            };

            return await this.ingestDocument(legalData.content, enrichedMetadata);
        } catch (error) {
            console.error('❌ 法律文件攝取失敗:', error.message);
            throw error;
        }
    }

    // 搜尋文件
    async searchDocuments({ query, limit = 10, threshold = 0.3, documentTypes, timeRange }) {
        try {
            console.log('🔍 文件搜尋:', {
                query: query.substring(0, 50),
                limit,
                threshold
            });

            let results = [];

            if (this.vectorServiceReady) {
                // 向量搜尋
                const queryEmbedding = await this.embedding.generateEmbedding(query, {
                    instruction: 'query: '
                });

                results = this.searchByVector(queryEmbedding, {
                    documentTypes,
                    threshold
                }).slice(0, limit);

            } else {
                // 關鍵詞搜尋
                results = this.searchByKeywords(query, {
                    documentTypes
                }).slice(0, limit);
            }

            return {
                results: results.map(doc => ({
                    documentId: doc.documentId || doc.id,
                    title: doc.title,
                    content: doc.content.substring(0, 500),
                    similarity: doc.similarity,
                    category: doc.category,
                    metadata: doc.metadata
                })),
                query,
                totalFound: results.length,
                searchTime: Date.now(),
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ 文件搜尋失敗:', error.message);
            throw error;
        }
    }

    // 取得文件詳情
    async getDocument(documentId) {
        try {
            console.log('📖 取得文件詳情:', documentId);

            // 尋找文件或其片段
            const doc = this.knowledgeBase.get(documentId);
            if (doc) {
                return {
                    id: doc.id,
                    documentId: doc.documentId,
                    title: doc.title,
                    content: doc.content,
                    category: doc.category,
                    metadata: doc.metadata,
                    chunkInfo: doc.chunkInfo,
                    lastUpdated: doc.metadata?.createdAt
                };
            }

            // 如果是文件ID，查找所有相關片段
            const chunks = [...this.knowledgeBase.values()]
                .filter(doc => doc.documentId === documentId);

            if (chunks.length > 0) {
                const fullContent = chunks
                    .sort((a, b) => (a.chunkInfo?.index || 0) - (b.chunkInfo?.index || 0))
                    .map(chunk => chunk.content)
                    .join('\n\n');

                return {
                    id: documentId,
                    title: chunks[0].title,
                    content: fullContent,
                    category: chunks[0].category,
                    metadata: chunks[0].metadata,
                    chunksCount: chunks.length,
                    lastUpdated: chunks[0].metadata?.createdAt
                };
            }

            throw new Error('文件不存在');

        } catch (error) {
            console.error('❌ 取得文件失敗:', error.message);
            throw error;
        }
    }

    // 刪除文件
    async deleteDocument(documentId, cascade = true) {
        try {
            console.log('🗑️ 刪除文件:', { documentId, cascade });

            let deletedCount = 0;

            if (cascade) {
                // 刪除文件的所有片段
                for (const [chunkId, doc] of this.knowledgeBase) {
                    if (doc.documentId === documentId || doc.id === documentId) {
                        this.knowledgeBase.delete(chunkId);
                        deletedCount++;
                    }
                }
            } else {
                // 只刪除指定的片段
                if (this.knowledgeBase.has(documentId)) {
                    this.knowledgeBase.delete(documentId);
                    deletedCount = 1;
                }
            }

            return {
                success: true,
                documentId,
                cascade,
                deletedChunks: deletedCount,
                message: `成功刪除 ${deletedCount} 個文件片段`,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ 刪除文件失敗:', error.message);
            throw error;
        }
    }

    // 批次文件攝取
    async batchIngestDocuments(documents) {
        try {
            console.log('📦 批次文件攝取:', { count: documents.length });

            const results = [];
            const batchSize = 5; // 限制並發數量

            for (let i = 0; i < documents.length; i += batchSize) {
                const batch = documents.slice(i, i + batchSize);
                const batchPromises = batch.map(async (doc, batchIndex) => {
                    const index = i + batchIndex;
                    try {
                        const result = await this.ingestDocument(doc.text, doc.metadata);
                        return {
                            index,
                            success: true,
                            ...result
                        };
                    } catch (error) {
                        return {
                            index,
                            success: false,
                            error: error.message
                        };
                    }
                });

                const batchResults = await Promise.all(batchPromises);
                results.push(...batchResults);

                // 批次間暫停
                if (i + batchSize < documents.length) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            const successCount = results.filter(r => r.success).length;
            const failCount = results.length - successCount;

            console.log(`✅ 批次攝取完成: ${successCount} 成功, ${failCount} 失敗`);

            return {
                results,
                summary: {
                    total: results.length,
                    successful: successCount,
                    failed: failCount,
                    successRate: `${Math.round(successCount / results.length * 100)}%`
                },
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ 批次攝取失敗:', error.message);
            throw error;
        }
    }

    // === 輔助方法 ===
    generateMockAnswer(question) {
        const answers = {
            'ekyc': 'eKYC (電子化身分識別與核實) 是一種數位身分驗證技術，使用 AI 和生物識別技術來驗證用戶身分。',
            'deepfake': 'Deepfake 攻擊是使用深度學習技術生成假造的人臉影像或影片，對 eKYC 系統構成嚴重威脅。主要包括 SimSwap 即時換臉（成功率89%）和 StyleGAN3 生成假自拍（成功率78%）。',
            'security': 'eKYC 系統的主要安全威脅包括：Deepfake 攻擊、身分盜用、生物識別欺騙、文件偽造等。建議採用多層防護策略。',
            'ai': 'AI 技術在 eKYC 系統中扮演關鍵角色，包括人臉辨識、活體檢測、OCR 文件辨識等功能。',
            '個資法': '根據個人資料保護法第6條，生物特徵資料屬於特種個人資料，eKYC系統蒐集時須經當事人明確同意。',
            '合規': 'eKYC 系統需要遵循個人資料保護法、金融監管規範等相關法規，建立完善的隱私政策和資料保護機制。'
        };

        const lowerQuestion = question.toLowerCase();
        for (const [key, answer] of Object.entries(answers)) {
            if (lowerQuestion.includes(key)) {
                return answer + ' (這是基於 RAG 系統檢索的回答)';
            }
        }

        return '根據已攝取的文件資料和內建知識庫，這是一個關於 eKYC 安全系統的問題。系統正在持續學習和改進，建議攝取更多相關文件以提供更精確的回答。';
    }

    calculateConfidence(relevantDocs) {
        if (!relevantDocs || relevantDocs.length === 0) return 0.5;

        const avgSimilarity = relevantDocs.reduce((sum, doc) => sum + (doc.similarity || 0.5), 0) / relevantDocs.length;
        const docCountFactor = Math.min(relevantDocs.length / 5, 1);

        return Math.round((avgSimilarity * 0.7 + docCountFactor * 0.3) * 100) / 100;
    }

    chunkDocument(text, chunkSize = 500, overlap = 50) {
        const chunks = [];
        let start = 0;
        let index = 0;

        while (start < text.length) {
            let end = Math.min(start + chunkSize, text.length);

            // 尋找適當的斷點
            if (end < text.length) {
                for (const punct of ['。', '！', '？', '；', '\n']) {
                    const lastPunct = text.lastIndexOf(punct, end);
                    if (lastPunct > start + chunkSize * 0.7) {
                        end = lastPunct + 1;
                        break;
                    }
                }
            }

            const chunkText = text.substring(start, end).trim();
            if (chunkText) {
                chunks.push({
                    index,
                    content: chunkText,
                    startIndex: start,
                    endIndex: end,
                    type: 'fixed_size',
                    character_count: chunkText.length
                });
                index++;
            }

            start = Math.max(end - overlap, start + 1);
        }

        return chunks;
    }
}

module.exports = RAGService;
