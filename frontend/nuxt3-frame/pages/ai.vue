<template>
    <!-- Neural Network Background -->
  <div class="neural-network" id="neuralNetwork"></div>

  <div class="ai-container">
  <!-- AI 模型管理 -->
  <div class="ai-panel">
    <h2 style="color: var(--neon-cyan); margin-bottom: 2rem; text-align: center;">
      AI 模型管理中心
    </h2>

    <!-- v-for 模型卡片 -->
    <div
      v-for="mod in sortedMods"
      :key="mod.id"
      class="ai-model-card"
    >
      <div class="model-status status-active">ACTIVE</div>

      <h3 style="color: var(--neon-green); margin-bottom: 1rem;">
        {{ mod.model }}
      </h3>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          
          <div style="color: var(--neon-green);">成功率: {{ mod.successRate }}</div>
        </div>
        <div
          class="accuracy-circle"
          :style="getAccuracyStyle(mod.successRate)"
        >
          <div class="accuracy-text">{{ mod.successRate }}</div>
        </div>
      </div>

      <!-- 模型描述（可選） -->
      <div v-if="mod.description" style="margin-top: 0.5rem; color: #ccc;">
        {{ mod.description }}
      </div>

      <div style="margin-top: 1rem; display: flex; gap: 1rem;">
        <button
          style="background: var(--neon-green); border: none; padding: 0.5rem 1rem; border-radius: 5px; color: var(--bg-dark); cursor: pointer; font-weight: 700;"
        >
          測試模型
        </button>
        <button
          style="background: transparent; border: 1px solid var(--neon-cyan); padding: 0.5rem 1rem; border-radius: 5px; color: var(--neon-cyan); cursor: pointer;"
        >
          查看詳情
        </button>
      </div>
    </div>
  </div>

  <!-- AI 分析結果 -->
  <div class="ai-panel">
    <h2 style="color: var(--neon-cyan); margin-bottom: 2rem; text-align: center;">
      實時分析結果
    </h2>

    <!-- 威脅分析 -->
    <div style="background: rgba(255, 16, 240, 0.05); border: 1px solid var(--neon-pink); border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem;">
      <h3 style="color: var(--neon-pink); margin-bottom: 1rem;"> 威脅態勢分析</h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; text-align: center;">
        <div>
          <div style="font-size: 2rem; font-weight: 700; color: var(--neon-pink);">47</div>
          <div style="font-size: 0.9rem;">檢測威脅</div>
        </div>
        <div>
          <div style="font-size: 2rem; font-weight: 700; color: var(--neon-green);">99.2%</div>
          <div style="font-size: 0.9rem;">檢測準確率</div>
        </div>
      </div>
    </div>

    <!-- AI 建議清單 -->
    <div style="background: rgba(57, 255, 20, 0.05); border: 1px solid var(--neon-green); border-radius: 10px; padding: 1.5rem;">
      <h3 style="color: var(--neon-green); margin-bottom: 1rem;"> AI 智能建議</h3>
      <div>
        <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
          <div style="width: 20px; height: 20px; background: #FF4444; border-radius: 50%; flex-shrink: 0; margin-top: 0.2rem;"></div>
          <div>
            <div style="font-weight: 700; color: #FF4444;">Critical Priority</div>
            <div style="font-size: 0.9rem;">修復 /api/login SQL 注入漏洞</div>
          </div>
        </div>
        <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
          <div style="width: 20px; height: 20px; background: var(--brand-orange); border-radius: 50%; flex-shrink: 0; margin-top: 0.2rem;"></div>
          <div>
            <div style="font-weight: 700; color: var(--brand-orange);">High Priority</div>
            <div style="font-size: 0.9rem;">升級 Apache 伺服器至最新版本</div>
          </div>
        </div>
        <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
          <div style="width: 20px; height: 20px; background: var(--brand-gold); border-radius: 50%; flex-shrink: 0; margin-top: 0.2rem;"></div>
          <div>
            <div style="font-weight: 700; color: var(--brand-gold);">Medium Priority</div>
            <div style="font-size: 0.9rem;">啟用 Deepfake 防護機制</div>
          </div>
        </div>
        <div style="display: flex; align-items: start; gap: 1rem;">
          <div style="width: 20px; height: 20px; background: var(--neon-green); border-radius: 50%; flex-shrink: 0; margin-top: 0.2rem;"></div>
          <div>
            <div style="font-weight: 700; color: var(--neon-green);">Low Priority</div>
            <div style="font-size: 0.9rem;">更新安全政策文檔</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  
</template>
<style src="@/assets/css/ai.css"></style>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { getAttackMod } from '@/composables/getapi'
import type { AttackModVector } from '@/composables/getapi'
import { getAccuracyStyle, animateAccuracyCircles,createNeuralNetwork } from '@/composables/ai'


type AttackModWithSelected = AttackModVector & { selected: boolean }

const attackMods = ref<AttackModWithSelected[]>([])


const sortedMods = computed(() => attackMods.value)


onMounted(async () => {
  try {
    createNeuralNetwork()

    const data = await getAttackMod()
    if (data && Array.isArray(data.vectors)) {
      attackMods.value = data.vectors.map((m): AttackModWithSelected => ({
        ...m,
        selected: false
      }))

      await nextTick()
      animateAccuracyCircles()
    }
  } catch (err) {
    console.error('取得 AI 模組失敗:', err)
  }
})
</script>

