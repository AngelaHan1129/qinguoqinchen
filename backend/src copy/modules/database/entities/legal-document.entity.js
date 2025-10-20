// backend/src/modules/database/entities/legal-document.entity.js
const { EntitySchema } = require('typeorm');

const LegalDocument = new EntitySchema({
    name: 'LegalDocument',
    tableName: 'legal_documents',
    columns: {
        id: {
            type: 'uuid',
            primary: true,
            generated: 'uuid'
        },
        title: {
            type: 'varchar',
            nullable: false
        },
        content: {
            type: 'text',
            nullable: false
        },
        source: {
            type: 'varchar',
            nullable: false,
            comment: 'ISO27001, OWASP, GDPR, Taiwan_PDPA, FSC'
        },
        documentType: {
            type: 'varchar',
            nullable: false,
            default: 'regulation',
            comment: 'regulation, standard, guideline, case_law'
        },
        jurisdiction: {
            type: 'varchar',
            nullable: false,
            default: 'Taiwan',
            comment: 'Taiwan, EU, International'
        },
        language: {
            type: 'varchar',
            nullable: false,
            default: 'zh-TW'
        },
        metadata: {
            type: 'json',
            nullable: true
        },
        status: {
            type: 'varchar',
            nullable: false,
            default: 'active'
        },
        relevanceScore: {
            type: 'decimal',
            precision: 3,
            scale: 2,
            nullable: true
        },
        createdAt: {
            type: 'timestamp',
            createDate: true
        },
        updatedAt: {
            type: 'timestamp',
            updateDate: true
        }
    },
    relations: {
        chunks: {
            type: 'one-to-many',
            target: 'LegalChunk',
            inverseSide: 'document'
        }
    }
});

module.exports = { LegalDocument };
