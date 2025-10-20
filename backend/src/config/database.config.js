// src/config/database.config.js
class DatabaseConfig {
    static getPostgreSQLConfig() {
        return {
            // 連線設定
            connection: {
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 5432,
                database: process.env.DB_NAME || 'qinguoqinchen_ai',
                user: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || '',
                ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
            },

            // 連線池設定
            pool: {
                min: parseInt(process.env.DB_POOL_MIN) || 2,
                max: parseInt(process.env.DB_POOL_MAX) || 10,
                acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 60000,
                idle: parseInt(process.env.DB_POOL_IDLE) || 10000
            },

            // pgvector 擴展設定
            extensions: {
                pgvector: {
                    enabled: true,
                    dimensions: 1024,
                    indexType: 'ivfflat',
                    indexOptions: {
                        lists: 100,
                        probes: 10
                    }
                },

                uuid: {
                    enabled: true,
                    extension: 'uuid-ossp'
                },

                fulltext: {
                    enabled: true,
                    language: 'chinese',
                    extension: 'pg_trgm'
                }
            },

            // 表格結構定義
            tables: {
                documents: {
                    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
                    title: 'VARCHAR(500)',
                    content: 'TEXT',
                    document_type: 'VARCHAR(100)',
                    source: 'VARCHAR(200)',
                    metadata: 'JSONB',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
                },

                chunks: {
                    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
                    document_id: 'UUID REFERENCES documents(id) ON DELETE CASCADE',
                    chunk_index: 'INTEGER',
                    content: 'TEXT',
                    embedding: 'vector(1024)',
                    metadata: 'JSONB',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
                },

                user_documents: {
                    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
                    user_id: 'VARCHAR(100)',
                    title: 'VARCHAR(500)',
                    content: 'TEXT',
                    category: 'VARCHAR(100)',
                    metadata: 'JSONB',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
                },

                user_chunks: {
                    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
                    user_document_id: 'UUID REFERENCES user_documents(id) ON DELETE CASCADE',
                    chunk_index: 'INTEGER',
                    content: 'TEXT',
                    embedding: 'vector(1024)',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
                },

                legal_documents: {
                    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
                    title: 'VARCHAR(500)',
                    content: 'TEXT',
                    document_type: 'VARCHAR(100)',
                    jurisdiction: 'VARCHAR(100)',
                    law_category: 'VARCHAR(100)',
                    article_number: 'VARCHAR(50)',
                    effective_date: 'DATE',
                    status: 'VARCHAR(20) DEFAULT \'active\'',
                    metadata: 'JSONB',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
                },

                legal_chunks: {
                    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
                    legal_document_id: 'UUID REFERENCES legal_documents(id) ON DELETE CASCADE',
                    chunk_index: 'INTEGER',
                    content: 'TEXT',
                    embedding: 'vector(1024)',
                    legal_concepts: 'TEXT[]',
                    keywords: 'TEXT[]',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
                },

                test_runs: {
                    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
                    test_id: 'VARCHAR(100) UNIQUE',
                    test_type: 'VARCHAR(50)',
                    attack_vectors: 'TEXT[]',
                    intensity: 'VARCHAR(20)',
                    results: 'JSONB',
                    status: 'VARCHAR(20)',
                    started_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                    completed_at: 'TIMESTAMP',
                    metadata: 'JSONB'
                },

                attack_logs: {
                    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
                    test_run_id: 'UUID REFERENCES test_runs(id)',
                    vector_id: 'VARCHAR(10)',
                    attack_type: 'VARCHAR(100)',
                    success: 'BOOLEAN',
                    confidence: 'DECIMAL(5,4)',
                    bypass_score: 'DECIMAL(5,4)',
                    processing_time: 'INTEGER',
                    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
                }
            },

            // 索引定義
            indexes: {
                chunks_embedding_idx: 'CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)',
                user_chunks_embedding_idx: 'CREATE INDEX IF NOT EXISTS user_chunks_embedding_idx ON user_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)',
                legal_chunks_embedding_idx: 'CREATE INDEX IF NOT EXISTS legal_chunks_embedding_idx ON legal_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)',
                documents_type_idx: 'CREATE INDEX IF NOT EXISTS documents_type_idx ON documents(document_type)',
                legal_documents_category_idx: 'CREATE INDEX IF NOT EXISTS legal_documents_category_idx ON legal_documents(law_category)',
                test_runs_type_idx: 'CREATE INDEX IF NOT EXISTS test_runs_type_idx ON test_runs(test_type)',
                attack_logs_vector_idx: 'CREATE INDEX IF NOT EXISTS attack_logs_vector_idx ON attack_logs(vector_id)',
                chunks_content_fulltext: 'CREATE INDEX IF NOT EXISTS chunks_content_fulltext ON chunks USING gin(to_tsvector(\'chinese\', content))'
            }
        };
    }

    static getNeo4jConfig() {
        return {
            connection: {
                uri: process.env.NEO4J_URI || 'neo4j://localhost:7687',
                user: process.env.NEO4J_USERNAME || 'neo4j',
                password: process.env.NEO4J_PASSWORD || '',
                database: process.env.NEO4J_DATABASE || 'neo4j'
            },

            pool: {
                maxConnectionLifetime: 60 * 60 * 1000, // 1 小時
                maxConnectionPoolSize: 50,
                connectionAcquisitionTimeout: 60000,
                connectionTimeout: 20000
            },

            // 節點和關係定義
            schema: {
                nodes: {
                    Document: ['id', 'title', 'type', 'source', 'createdAt'],
                    Chunk: ['id', 'index', 'content', 'createdAt'],
                    AttackVector: ['id', 'name', 'model', 'successRate'],
                    TestRun: ['id', 'testId', 'type', 'status', 'startedAt'],
                    User: ['id', 'userId', 'category'],
                    LegalDocument: ['id', 'title', 'category', 'jurisdiction'],
                    Concept: ['name', 'category', 'weight']
                },

                relationships: {
                    CONTAINS: 'Document -> Chunk',
                    USES: 'TestRun -> AttackVector',
                    BELONGS_TO: 'Chunk -> User',
                    RELATES_TO: 'Document -> Document',
                    MENTIONS: 'Chunk -> Concept',
                    SIMILAR_TO: 'Document -> Document',
                    REFERENCES: 'LegalDocument -> LegalDocument'
                }
            },

            // Cypher 查詢模板
            queries: {
                createDocument: `
          CREATE (d:Document {
            id: $id,
            title: $title,
            type: $type,
            source: $source,
            createdAt: datetime()
          })
          RETURN d
        `,

                createChunk: `
          MATCH (d:Document {id: $documentId})
          CREATE (c:Chunk {
            id: $id,
            index: $index,
            content: $content,
            createdAt: datetime()
          })
          CREATE (d)-[:CONTAINS]->(c)
          RETURN c
        `,

                findSimilarDocuments: `
          MATCH (d1:Document)-[:SIMILAR_TO]-(d2:Document)
          WHERE d1.id = $documentId
          RETURN d2, rand() as score
          ORDER BY score DESC
          LIMIT $limit
        `,

                createTestRun: `
          CREATE (t:TestRun {
            id: $id,
            testId: $testId,
            type: $type,
            status: $status,
            startedAt: datetime()
          })
          WITH t
          UNWIND $attackVectors as vectorId
          MATCH (a:AttackVector {id: vectorId})
          CREATE (t)-[:USES]->(a)
          RETURN t
        `,

                analyzeAttackPatterns: `
          MATCH (t:TestRun)-[:USES]->(a:AttackVector)
          WHERE t.status = 'completed'
          RETURN a.name as attack, 
                 count(t) as usage_count,
                 avg(t.success_rate) as avg_success_rate
          ORDER BY usage_count DESC
        `
            }
        };
    }

    static getRedisConfig() {
        return {
            connection: {
                url: process.env.REDIS_URL || 'redis://localhost:6379',
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379,
                password: process.env.REDIS_PASSWORD || '',
                db: process.env.REDIS_DB || 0
            },

            pool: {
                max: 20,
                min: 5,
                acquireTimeoutMillis: 60000,
                idleTimeoutMillis: 30000
            },

            // 快取策略設定
            cache: {
                defaultTTL: 3600, // 1 小時
                strategies: {
                    documents: { ttl: 1800, prefix: 'doc:' },
                    chunks: { ttl: 3600, prefix: 'chunk:' },
                    embeddings: { ttl: 7200, prefix: 'emb:' },
                    testResults: { ttl: 86400, prefix: 'test:' },
                    userSessions: { ttl: 1800, prefix: 'session:' },
                    rateLimit: { ttl: 900, prefix: 'rate:' }
                }
            },

            // 發布訂閱頻道
            pubsub: {
                channels: {
                    testStarted: 'test:started',
                    testCompleted: 'test:completed',
                    documentIngested: 'document:ingested',
                    systemAlert: 'system:alert',
                    performanceAlert: 'performance:alert'
                }
            },

            // 資料結構模板
            dataStructures: {
                sortedSets: {
                    leaderboard: 'leaderboard:attack_success',
                    performance: 'performance:response_times',
                    usage: 'usage:endpoints'
                },

                hashes: {
                    userStats: 'stats:user:',
                    systemMetrics: 'metrics:system',
                    configCache: 'config:cache'
                },

                lists: {
                    recentTests: 'recent:tests',
                    errorLog: 'errors:log',
                    auditTrail: 'audit:trail'
                }
            }
        };
    }

    static validateConfiguration() {
        const issues = [];

        // PostgreSQL 設定檢查
        if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
            issues.push({
                type: 'ERROR',
                component: 'PostgreSQL',
                message: '缺少資料庫連線設定 (DATABASE_URL 或 DB_HOST)'
            });
        }

        // Neo4j 設定檢查
        if (!process.env.NEO4J_URI || !process.env.NEO4J_USERNAME) {
            issues.push({
                type: 'WARNING',
                component: 'Neo4j',
                message: '圖形資料庫設定不完整，某些功能可能無法使用'
            });
        }

        // Redis 設定檢查
        if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
            issues.push({
                type: 'WARNING',
                component: 'Redis',
                message: '快取系統未設定，效能可能受影響'
            });
        }

        // 向量維度檢查
        const vectorDim = parseInt(process.env.VECTOR_DIMENSIONS) || 1024;
        if (vectorDim !== 1024 && vectorDim !== 1536 && vectorDim !== 3072) {
            issues.push({
                type: 'WARNING',
                component: 'Vector',
                message: '向量維度設定可能與 AI 模型不相容'
            });
        }

        return {
            valid: issues.filter(i => i.type === 'ERROR').length === 0,
            issues,
            summary: {
                errors: issues.filter(i => i.type === 'ERROR').length,
                warnings: issues.filter(i => i.type === 'WARNING').length,
                total: issues.length
            }
        };
    }

    static getConnectionStrings() {
        return {
            postgresql: process.env.DATABASE_URL ||
                `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'qinguoqinchen_ai'}`,

            neo4j: process.env.NEO4J_URI || 'neo4j://localhost:7687',

            redis: process.env.REDIS_URL ||
                `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}/${process.env.REDIS_DB || 0}`
        };
    }

    static getInitializationScripts() {
        return {
            postgresql: [
                'CREATE EXTENSION IF NOT EXISTS vector;',
                'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
                'CREATE EXTENSION IF NOT EXISTS pg_trgm;',
                'CREATE EXTENSION IF NOT EXISTS btree_gin;',
                ...Object.entries(this.getPostgreSQLConfig().tables).map(([tableName, columns]) => {
                    const columnDefs = Object.entries(columns).map(([col, def]) => `${col} ${def}`).join(', ');
                    return `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs});`;
                }),
                ...Object.values(this.getPostgreSQLConfig().indexes)
            ],

            neo4j: [
                'CREATE CONSTRAINT document_id IF NOT EXISTS FOR (d:Document) REQUIRE d.id IS UNIQUE;',
                'CREATE CONSTRAINT chunk_id IF NOT EXISTS FOR (c:Chunk) REQUIRE c.id IS UNIQUE;',
                'CREATE CONSTRAINT attack_vector_id IF NOT EXISTS FOR (a:AttackVector) REQUIRE a.id IS UNIQUE;',
                'CREATE CONSTRAINT test_run_id IF NOT EXISTS FOR (t:TestRun) REQUIRE t.id IS UNIQUE;',
                'CREATE INDEX document_type IF NOT EXISTS FOR (d:Document) ON (d.type);',
                'CREATE INDEX chunk_content IF NOT EXISTS FOR (c:Chunk) ON (c.content);'
            ]
        };
    }
}

module.exports = DatabaseConfig;
