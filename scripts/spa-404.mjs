// Se ejecuta automáticamente después de `vite build` (ver "build" en package.json).
//
// GitHub Pages es un hosting estático: si alguien abre directamente
// https://albertjcuac.github.io/boda-rafayali-web/encuesta no existe ese archivo y devolvería un 404.
// Truco estándar para SPA: GitHub Pages sirve `404.html` en esos casos, así que lo hacemos
// idéntico a `index.html` y Vue Router se encarga de mostrar la página correcta.
import { copyFileSync, existsSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const index = `${dist}index.html`

if (!existsSync(index)) {
  console.error('No se encontró dist/index.html. ¿Ha fallado la compilación?')
  process.exit(1)
}

copyFileSync(index, `${dist}404.html`)
writeFileSync(`${dist}.nojekyll`, '') // evita que GitHub Pages procese los archivos con Jekyll

console.log('✔ Creados dist/404.html y dist/.nojekyll para GitHub Pages')
