import { ref, computed, onMounted } from 'vue'
import { usePentestStore } from '@/stores/pentest'

export function usePentestUI() {
  const pentestStore = usePentestStore()

  const urlInput = ref('')
  const fileInput = ref<File | null>(null)

  const selectedFileName = computed(() => fileInput.value?.name || '')

  const isInputValid = computed(() => {
    return urlInput.value.trim() !== '' || fileInput.value !== null
  })

  function handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files?.length) {
      fileInput.value = target.files[0]
    }
  }

  function startPentest() {
    if (!isInputValid.value) {
      alert('請輸入 URL 或選擇檔案才能開始')
      return
    }

    alert('啟動滲透測試中...')
    pentestStore.startPentest()
  }

  function updateStats() {
    const stats = document.querySelectorAll('.stat-number')
    stats.forEach(stat => {
      const target = parseFloat(stat.textContent?.replace(/[^\d.]/g, '') || '0')
      let current = 0
      const increment = target / 50

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        stat.textContent = stat.textContent?.includes('%')
          ? current.toFixed(1) + '%'
          : Math.floor(current).toString()
      }, 50)
    })
  }

  onMounted(() => {
    urlInput.value = ''
    fileInput.value = null
    setTimeout(updateStats, 1000)

    document.querySelectorAll('.cyber-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-10px) rotateX(5deg)'
      })
      card.addEventListener('mouseleave', (e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0) rotateX(0)'
      })

    })
  })

  return {
    urlInput,
    fileInput,
    selectedFileName,
    isInputValid,
    handleFileInput,
    startPentest
  }
}
