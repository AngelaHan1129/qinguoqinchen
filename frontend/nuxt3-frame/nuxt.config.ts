// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],
  build: {
    transpile: ['pinia-plugin-persistedstate'],
  },
  vite: {
    server: {
      proxy: {
        // 任何對 /api 的請求，會被代理到你後端 API
        '/api': {
          target: 'http://localhost:7939',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
