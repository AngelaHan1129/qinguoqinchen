-- 建立向量索引
CREATE INDEX IF NOT EXISTS idx_legal_documents_embedding ON legal_documents USING hnsw (embedding vector_cosine_ops);

-- 建立一般索引
CREATE INDEX IF NOT EXISTS idx_legal_documents_document_id ON legal_documents (document_id);

CREATE INDEX IF NOT EXISTS idx_legal_documents_document_type ON legal_documents (document_type);

CREATE INDEX IF NOT EXISTS idx_legal_documents_jurisdiction ON legal_documents (jurisdiction);

CREATE INDEX IF NOT EXISTS idx_legal_documents_law_category ON legal_documents (law_category);

CREATE INDEX IF NOT EXISTS idx_legal_documents_article ON legal_documents (article_number);

CREATE INDEX IF NOT EXISTS idx_legal_documents_created_at ON legal_documents (created_at);

-- 用戶查詢索引
CREATE INDEX IF NOT EXISTS idx_user_queries_embedding ON user_queries USING hnsw (query_embedding vector_cosine_ops);