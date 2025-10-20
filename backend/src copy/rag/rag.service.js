const { Injectable, Logger } = require('@nestjs/common');
const { InjectRepository } = require('@nestjs/typeorm');
const { Repository } = require('typeorm');
const { ConfigService } = require('@nestjs/config');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const { Document } = require('../database/entities/document.entity');
const { Chunk } = require('../database/entities/chunk.entity');

@Injectable()
class RagService {
  constructor(documentRepo, chunkRepo, configService) {
    this.documentRepo = documentRepo;
    this.chunkRepo = chunkRepo;
    this.configService = configService;
    this.logger = new Logger(RagService.name);

    // 初始化 Gemini AI
    this.genAI = new GoogleGenerativeAI(
      this.configService.get('GEMINI_API_KEY')
    );
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async askQuestion(question, filters = {}) {
    try {
      this.logger.log(`處理 RAG 查詢: ${question}`);

      // 1. 向量檢索相似文檔
      const relevantChunks = await this.retrieveRelevantChunks(question, filters);

      if (relevantChunks.length === 0) {
        return {
          answer: '抱歉，在現有的滲透測試報告中找不到相關資訊。請檢查查詢條件或聯絡管理員。',
          sources: [],
          timestamp: new Date()
        };
      }

      // 2. 組合 RAG 提示
      const context = relevantChunks
        .map(chunk => `[文檔ID: ${chunk.documentId}][相似度: ${(chunk.similarity * 100).toFixed(1)}%] ${chunk.text}`)
        .join('\n\n');

      const prompt = this.buildRagPrompt(context, question);

      // 3. Gemini 生成回答
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      // 4. 記錄審計日誌
      await this.logRagQuery(question, relevantChunks.map(c => c.id), response);

      return {
        answer: response,
        sources: relevantChunks.map(chunk => ({
          documentId: chunk.documentId,
          chunkId: chunk.id,
          similarity: chunk.similarity,
          attackVector: chunk.attackVector,
          runId: chunk.runId,
          preview: chunk.text.substring(0, 200) + '...'
        })),
        timestamp: new Date()
      };

    } catch (error) {
      this.logger.error(`RAG 查詢失敗: ${error.message}`);
      throw new Error(`RAG 系統錯誤: ${error.message}`);
    }
  }

  async retrieveRelevantChunks(question, filters, topK = 5) {
    try {
      // 呼叫 Python AI 服務生成查詢向量
      const embedding = await this.getEmbedding(question);

      // PostgreSQL 向量相似度查詢
      let queryBuilder = this.chunkRepo
        .createQueryBuilder('chunk')
        .leftJoinAndSelect('chunk.document', 'document')
        .select([
          'chunk.id',
          'chunk.text',
          'chunk.documentId',
          'document.source',
          'document.type',
          'document.metadata',
          `(1 - (chunk.embedding <=> '[${embedding.join(',')}]')) as similarity`
        ])
        .where('chunk.embedding IS NOT NULL')
        .orderBy('similarity', 'DESC')
        .limit(topK);

      // 應用過濾條件
      if (filters.attackVector) {
        queryBuilder = queryBuilder.andWhere(
          "document.metadata->>'attackVector' = :attackVector",
          { attackVector: filters.attackVector }
        );
      }

      if (filters.runId) {
        queryBuilder = queryBuilder.andWhere(
          "document.metadata->>'runId' = :runId",
          { runId: filters.runId }
        );
      }

      if (filters.documentType) {
        queryBuilder = queryBuilder.andWhere(
          'document.type = :type',
          { type: filters.documentType }
        );
      }

      const results = await queryBuilder.getRawMany();

      // 加上 metadata 欄位到結果中
      return results.map(result => ({
        ...result,
        attackVector: result.document_metadata?.attackVector,
        runId: result.document_metadata?.runId,
        similarity: parseFloat(result.similarity)
      }));

    } catch (error) {
      this.logger.error(`向量檢索失敗: ${error.message}`);
      return [];
    }
  }

  async getEmbedding(text) {
    try {
      const pythonAiUrl = this.configService.get('PYTHON_AI_URL');
      const response = await axios.post(`${pythonAiUrl}/embed`, {
        text: text
      });

      return response.data.embedding;
    } catch (error) {
      this.logger.error(`生成向量失敗: ${error.message}`);
      throw error;
    }
  }

  buildRagPrompt(context, question) {
    return `你是「侵國侵城」eKYC 滲透測試系統的智慧助理，專門分析滲透測試報告並提供資安改善建議。

基於以下滲透測試文檔內容回答問題：

== 滲透測試報告內容 ==
${context}

== 用戶問題 ==
${question}

== 回答要求 ==
1. 只能基於提供的滲透測試報告內容回答
2. 必須在答案中標註引用的文檔ID和相似度分數
3. 針對 eKYC 系統的 AI 攻擊提供具體防護建議
4. 如果涉及 APCER、BPCER、ACER、ROC-AUC、EER 等指標，請詳細解釋
5. 提供可操作的改善措施，包含技術面和流程面
6. 如果文檔中沒有相關資訊，請明確說明並建議進一步的測試方向

請以專業的資安專家角度回答：`;
  }

  async logRagQuery(question, chunkIds, response) {
    const logData = {
      timestamp: new Date(),
      question: question,
      usedChunks: chunkIds,
      responseLength: response.length,
      systemVersion: '1.0.0'
    };

    this.logger.log(`RAG 查詢記錄: ${JSON.stringify(logData)}`);

    // 可選：寫入審計資料庫表
    // await this.auditRepo.save(logData);
  }

  // 批次更新文檔向量
  async updateDocumentEmbeddings(batchSize = 50) {
    const chunks = await this.chunkRepo.find({
      where: { embedding: null },
      take: batchSize
    });

    for (const chunk of chunks) {
      try {
        const embedding = await this.getEmbedding(chunk.text);
        chunk.embedding = `[${embedding.join(',')}]`;
        await this.chunkRepo.save(chunk);

        this.logger.log(`已更新 chunk ${chunk.id} 的向量`);
      } catch (error) {
        this.logger.error(`更新 chunk ${chunk.id} 向量失敗: ${error.message}`);
      }
    }

    return chunks.length;
  }
}

// 手動依賴注入裝飾器模擬
function createRagService(documentRepo, chunkRepo, configService) {
  return new RagService(documentRepo, chunkRepo, configService);
}

module.exports = { RagService, createRagService };
