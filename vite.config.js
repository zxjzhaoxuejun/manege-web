import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { svgBuilder } from './src/config/svgBuilder'

const path = require('path')
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 8090,
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    }
  },
  plugins: [
    vue(),
    svgBuilder('./src/icons/svg/')
    // viteSvgIcons({
    //   // 配置路劲在你的src里的svg存放文件
    //   iconDirs: [path.resolve(process.cwd(), './src/icons/svg')],
    //   symbolId: 'icon-[dir]-[name]'
    // })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss";'
      }
    }
  }

})
