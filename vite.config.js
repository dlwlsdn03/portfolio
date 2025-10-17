import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // If you deploy to a project page without a custom domain, set base to '/<repo-name>/'
  base: '/',
})
