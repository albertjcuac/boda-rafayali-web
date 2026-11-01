import { boda } from '@/config/boda'

const zona = boda.zonaHoraria

/** Fecha y hora exactas de la ceremonia como objeto Date. */
export const fechaBoda = new Date(boda.fecha)

const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1)

/** Ej.: "Sábado, 12 de junio de 2027" */
export function formatearFechaLarga() {
  return capitalizar(
    new Intl.DateTimeFormat('es-ES', { dateStyle: 'full', timeZone: zona }).format(fechaBoda),
  )
}

/** Ej.: "17:00" */
export function formatearHora() {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: zona,
  }).format(fechaBoda)
}

/** Ej.: "12 · 06 · 2027" */
export function formatearFechaNumerica() {
  const partes = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: zona,
  }).formatToParts(fechaBoda)
  const valor = (tipo) => partes.find((p) => p.type === tipo)?.value ?? ''
  return `${valor('day')} · ${valor('month')} · ${valor('year')}`
}

/**
 * Devuelve el día natural ("AAAA-MM-DD") de una fecha en la zona horaria de la boda.
 * Sirve para saber si "hoy" es el día de la boda sin importar desde dónde se mire la web.
 */
export function diaEnZona(fecha) {
  const partes = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: zona,
  }).formatToParts(fecha)
  const valor = (tipo) => partes.find((p) => p.type === tipo)?.value ?? ''
  return `${valor('year')}-${valor('month')}-${valor('day')}`
}
