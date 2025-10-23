基於你提供的 README 文檔，我會為你的「侵國侵城 AI 滲透測試系統」進行專業的修改和完善。以下是針對你專案的優化版本：


# 🛡️ 侵國侵城 AI 滲透測試系統

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/AngelaHan1129/qinguoqinchen)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/python-%3E%3D3.11-blue.svg)](https://python.org/)
[![Vue.js](https://img.shields.io/badge/vue.js-3.4.0-green.svg)](https://vuejs.org/)
[![NestJS](https://img.shields.io/badge/nestjs-11.0.1-red.svg)](https://nestjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-teal.svg)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://docker.com/)
[![RAG](https://img.shields.io/badge/RAG-enabled-orange.svg)](#)

**🎯 專為 eKYC (電子身份驗證) 安全測試設計的企業級 AI 紅隊滲透測試系統**  
> **整合 RAG 檢索增強生成技術 + 多模態 AI 攻擊引擎 + 實時威脅分析**

## 📋 目錄

- [🎯 系統概述](#-系統概述)
- [🏗️ 架構設計](#️-架構設計)
- [🚀 核心功能](#-核心功能)
- [⚔️ 攻擊向量](#️-攻擊向量)
- [🛠️ 技術棧](#️-技術棧)
- [⚡ 快速開始](#-快速開始)
- [📁 專案結構](#-專案結構)
- [🔧 開發指南](#-開發指南)
- [📚 API 文檔](#-api-文檔)
- [🐳 部署指南](#-部署指南)
- [🧪 測試指南](#-測試指南)
- [🔧 故障排除](#-故障排除)
- [🤝 貢獻指南](#-貢獻指南)

## 🎯 系統概述

**侵國侵城 AI 滲透測試系統**是一個創新的企業級 AI 紅隊工具，專為 **2025 InnoServe 創新伺服器大賽**設計。系統整合了最新的生成式 AI 技術、RAG 檢索增強生成和先進的攻擊向量模擬，提供全方位的 eKYC 安全評估解決方案。

### 🌟 系統特色

- **🤖 多 AI 引擎整合**: Gemini AI + Grok AI + Vertex AI Agent
- **🔍 RAG 智能問答**: 基於向量資料庫的智能檢索與分析
- **🎭 Deepfake 攻擊模擬**: StyleGAN3、SimSwap、DALL·E 等先進技術
- **📊 量化安全評估**: APCER、BPCER、ACER、EER 專業指標
- **🔒 企業級架構**: 模組化設計 + 工廠模式 + 服務導向
- **📱 RESTful API**: Swagger 自動化文檔 + 完整測試支援
- **🐳 容器化部署**: Docker + Docker Compose 一鍵部署

## 🏗️ 架構設計

```mermaid
graph TB
    subgraph "API 層 (Backend)"
        A[NestJS + Express]
        B[RouteManager]
        C[ServiceFactory]
        D[Swagger API 文檔]
    end
    
    subgraph "服務層 (Services)"
        E[RAG Service<br/>Gemini AI 整合]
        F[Attack Service<br/>5種攻擊向量]
        G[Health Service<br/>系統監控]
        H[Database Service<br/>多資料庫支援]
    end
    
    subgraph "AI 引擎層"
        I[Gemini AI<br/>智能生成]
        J[Grok AI<br/>安全分析]
        K[Vertex AI Agent<br/>對話式AI]
    end
    
    subgraph "資料層 (Database)"
        L[PostgreSQL + pgvector<br/>向量資料庫]
        M[Neo4j<br/>知識圖譜]
        N[Redis<br/>快取系統]
    end
    
    A --> B
    B --> C
    C --> E
    C --> F
    C --> G
    C --> H
    E --> I
    E --> L
    F --> I
    F --> J
    G --> K
    H --> L
    H --> M
    H --> N
```

## 🚀 核心功能

### 🎮 後端核心模組

| 功能模組 | 描述 | 實作狀態 |
|---------|------|---------|
| **🤖 多 AI 引擎** | Gemini + Grok + Vertex AI 整合 | ✅ 完成 |
| **🔍 RAG 系統** | 向量檢索 + 智能問答 + 文檔管理 | ✅ 完成 |
| **⚔️ 攻擊引擎** | 5種 AI 攻擊向量 + 組合攻擊 | ✅ 完成 |
| **📊 系統監控** | 健康檢查 + 效能統計 + 日誌追蹤 | ✅ 完成 |
| **📚 API 文檔** | Swagger UI + 自動化測試 | ✅ 完成 |
| **🔧 管理功能** | 系統配置 + 版本資訊 + 統計分析 | ✅ 完成 |

### 🎯 RAG 智能問答系統

| 功能 | 描述 | API 端點 |
|------|------|---------|
| **智能問答** | 基於向量檢索的 AI 問答 | `POST /rag/ask` |
| **文檔攝取** | 文字、檔案、法律文件攝取 | `POST /rag/ingest/*` |
| **語義搜尋** | 向量相似度文檔搜尋 | `POST /rag/search` |
| **文檔管理** | 查看、刪除、批次處理 | `GET/DELETE /rag/document/*` |
| **系統統計** | RAG 系統運行狀態 | `GET /rag/stats` |

## ⚔️ 攻擊向量

### 🎯 核心攻擊向量

| 向量ID | AI 模型 | 攻擊場景 | 難度等級 | 成功率 | 實作狀態 |
|-------|---------|----------|----------|--------|----------|
| **A1** | StyleGAN3 | 偽造真人自拍 | 🟡 MEDIUM | 78% | ✅ 已實作 |
| **A2** | StableDiffusion | 螢幕翻拍攻擊 | 🟢 LOW | 65% | ✅ 已實作 |
| **A3** | SimSwap | 即時換臉攻擊 | 🔴 HIGH | 89% | ✅ 已實作 |
| **A4** | Diffusion+GAN | 偽造護照攻擊 | 🟡 MEDIUM | 73% | ✅ 已實作 |
| **A5** | DALL·E | 生成假證件 | 🟢 EASY | 82% | ✅ 已實作 |

### 🎯 推薦攻擊組合

| 組合名稱 | 向量組合 | 描述 | 預估成功率 | 威脅等級 |
|---------|----------|------|------------|----------|
| **💎 鑽石組合** | A3 + A4 | 即時換臉 + 證件偽造 | **94%** | 🔴 CRITICAL |
| **🥇 黃金組合** | A1 + A5 | 假自拍 + 生成證件 | **83%** | 🟠 HIGH |
| **⚡ 閃電組合** | A2 + A3 | 翻拍攻擊 + 即時換臉 | **92%** | 🔴 CRITICAL |

## 🛠️ 技術棧

### 後端核心技術

```json
{
  "框架": "NestJS 11.0.1 + Express 4.19.2",
  "語言": "JavaScript ES2020 + Node.js 18+",
  "設計模式": {
    "架構": "分層架構 + 服務導向",
    "模式": "工廠模式 + 策略模式",
    "管理": "依賴注入 + 控制反轉"
  },
  "AI引擎": {
    "gemini": "Google Gemini 2.0 Flash API",
    "grok": "X.AI Grok API",
    "vertex": "Google Vertex AI Agent"
  },
  "文檔": "Swagger/OpenAPI 3.0 + 自動化生成",
  "測試": "Jest 29.7+ + Supertest"
}
```

### 資料庫技術

```json
{
  "主資料庫": "PostgreSQL 15+ with pgvector",
  "向量搜尋": "pgvector 擴展 (1024維)",
  "圖資料庫": "Neo4j 5.15 with APOC",
  "快取系統": "Redis 7.0+",
  "ORM": "原生 SQL + 連接池管理"
}
```

### AI 與機器學習

```json
{
  "RAG系統": "檢索增強生成 (Retrieval-Augmented Generation)",
  "向量模型": "intfloat/multilingual-e5-large",
  "向量維度": 1024,
  "相似度算法": "餘弦相似度 (Cosine Similarity)",
  "語言支援": "繁體中文 + 多語言"
}
```

## ⚡ 快速開始

### 💻 環境需求

```bash
# 基本環境
Node.js >= 18.0.0
npm >= 9.0.0 (建議使用 pnpm >= 8.0.0)
Git >= 2.30.0

# 可選環境 (完整功能)
Docker >= 20.10.0
Docker Compose >= 2.0.0
PostgreSQL >= 15.0 (with pgvector)
Redis >= 7.0
```

### 🚀 快速啟動

```bash
# 1. 克隆專案
git clone https://github.com/AngelaHan1129/qinguoqinchen.git
cd qinguoqinchen/backend

# 2. 安裝依賴
pnpm install

# 3. 設定環境變數 (基本配置)
cat > .env << EOF
NODE_ENV=development
PORT=7939
GEMINI_API_KEY=your_gemini_api_key_here
XAI_API_KEY=your_grok_api_key_here
LOG_LEVEL=info
EOF

# 4. 啟動系統
pnpm start:dev

# 5. 驗證啟動
curl http://localhost:7939/health
```

### 🔍 服務端點

| 服務 | URL | 描述 | 狀態 |
|------|-----|------|-----|
| **🏠 系統首頁** | http://localhost:7939 | 系統概覽 | ✅ 運行中 |
| **📚 API 文檔** | http://localhost:7939/api/docs | Swagger UI 文檔 | ✅ 可用 |
| **💚 健康檢查** | http://localhost:7939/health | 系統健康狀態 | ✅ 監控中 |
| **⚔️ 攻擊向量** | http://localhost:7939/ai-attack/vectors | 攻擊向量列表 | ✅ 就緒 |
| **🤖 RAG 問答** | http://localhost:7939/rag/ask | 智能問答系統 | ✅ 就緒 |

## 📁 專案結構

```text
qinguoqinchen/backend/
├── src/
│   ├── main.js                 # 🚀 應用程式入口 (NestJS + Express)
│   ├── config/                 # ⚙️ 配置管理
│   │   ├── swagger.config.js   # 📚 Swagger/OpenAPI 配置
│   │   └── database.config.js  # 🗄️ 資料庫配置 (PostgreSQL/Neo4j/Redis)
│   ├── services/               # 🔧 業務邏輯服務層
│   │   ├── RAGService.js       # 🧠 RAG 系統 (Gemini AI 整合)
│   │   ├── AttackService.js    # ⚔️ 攻擊向量服務
│   │   ├── HealthService.js    # 💚 健康檢查服務
│   │   ├── AppService.js       # 🏠 應用程式核心服務
│   │   └── DatabaseService.js  # 🗄️ 資料庫管理服務
│   ├── routes/                 # 🛣️ API 路由層
│   │   ├── index.js            # 🎯 路由統一註冊管理器
│   │   ├── rag.routes.js       # 🤖 RAG 系統路由 (9個端點)
│   │   ├── system.routes.js    # 🏠 系統管理路由
│   │   ├── ai.routes.js        # 🧠 AI 引擎路由
│   │   └── database.routes.js  # 🗄️ 資料庫操作路由
│   ├── utils/                  # 🛠️ 工具與輔助函數
│   │   ├── logger.js           # 📝 日誌管理工具
│   │   ├── errorHandler.js     # ❌ 錯誤處理工具
│   │   └── validation.js       # ✅ 輸入驗證工具
│   ├── middleware/             # 🔒 中間件層
│   │   ├── SecurityMiddleware.js   # 🛡️ 安全中間件
│   │   └── PerformanceMiddleware.js # ⚡ 效能監控中間件
│   └── factories/              # 🏭 工廠模式實作
│       └── ServiceFactory.js   # 🔧 服務工廠 (依賴注入)
├── sql/                        # 📁 新增：SQL 初始化檔案目錄
│   ├── 001_init_extensions.sql  # pgvector 擴展安裝
│   ├── 002_create_tables.sql    # 資料表建立
│   └── 003_create_indexes.sql   # 索引建立
├── uploads/                    # 📁 檔案上傳目錄
├── logs/                       # 📊 系統日誌目錄
├── package.json               # 📦 Node.js 專案配置
├── .env                       # 🔐 環境變數配置
├── docker-compose.yml         # 🐳 Docker 容器編排
└── README.md                  # 📖 專案說明文檔
```

### 🎯 核心檔案說明

#### **🚀 應用程式入口 (`main.js`)**
- NestJS + Express 混合架構
- 服務工廠模式初始化
- 路由統一註冊管理
- 優雅關閉處理

#### **🤖 RAG 服務核心 (`RAGService.js`)**
- Gemini AI 整合
- 向量檢索增強生成
- 內建知識庫管理
- 智能問答處理

#### **📚 Swagger 配置 (`swagger.config.js`)**
- OpenAPI 3.0 規格
- 自動化 API 文檔
- 互動式測試介面
- 完整的 schema 定義

#### **🎯 路由管理器 (`routes/index.js`)**
- 統一路由註冊
- 中間件設置
- 錯誤處理配置
- 404 處理策略

## 🔧 開發指南

### 📋 開發流程

```bash
# 1. 開發環境設置
pnpm install
cp .env.example .env
# 編輯 .env 檔案設定 API 金鑰

# 2. 啟動開發服務器
pnpm start:dev
# 系統會自動重載 (nodemon)

# 3. 驗證功能
curl http://localhost:7939/health
open http://localhost:7939/api/docs

# 4. 執行測試
pnpm test
pnpm run test:watch

# 5. 程式碼檢查
pnpm run lint
pnpm run format
```

### 🧩 添加新功能

#### 1. 新增服務

```javascript
// src/services/NewService.js
class NewService {
  constructor(dependencies) {
    this.deps = dependencies;
  }
  
  async newMethod() {
    // 業務邏輯
  }
}

module.exports = NewService;
```

#### 2. 註冊到工廠

```javascript
// src/factories/ServiceFactory.js
static createNewService() {
  const NewService = require('../services/NewService');
  return new NewService(/* dependencies */);
}

static createAllServices() {
  return {
    // ... 其他服務
    newService: this.createNewService()
  };
}
```

#### 3. 添加路由

```javascript
// src/routes/new.routes.js
class NewRoutes {
  static register(app, services) {
    const { newService } = services;
    
    app.get('/new/endpoint', async (req, res) => {
      const result = await newService.newMethod();
      res.json({ success: true, result });
    });
  }
}

module.exports = NewRoutes;
```

#### 4. 註冊路由

```javascript
// src/routes/index.js
const NewRoutes = require('./new.routes');

static registerAllRoutes(app, services) {
  // ... 其他路由
  NewRoutes.register(app, services);
}
```

### 🎯 最佳實踐

#### **🏗️ 架構原則**
- **單一職責原則**: 每個服務只負責一個功能領域
- **依賴注入**: 透過工廠模式管理依賴關係
- **錯誤處理**: 統一的錯誤處理和日誌記錄
- **API 設計**: RESTful 設計 + 統一回應格式

#### **🔒 安全考量**
- **輸入驗證**: 所有用戶輸入都要驗證
- **錯誤隱藏**: 生產環境不暴露敏感錯誤資訊
- **API 速率限制**: 防止 API 濫用
- **環境變數**: 敏感資訊使用環境變數管理

## 📚 API 文檔

### 🔗 主要 API 端點

#### **🏠 系統管理 API**
```bash
GET  /                     # 系統首頁資訊
GET  /health              # 健康檢查
GET  /system/info         # 系統詳細資訊
GET  /admin/stats         # 管理統計
GET  /admin/version       # 版本資訊
```

#### **⚔️ 攻擊系統 API**
```bash
GET  /ai-attack/vectors              # 取得所有攻擊向量
POST /ai-attack/execute              # 執行攻擊測試
POST /ai-gemini/attack-vector        # Gemini AI 攻擊分析
POST /ai-grok/security-analysis      # Grok AI 安全分析
POST /ai-agent/chat                  # Vertex AI 對話
```

#### **🤖 RAG 系統 API**
```bash
GET  /rag/stats                      # RAG 系統統計
POST /rag/ask                        # 智能問答
POST /rag/ingest/text                # 文字文檔攝取
POST /rag/ingest/file                # 檔案上傳攝取
POST /rag/ingest/legal               # 法律文檔攝取
POST /rag/search                     # 語義搜尋
GET  /rag/document/:id               # 取得文檔詳情
DELETE /rag/document/:id             # 刪除文檔
POST /rag/batch/ingest               # 批次攝取 (最多50個)
```

### 📖 詳細 API 文檔

完整的 API 文檔請訪問：**http://localhost:7939/api/docs**

#### **🎯 RAG 智能問答範例**

```bash
# 基本問答
curl -X POST http://localhost:7939/rag/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "eKYC 系統的主要安全威脅有哪些？",
    "filters": {
      "documentType": "security"
    }
  }'

# 回應範例
{
  "success": true,
  "answer": "基於相關資料分析，eKYC 系統面臨的主要安全威脅包括...",
  "sources": [
    {
      "id": "ekyc_security_001",
      "title": "eKYC 系統安全威脅分析",
      "similarity": 0.95,
      "category": "security"
    }
  ],
  "confidence": 0.88,
  "mode": "RAG",
  "documentsUsed": 1,
  "timestamp": "2025-10-21T02:00:00.000Z"
}
```

#### **⚔️ 攻擊執行範例**

```bash
# 執行多向量攻擊
curl -X POST http://localhost:7939/ai-attack/execute \
  -H "Content-Type: application/json" \
  -d '{
    "vectorIds": ["A3", "A4"],
    "intensity": "high"
  }'

# 回應範例
{
  "success": true,
  "testId": "QQC_ATK_1729454567890_A1B2C3",
  "attackResults": {
    "vectors": ["A3", "A4"],
    "intensity": "high",
    "results": [
      {
        "vectorId": "A3",
        "success": true,
        "confidence": 0.89,
        "bypassScore": 0.92,
        "processingTime": 2341
      }
    ],
    "summary": {
      "totalAttacks": 2,
      "successfulAttacks": 1,
      "successRate": "50%",
      "threatLevel": "HIGH"
    }
  }
}
```

## 🐳 部署指南

### 🏗️ Docker Compose 部署

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 後端服務
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "7939:7939"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://admin:qinguoqinchen123@postgres:5432/qinguoqinchen_ai
      - NEO4J_URI=bolt://neo4j:7687
      - REDIS_URL=redis://redis:6379
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - XAI_API_KEY=${XAI_API_KEY}
    depends_on:
      - postgres
      - neo4j  
      - redis
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads

  # PostgreSQL 資料庫
  postgres:
    image: pgvector/pgvector:pg15
    ports:
      - "5847:5432"
    environment:
      POSTGRES_DB: qinguoqinchen_ai
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: qinguoqinchen123
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Neo4j 圖資料庫
  neo4j:
    image: neo4j:5.15-community
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      NEO4J_AUTH: neo4j/qinguoqinchen123
      NEO4J_PLUGINS: '["apoc", "graph-data-science"]'
    volumes:
      - neo4j_data:/data

  # Redis 快取
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass qinguoqinchen123
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  neo4j_data:
  redis_data:
```

### 🚀 部署步驟

```bash
# 1. 準備環境
git clone https://github.com/AngelaHan1129/qinguoqinchen.git
cd qinguoqinchen/backend

# 2. 設定環境變數
cp .env.example .env.production
# 編輯 .env.production 設定真實的 API 金鑰

# 3. 啟動服務
docker-compose up -d --build

# 4. 驗證部署
docker-compose ps
curl http://localhost:7939/health

# 5. 查看日誌
docker-compose logs -f backend
```

## 🧪 測試指南

### 🔬 系統測試

```bash
# 健康檢查測試
curl http://localhost:7939/health

# 攻擊向量測試
curl http://localhost:7939/ai-attack/vectors

# RAG 系統測試
curl -X POST http://localhost:7939/rag/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"什麼是 Deepfake 攻擊？"}'

# 文檔攝取測試
curl -X POST http://localhost:7939/rag/ingest/text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "eKYC 系統是電子身份驗證的重要技術...",
    "metadata": {"title": "eKYC 技術說明"}
  }'
```

### 📊 效能測試

```bash
# 併發攻擊測試
for i in {1..10}; do
  curl -X POST http://localhost:7939/ai-attack/execute \
    -H "Content-Type: application/json" \
    -d '{"vectorIds":["A1"],"intensity":"medium"}' &
done

# RAG 問答壓力測試
for i in {1..20}; do
  curl -X POST http://localhost:7939/rag/ask \
    -H "Content-Type: application/json" \
    -d '{"question":"eKYC 安全威脅"}' &
done
```

## 🔧 故障排除

### ❓ 常見問題

#### **1. 系統啟動失敗**
```bash
# 檢查 Node.js 版本
node --version  # 需要 >= 18.0.0

# 清理並重新安裝
rm -rf node_modules package-lock.json
pnpm install

# 檢查環境變數
echo $GEMINI_API_KEY
echo $XAI_API_KEY
```

#### **2. RAG 問答回傳模擬結果**
```bash
# 確認 Gemini API 金鑰設置
grep GEMINI_API_KEY .env

# 測試 API 連接
curl -H "Authorization: Bearer $GEMINI_API_KEY" \
  https://generativelanguage.googleapis.com/v1/models
```

#### **3. 資料庫連接問題**
```bash
# 檢查資料庫狀態
docker-compose ps

# 重新啟動資料庫
docker-compose restart postgres neo4j redis

# 檢查連接
psql -h localhost -p 5847 -U admin -d qinguoqinchen_ai
```

#### **4. 攻擊向量執行異常**
```bash
# 檢查服務狀態
curl http://localhost:7939/health

# 查看詳細日誌
docker-compose logs backend | grep ERROR

# 重新啟動後端服務
docker-compose restart backend
```

### 📝 日誌分析

```bash
# 查看系統日誌
tail -f logs/system.log

# 查看錯誤日誌
tail -f logs/error.log

# 查看 RAG 操作日誌
docker-compose logs backend | grep "RAG"

# 查看攻擊執行日誌
docker-compose logs backend | grep "攻擊"
```

### 🚨 監控指標

```bash
# 系統健康狀態
curl http://localhost:7939/health

# RAG 系統統計
curl http://localhost:7939/rag/stats

# 管理統計資訊
curl http://localhost:7939/admin/stats

# 記憶體使用情況
curl http://localhost:7939/system/info
```

## 🤝 貢獻指南

### 🌟 如何貢獻

1. **Fork** 此專案
2. **建立功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交變更** (`git commit -m '新增某個厲害的功能'`)
4. **推送分支** (`git push origin feature/AmazingFeature`)
5. **開啟 Pull Request**

### 📋 開發規範

- **提交訊息**: 使用中文，格式為 `類型: 簡要描述`
- **程式碼風格**: 遵循 ESLint 和 Prettier 配置
- **測試覆蓋率**: 新功能需達到 80% 以上覆蓋率
- **文檔更新**: 新功能需同步更新 README 和 API 文檔

### 🐛 問題回報

請使用 [GitHub Issues](https://github.com/AngelaHan1129/qinguoqinchen/issues) 回報問題：

- 詳細的問題描述
- 重現步驟
- 期望行為
- 系統環境資訊
- 相關截圖或日誌

## 📞 聯絡資訊

- **🏫 開發團隊**: 國立臺中科技大學 資訊管理系
- **🏆 競賽項目**: 2025 InnoServe 大專校院資訊應用服務創新競賽
- **🌐 專案首頁**: [GitHub Repository](https://github.com/AngelaHan1129/qinguoqinchen)
- **🐛 問題回報**: [GitHub Issues](https://github.com/AngelaHan1129/qinguoqinchen/issues)
- **📧 聯絡信箱**: qinguoqinchen2025@gmail.com

## 📄 授權條款

本專案採用 MIT 授權條款。詳見 [LICENSE](LICENSE) 檔案。

***

<div align="center">
  <h3>🛡️ 為更安全的數位身份驗證而努力</h3>
  <p><strong>侵國侵城 AI 安全團隊</strong> © 2025</p>
  <p>🏆 <em>2025 InnoServe 創新伺服器大賽參賽作品</em></p>
  <p>🎯 <em>專業的 eKYC 安全測試解決方案</em></p>
  
  ![GitHub Stars](https://img.shields.io/github/stars/AngelaHan1129/qinguohttps://github.com/AngelaHan1129/qingu.shields.io/github/forks/AngelaHan1.com/AngelaHan1129/qinguoqinio/github/issues/AngelaHan1129/qinguhttps://github.com/AngelaHan1129/qingus.io/github/license/AngelaHan1129/qinguHan1129/qinguoqinchen/blob/main/用侵國侵城) **AI 滲透測試系統，體驗最先進的 eKYC 安全評估技術！**


  # docker連線到pgvecto操作資料庫
  ```bash
   docker exec -it cbecf761035a psql -U admin -d qinguoqinchen_ai
  ```

# 使用步驟
1. 執行測試
根據您的後端專案結構，執行不同類型的測試：

bash
# 執行所有測試
npx playwright test

# 執行特定專案
npx playwright test --project=unit
npx playwright test --project=e2e

# 執行特定測試檔案
npx playwright test tests/api/rag.routes.spec.js
2. 生成 Allure 報告
測試執行完成後，結果檔案會生成在 allure-results 目錄中 。​

安裝 Allure 命令列工具：

```bash
npm install -g allure-commandline
```
生成並開啟報告：

```bash
# 生成報告
allure generate allure-results -o allure-report

# 開啟報告
allure open allure-report
```
或者使用一行命令直接開啟：

```bash
allure serve allure-results
```