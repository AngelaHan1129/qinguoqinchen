-- 建立法律文件表
CREATE TABLE IF NOT EXISTS legal_documents (
    id VARCHAR(255) PRIMARY KEY,
    document_id VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1024),
    
    -- 法律文件專用欄位
    document_type VARCHAR(100), -- 'law', 'regulation', 'interpretation', 'case'
    jurisdiction VARCHAR(50),   -- 'TW', 'US', 'EU' 等
    law_category VARCHAR(100),  -- '個資法', '銀行法', '資安法' 等
    article_number VARCHAR(50), -- 條文編號
    effective_date DATE,        -- 生效日期
    
    -- 分塊資訊
    chunk_index INTEGER DEFAULT 0,
    chunk_type VARCHAR(50),     -- 'article', 'paragraph', 'section'
    
    -- 元數據
    metadata JSONB,
    source VARCHAR(255),        -- 資料來源
    language VARCHAR(10) DEFAULT 'zh-TW',
    
    -- 時間戳記
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 建立用戶查詢歷史表
CREATE TABLE IF NOT EXISTS user_queries (
    id SERIAL PRIMARY KEY,
    query_text TEXT NOT NULL,
    query_embedding vector(1024),
    response_text TEXT,
    retrieved_documents TEXT[], -- 檢索到的文件ID陣列
    confidence_score DECIMAL(3,2),
    processing_time INTEGER,    -- 處理時間（毫秒）
    created_at TIMESTAMP DEFAULT NOW()
);
