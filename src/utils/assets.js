/**
 * Convierte una ruta de la carpeta `public/` (por ejemplo "fotos/portada.jpg")
 * en una URL válida tanto en local como en GitHub Pages (con el prefijo /boda-rafayali-web/).
 */
export function assetUrl(ruta) {
  return `${import.meta.env.BASE_URL}${String(ruta).replace(/^\/+/, '')}`
}
