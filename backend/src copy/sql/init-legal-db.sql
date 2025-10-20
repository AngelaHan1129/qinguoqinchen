-- 啟用 pgvector 擴展
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 法律文件主表
CREATE TABLE IF NOT EXISTS legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source VARCHAR(200),  -- 例如：全國法規資料庫、司法院
    document_type VARCHAR(100),  -- 例如：法律、行政命令、司法解釋
    jurisdiction VARCHAR(100),  -- 例如：中華民國、地方法規
    law_category VARCHAR(100),  -- 例如：民法、刑法、行政法、勞動法
    article_number VARCHAR(50),  -- 條文號碼
    effective_date DATE,  -- 生效日期
    last_modified DATE,  -- 最後修改日期
    status VARCHAR(20) DEFAULT 'active',  -- active, archived, repealed
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 法律文件塊表（用於向量檢索）
CREATE TABLE IF NOT EXISTS legal_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES legal_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1024),  -- 1024維向量
    article_reference VARCHAR(100),  -- 條文引用，如：第12條第1項
    legal_concepts TEXT[],  -- 法律概念標籤
    keywords TEXT[],  -- 關鍵詞
    chunk_type VARCHAR(50),  -- 例如：條文、說明、案例
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 創建索引以提高查詢效能
CREATE INDEX IF NOT EXISTS idx_legal_docs_category ON legal_documents(law_category);
CREATE INDEX IF NOT EXISTS idx_legal_docs_source ON legal_documents(source);
CREATE INDEX IF NOT EXISTS idx_legal_docs_type ON legal_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_legal_docs_status ON legal_documents(status);
CREATE INDEX IF NOT EXISTS idx_legal_chunks_doc_id ON legal_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_legal_chunks_embedding ON legal_chunks USING hnsw (embedding vector_cosine_ops);

-- 法律查詢記錄表
CREATE TABLE IF NOT EXISTS legal_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100),
    query TEXT NOT NULL,
    response TEXT,
    used_chunks JSONB,
    legal_categories TEXT[],
    confidence_score NUMERIC(3,2),
    response_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入一些示例法律資料
INSERT INTO legal_documents (title, content, source, document_type, jurisdiction, law_category, article_number, status) VALUES
('個人資料保護法', '第1條 為規範個人資料之蒐集、處理及利用，以避免人格權受侵害，並促進個人資料之合理利用，特制定本法。', '全國法規資料庫', '法律', '中華民國', '行政法', '第1條', 'active'),
('個人資料保護法', '第6條 有關醫療、基因、性生活、健康檢查及犯罪前科之個人資料，不得蒐集、處理或利用。但有下列情形之一者，不在此限...', '全國法規資料庫', '法律', '中華民國', '行政法', '第6條', 'active'),
('電子簽章法', '第2條 本法用詞，定義如下：一、電子文件：指文字、聲音、圖片、影像、符號或其他資料，以電子或其他以人之知覺無法直接認識之方式製作...', '全國法規資料庫', '法律', '中華民國', '商事法', '第2條', 'active');
