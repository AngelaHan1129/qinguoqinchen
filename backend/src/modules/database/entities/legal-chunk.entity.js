// backend/src/modules/database/entities/legal-chunk.entity.js
const { EntitySchema } = require('typeorm');

const LegalChunk = new EntitySchema({
    name: 'LegalChunk',
    tableName: 'legal_chunks',
    columns: {
        id: {
            type: 'uuid',
            primary: true,
            generated: 'uuid'
        },
        text: {
            type: 'text',
            nullable: false
        },
        chunkIndex: {
            type: 'int',
            nullable: false
        },
        embedding: {
            type: 'vector',
            nullable: true,
            comment: 'pgvector format'
        },
        metadata: {
            type: 'json',
            nullable: true
        },
        documentId: {
            type: 'uuid',
            nullable: false
        },
        createdAt: {
            type: 'timestamp',
            createDate: true
        }
    },
    relations: {
        document: {
            type: 'many-to-one',
            target: 'LegalDocument',
            joinColumn: { name: 'documentId' }
        }
    }
});

module.exports = { LegalChunk };
