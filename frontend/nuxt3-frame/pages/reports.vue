<template>
    <div class="reports-container">
    <!-- 統計概覽 -->
    <div class="stats-grid">
      <div class="stat-card critical">
        <div class="stat-number" data-value="3">3</div>
        <div>Critical 漏洞</div>
      </div>
      <div class="stat-card high">
        <div class="stat-number" data-value="12">12</div>
        <div>High 風險</div>
      </div>
      <div class="stat-card medium">
        <div class="stat-number" data-value="28">28</div>
        <div>Medium 風險</div>
      </div>
      <div class="stat-card low">
        <div class="stat-number" data-value="45">45</div>
        <div>Low 風險</div>
      </div>
    </div>

    <!-- 風險趨勢圖表 -->
    <div class="chart-container">
      <h3 style="color: var(--brand-gold); margin-bottom: 1rem;"> 安全風險趨勢分析</h3>
      <div id="riskTrendChart" style="height: 300px;"></div>
    </div>

    <!-- 報告列表 -->
    <div class="reports-table">
      <div class="table-header">
        <span> 安全評估報告</span>
        <button
          style="background: var(--brand-orange); border: none; padding: 0.5rem 1rem; border-radius: 5px; color: white; cursor: pointer;">生成新報告</button>
      </div>

      <div class="reports-grid" style="font-weight: 700; background: rgba(255, 255, 255, 0.05);">
        <div>報告名稱</div>
        <div>狀態</div>
        <div>風險等級</div>
        <div>生成日期</div>
        <div>操作</div>
      </div>

      <div class="reports-grid">
        <div class="report-title">eKYC 系統滲透測試報告</div>
        <div><span class="report-status status-completed">完成</span></div>
        <div style="color: #FF4444; font-weight: 700;">Critical</div>
        <div>2025-09-15</div>
        <div>
          <button class="download-btn">📥 下載</button>
        </div>
      </div>

      <div class="reports-grid">
        <div class="report-title">Web 應用程式安全掃描</div>
        <div><span class="report-status status-processing">處理中</span></div>
        <div style="color: var(--brand-orange); font-weight: 700;">High</div>
        <div>2025-09-16</div>
        <div>
          <button class="download-btn" disabled style="opacity: 0.5;">⏳ 等待</button>
        </div>
      </div>

      <div class="reports-grid">
        <div class="report-title">AI 模型安全評估報告</div>
        <div><span class="report-status status-completed">完成</span></div>
        <div style="color: var(--brand-gold); font-weight: 700;">Medium</div>
        <div>2025-09-14</div>
        <div>
          <button class="download-btn">📥 下載</button>
        </div>
      </div>

      <div class="reports-grid">
        <div class="report-title">資料庫安全檢測報告</div>
        <div><span class="report-status status-completed">完成</span></div>
        <div style="color: var(--neon-green); font-weight: 700;">Low</div>
        <div>2025-09-13</div>
        <div>
          <button class="download-btn">📥 下載</button>
        </div>
      </div>
    </div>

    <!-- AI 智能摘要 -->
    <div
      style="background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(57, 255, 20, 0.1)); border: 2px solid var(--neon-cyan); border-radius: 15px; padding: 2rem;">
      <h3 style="color: var(--neon-cyan); margin-bottom: 1rem;"> AI 智能報告摘要</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        <div>
          <h4 style="color: var(--neon-green); margin-bottom: 0.5rem;"> 安全狀況良好</h4>
          <ul style="list-style: none; font-size: 0.9rem;">
            <li>• 防火牆配置正確</li>
            <li>• SSL/TLS 憑證有效</li>
            <li>• 存取控制機制完善</li>
          </ul>
        </div>
        <div>
          <h4 style="color: #FF4444; margin-bottom: 0.5rem;"> 需要立即處理</h4>
          <ul style="list-style: none; font-size: 0.9rem;">
            <li>• SQL 注入漏洞 (Critical)</li>
            <li>• 過期的軟體版本</li>
            <li>• 弱密碼政策</li>
          </ul>
        </div>
        <div>
          <h4 style="color: var(--brand-orange); margin-bottom: 0.5rem;"> 計畫改善項目</h4>
          <ul style="list-style: none; font-size: 0.9rem;">
            <li>• 啟用多因素驗證</li>
            <li>• 更新安全政策</li>
            <li>• 員工安全培訓</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style src="@/assets/css/reports.css"></style>
<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { nextTick } from 'vue'
import * as echarts from 'echarts'
function getCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

let myChart = null

function simulateReportGeneration() {
  const processingRows = document.querySelectorAll('.status-processing')

  processingRows.forEach(status => {
    setTimeout(() => {
      status.textContent = '完成'
      status.className = 'report-status status-completed'

      const downloadBtn = status.closest('.reports-grid')?.querySelector('.download-btn')
      if (downloadBtn) {
        downloadBtn.disabled = false
        downloadBtn.style.opacity = '1'
        downloadBtn.textContent = '📥 下載'
      }
    }, Math.random() * 10000 + 5000)
  })
}

const statValues = [3, 12, 28, 45] // 正確數值（依照你的 template 順序）


function animateStatNumbers() {
  if (isAnimating) return
  isAnimating = true

  const statNumbers = document.querySelectorAll('.stat-number')
  console.log('animateStatNumbers, found:', statNumbers.length)
  const duration = 2500

  statNumbers.forEach((stat, idx) => {
  const target = parseInt(stat.dataset.value || '0', 10)
  let current = 0
  let startTime = null

  function step(timestamp) {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / duration, 1)
    current = Math.floor(progress * target)
    stat.textContent = current

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      stat.textContent = target
      if (idx === statNumbers.length - 1) {
        isAnimating = false
      }
    }
  }

  requestAnimationFrame(step)
})}






function initChart() {
  const chartDom = document.getElementById('riskTrendChart')
  if (!chartDom) return

  myChart = echarts.init(chartDom)

  const option = {
    
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top: 30,
      textStyle: { color: getCssVar('--brand-gold') }
    },
    xAxis: {
      type: 'category',
      data: ['2025-09-12', '2025-09-13', '2025-09-14', '2025-09-15', '2025-09-16', '2025-09-17'],
      axisLine: { lineStyle: { color: getCssVar('--brand-gold') } },
      axisLabel: { color: getCssVar('--brand-gold') }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: { lineStyle: { color: getCssVar('--brand-gold') } },
      axisLabel: { color: getCssVar('--brand-gold') }
    },
    series: [
      {
        name: 'Critical',
        type: 'line',
        data: [1, 2, 2, 3, 3, 3],
        itemStyle: { color: '#FF4444' },
        smooth: true
      },
      {
        name: 'High',
        type: 'line',
        data: [8, 10, 11, 12, 12, 12],
        itemStyle: { color: getCssVar('--brand-orange') },
        smooth: true
      },
      {
        name: 'Medium',
        type: 'line',
        data: [20, 22, 25, 27, 28, 28],
        itemStyle: { color: getCssVar('--brand-gold') },
        smooth: true
      },
      {
        name: 'Low',
        type: 'line',
        data: [40, 42, 43, 44, 45, 45],
        itemStyle: { color: getCssVar('--neon-green') },
        smooth: true
      }
    ]
  }

  myChart.setOption(option)
}

function handleResize() {
  if (myChart) {
    myChart.resize()
  }
}

onMounted(() => {
  simulateReportGeneration()

  nextTick(() => {
    animateStatNumbers() // 這時才跑動畫，DOM 應該已經準備好
  })

  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
})
</script>
