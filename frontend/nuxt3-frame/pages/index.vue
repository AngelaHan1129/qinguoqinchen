<template>
    <!-- Main Container -->
  <div class="container">
    <div class="cyber-grid">
      
      <!-- 系統掃描卡片 -->
      <div class="cyber-card">
        <div class="scan-line"></div>
        <div class="card-header">
          <div class="card-icon">🎯</div>
          <h3 class="card-title">System Scanner</h3>
        </div>
        <div style="margin: 1.5rem 0;">
          <p style="margin-bottom: 1rem; color: var(--brand-gold);">選擇滲透測試目標：</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
            <input
              v-model="urlInput"
              type="text"
              placeholder="請輸入目標 URL"
              style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;"
            />
            <input
              type="file"
              @change="handleFileInput"
              style="width: 100%; padding: 0.5rem;"
            />
          </div>
        </div>
        <div class="data-stream"><div class="data-flow"></div></div>
        <button class="cyber-btn" style="width: 100%;" @click="startPentest"> START PENTEST</button>

      </div>

      <!-- 威脅分析卡片 -->
      <div class="cyber-card" v-if="pentestStore.started">
        <div class="card-header">
          <div class="card-icon">⚠️</div>
          <h3 class="card-title">Threat Analysis</h3>
        </div>
        <div style="margin: 1.5rem 0;">
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
            <span class="risk-badge risk-critical">Critical (3)</span>
            <span class="risk-badge risk-high">High (7)</span>
            <span class="risk-badge risk-medium">Medium (12)</span>
            <span class="risk-badge risk-low">Low (25)</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; text-align: center;">
            <div>
              <div class="stat-number">98.7%</div>
              <div style="color: var(--brand-gold);">System Integrity</div>
            </div>
            <div>
              <div class="stat-number">47</div>
              <div style="color: var(--brand-gold);">Vulnerabilities</div>
            </div>
          </div>
        </div>
        <button class="cyber-btn" style="width: 100%;"> VIEW DETAILS</button>
      </div>

      <!-- AI 智能分析 -->
      <div class="cyber-card ai-zone" v-if="pentestStore.started">
        <div class="card-header">
          <div class="card-icon">🤖</div>
          <h3 class="card-title">AI Neural Analysis</h3>
        </div>
        <div style="margin: 1.5rem 0;">
          <div style="background: rgba(0, 126, 126, 0.779); padding: 1rem; border-radius: 10px; border-left: 3px solid var(--neon-cyan);">
            <div style="color: var(--neon-cyan); font-weight: 700; margin-bottom: 0.5rem;">🧠 AI RECOMMENDATION:</div>
            <ul style="list-style: none; color: var(--text-glow);">
              <li>🔍 Detected SQL injection vulnerability</li>
              <li>🛠️ Recommend Apache version update</li>
              <li>🔐 Enhance API authentication</li>
              <li>🎭 Deploy Deepfake protection</li>
            </ul>
          </div>
        </div>
        <div class="data-stream"><div class="data-flow"></div></div>
        <button class="cyber-btn" style="width: 100%;"> AI DEEP SCAN</button>
      </div>

      <!-- 實時監控 -->
      <div class="cyber-card" v-if="pentestStore.started">
        <div class="card-header">
          <div class="card-icon">📡</div>
          <h3 class="card-title">Live Monitoring</h3>
        </div>
        <div style="margin: 1.5rem 0;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
            <div style="padding: 1rem; background: rgba(57,255,20,0.1); border-radius: 10px;">
              <div style="color: var(--neon-green); font-size: 1.5rem; font-weight: 700;">2.3K</div>
              <div style="font-size: 0.8rem;">Requests/sec</div>
            </div>
            <div style="padding: 1rem; background: rgba(255,16,240,0.1); border-radius: 10px;">
              <div style="color: var(--neon-pink); font-size: 1.5rem; font-weight: 700;">0.2%</div>
              <div style="font-size: 0.8rem;">APCER</div>
            </div>
            <div style="padding: 1rem; background: rgba(0,255,255,0.1); border-radius: 10px;">
              <div style="color: var(--neon-cyan); font-size: 1.5rem; font-weight: 700;">1.1%</div>
              <div style="font-size: 0.8rem;">BPCER</div>
            </div>
          </div>
        </div>
        <div class="data-stream"><div class="data-flow"></div></div>
        <button class="cyber-btn" style="width: 100%;">\ ANALYTICS</button>
      </div>

      <!-- 報告下載 -->
      <div class="cyber-card" v-if="pentestStore.started">
        <div class="card-header">
          <div class="card-icon">📋</div>
          <h3 class="card-title">Cyber Reports</h3>
        </div>
        <div style="margin: 1.5rem 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <span> Security Assessment</span>
            <span style="color: var(--neon-green);">READY</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <span> Penetration Report</span>
            <span style="color: var(--brand-orange);">PROCESSING</span>
          </div>
        </div>
        <div style="display: flex; gap: 1rem;">
          <button class="cyber-btn" style="flex: 1;">📥 PDF</button>
          <button class="cyber-btn" style="flex: 1;">📊 EXCEL</button>
        </div>
      </div>

    </div>
  </div>
  
</template>
<style src="@/assets/css/index.css"></style>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePentestStore } from '@/stores/pentest'

const pentestStore = usePentestStore()

const urlInput = ref('')
const fileInput = ref(null)



const isInputValid = computed(() => {
  return urlInput.value.trim() !== '' || fileInput.value !== null
})

function handleFileInput(event) {
  fileInput.value = event.target.files[0]
}

function startPentest() {
  if (!isInputValid.value) {
    alert('請輸入 URL 或選擇檔案才能開始')
    return
  }

  alert('啟動滲透測試中...')
  pentestStarted.value = true
  pentestStore.startPentest()
}

function updateStats() {
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => {
    const target = parseFloat(stat.textContent.replace(/[^\d.]/g, ''))
    let current = 0;
    const increment = target / 50;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      stat.textContent = stat.textContent.includes('%') ?
        current.toFixed(1) + '%' : Math.floor(current);
    }, 50);
  });
}

onMounted(() => {
  urlInput.value = ''
  fileInput.value = null
  pentestStore.resetPentest()
  setTimeout(updateStats, 1000)

  document.querySelectorAll('.cyber-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px) rotateX(5deg)'
    })

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) rotateX(0)'
    })
  })
})
</script>
