<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { boda } from '@/config/boda'
import { supabase, supabaseConfigurado } from '@/lib/supabase'
import { descargarCsv, generarCsv } from '@/utils/csv'
import StatCard from '@/components/StatCard.vue'

// ---------------------------------------------------------------------------
//  Sesión
// ---------------------------------------------------------------------------
const sesion = ref(null)
const comprobandoSesion = ref(true)
const email = ref('')
const password = ref('')
const iniciando = ref(false)
const errorLogin = ref('')
let suscripcion = null

onMounted(async () => {
  if (!supabaseConfigurado) {
    comprobandoSesion.value = false
    return
  }

  try {
    const { data } = await supabase.auth.getSession()
    sesion.value = data.session
  } catch (error) {
    console.error('[Admin] No se pudo comprobar la sesión:', error)
  } finally {
    comprobandoSesion.value = false
  }

  // Solo se actualiza el estado dentro del callback (no se hacen llamadas a Supabase aquí).
  const { data } = supabase.auth.onAuthStateChange((evento, nuevaSesion) => {
    sesion.value = nuevaSesion
    if (evento === 'SIGNED_OUT') respuestas.value = []
  })
  suscripcion = data.subscription

  if (sesion.value) cargarRespuestas()
})

onBeforeUnmount(() => suscripcion?.unsubscribe())

async function iniciarSesion() {
  if (iniciando.value) return
  errorLogin.value = ''
  iniciando.value = true
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value.trim(),
      password: password.value,
    })
    if (error) throw error
    password.value = ''
    await cargarRespuestas()
  } catch (error) {
    const texto = String(error?.message ?? '').toLowerCase()
    if (texto.includes('invalid login credentials')) {
      errorLogin.value = 'El email o la contraseña no son correctos.'
    } else if (texto.includes('failed to fetch') || texto.includes('network')) {
      errorLogin.value = 'No hay conexión con el servidor. Revisa tu internet.'
    } else {
      errorLogin.value = `No se ha podido iniciar sesión: ${error?.message ?? 'error desconocido'}`
    }
  } finally {
    iniciando.value = false
  }
}

async function cerrarSesion() {
  await supabase.auth.signOut()
  respuestas.value = []
  email.value = ''
}

// ---------------------------------------------------------------------------
//  Datos
// ---------------------------------------------------------------------------
const respuestas = ref([])
const cargando = ref(false)
const errorDatos = ref('')

async function cargarRespuestas() {
  cargando.value = true
  errorDatos.value = ''
  try {
    // Supabase devuelve como máximo 1000 filas por consulta, de sobra para una boda.
    const { data, error } = await supabase
      .from('respuestas_boda')
      .select('*')
      .order('creado_en', { ascending: false })
    if (error) throw error
    respuestas.value = data ?? []
  } catch (error) {
    console.error('[Admin] Error al cargar respuestas:', error)
    const texto = String(error?.message ?? '').toLowerCase()
    errorDatos.value =
      texto.includes('failed to fetch') || texto.includes('network')
        ? 'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.'
        : `No se han podido cargar las respuestas: ${error?.message ?? 'error desconocido'}`
  } finally {
    cargando.value = false
  }
}

// ---------------------------------------------------------------------------
//  Estadísticas, búsqueda y filtros
// ---------------------------------------------------------------------------
const busqueda = ref('')
const filtro = ref('todas') // 'todas' | 'si' | 'no'

const filtros = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'si', etiqueta: 'Asisten' },
  { valor: 'no', etiqueta: 'No asisten' },
]

const total = computed(() => respuestas.value.length)
const asisten = computed(() => respuestas.value.filter((r) => r.asistencia === 'si').length)
const noAsisten = computed(() => respuestas.value.filter((r) => r.asistencia === 'no').length)
const acompanantes = computed(() =>
  respuestas.value.filter((r) => r.asistencia === 'si').reduce((suma, r) => suma + (r.acompanantes ?? 0), 0),
)
const totalPersonas = computed(() => asisten.value + acompanantes.value)

// Búsqueda sin distinguir mayúsculas ni tildes.
const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

const filtradas = computed(() => {
  const termino = normalizar(busqueda.value.trim())
  return respuestas.value.filter((r) => {
    if (filtro.value !== 'todas' && r.asistencia !== filtro.value) return false
    if (!termino) return true
    return normalizar(r.nombre).includes(termino) || normalizar(r.nombres_acompanantes).includes(termino)
  })
})

const etiquetaAsistencia = (valor) => (valor === 'si' ? 'Asiste' : 'No asiste')
const formatearFecha = (iso) =>
  iso ? new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : ''

// ---------------------------------------------------------------------------
//  Exportar a CSV (todas las respuestas, ignorando búsqueda y filtros)
// ---------------------------------------------------------------------------
function exportarCsv() {
  const columnas = [
    { titulo: 'Fecha', valor: (r) => formatearFecha(r.creado_en) },
    { titulo: 'Nombre', valor: (r) => r.nombre },
    { titulo: 'Asistencia', valor: (r) => (r.asistencia === 'si' ? 'Sí' : 'No') },
    { titulo: 'Acompañantes', valor: (r) => r.acompanantes },
    { titulo: 'Nombres acompañantes', valor: (r) => r.nombres_acompanantes },
    { titulo: 'Alergias / necesidades', valor: (r) => r.alergias },
    { titulo: 'Canción', valor: (r) => r.cancion },
    { titulo: 'Mensaje', valor: (r) => r.mensaje },
  ]
  // Orden cronológico (de la primera respuesta a la última).
  const filas = [...respuestas.value].sort((a, b) => new Date(a.creado_en) - new Date(b.creado_en))
  const hoy = new Date().toISOString().slice(0, 10)
  descargarCsv(`respuestas-boda-${hoy}.csv`, generarCsv(columnas, filas))
}
</script>

<template>
  <section class="min-h-[100svh] bg-gradient-to-b from-crema-50 to-salvia-50 px-4 pb-24 pt-28 sm:pt-32">
    <div class="mx-auto w-full max-w-6xl">
      <!-- ===== Supabase sin configurar ===== -->
      <div v-if="!supabaseConfigurado" class="mx-auto max-w-lg rounded-3xl border border-oro-300 bg-oro-50 p-8 text-center">
        <h1 class="font-serif text-3xl">Falta configurar Supabase</h1>
        <p class="mt-3 text-tierra-600">
          Rellena <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> en
          <code>.env.local</code> y reinicia <code>npm run dev</code>. Los pasos están en el README.
        </p>
      </div>

      <!-- ===== Comprobando sesión ===== -->
      <div v-else-if="comprobandoSesion" class="flex flex-col items-center py-24 text-tierra-500" role="status">
        <svg class="h-8 w-8 animate-spin text-oro-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.25" />
          <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        </svg>
        <p class="mt-4 text-sm">Comprobando sesión…</p>
      </div>

      <!-- ===== Inicio de sesión ===== -->
      <div v-else-if="!sesion" class="mx-auto max-w-md">
        <header class="mb-8 text-center">
          <p class="eyebrow">Acceso privado</p>
          <h1 class="mt-3 font-serif text-4xl font-light sm:text-5xl">Panel de los novios</h1>
        </header>

        <form
          class="space-y-5 rounded-[2rem] border border-oro-200/70 bg-white/80 p-7 shadow-soft sm:p-9"
          @submit.prevent="iniciarSesion"
        >
          <div>
            <label for="email" class="mb-2 block text-sm text-tierra-600">Correo electrónico</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="field"
              autocomplete="username"
              inputmode="email"
              required
              :disabled="iniciando"
            />
          </div>
          <div>
            <label for="password" class="mb-2 block text-sm text-tierra-600">Contraseña</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="field"
              autocomplete="current-password"
              required
              :disabled="iniciando"
            />
          </div>

          <p v-if="errorLogin" role="alert" class="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {{ errorLogin }}
          </p>

          <button type="submit" class="btn-primary w-full" :disabled="iniciando || !email || !password">
            {{ iniciando ? 'Entrando…' : 'Entrar' }}
          </button>
        </form>
      </div>

      <!-- ===== Panel ===== -->
      <div v-else>
        <header class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="eyebrow">{{ boda.novios.primero }} &amp; {{ boda.novios.segundo }}</p>
            <h1 class="mt-3 font-serif text-4xl font-light sm:text-5xl">Respuestas de los invitados</h1>
            <p class="mt-2 text-sm text-tierra-500">Sesión iniciada como {{ sesion.user?.email }}</p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button type="button" class="btn-ghost !px-5 !py-2.5 !text-xs" :disabled="cargando" @click="cargarRespuestas">
              {{ cargando ? 'Actualizando…' : 'Actualizar' }}
            </button>
            <button type="button" class="btn-gold !px-5 !py-2.5 !text-xs" :disabled="cargando || total === 0" @click="exportarCsv">
              Exportar CSV
            </button>
            <button type="button" class="btn-ghost !px-5 !py-2.5 !text-xs" @click="cerrarSesion">Cerrar sesión</button>
          </div>
        </header>

        <!-- Error al cargar -->
        <div
          v-if="errorDatos"
          role="alert"
          class="mt-8 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{{ errorDatos }}</span>
          <button type="button" class="btn-ghost !border-rose-300 !px-5 !py-2 !text-xs !text-rose-800" @click="cargarRespuestas">
            Reintentar
          </button>
        </div>

        <!-- Estadísticas -->
        <div class="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard etiqueta="Respuestas" :valor="total" detalle="Formularios recibidos" />
          <StatCard etiqueta="Asisten" :valor="asisten" tono="verde" detalle="Invitados que confirman" />
          <StatCard etiqueta="No asisten" :valor="noAsisten" tono="tierra" detalle="Invitados que declinan" />
          <StatCard etiqueta="Acompañantes" :valor="acompanantes" tono="oro" :detalle="`${totalPersonas} personas en total`" />
        </div>

        <!-- Búsqueda y filtros -->
        <div class="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="relative w-full md:max-w-sm">
            <label for="busqueda" class="sr-only">Buscar por nombre</label>
            <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tierra-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input id="busqueda" v-model="busqueda" type="search" class="field !py-3 !pl-12 !text-base" placeholder="Buscar por nombre…" />
          </div>

          <div class="flex gap-2" role="group" aria-label="Filtrar por asistencia">
            <button
              v-for="f in filtros"
              :key="f.valor"
              type="button"
              class="rounded-full border px-4 py-2 text-sm transition"
              :class="
                filtro === f.valor
                  ? 'border-salvia-700 bg-salvia-700 text-crema-50'
                  : 'border-tierra-200 bg-white/70 text-tierra-600 hover:border-salvia-300'
              "
              :aria-pressed="filtro === f.valor"
              @click="filtro = f.valor"
            >
              {{ f.etiqueta }}
            </button>
          </div>
        </div>

        <p class="mt-4 text-sm text-tierra-500" aria-live="polite">
          Mostrando {{ filtradas.length }} de {{ total }} respuestas
        </p>

        <!-- Cargando -->
        <div v-if="cargando && total === 0" class="flex flex-col items-center py-20 text-tierra-500" role="status">
          <svg class="h-8 w-8 animate-spin text-oro-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.25" />
            <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
          <p class="mt-4 text-sm">Cargando respuestas…</p>
        </div>

        <!-- Sin datos -->
        <div
          v-else-if="filtradas.length === 0 && !errorDatos"
          class="mt-6 rounded-3xl border border-dashed border-oro-300 bg-white/50 py-16 text-center text-tierra-500"
        >
          {{ total === 0 ? 'Todavía no hay respuestas.' : 'Ninguna respuesta coincide con la búsqueda.' }}
        </div>

        <template v-else-if="filtradas.length > 0">
          <!-- Tabla (pantallas grandes) -->
          <div class="mt-6 hidden overflow-x-auto rounded-3xl border border-oro-200/70 bg-white/80 shadow-soft lg:block">
            <table class="w-full min-w-[60rem] text-left text-sm">
              <thead class="bg-salvia-50 text-xs uppercase tracking-widest text-tierra-500">
                <tr>
                  <th scope="col" class="px-4 py-3 font-medium">Fecha</th>
                  <th scope="col" class="px-4 py-3 font-medium">Nombre</th>
                  <th scope="col" class="px-4 py-3 font-medium">Asistencia</th>
                  <th scope="col" class="px-4 py-3 text-center font-medium">Acomp.</th>
                  <th scope="col" class="px-4 py-3 font-medium">Nombres acompañantes</th>
                  <th scope="col" class="px-4 py-3 font-medium">Alergias</th>
                  <th scope="col" class="px-4 py-3 font-medium">Canción</th>
                  <th scope="col" class="px-4 py-3 font-medium">Mensaje</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-tierra-100 align-top">
                <tr v-for="r in filtradas" :key="r.id" class="hover:bg-crema-100/60">
                  <td class="whitespace-nowrap px-4 py-3 text-tierra-500">{{ formatearFecha(r.creado_en) }}</td>
                  <td class="px-4 py-3 font-normal text-tierra-900">{{ r.nombre }}</td>
                  <td class="px-4 py-3">
                    <span
                      class="inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs"
                      :class="r.asistencia === 'si' ? 'bg-salvia-100 text-salvia-800' : 'bg-tierra-100 text-tierra-700'"
                    >
                      {{ etiquetaAsistencia(r.asistencia) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">{{ r.acompanantes }}</td>
                  <td class="max-w-[14rem] whitespace-pre-wrap break-words px-4 py-3">{{ r.nombres_acompanantes || '—' }}</td>
                  <td class="max-w-[14rem] whitespace-pre-wrap break-words px-4 py-3">{{ r.alergias || '—' }}</td>
                  <td class="max-w-[12rem] break-words px-4 py-3">{{ r.cancion || '—' }}</td>
                  <td class="max-w-[18rem] whitespace-pre-wrap break-words px-4 py-3">{{ r.mensaje || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Tarjetas (móvil y tablet) -->
          <ul class="mt-6 space-y-4 lg:hidden">
            <li v-for="r in filtradas" :key="r.id" class="rounded-3xl border border-oro-200/70 bg-white/80 p-5 shadow-soft">
              <div class="flex items-start justify-between gap-3">
                <p class="font-serif text-2xl leading-tight text-tierra-900">{{ r.nombre }}</p>
                <span
                  class="shrink-0 rounded-full px-3 py-1 text-xs"
                  :class="r.asistencia === 'si' ? 'bg-salvia-100 text-salvia-800' : 'bg-tierra-100 text-tierra-700'"
                >
                  {{ etiquetaAsistencia(r.asistencia) }}
                </span>
              </div>
              <p class="mt-1 text-xs text-tierra-400">{{ formatearFecha(r.creado_en) }}</p>

              <dl class="mt-4 space-y-3 text-sm">
                <div v-if="r.asistencia === 'si'">
                  <dt class="text-xs uppercase tracking-widest text-tierra-400">Acompañantes</dt>
                  <dd class="whitespace-pre-wrap break-words">
                    {{ r.acompanantes }}<template v-if="r.nombres_acompanantes"> · {{ r.nombres_acompanantes }}</template>
                  </dd>
                </div>
                <div v-if="r.alergias">
                  <dt class="text-xs uppercase tracking-widest text-tierra-400">Alergias</dt>
                  <dd class="whitespace-pre-wrap break-words">{{ r.alergias }}</dd>
                </div>
                <div v-if="r.cancion">
                  <dt class="text-xs uppercase tracking-widest text-tierra-400">Canción</dt>
                  <dd class="break-words">{{ r.cancion }}</dd>
                </div>
                <div v-if="r.mensaje">
                  <dt class="text-xs uppercase tracking-widest text-tierra-400">Mensaje</dt>
                  <dd class="whitespace-pre-wrap break-words">{{ r.mensaje }}</dd>
                </div>
              </dl>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </section>
</template>
