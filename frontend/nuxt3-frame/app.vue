<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout />
    <NuxtPage />
  </div>
</template>

<script setup>
import { onBeforeUnmount } from 'vue'
import { onMounted } from 'vue'

onMounted(() => {
  // 只在瀏覽器端執行
  if (process.client) {
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('justReloaded', 'true')
    })
  }
})
</script>
