import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'https://mocatestdeploy.duylongart.workers.dev'

  const apiProxy = {
    target: proxyTarget,
    changeOrigin: true,
    configure: (proxy: any) => {
      proxy.on('proxyReq', (proxyReq: any) => {
        // Some upstreams validate Origin even behind a reverse proxy.
        proxyReq.setHeader('origin', proxyTarget)
      })
    },
  }

  return {
    plugins: [react(), tailwindcss()],
    ...(command === 'serve'
      ? {
          server: {
            port: 5173,
            proxy: {
              '/api': apiProxy,
            },
          },
          preview: {
            proxy: {
              '/api': apiProxy,
            },
          },
        }
      : {}),
  }
})
