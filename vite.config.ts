import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import colorMod from 'postcss-color-mod-function';
import postcssNesting from 'postcss-nesting';
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
    postcss: {
      plugins: [
        postcssImport,
        tailwind({
          config: './tailwind.config.ts',
        }),
        autoprefixer,
        postcssNesting,
        colorMod,
      ],
    },
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },
})
