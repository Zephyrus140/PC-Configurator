import { defineConfig } from 'vite'

export default defineConfig({
  root: 'PCConfig.Api/wwwroot',

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            // Бэкенд не запущен — отвечаем 503, api.js переключится на mock-данные
            res.writeHead(503, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'backend offline' }))
          })
        }
      }
    }
  },

  preview: {
    port: 3000,
  }
})
