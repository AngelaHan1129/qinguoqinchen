
    // 數據更新動畫
    function updateStats() {
      const stats = document.querySelectorAll('.stat-number');
      stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
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
  createMatrix()
  createParticles()
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