import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import postcss from './postcss.config';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@image': fileURLToPath(new URL('./src/assets/images', import.meta.url))
    }
  },
  css: {
    postcss,
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },
})
