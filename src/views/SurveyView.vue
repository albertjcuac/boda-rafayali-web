<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { boda } from '@/config/boda'
import { supabase, supabaseConfigurado } from '@/lib/supabase'
import LeafBranch from '@/components/LeafBranch.vue'
import NumberStepper from '@/components/NumberStepper.vue'
import SurveyProgress from '@/components/SurveyProgress.vue'

// ---------------------------------------------------------------------------
//  Respuestas del invitado
// ---------------------------------------------------------------------------
const respuestas = reactive({
  nombre: '',
  asistencia: '', // 'si' | 'no'
  acompanantes: 0,
  nombres_acompanantes: '',
  alergias: '',
  cancion: '',
  mensaje: '',
})

const asiste = computed(() => respuestas.asistencia === 'si')

// ---------------------------------------------------------------------------
//  Preguntas
//  - `visible`: función opcional; si devuelve false, la pregunta se salta.
//  - `obligatoria`: si es true, no se puede avanzar con el campo vacío.
//  Para añadir, quitar o reordenar preguntas basta con editar esta lista
//  (y añadir la columna correspondiente en la tabla de Supabase).
// ---------------------------------------------------------------------------
const preguntas = [
  {
    id: 'nombre',
    tipo: 'texto',
    titulo: '¿Cómo te llamas?',
    ayuda: 'Escribe tu nombre y apellidos.',
    placeholder: 'Nombre y apellidos',
    autocomplete: 'name',
    maxlength: 120,
    obligatoria: true,
  },
  {
    id: 'asistencia',
    tipo: 'opciones',
    titulo: '¿Podrás asistir?',
    ayuda: 'Cuéntanos si vas a poder acompañarnos.',
    obligatoria: true,
    opciones: [
      { valor: 'si', etiqueta: 'Sí, allí estaré', detalle: '¡Qué ilusión!' },
      { valor: 'no', etiqueta: 'Lo siento, no podré asistir', detalle: 'Te echaremos de menos.' },
    ],
  },
  {
    id: 'acompanantes',
    tipo: 'numero',
    titulo: '¿Cuántos acompañantes traerás?',
    ayuda: 'Sin contarte a ti. Si vienes solo o sola, déjalo en 0.',
    max: boda.maxAcompanantes,
    obligatoria: true,
    visible: () => asiste.value,
  },
  {
    id: 'nombres_acompanantes',
    tipo: 'textarea',
    titulo: '¿Cómo se llaman tus acompañantes?',
    ayuda: 'Nombre y apellidos de cada persona.',
    placeholder: 'Ej.: María López, Pablo Ruiz…',
    maxlength: 500,
    obligatoria: false,
    visible: () => asiste.value && respuestas.acompanantes > 0,
  },
  {
    id: 'alergias',
    tipo: 'textarea',
    titulo: '¿Alguna alergia, intolerancia o necesidad alimentaria?',
    ayuda: 'Incluye también a tus acompañantes. Si no hay ninguna, pulsa «Ninguna».',
    placeholder: 'Ej.: celiaquía, alergia a los frutos secos, menú vegetariano…',
    atajo: 'Ninguna',
    maxlength: 500,
    obligatoria: true,
    visible: () => asiste.value,
  },
  {
    id: 'cancion',
    tipo: 'texto',
    titulo: '¿Qué canción no puede faltar en la fiesta?',
    ayuda: 'Título y artista, para que no haya dudas.',
    placeholder: 'Ej.: Dancing Queen – ABBA',
    maxlength: 200,
    obligatoria: true,
    visible: () => asiste.value,
  },
  {
    id: 'mensaje',
    tipo: 'textarea',
    titulo: '¿Quieres dejarnos un mensaje?',
    ayuda: 'Unas palabras para los novios.',
    placeholder: 'Escribe aquí tu mensaje…',
    maxlength: 1000,
    obligatoria: false,
  },
]

// Solo las preguntas que corresponden según lo ya respondido.
const visibles = computed(() => preguntas.filter((p) => !p.visible || p.visible()))

// ---------------------------------------------------------------------------
//  Estado del asistente
// ---------------------------------------------------------------------------
const indice = ref(0)
const direccion = ref('adelante') // 'adelante' | 'atras' (sentido de la animación)
const errorCampo = ref('')
const errorEnvio = ref('')
const enviando = ref(false)
const enviado = ref(false)

const actual = computed(() => visibles.value[indice.value])
const esUltima = computed(() => indice.value === visibles.value.length - 1)
const nombrePila = computed(() => respuestas.nombre.trim().split(/\s+/)[0] ?? '')

// ---------------------------------------------------------------------------
//  Validación
// ---------------------------------------------------------------------------
function validar(pregunta) {
  const valor = respuestas[pregunta.id]

  if (pregunta.tipo === 'texto' || pregunta.tipo === 'textarea') {
    const texto = String(valor ?? '').trim()
    if (pregunta.obligatoria && !texto) return 'Este campo es obligatorio.'
    if (pregunta.id === 'nombre' && texto.split(/\s+/).length < 2) {
      return 'Escribe tu nombre y al menos un apellido.'
    }
  }

  if (pregunta.tipo === 'opciones' && !valor) return 'Elige una opción para continuar.'

  if (pregunta.tipo === 'numero') {
    if (!Number.isInteger(valor) || valor < 0 || valor > pregunta.max) {
      return `Indica un número entre 0 y ${pregunta.max}.`
    }
  }

  return ''
}

// ---------------------------------------------------------------------------
//  Navegación
// ---------------------------------------------------------------------------
function elegir(id, valor) {
  respuestas[id] = valor
  errorCampo.value = ''
}

function anterior() {
  if (enviando.value || indice.value === 0) return
  errorCampo.value = ''
  errorEnvio.value = ''
  direccion.value = 'atras'
  indice.value--
}

async function siguiente() {
  if (enviando.value) return // evita dobles pulsaciones
  errorEnvio.value = ''

  const mensaje = validar(actual.value)
  if (mensaje) {
    errorCampo.value = mensaje
    return
  }
  errorCampo.value = ''

  if (esUltima.value) {
    await enviar()
    return
  }
  direccion.value = 'adelante'
  indice.value++
}

// Al terminar la animación, pone el cursor en el campo de texto (si lo hay).
function enfocar(el) {
  el.querySelector('input, textarea')?.focus({ preventScroll: true })
}

// ---------------------------------------------------------------------------
//  Envío a Supabase
// ---------------------------------------------------------------------------
const limpiar = (texto) => {
  const valor = String(texto ?? '').trim()
  return valor === '' ? null : valor
}

function construirPayload() {
  const conAcompanantes = asiste.value && respuestas.acompanantes > 0
  return {
    nombre: respuestas.nombre.trim().replace(/\s+/g, ' '),
    asistencia: respuestas.asistencia,
    acompanantes: asiste.value ? respuestas.acompanantes : 0,
    nombres_acompanantes: conAcompanantes ? limpiar(respuestas.nombres_acompanantes) : null,
    alergias: asiste.value ? limpiar(respuestas.alergias) : null,
    cancion: asiste.value ? limpiar(respuestas.cancion) : null,
    mensaje: limpiar(respuestas.mensaje),
  }
}

function mensajeDeError(error) {
  const texto = String(error?.message ?? '').toLowerCase()
  if (!navigator.onLine || texto.includes('failed to fetch') || texto.includes('network')) {
    return 'Parece que no hay conexión a internet. Revísala e inténtalo de nuevo.'
  }
  if (error?.code === '42501' || texto.includes('row-level security')) {
    return 'No hemos podido guardar tu respuesta por un problema de permisos. Avisa a los novios, por favor.'
  }
  if (error?.code === '23514') {
    return 'Alguno de los datos no es válido (quizá un texto demasiado largo). Revísalos e inténtalo de nuevo.'
  }
  return 'No hemos podido enviar tu respuesta. Inténtalo de nuevo en unos instantes.'
}

async function enviar() {
  if (enviando.value || enviado.value) return

  if (!supabaseConfigurado) {
    errorEnvio.value = 'La encuesta todavía no está conectada a la base de datos. Avisa a los novios.'
    return
  }

  enviando.value = true
  try {
    // Importante: NO se encadena .select(). Los invitados (anónimos) solo pueden insertar,
    // no leer, y pedir de vuelta la fila insertada fallaría por las políticas RLS.
    const { error } = await supabase.from('respuestas_boda').insert(construirPayload())
    if (error) throw error

    enviado.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    console.error('[Encuesta] Error al guardar la respuesta:', error)
    errorEnvio.value = mensajeDeError(error)
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section
    class="relative isolate min-h-[100svh] overflow-hidden bg-gradient-to-b from-crema-50 via-salvia-50 to-crema-100 px-4 pb-20 pt-28 sm:pt-32"
  >
    <LeafBranch class="pointer-events-none absolute -right-10 top-24 -z-10 h-80 rotate-12 text-salvia-200/70" />
    <LeafBranch class="pointer-events-none absolute -left-12 bottom-10 -z-10 h-72 -rotate-[20deg] text-oro-200/60" />

    <div class="mx-auto w-full max-w-xl">
      <header class="mb-8 text-center">
        <p class="eyebrow">Confirmación de asistencia</p>
        <h1 class="mt-3 font-serif text-4xl font-light sm:text-5xl">
          {{ boda.novios.primero }} <span class="italic text-oro-500">&amp;</span> {{ boda.novios.segundo }}
        </h1>
        <p v-if="boda.confirmarAntesDe && !enviado" class="mt-3 text-sm text-tierra-500">
          Te pedimos que confirmes antes del {{ boda.confirmarAntesDe }}.
        </p>
      </header>

      <div
        v-if="!supabaseConfigurado"
        role="alert"
        class="mb-6 rounded-2xl border border-oro-300 bg-oro-50 p-4 text-sm text-tierra-700"
      >
        <strong class="font-medium">Falta configurar Supabase.</strong>
        La encuesta se puede probar, pero no guardará respuestas hasta que rellenes
        <code>.env.local</code> (mira el README).
      </div>

      <div class="rounded-[2rem] border border-oro-200/70 bg-white/80 p-6 shadow-soft backdrop-blur sm:p-10">
        <!-- ===== Pantalla final de agradecimiento ===== -->
        <div v-if="enviado" class="py-6 text-center" role="status">
          <div class="mx-auto flex h-20 w-20 animate-pop items-center justify-center rounded-full bg-salvia-100 text-salvia-700">
            <svg class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.2 4.2L19 7" />
            </svg>
          </div>

          <h2 class="mt-8 font-serif text-4xl font-light">
            {{ asiste ? `¡Gracias, ${nombrePila}!` : 'Gracias por avisarnos' }}
          </h2>
          <p class="mx-auto mt-4 max-w-sm text-tierra-600">
            <template v-if="asiste">
              Hemos guardado tu respuesta. Estamos deseando celebrarlo contigo.
            </template>
            <template v-else>
              Sentimos que no puedas venir, pero te agradecemos mucho que nos lo hayas dicho. Te llevaremos en el corazón ese día.
            </template>
          </p>

          <RouterLink :to="{ name: 'home' }" class="btn-primary mt-10">Volver al inicio</RouterLink>
        </div>

        <!-- ===== Asistente de preguntas ===== -->
        <form v-else novalidate @submit.prevent="siguiente">
          <SurveyProgress :actual="indice + 1" :total="visibles.length" />

          <div class="relative mt-8 min-h-[17rem]">
            <Transition :name="`paso-${direccion}`" mode="out-in" @after-enter="enfocar">
              <fieldset
                :key="actual.id"
                :disabled="enviando"
                :aria-labelledby="`q-${actual.id}`"
                class="m-0 min-w-0 border-0 p-0"
              >
                <h2 :id="`q-${actual.id}`" class="font-serif text-3xl font-light leading-tight text-tierra-900 sm:text-4xl">
                  {{ actual.titulo }}
                </h2>

                <p v-if="actual.ayuda || !actual.obligatoria" class="mt-3 text-tierra-500">
                  {{ actual.ayuda }}
                  <span
                    v-if="!actual.obligatoria"
                    class="ml-1 rounded-full bg-salvia-100 px-2.5 py-0.5 align-middle text-[0.65rem] uppercase tracking-wider text-salvia-700"
                  >
                    Opcional
                  </span>
                </p>

                <div class="mt-8">
                  <input
                    v-if="actual.tipo === 'texto'"
                    v-model="respuestas[actual.id]"
                    type="text"
                    class="field"
                    :placeholder="actual.placeholder"
                    :maxlength="actual.maxlength"
                    :autocomplete="actual.autocomplete ?? 'off'"
                    :aria-invalid="errorCampo ? 'true' : 'false'"
                    :aria-describedby="errorCampo ? 'error-campo' : undefined"
                  />

                  <textarea
                    v-else-if="actual.tipo === 'textarea'"
                    v-model="respuestas[actual.id]"
                    rows="4"
                    class="field resize-none"
                    :placeholder="actual.placeholder"
                    :maxlength="actual.maxlength"
                    :aria-invalid="errorCampo ? 'true' : 'false'"
                    :aria-describedby="errorCampo ? 'error-campo' : undefined"
                  />

                  <div v-else-if="actual.tipo === 'opciones'" role="radiogroup" :aria-labelledby="`q-${actual.id}`" class="grid gap-3">
                    <button
                      v-for="opcion in actual.opciones"
                      :key="opcion.valor"
                      type="button"
                      role="radio"
                      :aria-checked="respuestas[actual.id] === opcion.valor"
                      class="flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition"
                      :class="
                        respuestas[actual.id] === opcion.valor
                          ? 'border-oro-400 bg-oro-50 shadow-gold'
                          : 'border-tierra-200 bg-white/70 hover:border-salvia-300'
                      "
                      @click="elegir(actual.id, opcion.valor)"
                    >
                      <span
                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border"
                        :class="respuestas[actual.id] === opcion.valor ? 'border-oro-500' : 'border-tierra-300'"
                      >
                        <span v-if="respuestas[actual.id] === opcion.valor" class="h-2.5 w-2.5 rounded-full bg-oro-500" />
                      </span>
                      <span>
                        <span class="block font-normal text-tierra-900">{{ opcion.etiqueta }}</span>
                        <span class="block text-sm text-tierra-500">{{ opcion.detalle }}</span>
                      </span>
                    </button>
                  </div>

                  <NumberStepper
                    v-else-if="actual.tipo === 'numero'"
                    v-model="respuestas[actual.id]"
                    :min="0"
                    :max="actual.max"
                  />

                  <button
                    v-if="actual.atajo"
                    type="button"
                    class="mt-3 rounded-full border border-salvia-300 px-4 py-1.5 text-sm text-salvia-700 transition hover:bg-salvia-100"
                    @click="elegir(actual.id, actual.atajo)"
                  >
                    {{ actual.atajo }}
                  </button>
                </div>
              </fieldset>
            </Transition>
          </div>

          <!-- Errores -->
          <p v-if="errorCampo" id="error-campo" role="alert" class="mt-4 text-sm text-rose-700">
            {{ errorCampo }}
          </p>
          <div
            v-if="errorEnvio"
            role="alert"
            class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          >
            {{ errorEnvio }}
          </div>

          <!-- Botones -->
          <div class="mt-8 flex items-center justify-between gap-4">
            <button type="button" class="btn-ghost" :disabled="indice === 0 || enviando" @click="anterior">
              Anterior
            </button>

            <button type="submit" class="btn-primary min-w-[10.5rem]" :disabled="enviando">
              <svg v-if="enviando" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.25" />
                <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              </svg>
              {{ enviando ? 'Enviando…' : esUltima ? 'Enviar respuesta' : 'Siguiente' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
