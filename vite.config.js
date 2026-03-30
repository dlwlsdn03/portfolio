import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cache-bust-favicon',
      transformIndexHtml(html) {
        return html.replace(
          /(<link rel="icon"[^>]*href=")([^"?]+)(")/,
          `$1$2?v=${Date.now()}$3`
        )
      }
    }
  ],
  // If you deploy to a project page without a custom domain, set base to '/<repo-name>/'
  base: '/',
})