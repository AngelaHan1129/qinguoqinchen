// src/services/EmbeddingService.js
class EmbeddingService {
    constructor() {
        // 可以使用 OpenAI、Cohere 或本地模型
        this.embeddingModel = 'text-embedding-ada-002';
    }

    async generateEmbedding(text) {
        // 實作向量生成邏輯
        // 可以呼叫 OpenAI API 或使用本地模型
        return await this.callEmbeddingAPI(text);
    }
}
