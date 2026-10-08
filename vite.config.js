import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base: './' keeps asset paths relative, so the build works from any sub-path
// (e.g. health.marengoasiahospitals.com/ggn/talent) without changes.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
