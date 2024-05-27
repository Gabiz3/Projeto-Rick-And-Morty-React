import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/Projeto-Rick-And-Morty-React",
  plugins: [react()],
})
