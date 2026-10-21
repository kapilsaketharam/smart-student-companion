import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset paths work both in VS Code's local dev server and GitHub Pages.
  base: './',
})
