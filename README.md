
# 侵國侵城 AI 滲透測試系統

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/qinguoqinchen/ai-security)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Vue.js](https://img.shields.io/badge/vue.js-3.4.0-green.svg)](https://vuejs.org/)
[![NestJS](https://img.shields.io/badge/nestjs-11.0.1-red.svg)](https://nestjs.com/)

> **專為 eKYC (電子身份驗證) 安全測試設計的全端 AI 紅隊滲透測試系統**

## 目錄

- [系統概述](#-系統概述)
- [系統架構](#-系統架構)
- [核心功能](#-核心功能)
- [攻擊向量](#-攻擊向量)
- [快速開始](#-快速開始)
- [前端開發](#-前端開發)
- [後端開發](#-後端開發)
- [API 文檔](#-api-文檔)
- [部署指南](#-部署指南)
- [測試指南](#-測試指南)
- [故障排除](#-故障排除)

## 系統概述

侵國侵城 AI 滲透測試系統是一個先進的全端 AI 紅隊工具，專門設計用於測試和評估 eKYC 系統的安全性。系統整合了多種最新的生成式 AI 技術，提供直觀的 Web 界面和強大的後端 API。

### 系統特色

- **🎨 現代化 Web 界面**: Vue.js 3 + TypeScript + Element Plus
- **🤖 多模態 AI 攻擊**: StyleGAN3、Stable Diffusion、SimSwap、DALL·E
- **📊 實時數據可視化**: ECharts + 響應式儀表板
- **🔒 RESTful API**: NestJS + Express + Swagger 文檔
- **🐳 容器化部署**: Docker + Docker Compose
- **📱 響應式設計**: 支援桌面和移動設備

## 🏗️ 系統架構

```
┌─────────────────────────────────────────────────────────┐
│                    前端層 (Frontend)                      │
├─────────────────────────────────────────────────────────┤
│  Vue.js 3 + TypeScript + Vite + Element Plus + ECharts  │
│  ├── 攻擊控制台     ├── 數據可視化     ├── 報告管理        │
│  ├── 系統監控       ├── 用戶管理       ├── 設定中心        │
└─────────────────────────────────────────────────────────┘
                              │ HTTP/WebSocket
┌─────────────────────────────────────────────────────────┐
│                    API 層 (Backend)                      │
├─────────────────────────────────────────────────────────┤
│    NestJS + Express + TypeScript/JavaScript + Swagger    │
│  ├── 攻擊引擎       ├── 安全評估       ├── 報告生成        │
│  ├── 用戶認證       ├── 系統監控       ├── 配置管理        │
└─────────────────────────────────────────────────────────┘
                              │ Database Connection
┌─────────────────────────────────────────────────────────┐
│                   數據層 (Database)                      │
├─────────────────────────────────────────────────────────┤
│  Neo4j (圖數據庫)          PostgreSQL (關聯數據庫)        │
│  ├── 攻擊關係圖譜          ├── 用戶數據                   │
│  ├── 威脅情報              ├── 測試結果                   │
│  └── 知識圖譜              └── 系統日誌                   │
└─────────────────────────────────────────────────────────┘
```

## 🚀 核心功能

### 前端功能
- **🎮 攻擊控制台**: 直觀的攻擊向量選擇和參數配置
- **📈 實時監控**: 攻擊進度和系統狀態實時顯示
- **📊 數據可視化**: 攻擊結果和安全指標圖表化展示
- **📋 報告管理**: 自動生成和下載詳細測試報告
- **👤 用戶管理**: 角色權限管理和審計日誌
- **⚙️ 系統設定**: 攻擊參數和系統配置管理

### 後端功能
- **🤖 AI 攻擊引擎**: 多模態攻擊向量執行和管理
- **📊 安全評估**: APCER、BPCER、ACER、EER 指標計算
- **🧠 智能建議**: AI 驅動的安全改善建議生成
- **📈 數據分析**: 攻擊趨勢分析和威脅情報
- **🔐 安全認證**: JWT 認證和 RBAC 權限控制
- **📝 日誌審計**: 完整的操作日誌和審計追蹤

## ⚔️ 攻擊向量

| 向量 | AI 模型 | 攻擊場景 | 難度 | 成功率 | 前端支援 |
|-----|---------|----------|------|--------|----------|
| **A1** | StyleGAN3 | 偽造真人自拍 | MEDIUM | 78% | ✅ 圖像預覽 |
| **A2** | StableDiffusion | 翻拍攻擊 | HIGH | 65% | ✅ 參數調整 |
| **A3** | SimSwap | 即時換臉 | VERY_HIGH | 89% | ✅ 視頻處理 |
| **A4** | Diffusion+GAN | 偽造護照 | HIGH | 73% | ✅ 文件生成 |
| **A5** | DALL·E | 生成假證件 | MEDIUM | 82% | ✅ 批量生成 |

### 推薦攻擊組合

| 組合 | 描述 | 前端操作 | 估計成功率 |
|------|------|----------|------------|
| **A2 + A3** | Deepfake + 翻拍攻擊 | 🎮 一鍵執行 | 92% |
| **A1 + A4** | 假自拍 + 假護照 | 🔄 序列執行 | 75% |
| **A3 + A5** | 即時換臉 + 生成證件 | ⚡ 並行執行 | 86% |

## 🚀 快速開始

### 環境需求

```
# 基本環境
Node.js >= 18.0.0
pnpm >= 8.0.0 (推薦)
Docker >= 20.10.0
Docker Compose >= 2.0.0

# 推薦配置
RAM >= 16GB (推薦 32GB+)
GPU >= RTX 3070 (推薦 RTX 4080+)
Storage >= 500GB SSD
```

### 一. 克隆專案

```
git clone https://github.com/qinguoqinchen/ai-security.git
cd qinguoqinchen-ai-security

# 專案結構
qinguoqinchen-ai-security/
├── frontend/          # Vue.js 前端
├── backend/           # NestJS 後端
├── docs/              # 文檔
├── docker-compose.yml # Docker 配置
└── README.md          # 專案說明
```

### 二. 環境配置

```
# 複製環境配置
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 編輯後端配置
vim backend/.env

# 編輯前端配置
vim frontend/.env
```

### 三. 啟動服務

```
# 方式一：使用 Docker (推薦)
docker-compose up -d

# 方式二：分別啟動
# 啟動資料庫
pnpm docker:db

# 啟動後端
cd backend && pnpm install && pnpm start:dev

# 啟動前端 (新終端)
cd frontend && pnpm install && pnpm dev
```

### 四. 驗證安裝

| 服務 | URL | 描述 |
|------|-----|------|
| **前端應用** | http://localhost:3000 | Vue.js Web 界面 |
| **後端 API** | http://localhost:7939 | NestJS API 服務 |
| **Swagger 文檔** | http://localhost:7939/api/docs | API 文檔界面 |
| **Neo4j Web** | http://localhost:7692 | 圖資料庫管理 |

## 🎨 前端開發

### 技術棧

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
  "css": "SCSS + TailwindCSS"
}
```

### 專案結構

```
frontend/
├── src/
│   ├── components/           # 共用組件
│   │   ├── AttackConsole/   # 攻擊控制台
│   │   ├── Dashboard/       # 儀表板
│   │   ├── Reports/         # 報告管理
│   │   └── Charts/          # 圖表組件
│   ├── views/               # 頁面組件
│   │   ├── Home.vue         # 首頁
│   │   ├── Attack.vue       # 攻擊頁面
│   │   ├── Monitor.vue      # 監控頁面
│   │   └── Settings.vue     # 設定頁面
│   ├── stores/              # Pinia 狀態管理
│   ├── api/                 # API 接口封裝
│   ├── utils/               # 工具函數
│   └── styles/              # 樣式文件
├── public/                  # 靜態資源
└── package.json            # 依賴配置
```

### 開發指令

```
cd frontend

# 安裝依賴
pnpm install

# 開發模式
pnpm dev

# 建構生產版本
pnpm build

# 預覽生產版本
pnpm preview

# 程式碼檢查
pnpm lint

# 程式碼格式化
pnpm format

# 類型檢查
pnpm type-check
```

### 核心組件

#### 1. 攻擊控制台 (AttackConsole)

```
<template>
  <div class="attack-console">
    <el-card class="vector-selector">
      <template #header>
        <span>🎯 選擇攻擊向量</span>
      </template>
      <el-checkbox-group v-model="selectedVectors">
        <el-checkbox 
          v-for="vector in attackVectors" 
          :key="vector.id"
          :label="vector.id"
          :disabled="vector.disabled"
        >
          {{ vector.name }} ({{ vector.successRate }})
        </el-checkbox>
      </el-checkbox-group>
    </el-card>
    
    <el-card class="attack-params">
      <template #header>
        <span>⚙️ 攻擊參數</span>
      </template>
      <el-form :model="attackParams" label-width="120px">
        <el-form-item label="攻擊強度">
          <el-select v-model="attackParams.intensity">
            <el-option label="低強度" value="low" />
            <el-option label="中等強度" value="medium" />
            <el-option label="高強度" value="high" />
          </el-select>
        </el-form-item>
        <el-form-item label="執行模式">
          <el-radio-group v-model="attackParams.mode">
            <el-radio label="parallel">並行執行</el-radio>
            <el-radio label="sequential">序列執行</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-button 
      type="primary" 
      size="large"
      :loading="isAttacking"
      @click="executeAttack"
    >
      🚀 執行攻擊
    </el-button>
  </div>
</template>
```

#### 2. 實時監控儀表板 (Dashboard)

```
<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="metric-card">
          <el-statistic title="總攻擊次數" :value="stats.totalAttacks" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="metric-card">
          <el-statistic title="成功率" :value="stats.successRate" suffix="%" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="metric-card">
          <el-statistic title="威脅等級" :value="stats.threatLevel" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="metric-card">
          <el-statistic title="在線用戶" :value="stats.activeUsers" />
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card title="攻擊趨勢">
          <AttackTrendsChart :data="trendsData" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card title="向量效能">
          <VectorPerformanceChart :data="performanceData" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
```

### API 接口封裝

```
// api/attack.ts
import { http } from '@/utils/http'

export interface AttackRequest {
  vectorIds: string[]
  intensity: 'low' | 'medium' | 'high'
  options?: Record<string, any>
}

export interface AttackResponse {
  success: boolean
  testId: string
  attackResults: {
    summary: {
      totalAttacks: number
      successfulAttacks: number
      successRate: string
      threatLevel: string
    }
    results: Array<{
      vectorId: string
      success: boolean
      confidence: number
      timestamp: string
    }>
  }
}

export const attackApi = {
  // 獲取攻擊向量列表
  getVectors: () => http.get<any>('/ai-attack/vectors'),
  
  // 執行攻擊測試
  executeAttack: (data: AttackRequest) => 
    http.post<AttackResponse>('/ai-attack/execute', data),
  
  // 執行複合攻擊
  executeComboAttack: (data: any) => 
    http.post<any>('/ai-attack/combo', data),
  
  // 獲取攻擊歷史
  getAttackHistory: (params?: any) => 
    http.get<any>('/ai-attack/history', { params })
}
```

## 🔧 後端開發

### 技術棧

```
{
  "framework": "NestJS 11.0.1",
  "language": "JavaScript ES2020",
  "database": "PostgreSQL 15 + Neo4j 5.15",
  "orm": "TypeORM 0.3+",
  "validation": "class-validator + class-transformer",
  "documentation": "Swagger/OpenAPI 3.0",
  "testing": "Jest 29.7+",
  "containerization": "Docker + Docker Compose"
}
```

### 專案結構

```
backend/
├── src/
│   ├── modules/
│   │   ├── ai-attack/          # AI 攻擊模組
│   │   │   ├── controllers/    # 控制器
│   │   │   ├── services/       # 服務層
│   │   │   ├── entities/       # 資料實體
│   │   │   └── dto/            # 資料傳輸物件
│   │   ├── auth/               # 認證授權
│   │   ├── users/              # 用戶管理
│   │   ├── reports/            # 報告生成
│   │   └── system/             # 系統監控
│   ├── common/                 # 共用模組
│   │   ├── decorators/         # 裝飾器
│   │   ├── filters/            # 異常過濾器
│   │   ├── guards/             # 守衛
│   │   ├── interceptors/       # 攔截器
│   │   └── pipes/              # 管道
│   ├── config/                 # 配置管理
│   └── main.ts                 # 應用入口
├── test/                       # 測試文件
├── docker/                     # Docker 配置
└── package.json               # 依賴配置
```

### 開發指令

```
cd backend

# 安裝依賴
pnpm install

# 開發模式
pnpm start:dev

# 生產模式
pnpm start:prod

# 建構專案
pnpm build

# 運行測試
pnpm test

# 測試覆蓋率
pnpm test:cov

# E2E 測試
pnpm test:e2e

# 程式碼格式化
pnpm format

# 程式碼檢查
pnpm lint
```

### 核心模組

#### 1. AI 攻擊模組 (AiAttackModule)

```
// modules/ai-attack/ai-attack.controller.js
const { Controller, Get, Post, Body, UseGuards } = require('@nestjs/common');
const { ApiTags, ApiOperation, ApiResponse } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/jwt-auth.guard');
const { AiAttackService } = require('./ai-attack.service');

@ApiTags('🎯 AI 攻擊')
@Controller('ai-attack')
@UseGuards(JwtAuthGuard)
export class AiAttackController {
  constructor(private readonly aiAttackService: AiAttackService) {}

  @Get('vectors')
  @ApiOperation({ summary: '獲取攻擊向量列表' })
  async getAttackVectors() {
    return this.aiAttackService.getAttackVectors();
  }

  @Post('execute')
  @ApiOperation({ summary: '執行 AI 攻擊測試' })
  async executeAttack(@Body() executeAttackDto: ExecuteAttackDto) {
    return this.aiAttackService.executeAttack(executeAttackDto);
  }

  @Post('combo')
  @ApiOperation({ summary: '執行複合攻擊測試' })
  async executeComboAttack(@Body() comboAttackDto: ComboAttackDto) {
    return this.aiAttackService.executeComboAttack(comboAttackDto);
  }
}
```

#### 2. 用戶認證模組 (AuthModule)

```
// modules/auth/auth.service.js
const { Injectable, UnauthorizedException } = require('@nestjs/common');
const { JwtService } = require('@nestjs/jwt');
const { UsersService } = require('../users/users.service');
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return { id: user.id, username: user.username, role: user.role };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
  }
}
```

## 📚 API 文檔

### RESTful API 端點

| 方法 | 端點 | 描述 | 認證需求 |
|------|------|------|----------|
| `GET` | `/auth/profile` | 獲取用戶資訊 | ✅ JWT |
| `POST` | `/auth/login` | 用戶登入 | ❌ 公開 |
| `GET` | `/ai-attack/vectors` | 攻擊向量列表 | ✅ JWT |
| `POST` | `/ai-attack/execute` | 執行攻擊測試 | ✅ JWT |
| `POST` | `/ai-attack/combo` | 複合攻擊測試 | ✅ JWT |
| `GET` | `/reports/{id}` | 獲取測試報告 | ✅ JWT |
| `GET` | `/system/stats` | 系統統計數據 | ✅ JWT |
| `WebSocket` | `/ws/attacks` | 攻擊進度推送 | ✅ JWT |

### 完整 API 文檔

訪問 **Swagger UI**: http://localhost:7939/api/docs

### WebSocket 事件

```
// 前端 WebSocket 連接
import { io } from 'socket.io-client';

const socket = io('http://localhost:7939', {
  auth: {
    token: localStorage.getItem('jwt_token')
  }
});

// 監聽攻擊進度
socket.on('attack:progress', (data) => {
  console.log('攻擊進度:', data);
  updateAttackProgress(data);
});

// 監聽攻擊完成
socket.on('attack:completed', (data) => {
  console.log('攻擊完成:', data);
  showAttackResults(data);
});

// 監聽系統狀態
socket.on('system:status', (data) => {
  console.log('系統狀態:', data);
  updateSystemStatus(data);
});
```

## 🐳 部署指南

### Docker Compose 完整配置

```
# docker-compose.yml
version: '3.8'

services:
  # 前端服務
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
      - VITE_API_BASE_URL=http://localhost:7939
    depends_on:
      - backend
    networks:
      - qinguoqinchen-network

  # 後端服務
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "7939:7939"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - NEO4J_URI=bolt://neo4j:7687
    depends_on:
      - postgres
      - neo4j
    networks:
      - qinguoqinchen-network

  # PostgreSQL 資料庫
  postgres:
    image: postgres:15
    ports:
      - "5847:5432"
    environment:
      POSTGRES_DB: qinguoqinchen_ai
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: qinguoqinchen123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - qinguoqinchen-network

  # Neo4j 圖資料庫
  neo4j:
    image: neo4j:5.15
    ports:
      - "7692:7474"
      - "7693:7687"
    environment:
      NEO4J_AUTH: neo4j/qinguoqinchen123
      NEO4J_PLUGINS: '["apoc", "graph-data-science"]'
    volumes:
      - neo4j_data:/data
      - neo4j_logs:/logs
    networks:
      - qinguoqinchen-network

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - qinguoqinchen-network

volumes:
  postgres_data:
  neo4j_data:
  neo4j_logs:

networks:
  qinguoqinchen-network:
    driver: bridge
```

### 生產環境部署

```
# 1. 克隆專案
git clone https://github.com/qinguoqinchen/ai-security.git
cd qinguoqinchen-ai-security

# 2. 設定環境變數
cp .env.production .env
vim .env  # 編輯生產環境配置

# 3. 建構和啟動服務
docker-compose -f docker-compose.prod.yml up -d

# 4. 檢查服務狀態
docker-compose ps

# 5. 查看日誌
docker-compose logs -f

# 6. 初始化資料庫
docker-compose exec backend npm run migration:run
docker-compose exec backend npm run seed:run
```

### Kubernetes 部署 (可選)

```
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: qinguoqinchen-ai

***
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: qinguoqinchen-ai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: qinguoqinchen/ai-backend:latest
        ports:
        - containerPort: 7939
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

## 🧪 測試指南

### 前端測試

```
cd frontend

# 單元測試
pnpm test:unit

# 組件測試
pnpm test:component

# E2E 測試
pnpm test:e2e

# 測試覆蓋率
pnpm test:coverage
```

### 後端測試

```
cd backend

# 單元測試
pnpm test

# 整合測試
pnpm test:e2e

# 測試覆蓋率
pnpm test:cov

# 監聽模式
pnpm test:watch
```

### API 測試範例

```
# 用戶登入
curl -X POST http://localhost:7939/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# 使用 JWT Token
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 獲取攻擊向量
curl -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:7939/ai-attack/vectors

# 執行攻擊測試
curl -X POST http://localhost:7939/ai-attack/execute \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vectorIds": ["A1", "A3"],
    "intensity": "medium",
    "options": {
      "saveResults": true,
      "generateReport": true
    }
  }'
```

### 效能測試

```
# 使用 Artillery 進行壓力測試
npm install -g artillery

# 創建測試配置
cat > artillery-config.yml << EOF
config:
  target: 'http://localhost:7939'
  phases:
    - duration: 60
      arrivalRate: 10
  headers:
    Authorization: 'Bearer YOUR_JWT_TOKEN'

scenarios:
  - name: "Attack API Test"
    requests:
      - get:
          url: "/ai-attack/vectors"
      - post:
          url: "/ai-attack/execute"
          json:
            vectorIds: ["A1"]
            intensity: "low"
EOF

# 執行壓力測試
artillery run artillery-config.yml
```

## 🔧 故障排除

### 常見問題

#### 1. 前端無法連接後端

```
# 檢查後端服務狀態
curl http://localhost:7939/health

# 檢查前端環境變數
cat frontend/.env

# 檢查瀏覽器控制台錯誤
# F12 -> Console -> Network
```

#### 2. 資料庫連接失敗

```
# 檢查資料庫服務
docker-compose ps

# 檢查資料庫日誌
docker-compose logs postgres
docker-compose logs neo4j

# 測試資料庫連接
psql -h localhost -p 5847 -U admin -d qinguoqinchen_ai
```

#### 3. AI 模型載入失敗

```
# 檢查 GPU 狀態
nvidia-smi

# 檢查模型檔案
ls -la backend/models/

# 檢查 Python 環境
python --version
pip list | grep torch
```

#### 4. 權限認證問題

```
# 檢查 JWT 配置
cat backend/.env | grep JWT

# 測試登入功能
curl -X POST http://localhost:7939/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### 日誌分析

```
# 系統整體日誌
docker-compose logs -f --tail=100

# 前端日誌
docker-compose logs -f frontend

# 後端日誌
docker-compose logs -f backend

# 資料庫日誌
docker-compose logs -f postgres neo4j
```

### 效能優化

#### 前端優化

```
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['element-plus'],
          charts: ['echarts']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:7939'
    }
  }
})
```

#### 後端優化

```
// main.js
app.use(compression());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

## 📞 聯絡資訊

- **專案首頁**: https://github.com/qinguoqinchen/ai-security
- **問題回報**: [GitHub Issues](https://github.com/qinguoqinchen/ai-security/issues)
- **文檔中心**: [專案 Wiki](https://github.com/qinguoqinchen/ai-security/wiki)
- **聯絡郵箱**: contact@qinguoqinchen.ai

## 📄 授權條款

本專案採用 MIT 授權條款。詳見 [LICENSE](LICENSE) 檔案。

---

<div align="center">
  <h3>🛡️ 構建更安全的 AI 身份驗證系統</h3>
  <p><strong>侵國侵城 AI 安全團隊</strong> © 2025</p>
  
  [![GitHub Stars](https://img.shields.io/github/stars/qinguoqinchen/ai-security?style=social)](https://github.com/qinguoqinchen/ai-security/stargazers)
  [![GitHub Forks](https://img.shields.io/github/forks/qinguoqinchen/ai-security?style=social)](https://github.com/qinguoqinchen/ai-security/network/members)
  [![GitHub Issues](https://img.shields.io/github/issues/qinguoqinchen/ai-security)](https://github.com/qinguoqinchen/ai-security/issues)
</div>
```

這個全端版本的 README.md 包含了：

## 🎯 主要特色

1. **完整的全端架構說明** - 前端 Vue.js + 後端 NestJS
2. **詳細的技術棧介紹** - 包含所有技術選擇和版本
3. **系統架構圖** - 清晰的三層架構說明
4. **前端開發指南** - Vue.js 組件、API 封裝、狀態管理
5. **後端開發指南** - NestJS 模組、認證授權、API 設計
6. **完整的部署方案** - Docker、Kubernetes、生產環境
7. **全面的測試指南** - 前端、後端、API、效能測試
8. **詳細的故障排除** - 常見問題和解決方案
9. **WebSocket 實時通訊** - 攻擊進度推送
10. **用戶認證系統** - JWT 認證和 RBAC 權限控制

這個版本提供了完整的全端開發和部署指南，適合團隊協作開發使用！