import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3006', // 你的 NestJS 地址
        // target: 'http://192.168.1.16:3006', // 你的 NestJS 地址
        // target: 'http://80800.iepose.cn', // 你的 NestJS 地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 去掉路径中的 /api
      },
      // ✅ 新增：专门给 OSS 图片用的代理
      '/oss-resource': {
        target: 'http://daan-pqf.oss-cn-beijing.aliyuncs.com',
        changeOrigin: true,
        // 关键：去掉前缀，这样 /oss-resource/avatars/1.png
        // 就会变成 http://daan-pqf.oss-cn-beijing.aliyuncs.com/avatars/1.png
        rewrite: (path) => path.replace(/^\/oss-resource/, ''),
      },
    },
  },
})
