import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    // Adicione a configuração base para o subpath
  base: '/processamento-imagem/',
})
