我來幫你修改這個簡化版的 README.md，保持原有結構但添加更詳細的內容：

```markdown
# 🛡️ qinguoqinchen-ai-2025

## Description

**侵國侵城 AI 滲透測試系統** - 專為 eKYC (電子身份驗證) 安全測試設計的 AI 紅隊滲透測試系統。

### 核心功能
- 🤖 **多模態 AI 攻擊模擬**: StyleGAN3、Stable Diffusion、SimSwap、DALL·E
- 📊 **量化安全評估**: APCER、BPCER、ACER、EER 等專業指標
- 🧠 **智能防禦建議**: AI 驅動的個性化安全改善建議
- 📈 **自動化報告生成**: 詳細的滲透測試報告和合規性分析
- 🔄 **複合攻擊模擬**: 支援多種攻擊向量的組合測試

### 攻擊向量
- **A1**: StyleGAN3 偽造真人自拍 (78% 成功率)
- **A2**: StableDiffusion 翻拍攻擊 (65% 成功率)
- **A3**: SimSwap 即時換臉 (89% 成功率)
- **A4**: Diffusion+GAN 偽造護照 (73% 成功率)
- **A5**: DALL·E 生成假證件 (82% 成功率)

### 技術架構
- **後端**: NestJS 11.0.1 + Express.js
- **語言**: JavaScript (ES2020)
- **API 文檔**: Swagger/OpenAPI 3.0
- **資料庫**: Neo4j 5.15 + PostgreSQL 15
- **容器化**: Docker + Docker Compose

## Installation

### 環境需求
- Node.js >= 18.0.0
- pnpm (推薦) / npm / yarn
- Docker >= 20.10.0
- Docker Compose >= 2.0.0

### 安裝步驟

```
# 克隆專案
$ git clone <repository-url>
$ cd qinguoqinchen-ai-2025

# 安裝依賴
$ pnpm install

# 設定環境變數
$ cp .env.example .env
# 編輯 .env 檔案設定資料庫連接等配置

# 啟動資料庫服務
$ pnpm docker:up
```

## Running the app

```
# 開發模式 (推薦)
$ pnpm start:dev

# 一般啟動
$ pnpm start

# 生產模式
$ pnpm start:prod

# 使用 Docker 啟動資料庫
$ pnpm docker:up

# 查看 Docker 服務狀態
$ pnpm docker:logs
```

### 驗證安裝
系統啟動後訪問以下端點：
- **主頁**: http://localhost:7939
- **Swagger 文檔**: http://localhost:7939/api/docs
- **健康檢查**: http://localhost:7939/health
- **攻擊向量**: http://localhost:7939/ai-attack/vectors

## Test

```
# 單元測試
$ pnpm test

# E2E 測試
$ pnpm test:e2e

# 測試覆蓋率
$ pnpm test:cov

# 測試監聽模式
$ pnpm test:watch
```

### 手動 API 測試

```
# 健康檢查
$ curl http://localhost:7939/health

# 獲取攻擊向量
$ curl http://localhost:7939/ai-attack/vectors

# 執行攻擊測試
$ curl -X POST http://localhost:7939/ai-attack/execute \
  -H "Content-Type: application/json" \
  -d '{"vectorIds":["A1","A3"],"intensity":"medium"}'

# 執行複合攻擊
$ curl -X POST http://localhost:7939/ai-attack/combo \
  -H "Content-Type: application/json" \
  -d '{"combos":[["A2","A3"]],"intensity":"high"}'
```

## Docker Services

```
# 啟動所有服務
$ pnpm docker:up

# 停止所有服務
$ pnpm docker:down

# 查看服務日誌
$ pnpm docker:logs

# 重啟服務
$ docker-compose restart
```

### 資料庫連接
- **Neo4j Web UI**: http://localhost:7692 (neo4j/qinguoqinchen123)
- **PostgreSQL**: localhost:5847 (admin/qinguoqinchen123)

## API Documentation

完整的 API 文檔可在系統啟動後訪問：
- **Swagger UI**: http://localhost:7939/api/docs
- **OpenAPI JSON**: http://localhost:7939/api/docs-json

### 主要端點
- `GET /health` - 系統健康檢查
- `GET /ai-attack/vectors` - 獲取攻擊向量列表
- `POST /ai-attack/execute` - 執行 AI 攻擊測試
- `POST /ai-attack/combo` - 執行複合攻擊測試
- `GET /system/stats` - 系統統計數據

## Development

```
# 程式碼格式化
$ pnpm format

# 開發模式 (自動重載)
$ pnpm start:dev

# 建構專案
$ pnpm build
```
