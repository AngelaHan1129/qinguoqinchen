const { Controller, Post, Get, Body, Query, HttpException, HttpStatus } = require('@nestjs/common');
const { RagService } = require('./rag.service');

@Controller('rag')
class RagController {
    constructor(ragService) {
        this.ragService = ragService;
    }

    @Post('ask')
    async askQuestion(@Body() body) {
        const { question, filters = {} } = body;

        if (!question || question.trim().length === 0) {
            throw new HttpException('問題不能為空', HttpStatus.BAD_REQUEST);
        }

        try {
            const result = await this.ragService.askQuestion(question, filters);
            return {
                success: true,
                data: result
            };
        } catch (error) {
            throw new HttpException(
                `RAG 查詢失敗: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('health')
    async healthCheck() {
        return {
            status: 'ok',
            service: 'RAG',
            timestamp: new Date()
        };
    }

    @Post('update-embeddings')
    async updateEmbeddings(@Query('batchSize') batchSize = 50) {
        try {
            const updatedCount = await this.ragService.updateDocumentEmbeddings(
                parseInt(batchSize)
            );

            return {
                success: true,
                message: `已更新 ${updatedCount} 個文檔的向量`
            };
        } catch (error) {
            throw new HttpException(
                `更新向量失敗: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

function createRagController(ragService) {
    return new RagController(ragService);
}

module.exports = { RagController, createRagController };
