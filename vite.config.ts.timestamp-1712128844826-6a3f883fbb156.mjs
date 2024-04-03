// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///Users/yihang/Desktop/web_user/node_modules/.pnpm/vite@5.0.11_@types+node@18.19.8/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/yihang/Desktop/web_user/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@5.0.11_vue@3.4.14/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Users/yihang/Desktop/web_user/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.0.11_vue@3.4.14/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import tailwind from "file:///Users/yihang/Desktop/web_user/node_modules/.pnpm/tailwindcss@3.4.1/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///Users/yihang/Desktop/web_user/node_modules/.pnpm/autoprefixer@10.4.17_postcss@8.4.33/node_modules/autoprefixer/lib/autoprefixer.js";
import postcssImport from "file:///Users/yihang/Desktop/web_user/node_modules/.pnpm/postcss-import@16.0.0_postcss@8.4.33/node_modules/postcss-import/index.js";
import colorMod from "file:///Users/yihang/Desktop/web_user/node_modules/.pnpm/postcss-color-mod-function@3.0.3/node_modules/postcss-color-mod-function/index.cjs.js";
import postcssNesting from "file:///Users/yihang/Desktop/web_user/node_modules/.pnpm/postcss-nesting@12.0.2_postcss@8.4.33/node_modules/postcss-nesting/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/yihang/Desktop/web_user/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    vueJsx()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "@image": fileURLToPath(new URL("./src/assets/images", __vite_injected_original_import_meta_url))
    }
  },
  css: {
    postcss: {
      plugins: [
        postcssImport,
        tailwind({
          config: "./tailwind.config.ts"
        }),
        autoprefixer,
        postcssNesting,
        colorMod
      ]
    },
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMveWloYW5nL0Rlc2t0b3Avd2ViX3VzZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy95aWhhbmcvRGVza3RvcC93ZWJfdXNlci92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMveWloYW5nL0Rlc2t0b3Avd2ViX3VzZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuaW1wb3J0IHRhaWx3aW5kIGZyb20gJ3RhaWx3aW5kY3NzJztcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcbmltcG9ydCBwb3N0Y3NzSW1wb3J0IGZyb20gJ3Bvc3Rjc3MtaW1wb3J0JztcbmltcG9ydCBjb2xvck1vZCBmcm9tICdwb3N0Y3NzLWNvbG9yLW1vZC1mdW5jdGlvbic7XG5pbXBvcnQgcG9zdGNzc05lc3RpbmcgZnJvbSAncG9zdGNzcy1uZXN0aW5nJztcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKHtcbiAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC5tZCQvXVxuICAgIH0pLFxuICAgIHZ1ZUpzeCgpLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgJ0BpbWFnZSc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvYXNzZXRzL2ltYWdlcycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgfVxuICB9LFxuICBjc3M6IHtcbiAgICBwb3N0Y3NzOiB7XG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIHBvc3Rjc3NJbXBvcnQsXG4gICAgICAgIHRhaWx3aW5kKHtcbiAgICAgICAgICBjb25maWc6ICcuL3RhaWx3aW5kLmNvbmZpZy50cycsXG4gICAgICAgIH0pLFxuICAgICAgICBhdXRvcHJlZml4ZXIsXG4gICAgICAgIHBvc3Rjc3NOZXN0aW5nLFxuICAgICAgICBjb2xvck1vZCxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBjc3M6IHtcbiAgICAgICAgY2hhcnNldDogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0USxTQUFTLGVBQWUsV0FBVztBQUUvUyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sY0FBYztBQUNyQixPQUFPLGtCQUFrQjtBQUN6QixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGNBQWM7QUFDckIsT0FBTyxvQkFBb0I7QUFUeUksSUFBTSwyQ0FBMkM7QUFXck4sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLE1BQ0YsU0FBUyxDQUFDLFVBQVUsT0FBTztBQUFBLElBQzdCLENBQUM7QUFBQSxJQUNELE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLE1BQ3BELFVBQVUsY0FBYyxJQUFJLElBQUksdUJBQXVCLHdDQUFlLENBQUM7QUFBQSxJQUN6RTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQSxTQUFTO0FBQUEsVUFDUCxRQUFRO0FBQUEsUUFDVixDQUFDO0FBQUEsUUFDRDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLHFCQUFxQjtBQUFBLE1BQ25CLEtBQUs7QUFBQSxRQUNILFNBQVM7QUFBQSxNQUNYO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
