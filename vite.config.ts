import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/fraud_check': {
          target: 'https://ip234.in',
          changeOrigin: true
        },
        ['/' + env.VITE_USER_NAME]: {
          target: 'https://api11.scamalytics.com',
          changeOrigin: true
        }
      }
    }
  }
})
