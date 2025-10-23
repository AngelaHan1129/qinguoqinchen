絕對可以！我來為您的團隊準備完整的 Docker pgvector 設置方案，讓所有成員都能快速啟動並使用。

## 🚀 **團隊 pgvector Docker 完整方案**

### **方案 1：完整的 Docker Compose（推薦）**

創建 `team-pgvector-setup.yml`：

```yaml
# team-pgvector-setup.yml - 侵國侵城 AI 團隊專用 pgvector 設置
version: '3.8'

services:
  # pgvector 資料庫
  qinguoqinchen-postgres:
    image: pgvector/pgvector:pg17
    container_name: qinguoqinchen-pgvector
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: qinguoqinchen123
      POSTGRES_DB: qinguoqinchen_ai
      TZ: Asia/Taipei
      # 設定記憶體使用量
      POSTGRES_SHARED_BUFFERS: 256MB
      POSTGRES_EFFECTIVE_CACHE_SIZE: 1GB
    ports:
      - "5847:5432"
    volumes:
      - qinguoqinchen_pgvector_data:/var/lib/postgresql/data
      - ./sql:/docker-entrypoint-initdb.d:ro
      - ./backups:/var/backups
    restart: always
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "admin", "-d", "qinguoqinchen_ai"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    command: >
      postgres 
      -c max_connections=200
      -c shared_preload_libraries=vector
      -c log_statement=all
      -c log_min_duration_statement=1000
    networks:
      - qinguoqinchen-network

  # pgAdmin 管理介面
  qinguoqinchen-pgadmin:
    image: dpage/pgadmin4:latest
    container_name: qinguoqinchen-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@qinguoqinchen.tw
      PGADMIN_DEFAULT_PASSWORD: qinguoqinchen123
      PGADMIN_LISTEN_PORT: 80
    ports:
      - "8080:80"
    volumes:
      - qinguoqinchen_pgadmin_data:/var/lib/pgadmin
    depends_on:
      qinguoqinchen-postgres:
        condition: service_healthy
    restart: always
    networks:
      - qinguoqinchen-network

  # Python 向量服務
  qinguoqinchen-vector-service:
    build: 
      context: ./python-ai
      dockerfile: Dockerfile
    container_name: qinguoqinchen-vector-service
    ports:
      - "8000:8000"
    environment:
      - MODEL_NAME=qinguoqinchen-legal-embedder-v1.0
      - CACHE_DIR=/app/models
      - MAX_LENGTH=512
      - EMBEDDING_DIMENSION=1024
      - BATCH_SIZE=16
      - DEVICE=cpu
      - LOG_LEVEL=info
    volumes:
      - qinguoqinchen_models_cache:/app/models
      - ./python-ai/logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 15s
      retries: 3
      start_period: 60s
    restart: always
    networks:
      - qinguoqinchen-network

volumes:
  qinguoqinchen_pgvector_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: ./data/postgres
  qinguoqinchen_pgadmin_data:
    driver: local
  qinguoqinchen_models_cache:
    driver: local

networks:
  qinguoqinchen-network:
    driver: bridge
    name: qinguoqinchen-ai-network
    ipam:
      driver: default
      config:
        - subnet: 192.168.100.0/24
          gateway: 192.168.100.1

# 健康檢查和監控
x-healthcheck-config: &healthcheck
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### **方案 2：一鍵啟動腳本**

創建 `team-setup.ps1` (Windows) 和 `team-setup.sh` (Mac/Linux)：

#### **Windows PowerShell 腳本**

```powershell
# team-setup.ps1 - 侵國侵城 AI 團隊 pgvector 一鍵設置
param(
    [string]$Action = "start",
    [switch]$Clean = $false
)

Write-Host "🏛️ 侵國侵城 AI 團隊 pgvector 環境設置" -ForegroundColor Cyan
Write-Host "📅 $(Get-Date)" -ForegroundColor Gray

function Show-Usage {
    Write-Host "使用方法:" -ForegroundColor Yellow
    Write-Host "  .\team-setup.ps1 start     # 啟動所有服務" -ForegroundColor Green
    Write-Host "  .\team-setup.ps1 stop      # 停止所有服務" -ForegroundColor Green
    Write-Host "  .\team-setup.ps1 restart   # 重啟所有服務" -ForegroundColor Green
    Write-Host "  .\team-setup.ps1 status    # 查看服務狀態" -ForegroundColor Green
    Write-Host "  .\team-setup.ps1 logs      # 查看日誌" -ForegroundColor Green
    Write-Host "  .\team-setup.ps1 clean     # 清理環境" -ForegroundColor Green
}

function Test-Prerequisites {
    Write-Host "🔍 檢查前置需求..." -ForegroundColor Yellow
    
    # 檢查 Docker
    try {
        $dockerVersion = docker --version 2>$null
        Write-Host "  ✅ Docker: $dockerVersion" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Docker 未安裝或未啟動" -ForegroundColor Red
        exit 1
    }
    
    # 檢查 Docker Compose
    try {
        $composeVersion = docker compose version 2>$null
        Write-Host "  ✅ Docker Compose: $composeVersion" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Docker Compose 未安裝" -ForegroundColor Red
        exit 1
    }
    
    # 檢查端口占用
    $ports = @(5847, 8080, 8000)
    foreach ($port in $ports) {
        $portCheck = netstat -an | Select-String ":$port "
        if ($portCheck) {
            Write-Host "  ⚠️  端口 $port 可能已被占用" -ForegroundColor Yellow
        } else {
            Write-Host "  ✅ 端口 $port 可用" -ForegroundColor Green
        }
    }
}

function Setup-Environment {
    Write-Host "📁 設置環境..." -ForegroundColor Yellow
    
    # 創建必要目錄
    $directories = @("sql", "python-ai", "data/postgres", "backups", "logs")
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "  ✅ 創建目錄: $dir" -ForegroundColor Green
        }
    }
    
    # 創建初始化 SQL
    if (-not (Test-Path "sql/init.sql")) {
        @"
-- 侵國侵城 AI pgvector 初始化腳本
-- 啟用 pgvector 擴展
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 創建法律文件表
CREATE TABLE IF NOT EXISTS legal_documents (
    id VARCHAR(255) PRIMARY KEY,
    document_id VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1024),
    document_type VARCHAR(100),
    jurisdiction VARCHAR(50),
    law_category VARCHAR(100),
    article_number VARCHAR(50),
    effective_date DATE,
    chunk_index INTEGER DEFAULT 0,
    chunk_type VARCHAR(50),
    metadata JSONB,
    source VARCHAR(255),
    language VARCHAR(10) DEFAULT 'zh-TW',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 創建向量索引
CREATE INDEX IF NOT EXISTS idx_legal_documents_embedding 
    ON legal_documents USING hnsw (embedding vector_cosine_ops);

-- 創建其他索引
CREATE INDEX IF NOT EXISTS idx_legal_documents_document_id ON legal_documents(document_id);
CREATE INDEX IF NOT EXISTS idx_legal_documents_document_type ON legal_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_legal_documents_jurisdiction ON legal_documents(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_legal_documents_law_category ON legal_documents(law_category);

-- 創建系統配置表
CREATE TABLE IF NOT EXISTS system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 插入初始配置
INSERT INTO system_config (config_key, config_value, description) VALUES 
('team_setup', '{"version": "1.0", "initialized_at": "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')", "setup_by": "team-setup-script"}', '團隊環境設置資訊')
ON CONFLICT (config_key) DO NOTHING;

-- 顯示初始化完成
SELECT '🎉 侵國侵城 AI pgvector 團隊環境初始化完成！' as status;
"@ | Out-File -FilePath "sql/init.sql" -Encoding UTF8
        Write-Host "  ✅ 創建初始化 SQL" -ForegroundColor Green
    }
}

function Start-Services {
    Write-Host "🚀 啟動服務..." -ForegroundColor Yellow
    
    Setup-Environment
    
    try {
        docker compose -f team-pgvector-setup.yml up -d
        
        Write-Host "⏳ 等待服務啟動..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        
        # 檢查服務狀態
        Show-Status
        
        Write-Host "🎉 所有服務已啟動！" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 服務連接資訊:" -ForegroundColor Cyan
        Write-Host "  pgvector 資料庫: localhost:5847" -ForegroundColor White
        Write-Host "  pgAdmin 管理介面: http://localhost:8080" -ForegroundColor White  
        Write-Host "  向量服務 API: http://localhost:8000" -ForegroundColor White
        Write-Host ""
        Write-Host "🔑 登入資訊:" -ForegroundColor Cyan
        Write-Host "  資料庫用戶: admin / qinguoqinchen123" -ForegroundColor White
        Write-Host "  pgAdmin: admin@qinguoqinchen.tw / qinguoqinchen123" -ForegroundColor White
        
    } catch {
        Write-Host "❌ 啟動失敗: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

function Stop-Services {
    Write-Host "🛑 停止服務..." -ForegroundColor Yellow
    docker compose -f team-pgvector-setup.yml down
    Write-Host "✅ 所有服務已停止" -ForegroundColor Green
}

function Restart-Services {
    Write-Host "🔄 重啟服務..." -ForegroundColor Yellow
    Stop-Services
    Start-Sleep -Seconds 5
    Start-Services
}

function Show-Status {
    Write-Host "📊 服務狀態:" -ForegroundColor Yellow
    docker compose -f team-pgvector-setup.yml ps
    
    Write-Host "`n🏥 健康檢查:" -ForegroundColor Yellow
    
    # pgvector 健康檢查
    try {
        $pgHealth = docker exec qinguoqinchen-pgvector pg_isready -U admin -d qinguoqinchen_ai 2>$null
        if ($pgHealth -match "accepting connections") {
            Write-Host "  ✅ pgvector 資料庫: 正常" -ForegroundColor Green
        } else {
            Write-Host "  ❌ pgvector 資料庫: 異常" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ❌ pgvector 資料庫: 未運行" -ForegroundColor Red
    }
    
    # 向量服務健康檢查
    try {
        $vectorHealth = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 5 2>$null
        Write-Host "  ✅ 向量服務: $($vectorHealth.status)" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ 向量服務: 異常或未運行" -ForegroundColor Red
    }
}

function Show-Logs {
    Write-Host "📋 查看服務日誌..." -ForegroundColor Yellow
    docker compose -f team-pgvector-setup.yml logs -f --tail=50
}

function Clean-Environment {
    Write-Host "🧹 清理環境..." -ForegroundColor Yellow
    
    if ($Clean) {
        Write-Host "⚠️  這將刪除所有資料！按 Ctrl+C 取消，或按任意鍵繼續..." -ForegroundColor Red
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
    # 停止並移除容器
    docker compose -f team-pgvector-setup.yml down -v
    
    if ($Clean) {
        # 移除映像
        docker rmi pgvector/pgvector:pg17 dpage/pgadmin4:latest 2>$null
        
        # 清理資料目錄
        if (Test-Path "data") {
            Remove-Item -Recurse -Force "data" 2>$null
        }
        
        Write-Host "✅ 環境完全清理完成" -ForegroundColor Green
    } else {
        Write-Host "✅ 服務已停止" -ForegroundColor Green
    }
}

# 主執行邏輯
Test-Prerequisites

switch ($Action.ToLower()) {
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "status" { Show-Status }
    "logs" { Show-Logs }
    "clean" { Clean-Environment }
    default { 
        Write-Host "❌ 未知操作: $Action" -ForegroundColor Red
        Show-Usage
        exit 1
    }
}
```

#### **Mac/Linux 腳本**

```bash
#!/bin/bash
# team-setup.sh - 侵國侵城 AI 團隊 pgvector 一鍵設置

set -e

ACTION=${1:-start}
CLEAN=${2:-false}

echo "🏛️ 侵國侵城 AI 團隊 pgvector 環境設置"
echo "📅 $(date)"

show_usage() {
    echo "使用方法:"
    echo "  ./team-setup.sh start     # 啟動所有服務"
    echo "  ./team-setup.sh stop      # 停止所有服務"
    echo "  ./team-setup.sh restart   # 重啟所有服務"
    echo "  ./team-setup.sh status    # 查看服務狀態"
    echo "  ./team-setup.sh logs      # 查看日誌"
    echo "  ./team-setup.sh clean     # 清理環境"
}

test_prerequisites() {
    echo "🔍 檢查前置需求..."
    
    # 檢查 Docker
    if command -v docker &> /dev/null; then
        echo "  ✅ Docker: $(docker --version)"
    else
        echo "  ❌ Docker 未安裝"
        exit 1
    fi
    
    # 檢查 Docker Compose
    if docker compose version &> /dev/null; then
        echo "  ✅ Docker Compose: $(docker compose version)"
    else
        echo "  ❌ Docker Compose 未安裝"
        exit 1
    fi
}

setup_environment() {
    echo "📁 設置環境..."
    
    # 創建必要目錄
    mkdir -p sql python-ai data/postgres backups logs
    
    # 創建初始化 SQL
    if [ ! -f "sql/init.sql" ]; then
        cat > sql/init.sql << 'EOF'
-- 侵國侵城 AI pgvector 初始化腳本
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 創建法律文件表
CREATE TABLE IF NOT EXISTS legal_documents (
    id VARCHAR(255) PRIMARY KEY,
    document_id VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1024),
    document_type VARCHAR(100),
    jurisdiction VARCHAR(50),
    law_category VARCHAR(100),
    article_number VARCHAR(50),
    effective_date DATE,
    chunk_index INTEGER DEFAULT 0,
    chunk_type VARCHAR(50),
    metadata JSONB,
    source VARCHAR(255),
    language VARCHAR(10) DEFAULT 'zh-TW',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 創建向量索引
CREATE INDEX IF NOT EXISTS idx_legal_documents_embedding 
    ON legal_documents USING hnsw (embedding vector_cosine_ops);

SELECT '🎉 侵國侵城 AI pgvector 團隊環境初始化完成！' as status;
EOF
        echo "  ✅ 創建初始化 SQL"
    fi
}

start_services() {
    echo "🚀 啟動服務..."
    setup_environment
    
    docker compose -f team-pgvector-setup.yml up -d
    
    echo "⏳ 等待服務啟動..."
    sleep 30
    
    show_status
    
    echo "🎉 所有服務已啟動！"
    echo ""
    echo "📊 服務連接資訊:"
    echo "  pgvector 資料庫: localhost:5847"
    echo "  pgAdmin 管理介面: http://localhost:8080"
    echo "  向量服務 API: http://localhost:8000"
    echo ""
    echo "🔑 登入資訊:"
    echo "  資料庫用戶: admin / qinguoqinchen123"
    echo "  pgAdmin: admin@qinguoqinchen.tw / qinguoqinchen123"
}

stop_services() {
    echo "🛑 停止服務..."
    docker compose -f team-pgvector-setup.yml down
    echo "✅ 所有服務已停止"
}

show_status() {
    echo "📊 服務狀態:"
    docker compose -f team-pgvector-setup.yml ps
    
    echo ""
    echo "🏥 健康檢查:"
    
    # pgvector 健康檢查
    if docker exec qinguoqinchen-pgvector pg_isready -U admin -d qinguoqinchen_ai &> /dev/null; then
        echo "  ✅ pgvector 資料庫: 正常"
    else
        echo "  ❌ pgvector 資料庫: 異常"
    fi
    
    # 向量服務健康檢查
    if curl -s http://localhost:8000/health &> /dev/null; then
        echo "  ✅ 向量服務: 正常"
    else
        echo "  ❌ 向量服務: 異常"
    fi
}

# 主執行邏輯
test_prerequisites

case $ACTION in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        sleep 5
        start_services
        ;;
    status)
        show_status
        ;;
    logs)
        docker compose -f team-pgvector-setup.yml logs -f --tail=50
        ;;
    clean)
        echo "🧹 清理環境..."
        docker compose -f team-pgvector-setup.yml down -v
        if [ "$CLEAN" = "true" ]; then
            docker rmi pgvector/pgvector:pg17 dpage/pgadmin4:latest 2>/dev/null || true
            rm -rf data/
        fi
        echo "✅ 環境清理完成"
        ;;
    *)
        echo "❌ 未知操作: $ACTION"
        show_usage
        exit 1
        ;;
esac
```

## 📚 **團隊使用指南**

### **快速開始指南**

創建 `TEAM_SETUP_GUIDE.md`：

```markdown
# 侵國侵城 AI 團隊 pgvector 環境設置指南

## 🚀 快速開始

### 1. 前置需求
- Docker Desktop (Windows/Mac) 或 Docker Engine (Linux)
- Docker Compose
- 至少 4GB RAM 可用空間

### 2. 一鍵啟動

#### Windows (PowerShell)
```
# 下載設置文件到專案目錄
# 啟動所有服務
.\team-setup.ps1 start
```

#### Mac/Linux (Terminal)
```
# 給予執行權限
chmod +x team-setup.sh

# 啟動所有服務
./team-setup.sh start
```

### 3. 服務訪問

| 服務 | 地址 | 用途 |
|-----|------|------|
| **pgvector 資料庫** | `localhost:5847` | 向量資料庫 |
| **pgAdmin** | `http://localhost:8080` | 資料庫管理介面 |
| **向量服務** | `http://localhost:8000` | AI 向量生成服務 |

### 4. 登入資訊

```
資料庫連接:
  Host: localhost
  Port: 5847
  Database: qinguoqinchen_ai
  Username: admin
  Password: qinguoqinchen123

pgAdmin:
  Email: admin@qinguoqinchen.tw
  Password: qinguoqinchen123
```

## 🛠️ 常用操作

```
# 查看服務狀態
./team-setup.sh status

# 查看日誌
./team-setup.sh logs

# 重啟服務
./team-setup.sh restart

# 停止服務
./team-setup.sh stop

# 完全清理環境
./team-setup.sh clean
```

## 🧪 測試 API

```
# 測試向量服務
curl http://localhost:8000/health

# 測試資料庫連接
```bash
docker exec qinguoqinchen-pgvector psql -U admin -d qinguoqinchen_ai -c "SELECT version();"
```

# 測試 pgvector 功能
```bash
docker exec qinguoqinchen-pgvector psql -U admin -d qinguoqinchen_ai -c "SELECT ''::vector;"[1]
```

## 🔧 故障排除

### 端口衝突
如果端口已被占用，修改 `team-pgvector-setup.yml` 中的端口映射：
```bash
ports:
  - "5848:5432"  # 改為 5848
  - "8081:80"    # 改為 8081
  - "8001:8000"  # 改為 8001
```

### 記憶體不足
調整 PostgreSQL 記憶體設定：
```bash
environment:
  POSTGRES_SHARED_BUFFERS: 128MB  # 降低記憶體使用
  POSTGRES_EFFECTIVE_CACHE_SIZE: 512MB
```

### 數據持久化
團隊共享數據時，將 `./data/postgres` 目錄同步到版本控制或共享儲存。

## 📞 支援

遇到問題請聯繫技術負責人或參考：
- Docker 官方文檔: https://docs.docker.com/
- pgvector 文檔: https://github.com/pgvector/pgvector


## 🎯 **團隊協作建議**

### **1. 版本控制整合**

在 `.gitignore` 中添加：
```gitignore
# Docker 相關
data/postgres/
logs/
*.log

# 但保留配置文件
!team-pgvector-setup.yml
!team-setup.*
!sql/init.sql
```

### **2. 環境變數管理**

創建 `.env.team` 檔案：
```env
# 團隊環境設定
POSTGRES_PASSWORD=qinguoqinchen123
PGADMIN_PASSWORD=qinguoqinchen123
VECTOR_SERVICE_PORT=8000
POSTGRES_PORT=5847
PGADMIN_PORT=8080

# 網路設定
TEAM_NETWORK_SUBNET=192.168.100.0/24
```

### **3. 資料備份和同步**

```bash
# 資料備份腳本
./team-setup.sh backup

# 資料還原腳本  
./team-setup.sh restore backup_file.sql
```

## ✅ **總結**

**是的！您的團隊成員絕對可以用 Docker 啟用 pgvector！**

這個方案提供：
- ✅ **一鍵啟動**：簡單的腳本操作
- ✅ **標準化環境**：所有成員使用相同配置
- ✅ **完整功能**：pgvector + pgAdmin + 向量服務
- ✅ **易於維護**：健康檢查和故障排除
- ✅ **團隊協作**：統一的開發環境
