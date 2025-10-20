//composables/dashboard.ts
import { ref, computed, onMounted, watch } from 'vue'

import { usePentestStore } from '@/stores/pentest'

export function usePentestUI() {
  const pentestStore = usePentestStore()

  // computed getter/setter 直接綁 store state
  const urlInput = computed<string>({
    get: () => pentestStore.tempUrlInput,
    set: (v: string) => (pentestStore.tempUrlInput = v),
  })

  const fileInput = computed<File | null>({
    get: () => pentestStore.tempFileInput,
    set: (f: File | null) => (pentestStore.tempFileInput = f),
  })

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
  function isFullReload(): boolean {
    const sessionFlag = sessionStorage.getItem('justReloaded')

    if (sessionFlag === 'true') {
      sessionStorage.removeItem('justReloaded') // 只用一次
      return true
    }

    return false
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
  // 如果輸入了 URL，就清除檔案
  watch(urlInput, (newVal) => {
    if (newVal.trim() !== '') {
      fileInput.value = null
    }
  })

  // 如果選擇了檔案，就清除 URL
  watch(fileInput, (newFile) => {
    if (newFile !== null) {
      urlInput.value = ''
    }
  })



  onMounted(() => {
    if (isFullReload()) {
      pentestStore.resetInputs()
    }

    // 動畫與 hover 效果等
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
