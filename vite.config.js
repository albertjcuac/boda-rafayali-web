import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Nombre del repositorio en GitHub. La URL final será:
//   https://albertjcuac.github.io/boda-rafayali-web/
// Si algún día cambias el nombre del repositorio, cámbialo también aquí.
const NOMBRE_REPOSITORIO = 'boda-rafayali-web'

export default defineConfig(({ mode }) => ({
  // En desarrollo (npm run dev) la web cuelga de "/".
  // En producción (npm run build / preview) cuelga de "/boda-rafayali-web/", como en GitHub Pages.
  base: mode === 'production' ? `/${NOMBRE_REPOSITORIO}/` : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
