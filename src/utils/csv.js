// Separador ";" → Excel en español lo abre directamente en columnas.
// Google Sheets detecta el separador automáticamente al importar.
const SEPARADOR = ';'

function escapar(valor) {
  if (valor === null || valor === undefined) return ''
  let texto = String(valor)

  // Protección contra "inyección de fórmulas": si un invitado escribe algo que empieza por
  // = + - @ , Excel/Sheets podrían interpretarlo como fórmula al abrir el CSV.
  if (/^[=+\-@\t\r]/.test(texto)) texto = `'${texto}`

  // Si contiene separador, comillas o saltos de línea, se entrecomilla.
  if (/[";\n\r]/.test(texto)) texto = `"${texto.replace(/"/g, '""')}"`
  return texto
}

/**
 * Genera el contenido de un CSV.
 * @param {{ titulo: string, valor: (fila: object) => any }[]} columnas
 * @param {object[]} filas
 */
export function generarCsv(columnas, filas) {
  const cabecera = columnas.map((c) => escapar(c.titulo)).join(SEPARADOR)
  const lineas = filas.map((fila) => columnas.map((c) => escapar(c.valor(fila))).join(SEPARADOR))
  // ﻿ (BOM) para que Excel reconozca las tildes y la ñ (UTF-8).
  return '﻿' + [cabecera, ...lineas].join('\r\n')
}

/** Descarga un texto como archivo .csv en el navegador. */
export function descargarCsv(nombreArchivo, contenido) {
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreArchivo
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
