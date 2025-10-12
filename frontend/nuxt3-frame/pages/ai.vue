<template>
    <!-- Neural Network Background -->
  <div class="neural-network" id="neuralNetwork"></div>

  <div class="ai-container">
    <!-- AI 模型管理 -->
    <div class="ai-panel">
      <h2 style="color: var(--neon-cyan); margin-bottom: 2rem; text-align: center;"> AI 模型管理中心</h2>
      
      <!-- Deepfake Detection Model -->
      <div class="ai-model-card">
        <div class="model-status status-active">ACTIVE</div>
        <h3 style="color: var(--neon-green); margin-bottom: 1rem;"> Deepfake Detection Model</h3>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="margin-bottom: 0.5rem;">版本: v2.1.3</div>
            <div style="margin-bottom: 0.5rem;">訓練樣本: 1.2M+</div>
            <div style="color: var(--neon-green);">準確率: 98.7%</div>
          </div>
          <div class="accuracy-circle" style="--accuracy: 98.7">
            <div class="accuracy-text">98.7%</div>
          </div>
        </div>
        <div style="margin-top: 1rem; display: flex; gap: 1rem;">
          <button style="background: var(--neon-green); border: none; padding: 0.5rem 1rem; border-radius: 5px; color: var(--bg-dark); cursor: pointer; font-weight: 700;">測試模型</button>
          <button style="background: transparent; border: 1px solid var(--neon-cyan); padding: 0.5rem 1rem; border-radius: 5px; color: var(--neon-cyan); cursor: pointer;">查看詳情</button>
        </div>
      </div>

      <!-- Liveness Detection Model -->
      <div class="ai-model-card">
        <div class="model-status status-active">ACTIVE</div>
        <h3 style="color: var(--neon-green); margin-bottom: 1rem;"> Liveness Detection Model</h3>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="margin-bottom: 0.5rem;">版本: v1.8.2</div>
            <div style="margin-bottom: 0.5rem;">訓練樣本: 800K+</div>
            <div style="color: var(--neon-green);">準確率: 96.3%</div>
          </div>
          <div class="accuracy-circle" style="--accuracy: 96.3">
            <div class="accuracy-text">96.3%</div>
          </div>
        </div>
        <div style="margin-top: 1rem; display: flex; gap: 1rem;">
          <button style="background: var(--neon-green); border: none; padding: 0.5rem 1rem; border-radius: 5px; color: var(--bg-dark); cursor: pointer; font-weight: 700;">測試模型</button>
          <button style="background: transparent; border: 1px solid var(--neon-cyan); padding: 0.5rem 1rem; border-radius: 5px; color: var(--neon-cyan); cursor: pointer;">查看詳情</button>
        </div>
      </div>

      <!-- Document Forgery Model -->
      <div class="ai-model-card">
        <div class="model-status status-training">TRAINING</div>
        <h3 style="color: var(--brand-orange); margin-bottom: 1rem;"> Document Forgery Detection</h3>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="margin-bottom: 0.5rem;">版本: v0.9.1-beta</div>
            <div style="margin-bottom: 0.5rem;">訓練中...</div>
            <div style="color: var(--brand-orange);">預估準確率: 94.1%</div>
          </div>
          <div style="width: 120px; height: 120px; border: 2px solid var(--brand-orange); border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative;">
            <div style="font-size: 1.2rem; color: var(--brand-orange);">Training</div>
            <div style="position: absolute; top: -2px; left: -2px; width: 124px; height: 124px; border: 2px solid transparent; border-top-color: var(--brand-orange); border-radius: 50%; animation: spin 2s linear infinite;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 分析結果 -->
    <div class="ai-panel">
      <h2 style="color: var(--neon-cyan); margin-bottom: 2rem; text-align: center;"> 實時分析結果</h2>
      
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
<script setup>
import { onMounted } from 'vue'

function createNeuralNetwork() {
  const container = document.getElementById('neuralNetwork')
  const nodeCount = 50

  for (let i = 0; i < nodeCount; i++) {
    const node = document.createElement('div')
    node.className = 'neural-node'
    node.style.left = Math.random() * 100 + '%'
    node.style.top = Math.random() * 100 + '%'
    node.style.animationDelay = Math.random() * 3 + 's'
    container.appendChild(node)
  }
}

onMounted(() => {
  createNeuralNetwork()

  // 模擬準確率動畫
  const circles = document.querySelectorAll('.accuracy-circle')
  circles.forEach(circle => {
    const accuracy = parseFloat(circle.style.getPropertyValue('--accuracy'))
    let current = 0
    const increment = accuracy / 100

    const animation = setInterval(() => {
      current += increment
      if (current >= accuracy) {
        current = accuracy
        clearInterval(animation)
      }
      circle.style.setProperty('--accuracy', current)
      const text = circle.querySelector('.accuracy-text')
      if (text) {
        text.textContent = current.toFixed(1) + '%'
      }
    }, 20)
  })
})
    /* // 創建神經網路背景
    function createNeuralNetwork() {
      const container = document.getElementById('neuralNetwork');
      const nodeCount = 50;
      
      for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'neural-node';
        node.style.left = Math.random() * 100 + '%';
        node.style.top = Math.random() * 100 + '%';
        node.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(node);
      }
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
      createNeuralNetwork();
      
      // 模擬準確率動畫
      const circles = document.querySelectorAll('.accuracy-circle');
      circles.forEach(circle => {
        const accuracy = parseFloat(circle.style.getPropertyValue('--accuracy'));
        let current = 0;
        const increment = accuracy / 100;
        
        const animation = setInterval(() => {
          current += increment;
          if (current >= accuracy) {
            current = accuracy;
            clearInterval(animation);
          }
          circle.style.setProperty('--accuracy', current);
          circle.querySelector('.accuracy-text').textContent = current.toFixed(1) + '%';
        }, 20);
      });
    }); */
  </script>