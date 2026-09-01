import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // twisty-player is a Web Component from cubing/twisty — not a Vue component
          isCustomElement: (tag) => tag === 'twisty-player',
        },
      },
    }),
  ],
  base: '/jjtimer/',
})
