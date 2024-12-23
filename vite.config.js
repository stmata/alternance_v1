import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false,  // Désactive l'overlay d'erreur
    },
  },
  build: {
    rollupOptions: {
      input: 'index.html', // Spécifie le point d'entrée principal
    },
  },
  publicDir: 'public',
})
