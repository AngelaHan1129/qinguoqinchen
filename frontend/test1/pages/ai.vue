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
<style>
/* AI 神經網路視覺化 */
    .neural-network {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      z-index: -1;
      opacity: 0.1;
    }
    
    .neural-node {
      position: absolute;
      width: 8px; height: 8px;
      background: var(--neon-cyan);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--neon-cyan);
      animation: neural-pulse 3s ease-in-out infinite;
    }
    
    @keyframes neural-pulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.5); }
    }
    
    .ai-container {
      max-width: 1400px;
      margin: 2rem auto;
      padding: 0 2rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    
    .ai-panel {
      background: linear-gradient(135deg, rgba(10, 15, 28, 0.9), rgba(15, 25, 45, 0.8));
      border: 2px solid var(--neon-cyan);
      border-radius: 15px;
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }
    
    .ai-panel::before {
      content: '';
      position: absolute;
      top: -2px; left: -2px; right: -2px; bottom: -2px;
      background: linear-gradient(45deg, var(--neon-cyan), var(--neon-green), var(--neon-pink), var(--neon-cyan));
      border-radius: 15px;
      z-index: -1;
      animation: ai-border-glow 4s linear infinite;
    }
    
    @keyframes ai-border-glow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    /* AI 模型卡片 */
    .ai-model-card {
      background: rgba(0, 255, 255, 0.05);
      border: 1px solid var(--neon-cyan);
      border-radius: 10px;
      padding: 1.5rem;
      margin: 1rem 0;
      position: relative;
    }
    
    .model-status {
      position: absolute;
      top: 1rem; right: 1rem;
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 700;
    }
    
    .status-active {
      background: var(--neon-green);
      color: var(--bg-dark);
      box-shadow: 0 0 10px var(--neon-green);
    }
    
    .status-training {
      background: var(--brand-orange);
      color: white;
      animation: training-blink 2s ease-in-out infinite;
    }
    
    @keyframes training-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    
    /* 準確率圓形圖表 */
    .accuracy-circle {
      width: 120px; height: 120px;
      border-radius: 50%;
      background: conic-gradient(var(--neon-green) 0deg, var(--neon-green) calc(var(--accuracy) * 3.6deg), rgba(255,255,255,0.1) calc(var(--accuracy) * 3.6deg));
      position: relative;
      display: flex; align-items: center; justify-content: center;
      margin: 1rem auto;
    }
    
    .accuracy-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--neon-green);
    }
</style>
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