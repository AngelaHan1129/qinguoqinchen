-- init-legal-db.sql (修復版)
-- 侵國侵城法規向量資料庫初始化腳本

-- 設定編碼和客戶端
SET CLIENT_ENCODING TO 'UTF8';
SET standard_conforming_strings = on;

-- 建立必要擴展
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 使用 gen_random_uuid() 代替 uuid_generate_v4() (PostgreSQL 13+)
-- 或者使用 serial/bigserial

-- 法規文件表 (使用 serial 主鍵)
DROP TABLE IF EXISTS legal_chunks CASCADE;
DROP TABLE IF EXISTS legal_documents CASCADE;
DROP TABLE IF EXISTS legal_queries CASCADE;
DROP TABLE IF EXISTS system_stats CASCADE;

CREATE TABLE legal_documents (
    id SERIAL PRIMARY KEY,
    uuid_id TEXT DEFAULT gen_random_uuid()::TEXT,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    source VARCHAR(100) NOT NULL, -- MOJ, FSC, ISO, GDPR
    document_type VARCHAR(50) NOT NULL DEFAULT 'regulation',
    jurisdiction VARCHAR(100) NOT NULL DEFAULT 'Taiwan',
    language VARCHAR(10) NOT NULL DEFAULT 'zh-TW',
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    relevance_score DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 法規文件分塊表 (支援 1024 維向量搜尋)
CREATE TABLE legal_chunks (
    id SERIAL PRIMARY KEY,
    uuid_id TEXT DEFAULT gen_random_uuid()::TEXT,
    document_id INTEGER NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    text TEXT NOT NULL,
    embedding VECTOR(1024), -- 1024維向量
    chunk_type VARCHAR(50) DEFAULT 'article',
    article_number VARCHAR(20),
    metadata JSONB DEFAULT '{}',
    keyword_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    legal_concepts TEXT[] DEFAULT ARRAY[]::TEXT[],
    token_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立向量搜尋索引
CREATE INDEX legal_chunks_embedding_idx ON legal_chunks USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX legal_chunks_document_id_idx ON legal_chunks (document_id);
CREATE INDEX legal_chunks_chunk_index_idx ON legal_chunks (chunk_index);
CREATE INDEX legal_chunks_metadata_idx ON legal_chunks USING GIN (metadata);
CREATE INDEX legal_chunks_keyword_tags_idx ON legal_chunks USING GIN (keyword_tags);
CREATE INDEX legal_chunks_legal_concepts_idx ON legal_chunks USING GIN (legal_concepts);
CREATE INDEX legal_documents_source_idx ON legal_documents (source);
CREATE INDEX legal_documents_document_type_idx ON legal_documents (document_type);
CREATE INDEX legal_documents_jurisdiction_idx ON legal_documents (jurisdiction);
CREATE INDEX legal_documents_metadata_idx ON legal_documents USING GIN (metadata);

-- 法規查詢歷史表
CREATE TABLE legal_queries (
    id SERIAL PRIMARY KEY,
    uuid_id TEXT DEFAULT gen_random_uuid()::TEXT,
    user_question TEXT NOT NULL,
    question_embedding VECTOR(1024),
    context JSONB DEFAULT '{}',
    retrieved_chunks_ids INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    similarity_scores DECIMAL(5,4)[] DEFAULT ARRAY[]::DECIMAL(5,4)[],
    gemini_response TEXT,
    response_time_ms INTEGER DEFAULT 0,
    user_feedback INTEGER CHECK (user_feedback BETWEEN 1 AND 5),
    similarity_threshold DECIMAL(3,2) DEFAULT 0.70,
    chunks_retrieved INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 系統統計表
CREATE TABLE system_stats (
    id SERIAL PRIMARY KEY,
    uuid_id TEXT DEFAULT gen_random_uuid()::TEXT,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- count, duration, percentage
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入測試法規資料 (使用正確的繁體中文)
INSERT INTO legal_documents (title, content, source, document_type, jurisdiction, metadata) VALUES
('個人資料保護法', 
'第1條 為規範個人資料之蒐集、處理及利用，以避免人格權受侵害，並促進個人資料之合理利用，特制定本法。

第6條 有關醫療、基因、性生活、健康檢查及犯罪前科之個人資料，不得蒐集、處理或利用。但有下列情形之一者，不在此限：
六、經當事人書面同意。
七、與當事人有契約或類似契約之關係，且已採取適當之安全措施。

第47條 意圖營利，違反第六條第一項規定，足生損害於他人者，處五年以下有期徒刑，得併科新臺幣一百萬元以下罰金。', 
'MOJ', 'law', 'Taiwan', 
'{"lawType": "civil", "industryScope": ["all"], "complianceLevel": "mandatory", "tags": ["個資保護", "生物特徵", "eKYC"], "penalties": {"criminal": "5年以下有期徒刑", "fine": "100萬元以下罰金"}}'),

('資通安全管理法',
'第14條 關鍵基礎設施提供者發現資通安全事件時，應立即採取應變措施及調查鑑識，並於事件發現後七十二小時內通報主管機關。

第22條 違反第十四條第一項規定，未於規定時間內通報者，處新臺幣三十萬元以上一百五十萬元以下罰鍰。',
'MOJ', 'law', 'Taiwan',
'{"lawType": "administrative", "industryScope": ["critical-infrastructure"], "complianceLevel": "mandatory", "tags": ["資通安全", "事件通報"], "penalties": {"fine": "30-150萬元罰鍰"}}'),

('金融機構資訊安全管理辦法',
'第14條 金融機構發生資訊安全事件時，應立即查明及控制損害範圍，並於事件發生後二十四小時內，向主管機關申報。

第27條 違反第十四條規定者，處新臺幣二十萬元以上一百萬元以下罰鍰。',
'FSC', 'regulation', 'Taiwan',
'{"lawType": "administrative", "industryScope": ["finance"], "complianceLevel": "mandatory", "tags": ["金融資安", "事件通報"], "penalties": {"fine": "20-100萬元罰鍰"}}');

-- 建立向量搜尋函數 (使用 INTEGER 主鍵)
CREATE OR REPLACE FUNCTION search_legal_knowledge(
    query_embedding VECTOR(1024),
    similarity_threshold FLOAT DEFAULT 0.7,
    max_results INTEGER DEFAULT 10,
    filter_source VARCHAR DEFAULT NULL,
    filter_jurisdiction VARCHAR DEFAULT NULL
)
RETURNS TABLE(
    chunk_id INTEGER,
    document_id INTEGER,
    document_title VARCHAR,
    chunk_text TEXT,
    similarity FLOAT,
    metadata JSONB,
    source VARCHAR,
    document_type VARCHAR,
    chunk_index INTEGER,
    article_number VARCHAR,
    keyword_tags TEXT[],
    legal_concepts TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lc.id,
        lc.document_id,
        ld.title,
        lc.text,
        1 - (lc.embedding <=> query_embedding) as sim,
        lc.metadata,
        ld.source,
        ld.document_type,
        lc.chunk_index,
        lc.article_number,
        lc.keyword_tags,
        lc.legal_concepts
    FROM legal_chunks lc
    JOIN legal_documents ld ON lc.document_id = ld.id
    WHERE 1 - (lc.embedding <=> query_embedding) >= similarity_threshold
      AND ld.status = 'active'
      AND (filter_source IS NULL OR ld.source = filter_source)
      AND (filter_jurisdiction IS NULL OR ld.jurisdiction = filter_jurisdiction)
    ORDER BY lc.embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- 建立觸發器更新時間戳
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_legal_documents_updated_at
    BEFORE UPDATE ON legal_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 插入初始統計資料
INSERT INTO system_stats (metric_name, metric_value, metric_type, metadata) VALUES
('total_documents', 3, 'count', '{"description": "總法規文件數"}'),
('total_chunks', 0, 'count', '{"description": "總文件分塊數"}'),
('total_queries', 0, 'count', '{"description": "總查詢次數"}'),
('avg_response_time', 0, 'duration', '{"unit": "milliseconds", "description": "平均回應時間"}');

-- 顯示初始化結果
SELECT 
    '資料庫初始化成功!' as status,
    (SELECT count(*) FROM legal_documents) as total_documents,
    (SELECT count(*) FROM legal_chunks) as total_chunks,
    version() as pg_version,
    (SELECT extversion FROM pg_extension WHERE extname = 'vector') as vector_version;
