// nuxt.config.ts
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
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:7939',
        changeOrigin: true,
        prependPath: false
      }
    }
  },
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:7939',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})