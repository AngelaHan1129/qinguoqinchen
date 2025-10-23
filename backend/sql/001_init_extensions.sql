-- 安裝 pgvector 擴展
CREATE EXTENSION IF NOT EXISTS vector;

-- 安裝其他可能需要的擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS "pgcrypto";