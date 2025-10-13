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

> **🎯 專為 eKYC (電子身份驗證) 安全測試設計的全端 AI 紅隊滲透測試系統**  
> **整合 RAG 檢索增強生成技術 + 多模態 AI 攻擊引擎**

## 📋 目錄

- [🎯 系統概述](#-系統概述)
- [🏗️ 系統架構](#️-系統架構)
- [🚀 核心功能](#-核心功能)
- [⚔️ 攻擊向量](#️-攻擊向量)
- [🛠️ 技術棧](#️-技術棧)
- [⚡ 快速開始](#-快速開始)
- [🎨 前端開發](#-前端開發)
- [🔧 後端開發](#-後端開發)
- [🐍 Python AI 服務](#-python-ai-服務)
- [📚 API 文檔](#-api-文檔)
- [🐳 部署指南](#-部署指南)
- [🧪 測試指南](#-測試指南)
- [🔧 故障排除](#-故障排除)
- [🤝 貢獻指南](#-貢獻指南)

## 🎯 系統概述

**侵國侵城 AI 滲透測試系統**是一個創新的全端 AI 紅隊工具，專為 **2025 創新伺服器大賽**設計。系統整合了最新的生成式 AI 技術、RAG 檢索增強生成和先進的攻擊向量模擬，提供全方位的 eKYC 安全評估解決方案。

### 🌟 系統特色

- **🤖 多 AI 引擎整合**: Gemini AI + Grok AI + Vertex AI Agent
- **🔍 RAG 智慧問答**: 基於滲透測試報告的智能檢索與分析
- **🎭 Deepfake 攻擊模擬**: StyleGAN3、SimSwap、DALL·E 等先進技術
- **📊 量化安全評估**: APCER、BPCER、ACER、EER 專業指標
- **🎨 現代化介面**: Vue.js 3 + TypeScript + Element Plus
- **🔒 企業級安全**: JWT 認證 + RBAC 權限控制
- **🐳 容器化部署**: Docker + Docker Compose 一鍵部署
- **📱 響應式設計**: 支援桌面和移動設備

## 🏗️ 系統架構

```
graph TB
    subgraph "前端層 (Frontend)"
        A[Vue.js 3 + TypeScript]
        B[Element Plus UI]
        C[ECharts 可視化]
        D[WebSocket 實時通信]
    end
    
    subgraph "API 層 (Backend)"
        E[NestJS + Express]
        F[多 AI 引擎整合]
        G[RAG 檢索系統]
        H[攻擊向量引擎]
    end
    
    subgraph "AI 服務層"
        I[Python FastAPI]
        J[Sentence Transformers]
        K[向量嵌入模型]
    end
    
    subgraph "數據層 (Database)"
        L[PostgreSQL + pgvector]
        M[Neo4j 知識圖譜]
        N[Redis 快取]
    end
    
    A --> E
    E --> I
    E --> L
    E --> M
    E --> N
    I --> J
    J --> K
```

## 🚀 核心功能

### 🎮 前端功能
| 功能模組 | 描述 | 狀態 |
|---------|------|-----|
| **攻擊控制台** | 直觀的攻擊向量選擇和參數配置 | ✅ |
| **實時監控** | 攻擊進度和系統狀態實時顯示 | ✅ |
| **RAG 智慧問答** | 基於文檔的智能查詢與分析 | ✅ |
| **數據可視化** | 攻擊結果和安全指標圖表展示 | 🔄 |
| **報告管理** | 自動生成和下載詳細測試報告 | 🔄 |
| **用戶管理** | 角色權限管理和審計日誌 | 📋 |

### 🔧 後端功能
| 功能模組 | 描述 | 狀態 |
|---------|------|-----|
| **多 AI 引擎** | Gemini AI + Grok AI + Vertex AI Agent | ✅ |
| **RAG 系統** | 文檔向量化、相似度搜尋、智慧問答 | ✅ |
| **攻擊引擎** | 5 種 AI 攻擊向量模擬執行 | ✅ |
| **安全評估** | APCER、BPCER、ACER、EER 指標計算 | ✅ |
| **知識圖譜** | Neo4j 攻擊關係網絡分析 | 🔄 |
| **API 文檔** | Swagger 自動生成文檔 | ✅ |

## ⚔️ 攻擊向量

| 向量ID | AI 模型 | 攻擊場景 | 難度等級 | 成功率 | 實作狀態 |
|-------|---------|----------|----------|--------|----------|
| **A1** | StyleGAN3 | 偽造真人自拍 | 🟡 MEDIUM | 78% | ✅ 已實作 |
| **A2** | StableDiffusion | 翻拍攻擊 | 🔴 HIGH | 65% | ✅ 已實作 |
| **A3** | SimSwap | 即時換臉 | 🔴 VERY_HIGH | 89% | ✅ 已實作 |
| **A4** | Diffusion+GAN | 偽造護照 | 🔴 HIGH | 73% | ✅ 已實作 |
| **A5** | DALL·E | 生成假證件 | 🟡 MEDIUM | 82% | ✅ 已實作 |

### 🎯 推薦攻擊組合

| 組合名稱 | 向量組合 | 描述 | 預估成功率 | 使用場景 |
|---------|----------|------|------------|----------|
| **🔥 鑽石組合** | A3 + A4 | 即時換臉 + 證件偽造 | **94%** | 高風險 eKYC 系統測試 |
| **💎 黃金組合** | A1 + A5 | 假自拍 + 生成證件 | **83%** | 標準滲透測試 |
| **⚡ 閃電組合** | A2 + A3 | 翻拍攻擊 + 即時換臉 | **92%** | 視訊驗證繞過 |

## 🛠️ 技術棧

### 前端技術
```
{
  "framework": "Vue.js 3.4.0",
  "language": "TypeScript 5.0+",
  "build": "Vite 5.0+",
  "ui": "Element Plus 2.4+",
  "charts": "ECharts 5.4+",
  "http": "Axios 1.6+",
  "router": "Vue Router 4.0+",
  "state": "Pinia 2.1+",
  "styling": "SCSS + TailwindCSS"
}
```

### 後端技術
```
{
  "framework": "NestJS 11.0.1 + Express",
  "language": "JavaScript ES2020",
  "ai_engines": {
    "gemini": "Google Gemini API",
    "grok": "X.AI Grok API", 
    "vertex": "Google Vertex AI Agent"
  },
  "database": {
    "postgresql": "15+ with pgvector",
    "neo4j": "5.15 with APOC plugins",
    "redis": "7.0+ for caching"
  },
  "documentation": "Swagger/OpenAPI 3.0",
  "testing": "Jest 29.7+",
  "containerization": "Docker + Docker Compose"
}
```

### AI 服務技術
```
{
  "framework": "FastAPI 0.104.1",
  "language": "Python 3.11+",
  "ai_models": {
    "embedding": "intfloat/e5-large-v2",
    "dimension": 1024,
    "vector_db": "PostgreSQL + pgvector"
  },
  "libraries": {
    "sentence_transformers": "2.2.2",
    "torch": "2.0+",
    "numpy": "1.24+",
    "uvicorn": "0.24.0"
  }
}
```

## ⚡ 快速開始

### 💻 環境需求

```
# 基本環境
Node.js >= 18.0.0
Python >= 3.11.0
pnpm >= 8.0.0 (推薦)
Docker >= 20.10.0
Docker Compose >= 2.0.0

# 推薦硬體配置
RAM >= 16GB (推薦 32GB)
GPU >= RTX 3070 (AI 模型加速，可選)
Storage >= 100GB SSD
```

### 🚀 一鍵啟動

```
# 1. 克隆專案
git clone https://github.com/AngelaHan1129/qinguoqinchen.git
cd qinguoqinchen

# 2. 設定環境變數
cp .env.example .env
cp backend/vertex-ai-key.json.example backend/vertex-ai-key.json
# 編輯 .env 和 vertex-ai-key.json 填入真實憑證

# 3. 一鍵啟動 (Docker)
docker-compose up -d

# 4. 驗證服務
curl http://localhost:7939/health  # 後端健康檢查
curl http://localhost:8000/health  # Python AI 服務
```

### 🔍 服務端點

| 服務 | URL | 描述 | 狀態 |
|------|-----|------|-----|
| **前端應用** | http://localhost:3000 | Vue.js Web 界面 | 🔄 開發中 |
| **後端 API** | http://localhost:7939 | NestJS API 服務 | ✅ 運行中 |
| **Python AI** | http://localhost:8000 | FastAPI 向量化服務 | ✅ 運行中 |
| **Swagger 文檔** | http://localhost:7939/api/docs | API 文檔界面 | ✅ 可用 |
| **PostgreSQL** | localhost:5847 | 主資料庫 | ✅ 已配置 |
| **Neo4j Web** | http://localhost:7474 | 圖資料庫管理 | 🔄 配置中 |
| **Redis** | localhost:6379 | 快取服務 | 🔄 配置中 |

## 🎨 前端開發

### 📁 專案結構
```
frontend/
├── src/
│   ├── components/           # 共用組件
│   │   ├── AttackConsole/   # 攻擊控制台
│   │   ├── RAGChat/         # RAG 聊天介面
│   │   ├── Dashboard/       # 儀表板
│   │   └── Charts/          # 圖表組件
│   ├── views/               # 頁面組件
│   │   ├── Home.vue         # 首頁
│   │   ├── Attack.vue       # 攻擊頁面
│   │   ├── RAG.vue          # RAG 智慧問答
│   │   └── Reports.vue      # 報告管理
│   ├── stores/              # Pinia 狀態管理
│   ├── api/                 # API 接口封裝
│   └── utils/               # 工具函數
└── package.json            # 依賴配置
```

### 🔨 開發指令
```
cd frontend

# 安裝依賴
pnpm install

# 開發模式
pnpm dev

# 建構生產版本
pnpm build

# 程式碼檢查
pnpm lint

# 類型檢查
pnpm type-check
```

## 🔧 後端開發

### 📁 專案結構
```
backend/
├── src/
│   ├── modules/
│   │   ├── ai-attack/          # AI 攻擊模組
│   │   ├── ai-gemini/          # Gemini AI 模組
│   │   ├── ai-grok/            # Grok AI 模組
│   │   ├── ai-agent/           # Vertex AI Agent 模組
│   │   ├── rag/                # RAG 檢索增強生成
│   │   └── database/           # 資料庫管理
│   ├── common/                 # 共用模組
│   └── main.js                 # 應用入口
├── python-ai/                  # Python AI 服務
│   ├── main.py                 # FastAPI 應用
│   ├── requirements.txt        # Python 依賴
│   └── models/                 # AI 模型快取
└── package.json               # Node.js 依賴
```

### 🔨 開發指令
```
# Node.js 後端
cd backend
npm install
node src/main.js

# Python AI 服務
cd backend/python-ai
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 🐍 Python AI 服務

### 🧠 AI 模型說明
- **模型**: intfloat/e5-large-v2
- **維度**: 1024
- **語言支援**: 100+ 語言（包含繁體中文）
- **用途**: 文本向量化、語義搜尋、RAG 檢索

### 🔌 API 端點
| 端點 | 方法 | 描述 | 範例 |
|------|------|------|------|
| `/embed` | POST | 單一文本向量化 | `{"text": "eKYC攻擊分析"}` |
| `/embed/batch` | POST | 批量文本向量化 | `{"texts": ["文本1", "文本2"]}` |
| `/health` | GET | 健康檢查 | 返回服務狀態 |

## 📚 API 文檔

### 🔑 主要 API 端點

#### 攻擊系統
```
# 獲取攻擊向量列表
GET /ai-attack/vectors

# 執行單一攻擊
POST /ai-attack/execute
{
  "vectorIds": ["A1", "A3"],
  "intensity": "high",
  "options": {}
}

# 執行複合攻擊
POST /ai-attack/combo
{
  "combos": [["A1", "A4"], ["A3", "A5"]],
  "intensity": "medium"
}
```

#### RAG 智慧問答
```
# RAG 問答
POST /rag/ask
{
  "question": "eKYC系統如何防護Deepfake攻擊？",
  "filters": {
    "attackVector": "A3",
    "runId": "test-001"
  }
}

# 文檔匯入
POST /rag/ingest
{
  "text": "滲透測試報告內容...",
  "metadata": {
    "attackVector": "A3",
    "runId": "test-001",
    "documentType": "penetration-report"
  }
}

# RAG 統計
GET /rag/stats
```

#### 多 AI 引擎
```
# Gemini AI 攻擊向量生成
POST /ai-gemini/attack-vector
{
  "prompt": "針對銀行eKYC系統的深偽攻擊策略"
}

# Grok AI 安全分析
POST /ai-grok/security-analysis
{
  "threatDescription": "AI生成Deepfake攻擊",
  "targetSystem": "銀行eKYC系統"
}

# Vertex AI Agent 對話
POST /ai-agent/chat
{
  "message": "分析銀行eKYC系統的安全風險",
  "sessionId": "security-session-1"
}
```

### 📖 完整 API 文檔
訪問 **Swagger UI**: http://localhost:7939/api/docs

## 🐳 部署指南

### 🏗️ Docker Compose 配置

```
# docker-compose.yml
version: '3.8'

services:
  # 後端服務
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "7939:7939"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://admin:password@postgres:5432/qinguoqinchen_ai
      - NEO4J_URI=bolt://neo4j:7687
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - neo4j
      - redis
      - python-ai

  # Python AI 服務
  python-ai:
    build:
      context: ./backend/python-ai
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./backend/python-ai/models:/app/models

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
    image: neo4j:5.15
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

volumes:
  postgres_data:
  neo4j_data:
```

### 🚀 生產環境部署

```
# 1. 克隆並設定
git clone https://github.com/AngelaHan1129/qinguoqinchen.git
cd qinguoqinchen

# 2. 設置生產環境變數
cp .env.example .env.production
# 編輯生產環境配置

# 3. 建構並啟動
docker-compose -f docker-compose.prod.yml up -d --build

# 4. 初始化資料庫
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed

# 5. 驗證部署
curl http://your-domain.com/health
```

## 🧪 測試指南

### 🔬 單元測試
```
# 後端測試
cd backend
npm test
npm run test:cov

# Python AI 服務測試
cd backend/python-ai
python -m pytest
python -m pytest --cov=.
```

### 🌐 API 測試範例
```
# 健康檢查
curl http://localhost:7939/health

# 攻擊向量測試
curl http://localhost:7939/ai-attack/vectors

# RAG 問答測試
curl -X POST http://localhost:7939/rag/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"A3攻擊向量的成功率是多少？"}'

# Python AI 服務測試
curl -X POST http://localhost:8000/embed \
  -H "Content-Type: application/json" \
  -d '{"text":"eKYC系統安全測試"}'
```

## 🔧 故障排除

### ❓ 常見問題

#### 1. Python AI 服務啟動失敗
```
# 檢查 Python 版本
python --version  # 需要 >= 3.11

# 重新安裝依賴
pip install -r requirements.txt --no-cache-dir

# 使用輕量版模擬服務
uvicorn main-lite:app --host 0.0.0.0 --port 8000
```

#### 2. 資料庫連接問題
```
# 檢查資料庫狀態
docker-compose ps

# 重新啟動資料庫服務
docker-compose restart postgres neo4j redis

# 檢查資料庫日誌
docker-compose logs postgres
```

#### 3. AI API 配置問題
```
# 檢查環境變數
echo $GEMINI_API_KEY
echo $XAI_API_KEY
echo $GOOGLE_CLOUD_PROJECT_ID

# 測試 API 連接
curl http://localhost:7939/ai-gemini/test
curl http://localhost:7939/ai-grok/test
```

### 📝 日誌分析
```
# 查看所有服務日誌
docker-compose logs -f

# 查看特定服務日誌
docker-compose logs -f backend
docker-compose logs -f python-ai

# 日誌過濾
docker-compose logs backend | grep ERROR
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

### 🐛 回報問題

請使用 [GitHub Issues](https://github.com/AngelaHan1129/qinguoqinchen/issues) 回報問題，包含：
- 詳細的問題描述
- 重現步驟
- 期望行為
- 系統環境資訊
- 相關截圖或日誌

---

## 📞 聯絡資訊

- **專案首頁**: https://github.com/AngelaHan1129/qinguoqinchen
- **問題回報**: [GitHub Issues](https://github.com/AngelaHan1129/qinguoqinchen/issues)
- **開發團隊**: 國立臺中科技大學 資訊管理系
- **比賽項目**: 2025 創新伺服器大賽

## 📄 授權條款

本專案採用 MIT 授權條款。詳見 [LICENSE](LICENSE) 檔案。

---

<div align="center">
  <h3>🛡️ 為更安全的數位身份驗證而努力</h3>
  <p><strong>侵國侵城 AI 安全團隊</strong> © 2025</p>
  <p>🏆 <em>2025 創新伺服器大賽參賽作品</em></p>
  
  [![GitHub Stars](https://img.shields.io/github/stars/AngelaHan1129/qinguoqinchen?style=social)](https://github.com/AngelaHan1129/qinguoqinchen/stargazers)
  [![GitHub Forks](https://img.shields.io/github/forks/AngelaHan1129/qinguoqinchen?style=social)](https://github.com/AngelaHan1129/qinguoqinchen/network/members)
  [![GitHub Issues](https://img.shields.io/github/issues/AngelaHan1129/qinguoqinchen)](https://github.com/AngelaHan1129/qinguoqinchen/issues)
</div>

