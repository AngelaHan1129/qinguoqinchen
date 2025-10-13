const { Module } = require('@nestjs/common');
const { TypeOrmModule } = require('@nestjs/typeorm');
const { RagService, createRagService } = require('./rag.service');
const { RagController, createRagController } = require('./rag.controller');
const { Document } = require('../database/entities/document.entity');
const { Chunk } = require('../database/entities/chunk.entity');

@Module({
    imports: [TypeOrmModule.forFeature([Document, Chunk])],
    providers: [
        {
            provide: RagService,
            useFactory: createRagService,
            inject: ['DocumentRepository', 'ChunkRepository', 'ConfigService']
        }
    ],
    controllers: [
        {
            provide: RagController,
            useFactory: createRagController,
            inject: [RagService]
        }
    ],
    exports: [RagService],
})
class RagModule { }

module.exports = { RagModule };
