<!-- pages/reports.vue -->
<template>
  <div class="reports-container">
    <!-- Loading 狀態 -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>載入報告中...</p>
    </div>

    <!-- 報告內容 -->
    <div v-else-if="result">
      <!-- 統計概覽 -->
      <div class="stats-grid">
        <!-- ✅ 移除 @click="animateCard" -->
        <div class="stat-card critical">
          <div class="stat-number" ref="criticalCount">
            {{ calculateCriticalCount() }}
          </div>
          <div class="stat-label">Critical 漏洞</div>
        </div>
        <div class="stat-card high">
          <div class="stat-number" ref="highCount">
            {{ result.executiveSummary.successfulAttacks }}
          </div>
          <div class="stat-label">成功攻擊</div>
        </div>
        <div class="stat-card medium">
          <div class="stat-number" ref="mediumCount">
            {{ result.executiveSummary.failedAttacks }}
          </div>
          <div class="stat-label">失敗攻擊</div>
        </div>
        <div class="stat-card low">
          <div class="stat-number" ref="lowCount">
            {{ result.executiveSummary.totalVectors }}
          </div>
          <div class="stat-label">測試向量</div>
        </div>
      </div>

      <!-- 風險趨勢圖表 -->
      <!-- <div class="chart-container">
        <h3 class="chart-title">🔥 安全風險趨勢分析</h3>
        <div id="riskTrendChart" class="chart-element"></div>
      </div> -->

      <!-- 報告列表 -->
      <div class="reports-table">
        <div class="table-header">
          <span>🔒 安全評估報告</span>
          <button @click="navigateToPentest" class="generate-btn">
            生成新報告
          </button>
        </div>

        <!-- 表頭 -->
        <div class="reports-grid table-head">
          <div>報告名稱</div>
          <div>狀態</div>
          <div>風險等級</div>
          <div>生成日期</div>
          <div>操作</div>
        </div>

        <!-- 當前報告 -->
        <div class="reports-grid report-row">
          <div class="report-title">
            📋 侵國侵城 AI 滲透測試報告
          </div>
          <div>
            <span class="report-status status-completed">完成</span>
          </div>
          <div :class="getRiskClass(result.executiveSummary.riskLevel)">
            {{ result.executiveSummary.riskLevel }}
          </div>
          <div class="report-date">
            {{ formatDate(result.metadata.generatedAt) }}
          </div>
          <div class="action-buttons">
      <button 
        v-if="result.downloads.pdfReport" 
        @click="downloadReport('pdf')"
        class="download-btn pdf-btn"
      >
        📄 下載 PDF
      </button>
      <button 
        v-if="result.downloads.excelReport" 
        @click="downloadReport('excel')"
        class="download-btn excel-btn"
      >
        📊 下載 Excel
      </button>
    </div>
        </div>
      </div>

     <!-- AI 智能摘要 -->
<div class="ai-summary-container">
  <h3 class="summary-title">🤖 AI 智能報告摘要</h3>
  <div class="summary-grid">

    <!-- Grok 滲透測試分析 -->
    <div class="summary-card">
      <h4 class="summary-card-title success-title">
        滲透測試分析
      </h4>
      <div class="summary-content">
        {{ truncateText(result.grokReports.pentestReport.content, 300) }}
      </div>
      <button @click="showFullReport('grok')" class="view-more-btn">
        查看完整分析 →
      </button>
    </div>

    <!-- 下次滲透攻擊建議 -->
    <div class="summary-card">
      <h4 class="summary-card-title warning-title">
        下次滲透攻擊建議
      </h4>
      <div class="summary-content">
        <p v-if="result.grokReports.attackRecommendations && result.grokReports.attackRecommendations.content">
          {{ truncateText(result.grokReports.attackRecommendations.content, 300) }}
        </p>
        <p v-else class="no-data">尚未產生攻擊建議...</p>
      </div>
      <button @click="showFullReport('attackRecommendations')" class="view-more-btn">
        查看完整建議 →
      </button>
    </div>

    <!-- 執行摘要 -->
    <div class="summary-card">
      <h4 class="summary-card-title info-title">
        執行摘要
      </h4>
      <ul class="summary-list">
        <li>• 測試時間: {{ result.executiveSummary.testDuration }}</li>
        <li>• 成功率: {{ result.executiveSummary.overallSuccessRate }}</li>
        <li>• 風險等級: {{ result.executiveSummary.riskLevel }}</li>
        <li>• Session ID: {{ result.sessionId }}</li>
      </ul>
    </div>
  </div>
</div>


      <!-- 返回按鈕 -->
      <div class="action-footer">
        <button @click="navigateToPentest" class="nav-btn primary-btn">
          🚀 返回測試頁面
        </button>
        <button @click="navigateToDashboard" class="nav-btn secondary-btn">
          📊 返回主控台
        </button>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>找不到測試結果</h2>
      <p>請先執行滲透測試以生成報告</p>
      <button @click="navigateToPentest" class="nav-btn primary-btn">
        返回測試頁面
      </button>
    </div>

    <!-- 完整報告模態框 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <pre class="modal-text">{{ modalContent }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from '#app'
import * as echarts from 'echarts'

const router = useRouter()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:7939'

// State
const result = ref<any>(null)
const loading = ref(true)
const showModal = ref(false)
const modalTitle = ref('')
const modalContent = ref('')

// 載入報告
onMounted(async () => {
  const storedResult = localStorage.getItem('pentestResult')
  
  if (storedResult) {
    result.value = JSON.parse(storedResult)
    await nextTick()
    initChart()
    animateNumbers()
  }
  
  loading.value = false
})

// 初始化圖表
function initChart() {
  const chartDom = document.getElementById('riskTrendChart')
  if (!chartDom) return

  const myChart = echarts.init(chartDom)

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#39FF14',
      textStyle: { color: '#FFFFFF' }
    },
    legend: {
      data: ['Critical', 'High', 'Medium', 'Low'],
      textStyle: { color: '#D7BD82' },
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: generateDateRange(),
      axisLine: { lineStyle: { color: '#D7BD82' } },
      axisLabel: { color: '#D7BD82' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#D7BD82' } },
      axisLabel: { color: '#D7BD82' },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    series: [
      {
        name: 'Critical',
        type: 'line',
        data: [1, 2, 2, 3, 3, 3],
        smooth: true,
        itemStyle: { color: '#FF4444' },
        areaStyle: { color: 'rgba(255, 68, 68, 0.2)' }
      },
      {
        name: 'High',
        type: 'line',
        data: [8, 10, 11, 12, 12, 12],
        smooth: true,
        itemStyle: { color: '#D17000' },
        areaStyle: { color: 'rgba(209, 112, 0, 0.2)' }
      },
      {
        name: 'Medium',
        type: 'line',
        data: [20, 22, 25, 27, 28, 28],
        smooth: true,
        itemStyle: { color: '#D7BD82' },
        areaStyle: { color: 'rgba(215, 189, 130, 0.2)' }
      },
      {
        name: 'Low',
        type: 'line',
        data: [40, 42, 43, 44, 45, 45],
        smooth: true,
        itemStyle: { color: '#39FF14' },
        areaStyle: { color: 'rgba(57, 255, 20, 0.2)' }
      }
    ]
  }

  myChart.setOption(option)

  // 響應式調整
  window.addEventListener('resize', () => myChart.resize())
}
function showFullReport(type: 'grok' | 'attackRecommendations') {
  showModal.value = true

  if (type === 'grok') {
    modalTitle.value = 'Grok AI 完整滲透測試分析'
    modalContent.value = result.value.grokReports.pentestReport.content
  } else if (type === 'attackRecommendations') {
    modalTitle.value = '紅隊下次攻擊策略建議'
    modalContent.value = result.value.grokReports.attackRecommendations.content || '尚未產生攻擊建議...'
  }
}

// 生成日期範圍
function generateDateRange(): string[] {
  const dates: string[] = []
  const today = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' }))
  }
  
  return dates
}

// 數字動畫
function animateNumbers() {
  const numbers = document.querySelectorAll('.stat-number')
  
  numbers.forEach(el => {
    const target = parseInt(el.textContent || '0')
    let current = 0
    const increment = target / 50

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      el.textContent = Math.floor(current).toString()
    }, 30)
  })
}

// 計算 Critical 數量
function calculateCriticalCount(): number {
  if (!result.value) return 0
  return result.value.executiveSummary.successfulAttacks > 0 ? 3 : 0
}

// 格式化日期
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 獲取風險等級樣式
function getRiskClass(riskLevel: string): string {
  const level = riskLevel.toLowerCase()
  return `risk-${level}`
}

// 截取文字
function truncateText(text: string, length: number): string {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// 下載報告
function downloadReport(format: 'pdf' | 'excel') {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:7939'
  
  // ✅ 從 result 中取得完整 URL
  let downloadUrl = format === 'pdf' 
    ? result.value.downloads.pdfReport
    : result.value.downloads.excelReport

  if (downloadUrl) {
    // ✅ 如果 URL 是相對路徑,加上 apiBaseUrl
    if (downloadUrl.startsWith('/reports/')) {
      downloadUrl = `${apiBaseUrl}${downloadUrl}`
    }
    
    console.log('📥 下載 URL:', downloadUrl)
    window.open(downloadUrl, '_blank')
  } else {
    alert(`${format.toUpperCase()} 報告尚未生成`)
  }
}


// 關閉模態框
function closeModal() {
  showModal.value = false
}

// 導航
function navigateToPentest() {
  router.push('/pentest')
}

function navigateToDashboard() {
  router.push('/')
}
</script>

<style scoped>
@import '@/assets/css/reports.css';

/* 額外樣式 */
.chart-element {
  height: 350px;
  margin-top: 1rem;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(57, 255, 20, 0.3);
  border-top-color: var(--neon-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 4rem 2rem;
}

.error-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

/* 模態框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-card);
  border: 2px solid var(--neon-cyan);
  border-radius: 15px;
  max-width: 900px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  background: linear-gradient(90deg, var(--neon-cyan), var(--neon-green));
  color: var(--bg-dark);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  color: var(--bg-dark);
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
}

.modal-text {
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  color: var(--text-glow);
  line-height: 1.6;
}

/* CSS 變數 (如果你的 reports.css 沒有定義) */
:root {
  --neon-green: #39FF14;
  --neon-cyan: #00FFFF;
  --bg-card: #0A0F1C;
  --bg-dark: #000811;
  --text-glow: #FFFFFF;
}


/* ========================================
   統計卡片美化
   ======================================== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: linear-gradient(135deg, rgba(10, 15, 28, 0.9), rgba(15, 25, 45, 0.8));
  border: 2px solid;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
}

.stat-card.critical {
  border-color: #FF4444;
  box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
}

.stat-card.high {
  border-color: #D17000;
  box-shadow: 0 0 20px rgba(209, 112, 0, 0.3);
}

.stat-card.medium {
  border-color: #D7BD82;
  box-shadow: 0 0 20px rgba(215, 189, 130, 0.3);
}

.stat-card.low {
  border-color: #39FF14;
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px currentColor;
  font-family: 'Orbitron', monospace;
}

.stat-card.critical .stat-number {
  color: #FF4444;
}

.stat-card.high .stat-number {
  color: #D17000;
}

.stat-card.medium .stat-number {
  color: #D7BD82;
}

.stat-card.low .stat-number {
  color: #39FF14;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* ========================================
   圖表容器美化
   ======================================== */
.chart-container {
  background: linear-gradient(135deg, rgba(10, 15, 28, 0.9), rgba(15, 25, 45, 0.8));
  border: 2px solid #D7BD82;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 0 30px rgba(215, 189, 130, 0.2);
}

.chart-title {
  color: #D7BD82;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-weight: 700;
  text-shadow: 0 0 15px rgba(215, 189, 130, 0.5);
}

.chart-element {
  height: 350px;
  margin-top: 1rem;
}

/* ========================================
   AI 智能摘要區域 - 完全重構
   ======================================== */
.ai-summary-container {
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.08), rgba(57, 255, 20, 0.08));
  border: 2px solid var(--neon-cyan);
  border-radius: 15px;
  padding: 2.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.ai-summary-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.05) 0%, transparent 70%);
  animation: pulse-glow 4s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.summary-title {
  color: var(--neon-cyan);
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 1;
}

/* 摘要卡片美化 */
.summary-card {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(10, 15, 28, 0.8));
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, currentColor, transparent);
  opacity: 0;
  transition: opacity 0.4s;
}

.summary-card:hover::before {
  opacity: 1;
}

.summary-card:hover {
  border-color: var(--neon-cyan);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 255, 255, 0.3);
}

/* 卡片標題 */
.summary-card-title {
  margin-bottom: 1.5rem;
  font-size: 1.15rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 0 15px currentColor;
}

.success-title {
  color: var(--neon-green);
}

.warning-title {
  color: #FF4444;
}

.info-title {
  color: #D7BD82;
}

/* 摘要內容 */
.summary-content {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  min-height: 120px;
  max-height: 180px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.summary-content::-webkit-scrollbar {
  width: 4px;
}

.summary-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

.summary-content::-webkit-scrollbar-thumb {
  background: var(--neon-cyan);
  border-radius: 2px;
}

.no-data {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

/* 摘要列表 */
.summary-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.summary-list li {
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  transition: all 0.3s;
}

.summary-list li:last-child {
  border-bottom: none;
}

.summary-list li:hover {
  color: var(--neon-cyan);
  padding-left: 0.5rem;
}

/* 查看更多按鈕 */
.view-more-btn {
  width: 100%;
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(57, 255, 20, 0.15));
  border: 2px solid var(--neon-cyan);
  color: var(--neon-cyan);
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.view-more-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(0, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.view-more-btn:hover::before {
  width: 300px;
  height: 300px;
}

.view-more-btn:hover {
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(57, 255, 20, 0.3));
  border-color: var(--neon-green);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 255, 255, 0.4);
}

.view-more-btn:active {
  transform: translateY(0);
}

/* ========================================
   報告表格美化
   ======================================== */
.reports-table {
  background: linear-gradient(135deg, rgba(10, 15, 28, 0.9), rgba(15, 25, 45, 0.8));
  border: 2px solid var(--neon-cyan);
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 2.5rem;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
}

.table-header {
  background: linear-gradient(90deg, var(--neon-cyan), var(--neon-green));
  color: var(--bg-dark);
  padding: 1.5rem 2rem;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}

.generate-btn {
  background: var(--brand-orange);
  border: none;
  padding: 0.7rem 1.8rem;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(209, 112, 0, 0.4);
}

.generate-btn:hover {
  background: #B85F00;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(209, 112, 0, 0.6);
}

/* 下載按鈕 */
.action-buttons {
  display: flex;
  gap: 0.8rem;
}

.download-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.3s;
  color: white;
}

.pdf-btn {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.pdf-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.5);
}

.excel-btn {
  background: linear-gradient(135deg, #27ae60, #229954);
  box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
}

.excel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(39, 174, 96, 0.5);
}

/* 風險等級樣式 */
.risk-critical {
  color: #FF4444;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
}

.risk-high {
  color: #D17000;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(209, 112, 0, 0.5);
}

.risk-medium {
  color: #D7BD82;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(215, 189, 130, 0.5);
}

.risk-low {
  color: #39FF14;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
}

/* 返回按鈕 */
.action-footer {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2rem;
}

.nav-btn {
  padding: 1rem 2.5rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s;
}

.primary-btn {
  background: linear-gradient(135deg, var(--neon-cyan), var(--neon-green));
  color: var(--bg-dark);
  box-shadow: 0 5px 20px rgba(0, 255, 255, 0.3);
}

.primary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 255, 255, 0.5);
}

.secondary-btn {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.secondary-btn:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-color: var(--neon-cyan);
  transform: translateY(-3px);
}

/* CSS 變數 */
:root {
  --neon-green: #39FF14;
  --neon-cyan: #00FFFF;
  --brand-orange: #D17000;
  --bg-card: #0A0F1C;
  --bg-dark: #000811;
  --text-glow: #FFFFFF;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-footer {
    flex-direction: column;
  }

  .nav-btn {
    width: 100%;
  }
}
</style>