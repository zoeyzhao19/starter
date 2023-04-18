import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [UnoCSS(), vue(), legacy()],
    resolve: {
      alias: [
        { find: /^@src\/(.*)/, replacement: '/src/$1' },
      ],
    },
    server: {
      proxy: {
        '/xx': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
    build: {
      minify: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
          },
        },
      },
    },
  }
})
