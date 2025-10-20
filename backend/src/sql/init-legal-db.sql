-- init-legal-db.sql (最佳化版本)
-- 侵國侵城 AI 滲透測試系統 - 向量資料庫初始化腳本
-- 支援用戶向量化、法規遵循、RAG 檢索等完整功能
-- 版本: 2.0 (2025年最佳實踐)

-- 設定編碼和客戶端
SET CLIENT_ENCODING TO 'UTF8';
SET standard_conforming_strings = on;
SET timezone = 'Asia/Taipei';

-- 建立必要擴展
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- 嘗試建立 uuid-ossp，如果失敗則使用 gen_random_uuid
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    EXCEPTION WHEN OTHERS THEN
        -- 如果 uuid-ossp 不可用，我們會使用 gen_random_uuid()
        RAISE NOTICE 'uuid-ossp extension not available, using gen_random_uuid()';
END
$$;

-- ==========================================
-- 清理現有表格（如果需要重新初始化）
-- ==========================================
DROP TABLE IF EXISTS user_queries CASCADE;
DROP TABLE IF EXISTS legal_queries CASCADE;
DROP TABLE IF EXISTS system_stats CASCADE;
DROP TABLE IF EXISTS user_chunks CASCADE;
DROP TABLE IF EXISTS legal_chunks CASCADE;
DROP TABLE IF EXISTS user_documents CASCADE;
DROP TABLE IF EXISTS legal_documents CASCADE;
DROP TABLE IF EXISTS attack_vectors CASCADE;

-- ==========================================
-- 用戶向量文檔系統
-- ==========================================

-- 用戶文檔表（優化版）
CREATE TABLE user_documents (
    id SERIAL PRIMARY KEY,
    uuid_id UUID DEFAULT COALESCE(uuid_generate_v4(), gen_random_uuid()),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    user_id VARCHAR(100) DEFAULT 'anonymous',
    chunks_count INTEGER DEFAULT 0,
    has_vectors BOOLEAN DEFAULT false,
    content_hash VARCHAR(64), -- SHA256 雜湊，防重複
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 用戶文檔分塊表（1024 維向量，符合現代 AI 模型）
CREATE TABLE user_chunks (
    id SERIAL PRIMARY KEY,
    uuid_id UUID DEFAULT COALESCE(uuid_generate_v4(), gen_random_uuid()),
    document_id INTEGER NOT NULL REFERENCES user_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    text TEXT NOT NULL,
    embedding VECTOR(1024),
    chunk_size INTEGER,
    token_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 法規遵循系統
-- ==========================================

-- 法規文件表（加強版）
CREATE TABLE legal_documents (
    id SERIAL PRIMARY KEY,
    uuid_id UUID DEFAULT COALESCE(uuid_generate_v4(), gen_random_uuid()),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    source VARCHAR(100) NOT NULL, -- MOJ, FSC, ISO, GDPR, NIST
    document_type VARCHAR(50) NOT NULL DEFAULT 'regulation',
    jurisdiction VARCHAR(100) NOT NULL DEFAULT 'Taiwan',
    language VARCHAR(10) NOT NULL DEFAULT 'zh-TW',
    version VARCHAR(20) DEFAULT '1.0',
    effective_date DATE,
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
    relevance_score DECIMAL(3,2) DEFAULT 0.00,
    content_hash VARCHAR(64), -- 防重複
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 法規文件分塊表（優化版）
CREATE TABLE legal_chunks (
    id SERIAL PRIMARY KEY,
    uuid_id UUID DEFAULT COALESCE(uuid_generate_v4(), gen_random_uuid()),
    document_id INTEGER NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    text TEXT NOT NULL,
    embedding VECTOR(1024),
    chunk_type VARCHAR(50) DEFAULT 'article',
    article_number VARCHAR(20),
    section_title VARCHAR(200),
    metadata JSONB DEFAULT '{}',
    keyword_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    legal_concepts TEXT[] DEFAULT ARRAY[]::TEXT[],
    token_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 攻擊向量測試系統（新增）
-- ==========================================

-- 攻擊向量表
CREATE TABLE attack_vectors (
    id SERIAL PRIMARY KEY,
    uuid_id UUID DEFAULT COALESCE(uuid_generate_v4(), gen_random_uuid()),
    vector_code VARCHAR(10) NOT NULL UNIQUE, -- A1, A2, A3...
    vector_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    attack_type VARCHAR(50) NOT NULL, -- simswap, stylegan3, deepface
    target_system VARCHAR(100) DEFAULT 'eKYC',
    severity_level VARCHAR(20) DEFAULT 'HIGH' CHECK (severity_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    success_rate DECIMAL(5,2), -- 成功率百分比
    apcer DECIMAL(5,2), -- Attack Presentation Classification Error Rate
    bpcer DECIMAL(5,2), -- Bona Fide Presentation Classification Error Rate
    acer DECIMAL(5,2), -- Average Classification Error Rate
    countermeasures TEXT[],
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 查詢歷史與統計
-- ==========================================

-- 用戶查詢歷史表（優化版）
CREATE TABLE user_queries (
    id SERIAL PRIMARY KEY,
    uuid_id UUID DEFAULT COALESCE(uuid_generate_v4(), gen_random_uuid()),
    user_id VARCHAR(100),
    question TEXT NOT NULL,
    question_embedding VECTOR(1024),
    retrieved_chunks_ids INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    similarity_scores DECIMAL(5,4)[] DEFAULT ARRAY[]::DECIMAL(5,4)[],
    response TEXT,
    response_time_ms INTEGER DEFAULT 0,
    query_type VARCHAR(50) DEFAULT 'user_vector',
    session_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 法規查詢歷史表（優化版）
CREATE TABLE legal_queries (
    id SERIAL PRIMARY KEY,
    uuid_id UUID DEFAULT COALESCE(uuid_generate_v4(), gen_random_uuid()),
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
    session_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 系統統計表（加強版）
CREATE TABLE system_stats (
    id SERIAL PRIMARY KEY,
    uuid_id UUID DEFAULT COALESCE(uuid_generate_v4(), gen_random_uuid()),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    subcategory VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 高效能向量搜尋索引（HNSW 最佳實踐）
-- ==========================================

-- 用戶文檔向量索引（最佳化參數）
CREATE INDEX CONCURRENTLY user_chunks_embedding_hnsw_idx 
ON user_chunks USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- 法規文檔向量索引（最佳化參數）
CREATE INDEX CONCURRENTLY legal_chunks_embedding_hnsw_idx 
ON legal_chunks USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- 查詢向量索引
CREATE INDEX CONCURRENTLY user_queries_embedding_idx 
ON user_queries USING hnsw (question_embedding vector_cosine_ops) 
WITH (m = 8, ef_construction = 32);

CREATE INDEX CONCURRENTLY legal_queries_embedding_idx 
ON legal_queries USING hnsw (question_embedding vector_cosine_ops) 
WITH (m = 8, ef_construction = 32);

-- ==========================================
-- 其他性能優化索引
-- ==========================================

-- 用戶文檔索引
CREATE INDEX CONCURRENTLY user_documents_user_id_idx ON user_documents (user_id);
CREATE INDEX CONCURRENTLY user_documents_category_idx ON user_documents (category);
CREATE INDEX CONCURRENTLY user_documents_status_idx ON user_documents (status);
CREATE INDEX CONCURRENTLY user_documents_tags_gin_idx ON user_documents USING GIN (tags);
CREATE INDEX CONCURRENTLY user_documents_metadata_gin_idx ON user_documents USING GIN (metadata);
CREATE INDEX CONCURRENTLY user_documents_created_at_idx ON user_documents (created_at);
CREATE INDEX CONCURRENTLY user_documents_hash_idx ON user_documents (content_hash);

-- 用戶分塊索引
CREATE INDEX CONCURRENTLY user_chunks_document_id_idx ON user_chunks (document_id);
CREATE INDEX CONCURRENTLY user_chunks_doc_chunk_idx ON user_chunks (document_id, chunk_index);

-- 法規文檔索引
CREATE INDEX CONCURRENTLY legal_documents_source_idx ON legal_documents (source);
CREATE INDEX CONCURRENTLY legal_documents_type_idx ON legal_documents (document_type);
CREATE INDEX CONCURRENTLY legal_documents_jurisdiction_idx ON legal_documents (jurisdiction);
CREATE INDEX CONCURRENTLY legal_documents_status_idx ON legal_documents (status);
CREATE INDEX CONCURRENTLY legal_documents_metadata_gin_idx ON legal_documents USING GIN (metadata);
CREATE INDEX CONCURRENTLY legal_documents_effective_date_idx ON legal_documents (effective_date);
CREATE INDEX CONCURRENTLY legal_documents_hash_idx ON legal_documents (content_hash);

-- 法規分塊索引
CREATE INDEX CONCURRENTLY legal_chunks_document_id_idx ON legal_chunks (document_id);
CREATE INDEX CONCURRENTLY legal_chunks_doc_chunk_idx ON legal_chunks (document_id, chunk_index);
CREATE INDEX CONCURRENTLY legal_chunks_metadata_gin_idx ON legal_chunks USING GIN (metadata);
CREATE INDEX CONCURRENTLY legal_chunks_keywords_gin_idx ON legal_chunks USING GIN (keyword_tags);
CREATE INDEX CONCURRENTLY legal_chunks_concepts_gin_idx ON legal_chunks USING GIN (legal_concepts);

-- 攻擊向量索引
CREATE INDEX CONCURRENTLY attack_vectors_code_idx ON attack_vectors (vector_code);
CREATE INDEX CONCURRENTLY attack_vectors_type_idx ON attack_vectors (attack_type);
CREATE INDEX CONCURRENTLY attack_vectors_severity_idx ON attack_vectors (severity_level);

-- 查詢歷史索引
CREATE INDEX CONCURRENTLY user_queries_user_id_idx ON user_queries (user_id);
CREATE INDEX CONCURRENTLY user_queries_created_at_idx ON user_queries (created_at DESC);
CREATE INDEX CONCURRENTLY user_queries_type_idx ON user_queries (query_type);
CREATE INDEX CONCURRENTLY user_queries_session_idx ON user_queries (session_id);

CREATE INDEX CONCURRENTLY legal_queries_created_at_idx ON legal_queries (created_at DESC);
CREATE INDEX CONCURRENTLY legal_queries_session_idx ON legal_queries (session_id);

-- 系統統計索引
CREATE INDEX CONCURRENTLY system_stats_category_idx ON system_stats (category);
CREATE INDEX CONCURRENTLY system_stats_recorded_at_idx ON system_stats (recorded_at DESC);
CREATE INDEX CONCURRENTLY system_stats_name_idx ON system_stats (metric_name);

-- ==========================================
-- 高階向量搜尋函數（優化版）
-- ==========================================

-- 用戶向量搜尋函數
CREATE OR REPLACE FUNCTION search_user_vectors(
    query_embedding VECTOR(1024),
    similarity_threshold FLOAT DEFAULT 0.7,
    max_results INTEGER DEFAULT 10,
    filter_category VARCHAR DEFAULT NULL,
    filter_user_id VARCHAR DEFAULT NULL,
    filter_tags TEXT[] DEFAULT NULL
)
RETURNS TABLE(
    chunk_id INTEGER,
    document_id INTEGER,
    document_title VARCHAR,
    chunk_text TEXT,
    similarity FLOAT,
    category VARCHAR,
    tags TEXT[],
    user_id VARCHAR,
    chunk_index INTEGER,
    metadata JSONB,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    -- 設定 HNSW 搜尋參數
    PERFORM set_config('hnsw.ef_search', GREATEST(max_results * 2, 40)::text, true);
    
    RETURN QUERY
    SELECT 
        uc.id,
        uc.document_id,
        ud.title,
        uc.text,
        1 - (uc.embedding <=> query_embedding) as sim,
        ud.category,
        ud.tags,
        ud.user_id,
        uc.chunk_index,
        uc.metadata,
        uc.created_at
    FROM user_chunks uc
    JOIN user_documents ud ON uc.document_id = ud.id
    WHERE 1 - (uc.embedding <=> query_embedding) >= similarity_threshold
      AND ud.status = 'active'
      AND ud.has_vectors = true
      AND uc.embedding IS NOT NULL
      AND (filter_category IS NULL OR ud.category = filter_category)
      AND (filter_user_id IS NULL OR ud.user_id = filter_user_id)
      AND (filter_tags IS NULL OR ud.tags && filter_tags)
    ORDER BY uc.embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- 法規向量搜尋函數（優化版）
CREATE OR REPLACE FUNCTION search_legal_knowledge(
    query_embedding VECTOR(1024),
    similarity_threshold FLOAT DEFAULT 0.7,
    max_results INTEGER DEFAULT 10,
    filter_source VARCHAR DEFAULT NULL,
    filter_jurisdiction VARCHAR DEFAULT NULL,
    filter_document_type VARCHAR DEFAULT NULL
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
    legal_concepts TEXT[],
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    -- 設定 HNSW 搜尋參數
    PERFORM set_config('hnsw.ef_search', GREATEST(max_results * 2, 40)::text, true);
    
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
        lc.legal_concepts,
        lc.created_at
    FROM legal_chunks lc
    JOIN legal_documents ld ON lc.document_id = ld.id
    WHERE 1 - (lc.embedding <=> query_embedding) >= similarity_threshold
      AND ld.status = 'active'
      AND lc.embedding IS NOT NULL
      AND (filter_source IS NULL OR ld.source = filter_source)
      AND (filter_jurisdiction IS NULL OR ld.jurisdiction = filter_jurisdiction)
      AND (filter_document_type IS NULL OR ld.document_type = filter_document_type)
    ORDER BY lc.embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- 攻擊向量搜尋函數
CREATE OR REPLACE FUNCTION search_attack_vectors(
    attack_type_filter VARCHAR DEFAULT NULL,
    severity_filter VARCHAR DEFAULT NULL,
    min_success_rate DECIMAL DEFAULT 0.0
)
RETURNS TABLE(
    vector_id INTEGER,
    vector_code VARCHAR,
    vector_name VARCHAR,
    description TEXT,
    attack_type VARCHAR,
    severity_level VARCHAR,
    success_rate DECIMAL,
    apcer DECIMAL,
    bpcer DECIMAL,
    acer DECIMAL,
    countermeasures TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        av.id,
        av.vector_code,
        av.vector_name,
        av.description,
        av.attack_type,
        av.severity_level,
        av.success_rate,
        av.apcer,
        av.bpcer,
        av.acer,
        av.countermeasures
    FROM attack_vectors av
    WHERE av.status = 'active'
      AND (attack_type_filter IS NULL OR av.attack_type = attack_type_filter)
      AND (severity_filter IS NULL OR av.severity_level = severity_filter)
      AND (av.success_rate IS NULL OR av.success_rate >= min_success_rate)
    ORDER BY av.severity_level DESC, av.success_rate DESC;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 自動更新觸發器
-- ==========================================

-- 更新時間戳觸發器函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 建立所有更新觸發器
CREATE TRIGGER update_user_documents_updated_at
    BEFORE UPDATE ON user_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_documents_updated_at
    BEFORE UPDATE ON legal_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attack_vectors_updated_at
    BEFORE UPDATE ON attack_vectors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 插入範例資料
-- ==========================================

-- 攻擊向量範例資料
INSERT INTO attack_vectors (vector_code, vector_name, description, attack_type, severity_level, success_rate, apcer, bpcer, acer, countermeasures, metadata) VALUES
('A1', 'StyleGAN3 人臉生成攻擊', '使用 StyleGAN3 生成高品質人臉圖像，繞過 eKYC 系統的人臉識別機制', 'stylegan3', 'CRITICAL', 87.50, 25.30, 12.10, 18.70, ARRAY['3D活體檢測', '多重生物特徵驗證', '行為分析'], '{"model": "StyleGAN3", "dataset": "FFHQ", "resolution": "1024x1024"}'),

('A2', 'SimSwap 即時換臉攻擊', '利用 SimSwap 技術進行即時人臉替換，攻擊即時視訊驗證', 'simswap', 'CRITICAL', 89.20, 31.50, 15.20, 23.35, ARRAY['深度檢測算法', '時序一致性驗證', '多角度驗證'], '{"model": "SimSwap", "latency": "real-time", "gpu_required": true}'),

('A3', 'DeepFace 身份欺騙', '使用 DeepFace 模型進行身份特徵提取和偽造', 'deepface', 'HIGH', 76.30, 18.90, 22.10, 20.50, ARRAY['反欺騙模型', '特徵多樣性檢測'], '{"framework": "DeepFace", "backend": "VGG-Face"}'),

('A4', 'DALL-E 文件偽造', '使用 DALL-E 生成偽造的身份證件和官方文件', 'dalle', 'HIGH', 72.80, 28.40, 19.60, 24.00, ARRAY['OCR驗證', '數位浮水印檢測', '政府資料庫比對'], '{"model": "DALL-E-3", "document_types": ["ID", "passport", "license"]}')
ON CONFLICT (vector_code) DO NOTHING;

-- 用戶文檔範例資料
INSERT INTO user_documents (title, content, category, tags, metadata, user_id, content_hash) VALUES
('eKYC 系統安全威脅分析', 
 'eKYC（電子化了解你的客戶）系統面臨的主要安全威脅包括：1. Deepfake 攻擊 - 使用 StyleGAN3、SimSwap 等技術生成假的身份驗證影像；2. 文件偽造 - 利用 AI 技術如 DALL-E 偽造身份證件；3. 生物特徵欺騙 - 使用高品質面具或 3D 列印模型；4. 系統漏洞利用 - 針對 API 和資料庫的攻擊。防護措施必須包括多重驗證、活體檢測、行為分析和定期安全評估。', 
 'security-analysis', 
 ARRAY['eKYC', '安全威脅', 'Deepfake', 'StyleGAN3', 'SimSwap'], 
 '{"type": "threat-analysis", "level": "critical", "version": "2.0", "author": "security-team"}',
 'system',
 encode(sha256('eKYC 系統安全威脅分析內容'), 'hex')),

('侵國侵城滲透測試方法論', 
 '侵國侵城滲透測試採用系統化方法評估 eKYC 系統安全性。測試階段包括：1. 偵察階段 - 收集目標系統資訊；2. 威脅建模 - 識別攻擊向量；3. 漏洞掃描 - 自動化工具掃描；4. 手動測試 - 專家手動驗證；5. 攻擊模擬 - 實際攻擊場景模擬；6. 報告生成 - 詳細安全評估報告。每個階段都有明確的成功標準和風險評級。', 
 'penetration-testing', 
 ARRAY['滲透測試', '方法論', '安全評估', '風險分析'], 
 '{"type": "methodology", "version": "3.1", "compliance": ["ISO27001", "NIST"]}',
 'system',
 encode(sha256('侵國侵城滲透測試方法論內容'), 'hex')),

('AI 反檢測技術實作指南', 
 'AI 反檢測技術是對抗 Deepfake 攻擊的關鍵防線。主要技術包括：1. 時序不一致檢測 - 分析視訊幀間的不一致性；2. 頻域分析 - 檢測 AI 生成內容的頻譜特徵；3. 生物特徵活性檢測 - 驗證真實的生理反應；4. 神經網路檢測器 - 使用對抗網路識別假內容。實作時需要考慮計算效能、準確率和誤報率的平衡。', 
 'ai-defense', 
 ARRAY['AI防護', '反檢測', '對抗網路', '活體檢測'], 
 '{"type": "implementation-guide", "tech_stack": ["TensorFlow", "OpenCV", "PyTorch"]}',
 'system',
 encode(sha256('AI 反檢測技術實作指南內容'), 'hex'))
ON CONFLICT (content_hash) DO NOTHING;

-- 法規文檔範例資料
INSERT INTO legal_documents (title, content, source, document_type, jurisdiction, metadata, content_hash) VALUES
('個人資料保護法（完整版）', 
 '第1條（立法目的）為規範個人資料之蒐集、處理及利用，以避免人格權受侵害，並促進個人資料之合理利用，特制定本法。第6條（特種個人資料）有關醫療、基因、性生活、健康檢查及犯罪前科之個人資料，不得蒐集、處理或利用。但有下列情形之一者，不在此限：一、法律明文規定。二、公務機關執行法定職務或非公務機關履行法定義務必要範圍內，且已採取適當安全措施。三、當事人自行公開或其他已合法公開之個人資料。四、公務機關或學術研究機構基於公共利益為統計或學術研究而有必要，且已採取適當安全措施。五、經當事人書面同意。六、與當事人有契約或類似契約之關係，且已採取適當之安全措施。第47條（刑事責任）意圖營利，違反第六條第一項規定，足生損害於他人者，處五年以下有期徒刑，得併科新臺幣一百萬元以下罰金。', 
 'MOJ', 'law', 'Taiwan', 
 '{"lawType": "personal-data-protection", "articles": ["第1條", "第6條", "第47條"], "penalties": {"criminal": "5年以下有期徒刑", "fine": "100萬元以下罰金"}, "effectiveDate": "2012-10-01", "amendmentDate": "2015-12-30"}',
 encode(sha256('個人資料保護法完整版內容'), 'hex')),

('金融機構辦理電子化客戶身分確認作業及建立客戶檔案管理辦法', 
 '第1條 本辦法依銀行法第四十五條之一、保險法第一百四十八條之二及證券交易法第十八條之一規定訂定之。第7條 金融機構辦理電子化客戶身分確認，應確認客戶身分之真實性，並留存確認過程之相關紀錄。第8條 金融機構應建立電子化客戶身分確認之內部控制制度，並定期檢討修正。第15條 違反本辦法規定者，依各該業法規定處罰。', 
 'FSC', 'regulation', 'Taiwan',
 '{"lawType": "financial-regulation", "scope": "eKYC", "industryScope": ["banking", "insurance", "securities"], "complianceLevel": "mandatory", "internalControls": true}',
 encode(sha256('金融機構eKYC管理辦法內容'), 'hex')),

('資通安全管理法', 
 '第1條 為維護國家資通安全，確保國家安全及社會穩定，特制定本法。第14條 關鍵基礎設施提供者發現資通安全事件時，應立即採取應變措施及調查鑑識，並於事件發現後七十二小時內通報主管機關；必要時，主管機關得要求關鍵基礎設施提供者提出改善計畫。第22條 違反第十四條第一項規定，未於規定時間內通報者，處新臺幣三十萬元以上一百五十萬元以下罰鍰。', 
 'MOJ', 'law', 'Taiwan',
 '{"lawType": "cybersecurity", "industryScope": ["critical-infrastructure"], "complianceLevel": "mandatory", "timeRequirements": {"通報時限": "72小時"}, "penalties": {"fine": "30-150萬元罰鍰"}}',
 encode(sha256('資通安全管理法內容'), 'hex'))
ON CONFLICT (content_hash) DO NOTHING;

-- 插入初始統計資料
INSERT INTO system_stats (metric_name, metric_value, metric_type, category, subcategory, metadata) VALUES
('total_user_documents', 3, 'count', 'user_vector', 'documents', '{"description": "總用戶文件數"}'),
('total_legal_documents', 3, 'count', 'legal_compliance', 'documents', '{"description": "總法規文件數"}'),
('total_attack_vectors', 4, 'count', 'penetration_test', 'vectors', '{"description": "總攻擊向量數"}'),
('total_user_chunks', 0, 'count', 'user_vector', 'chunks', '{"description": "總用戶文件分塊數"}'),
('total_legal_chunks', 0, 'count', 'legal_compliance', 'chunks', '{"description": "總法規文件分塊數"}'),
('avg_response_time', 0, 'duration', 'system', 'performance', '{"unit": "milliseconds", "description": "平均回應時間"}'),
('system_uptime', 0, 'duration', 'system', 'availability', '{"unit": "seconds", "description": "系統運行時間"}'),
('vector_index_size', 0, 'size', 'system', 'storage', '{"unit": "MB", "description": "向量索引大小"}')
ON CONFLICT DO NOTHING;

-- ==========================================
-- 設定 pgvector 最佳化參數
-- ==========================================

-- 設定全域 HNSW 參數
ALTER SYSTEM SET shared_preload_libraries = 'vector';
SELECT pg_reload_conf();

-- 設定向量操作的工作記憶體
SET work_mem = '256MB';
SET maintenance_work_mem = '2GB';

-- ==========================================
-- 最終驗證與顯示
-- ==========================================

-- 顯示初始化結果
SELECT 
    '🎉 侵國侵城向量資料庫初始化完成 (v2.0)!' as status,
    (SELECT count(*) FROM user_documents) as user_documents,
    (SELECT count(*) FROM legal_documents) as legal_documents,
    (SELECT count(*) FROM attack_vectors) as attack_vectors,
    (SELECT count(*) FROM user_chunks) as user_chunks,
    (SELECT count(*) FROM legal_chunks) as legal_chunks,
    version() as pg_version,
    (SELECT extversion FROM pg_extension WHERE extname = 'vector') as vector_version;

-- 顯示資料表統計
SELECT 
    '📊 資料表統計' as info,
    schemaname,
    tablename,
    n_tup_ins as inserted_rows,
    n_tup_upd as updated_rows,
    n_tup_del as deleted_rows
FROM pg_stat_user_tables 
WHERE tablename IN ('user_documents', 'legal_documents', 'user_chunks', 'legal_chunks', 'attack_vectors')
ORDER BY tablename;

-- 顯示向量索引狀態
SELECT 
    '📈 向量索引狀態' as info,
    schemaname,
    tablename,
    indexname,
    idx_tup_read as index_reads,
    idx_tup_fetch as index_fetches
FROM pg_stat_user_indexes 
WHERE indexname LIKE '%embedding%'
ORDER BY tablename;

-- 顯示系統配置
SELECT 
    '⚙️ 系統配置' as info,
    name,
    setting,
    unit,
    short_desc
FROM pg_settings 
WHERE name IN ('work_mem', 'maintenance_work_mem', 'shared_preload_libraries')
ORDER BY name;

-- 完成通知
SELECT '✅ 系統準備就緒 - 支援用戶向量、法規遵循、攻擊向量測試功能!' as final_status;

-- 安全提醒
SELECT '🔒 安全提醒：請確保資料庫連線使用 SSL，並定期備份重要資料' as security_reminder;
