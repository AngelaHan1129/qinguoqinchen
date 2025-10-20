-- init-user-vector-db.sql
-- 用戶向量資料庫初始化

-- 啟用必要擴展
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 用戶文檔表
CREATE TABLE IF NOT EXISTS user_documents (
    id SERIAL PRIMARY KEY,
    uuid_id UUID DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active',
    user_id VARCHAR(100) DEFAULT 'anonymous',
    chunks_count INTEGER DEFAULT 0,
    has_vectors BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用戶文檔分塊表
CREATE TABLE IF NOT EXISTS user_chunks (
    id SERIAL PRIMARY KEY,
    uuid_id UUID DEFAULT uuid_generate_v4(),
    document_id INTEGER NOT NULL REFERENCES user_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    text TEXT NOT NULL,
    embedding VECTOR(1024),
    chunk_size INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立向量搜尋索引
CREATE INDEX IF NOT EXISTS user_chunks_embedding_idx 
ON user_chunks USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- 建立其他索引
CREATE INDEX IF NOT EXISTS user_documents_user_id_idx ON user_documents (user_id);
CREATE INDEX IF NOT EXISTS user_documents_category_idx ON user_documents (category);
CREATE INDEX IF NOT EXISTS user_documents_tags_idx ON user_documents USING GIN (tags);
CREATE INDEX IF NOT EXISTS user_chunks_document_id_idx ON user_chunks (document_id);

-- 查詢統計表
CREATE TABLE IF NOT EXISTS user_queries (
    id SERIAL PRIMARY KEY,
    uuid_id UUID DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100),
    question TEXT NOT NULL,
    question_embedding VECTOR(1024),
    retrieved_chunks_ids INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    similarity_scores DECIMAL(5,4)[] DEFAULT ARRAY[]::DECIMAL(5,4)[],
    response TEXT,
    response_time_ms INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入範例資料
INSERT INTO user_documents (title, content, category, tags, metadata) VALUES
('範例：eKYC 安全指南', 
 'eKYC（電子化了解你的客戶）系統是現代銀行業的重要組成部分。為了確保系統安全，需要實施以下措施：1. 多重身份驗證 2. 生物特徵識別 3. 活體檢測技術 4. 文件真偽驗證。同時，還需要防範 Deepfake 攻擊，包括使用 StyleGAN3、SimSwap 等技術的威脅。建議採用 AI 反檢測技術和多維度驗證機制。', 
 'security', 
 ARRAY['eKYC', '安全', '銀行', 'Deepfake'], 
 '{"type": "guide", "level": "advanced"}'),

('範例：AI 攻擊與防護', 
 '人工智慧攻擊正在成為網路安全的重大威脅。常見的 AI 攻擊包括：對抗性樣本攻擊、數據中毒攻擊、模型反向工程、深度造假技術等。防護措施包括：對抗性訓練、輸入驗證、模型加密、異常檢測系統。特別是在金融領域，需要格外注意 AI 生成的假身份證件和偽造的生物特徵數據。', 
 'ai-security', 
 ARRAY['AI', '攻擊', '防護', '對抗性樣本'], 
 '{"type": "analysis", "industry": "finance"}')
ON CONFLICT DO NOTHING;

-- 顯示初始化結果
SELECT 
    '用戶向量資料庫初始化完成!' as status,
    (SELECT count(*) FROM user_documents) as sample_documents,
    version() as pg_version,
    (SELECT extversion FROM pg_extension WHERE extname = 'vector') as vector_version;
