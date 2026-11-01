import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const clave = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * `true` si las variables de entorno están rellenadas con valores reales.
 * Así la web no se rompe si todavía no has configurado Supabase: solo avisa.
 */
export const supabaseConfigurado = Boolean(
  url && clave && /^https?:\/\//.test(url) && !/TU_PROYECTO/i.test(url) && !/TU_CLAVE/i.test(clave),
)

if (!supabaseConfigurado) {
  console.warn(
    '[Supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. ' +
      'Copia .env.example a .env.local y rellénalos (mira el README).',
  )
}

// Solo se usa la clave pública (anon). La seguridad real la ponen las políticas RLS de la base de datos.
export const supabase = supabaseConfigurado
  ? createClient(url, clave, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
