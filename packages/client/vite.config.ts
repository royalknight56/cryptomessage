import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const currentVersion = Math.floor(Date.now() / 1000).toString();

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development',
    ),
    __APP_VERSION__: JSON.stringify(currentVersion),
    global: 'window',
  },
  build: {
    outDir: "../../dist/client",
  }
})
