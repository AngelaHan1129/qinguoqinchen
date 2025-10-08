import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VertexAI } from '@google-cloud/vertexai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v1 as aiplatform } from '@google-cloud/aiplatform';

@Injectable()
export class GoogleCloudService {
  constructor(configService) {
    this.configService = configService;
    this.projectId = configService.get('GOOGLE_CLOUD_PROJECT_ID');
    this.location = configService.get('GOOGLE_CLOUD_LOCATION');
    
    // 初始化 Vertex AI
    this.vertexAI = new VertexAI({
      project: this.projectId,
      location: this.location
    });

    // 初始化 Gemini AI
    this.genAI = new GoogleGenerativeAI(configService.get('GEMINI_API_KEY'));
    
    // 初始化 Vertex AI Search
    this.predictionClient = new aiplatform.PredictionServiceClient({
      apiEndpoint: configService.get('VERTEX_AI_ENDPOINT')
    });
  }

  // 獲取 Gemini Pro 模型
  getGeminiModel(modelName = 'gemini-1.5-pro') {
    return this.genAI.getGenerativeModel({ model: modelName });
  }

  // 獲取 Vertex AI 生成模型
  getVertexGenerativeModel(modelName = 'gemini-1.5-pro') {
    return this.vertexAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.1,
        topP: 0.8,
      },
    });
  }

  // 文本嵌入生成
  async generateEmbedding(text, modelName = 'text-embedding-004') {
    try {
      const model = this.vertexAI.getGenerativeModel({ model: modelName });
      const result = await model.embedContent({
        content: { role: 'user', parts: [{ text }] }
      });
      
      return result.response.embeddings?.[0]?.values || [];
    } catch (error) {
      console.error('嵌入生成失敗:', error);
      throw error;
    }
  }

  // Vertex AI Search 搜尋
  async searchVertexAI(query, datastoreId) {
    try {
      const request = {
        servingConfig: `projects/${this.projectId}/locations/${this.location}/collections/default_collection/dataStores/${datastoreId}/servingConfigs/default_serving_config`,
        query: {
          text: query,
        },
        pageSize: 10,
      };

      const [response] = await this.predictionClient.search(request);
      return response.results || [];
    } catch (error) {
      console.error('Vertex AI Search 失敗:', error);
      throw error;
    }
  }
}
