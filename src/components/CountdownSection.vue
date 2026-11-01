<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { boda } from '@/config/boda'
import { useCountdown } from '@/composables/useCountdown'
import { formatearFechaLarga } from '@/utils/fechas'
import LeafBranch from './LeafBranch.vue'
import SectionTitle from './SectionTitle.vue'
import TimeUnit from './TimeUnit.vue'

const { fase, dias, horas, minutos, segundos, ceremoniaEmpezada } = useCountdown()
const fechaLarga = formatearFechaLarga()

const unidades = computed(() => [
  { etiqueta: 'Días', valor: dias.value },
  { etiqueta: 'Horas', valor: horas.value },
  { etiqueta: 'Minutos', valor: minutos.value },
  { etiqueta: 'Segundos', valor: segundos.value },
])

// Pétalos que caen el día de la boda (posiciones y tiempos aleatorios).
const petalos = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  tipo: i % 3,
  estilo: {
    left: `${Math.round(Math.random() * 100)}%`,
    '--size': `${10 + Math.round(Math.random() * 14)}px`,
    '--dur': `${(7 + Math.random() * 7).toFixed(1)}s`,
    '--delay': `${(-Math.random() * 12).toFixed(1)}s`,
    '--drift': `${Math.round(-70 + Math.random() * 140)}px`,
  },
}))
</script>

<template>
  <section
    id="cuenta-atras"
    class="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-salvia-800 to-salvia-900 px-6 py-24 text-crema-50 sm:py-32"
  >
    <LeafBranch class="pointer-events-none absolute -left-10 -top-6 h-72 rotate-[155deg] text-salvia-600/40" />
    <LeafBranch class="pointer-events-none absolute -bottom-10 -right-10 h-72 -rotate-[25deg] text-oro-400/20" />

    <!-- Pétalos: solo el día de la boda -->
    <div v-if="fase === 'hoy'" class="pointer-events-none absolute inset-0" aria-hidden="true">
      <span v-for="petalo in petalos" :key="petalo.id" class="petal" :class="`petal-${petalo.tipo}`" :style="petalo.estilo" />
    </div>

    <div class="relative mx-auto max-w-4xl text-center">
      <Transition name="fase" mode="out-in">
        <!-- ANTES de la boda: cuenta atrás -->
        <div v-if="fase === 'antes'" key="antes">
          <SectionTitle light eyebrow="Falta muy poco" title="Cuenta atrás" />

          <div class="mx-auto mt-14 grid max-w-3xl grid-cols-4 gap-2 sm:gap-6" role="timer" aria-label="Tiempo que falta para la boda">
            <TimeUnit v-for="u in unidades" :key="u.etiqueta" :valor="u.valor" :etiqueta="u.etiqueta" />
          </div>

          <p class="mt-12 font-serif text-xl italic text-salvia-100 sm:text-2xl">Nos vemos el {{ fechaLarga }}</p>

          <RouterLink :to="{ name: 'encuesta' }" class="btn-gold mt-10 px-10 py-4">
            Confirmar asistencia
          </RouterLink>
          <p v-if="boda.confirmarAntesDe" class="mt-4 text-sm text-salvia-200/80">
            Confírmanos tu asistencia antes del {{ boda.confirmarAntesDe }}.
          </p>
        </div>

        <!-- EL DÍA DE LA BODA: diseño festivo -->
        <div v-else-if="fase === 'hoy'" key="hoy">
          <p class="eyebrow !text-oro-200">{{ fechaLarga }}</p>

          <h2
            class="mt-6 animate-shimmer bg-gradient-to-r from-oro-300 via-crema-50 to-oro-300 bg-[length:200%_auto] bg-clip-text font-serif text-[length:clamp(2.75rem,10vw,6rem)] font-light italic leading-tight !text-transparent"
          >
            ¡Hoy es el gran día!
          </h2>

          <div class="mx-auto mt-8 h-14 w-14 animate-pulse-soft text-oro-300" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </div>

          <p class="mt-8 font-serif text-2xl italic text-salvia-100 sm:text-3xl">
            {{ boda.novios.primero }} y {{ boda.novios.segundo }} se dicen «sí, quiero»
          </p>

          <div v-if="!ceremoniaEmpezada" class="mt-12">
            <p class="mb-5 text-xs uppercase tracking-[0.3em] text-salvia-200/80">La ceremonia empieza en</p>
            <div class="flex justify-center gap-3 sm:gap-5" role="timer">
              <TimeUnit compacto etiqueta="Horas" :valor="horas" />
              <TimeUnit compacto etiqueta="Minutos" :valor="minutos" />
              <TimeUnit compacto etiqueta="Segundos" :valor="segundos" />
            </div>
          </div>
          <p v-else class="mt-10 text-lg text-salvia-100">¡Ya ha empezado la fiesta! Gracias por estar aquí.</p>
        </div>

        <!-- DESPUÉS de la boda -->
        <div v-else key="despues">
          <p class="eyebrow !text-oro-200">{{ fechaLarga }}</p>
          <h2 class="mt-6 font-serif text-[length:clamp(2.5rem,9vw,5rem)] font-light italic leading-tight !text-crema-50">
            ¡Lo hemos hecho!
          </h2>
          <p class="mx-auto mt-6 max-w-lg font-serif text-xl italic text-salvia-100 sm:text-2xl">
            Gracias por acompañarnos en el día más especial de nuestra vida.
          </p>
        </div>
      </Transition>
    </div>
  </section>
</template>
