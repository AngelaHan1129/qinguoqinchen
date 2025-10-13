<template>
  
  <!-- 矩陣雨背景 -->
  <div class="matrix-bg" id="matrixBg"></div>
  
  <!-- 粒子系統 -->
  <div class="particles" id="particles"></div>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">

<!-- Header -->
  <header>
    <div class="logo">
      <div class="logo-icon"><img src="/favicon-32x32.png"></div>
      <span>QinGuoQinChen - 侵國侵城</span>
    </div>
    <nav>
      `<ul class="nav-menu">
        <li><NuxtLink to="/">Dashboard</NuxtLink></li>

        <!-- 僅在啟動後才顯示 -->
        <li v-if="pentestStore.started"><NuxtLink to="/pentest">滲透測試</NuxtLink></li>
        <li v-if="pentestStore.started"><NuxtLink to="/ai">AI 分析</NuxtLink></li>
        <li v-if="pentestStore.started"><NuxtLink to="/reports">報告</NuxtLink></li>
      </ul>
    </nav>
  </header>

</template>
<style>
    :root {
      --brand-orange: #D17000;
      --brand-gold: #D7BD82;
      --neon-cyan: #00FFFF;
      --neon-green: #39FF14;
      --neon-pink: #FF10F0;
      --bg-dark: #000811;
      --bg-card: #0A0F1C;
      --text-glow: #FFFFFF;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Orbitron', monospace;
      background: var(--bg-dark);
      color: var(--text-glow);
      overflow-x: hidden;
      position: relative;
    }
    /* 矩陣雨背景 */
    .matrix-bg {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      z-index: -1;
      background: linear-gradient(180deg, #000811, #001122);
    }
    
    .matrix-char {
      position: absolute;
      font-family: 'Orbitron', monospace;
      color: var(--neon-green);
      opacity: 0.3;
      animation: matrix-fall 8s linear infinite;
      text-shadow: 0 0 5px var(--neon-green);
    }
    
    @keyframes matrix-fall {
      0% { transform: translateY(-100vh); opacity: 1; }
      100% { transform: translateY(100vh); opacity: 0; }
    }
    
    /* 粒子系統 */
    .particles {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      z-index: -1;
      overflow: hidden;
    }
    
    .particle {
      position: absolute;
      width: 2px; height: 2px;
      background: var(--neon-cyan);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
      box-shadow: 0 0 6px var(--neon-cyan);
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
/* Header */
    header {
      position: relative;
      background: linear-gradient(135deg, rgba(209, 112, 0, 0.2), rgba(215, 189, 130, 0.1));
      border-bottom: 2px solid var(--brand-orange);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 30px rgba(209, 112, 0, 0.3);
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.5rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
      animation: glow-pulse 2s ease-in-out infinite alternate;
    }
    
    .logo-icon {
      width: 40px; height: 40px;
      background: var(--brand-orange);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 20px var(--brand-orange);
      animation: rotate 4s linear infinite;
    }
    @keyframes glow-pulse {
      from { text-shadow: 0 0 5px var(--brand-orange), 0 0 10px var(--brand-orange); }
      to { text-shadow: 0 0 10px var(--brand-orange), 0 0 20px var(--brand-orange), 0 0 30px var(--brand-orange); }
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    /* Navigation */
    .nav-menu {
      display: flex;
      gap: 2rem;
      list-style: none;
      justify-content: flex-end;
    }
    
    .nav-menu a {
      color: var(--text-glow);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border: 1px solid transparent;
      border-radius: 20px;
      transition: all 0.3s;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 1px;
    }
    
    .nav-menu a:hover {
      border-color: var(--neon-cyan);
      box-shadow: 0 0 15px var(--neon-cyan);
      text-shadow: 0 0 10px var(--neon-cyan);
    }
    /* Main Container */
    .container {
      max-width: 1400px;
      margin: 2rem auto;
      padding: 0 2rem;
    }
    
    .cyber-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }
    @keyframes scan {
      0% { top: 0; opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    
    /* 響應式設計 */
    @media (max-width: 768px) {
      .cyber-grid { grid-template-columns: 1fr; }
      .container { padding: 0 1rem; }
      header { flex-direction: column; gap: 1rem; }
      .nav-menu { flex-wrap: wrap; justify-content: center; }
    }
    
</style>
<script setup>
import { useRouter, useRoute } from 'vue-router'

useHead({
  title: 'QinGuoQinChen - 侵國侵城',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ],
  link: [
    { rel: 'shortcut icon', href: '/favicon.ico' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap' }
  ]
})
// 矩陣雨效果
    function createMatrix() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
      const container = document.getElementById('matrixBg');
      
      for (let i = 0; i < 50; i++) {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = chars[Math.floor(Math.random() * chars.length)];
        char.style.left = Math.random() * 100 + '%';
        char.style.animationDelay = Math.random() * 8 + 's';
        char.style.fontSize = (Math.random() * 20 + 10) + 'px';
        container.appendChild(char);
      }
    }

    // 粒子系統
    function createParticles() {
      const container = document.getElementById('particles');
      
      for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 2) + 's';
        container.appendChild(particle);
      }
    }
    // 數據更新動畫
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
    const router = useRouter()
const route = useRoute()
    onMounted(() => {
  createMatrix()
  createParticles()
  setTimeout(updateStats, 1000)

  // 每次載入 layout 時強制導回首頁
  if (route.path !== '/') {
    router.push('/')
  }
  document.querySelectorAll('.cyber-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px) rotateX(5deg)'
    })

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) rotateX(0)'
    })
  })
})
import { usePentestStore } from '@/stores/pentest'

const pentestStore = usePentestStore()

</script>