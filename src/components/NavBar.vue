<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { boda } from '@/config/boda'

const route = useRoute()
const abierto = ref(false)
const conScroll = ref(false)

const inicial1 = boda.novios.primero.charAt(0)
const inicial2 = boda.novios.segundo.charAt(0)

const enlaces = [
  { etiqueta: 'Historia', hash: '#historia' },
  { etiqueta: 'Horarios', hash: '#horarios' },
  { etiqueta: 'Cómo llegar', hash: '#como-llegar' },
  { etiqueta: 'Cuenta atrás', hash: '#cuenta-atras' },
]

const alHacerScroll = () => {
  conScroll.value = window.scrollY > 24
}

onMounted(() => {
  alHacerScroll()
  window.addEventListener('scroll', alHacerScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', alHacerScroll))

// Cierra el menú móvil al navegar.
watch(
  () => route.fullPath,
  () => {
    abierto.value = false
  },
)

// Transparente solo en lo alto de la portada; sólido en el resto de casos.
const conFondo = computed(() => conScroll.value || abierto.value || route.name !== 'home')
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="
      conFondo
        ? 'bg-crema-50/90 shadow-[0_1px_0_0_rgba(207,170,94,0.25)] backdrop-blur-md'
        : 'bg-transparent'
    "
  >
    <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8" aria-label="Principal">
      <RouterLink :to="{ name: 'home' }" class="flex items-baseline gap-1.5 font-serif text-2xl text-tierra-900" aria-label="Ir al inicio">
        {{ inicial1 }}
        <span class="text-lg italic text-oro-500">&amp;</span>
        {{ inicial2 }}
      </RouterLink>

      <!-- Escritorio -->
      <ul class="hidden items-center gap-8 md:flex">
        <li v-for="enlace in enlaces" :key="enlace.hash">
          <RouterLink
            :to="{ name: 'home', hash: enlace.hash }"
            class="text-sm uppercase tracking-[0.2em] text-tierra-600 transition hover:text-oro-700"
          >
            {{ enlace.etiqueta }}
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'encuesta' }" class="btn-primary !px-6 !py-2.5 !text-xs">
            Confirmar asistencia
          </RouterLink>
        </li>
      </ul>

      <!-- Botón de menú móvil -->
      <button
        type="button"
        class="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-tierra-800 md:hidden"
        :aria-expanded="abierto"
        aria-controls="menu-movil"
        aria-label="Abrir menú"
        @click="abierto = !abierto"
      >
        <svg v-if="!abierto" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M4 8h16M4 16h16" />
        </svg>
        <svg v-else class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </nav>

    <!-- Menú móvil -->
    <Transition name="menu">
      <div v-if="abierto" id="menu-movil" class="border-t border-oro-200/50 bg-crema-50/95 px-5 pb-6 pt-2 md:hidden">
        <ul class="flex flex-col">
          <li v-for="enlace in enlaces" :key="enlace.hash">
            <RouterLink
              :to="{ name: 'home', hash: enlace.hash }"
              class="block border-b border-tierra-100 py-4 text-sm uppercase tracking-[0.25em] text-tierra-700"
            >
              {{ enlace.etiqueta }}
            </RouterLink>
          </li>
        </ul>
        <RouterLink :to="{ name: 'encuesta' }" class="btn-primary mt-6 w-full">
          Confirmar asistencia
        </RouterLink>
      </div>
    </Transition>
  </header>
</template>
