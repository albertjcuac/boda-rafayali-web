<script setup>
import { RouterLink } from 'vue-router'
import { boda } from '@/config/boda'
import { assetUrl } from '@/utils/assets'
import { formatearFechaLarga, formatearHora } from '@/utils/fechas'
import LeafBranch from './LeafBranch.vue'

const fechaLarga = formatearFechaLarga()
const hora = formatearHora()
const imagen = boda.imagenes.hero ? assetUrl(boda.imagenes.hero) : null
</script>

<template>
  <section
    id="inicio"
    class="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pb-24 pt-28 text-center"
  >
    <!-- Fondo: degradado elegante. -->
    <div class="absolute inset-0 -z-20 bg-gradient-to-b from-crema-50 via-salvia-50 to-salvia-100" />

    <!-- FOTO REAL: para usar una foto de portada, pon su ruta en src/config/boda.js (imagenes.hero). -->
    <template v-if="imagen">
      <div
        class="absolute inset-0 -z-20 bg-cover bg-center"
        :style="{ backgroundImage: `url(${imagen})` }"
      />
      <div class="absolute inset-0 -z-10 bg-crema-50/75" />
    </template>

    <!-- Manchas de luz doradas y salvia -->
    <div class="pointer-events-none absolute -left-24 top-1/4 -z-10 h-72 w-72 rounded-full bg-oro-200/40 blur-3xl" />
    <div class="pointer-events-none absolute -right-24 bottom-1/4 -z-10 h-80 w-80 rounded-full bg-salvia-200/60 blur-3xl" />

    <!-- Ramas decorativas -->
    <LeafBranch
      class="pointer-events-none absolute -left-8 bottom-0 -z-10 h-[52%] max-h-[24rem] animate-float text-salvia-300/60 sm:left-4"
    />
    <LeafBranch
      class="pointer-events-none absolute -right-8 top-20 -z-10 h-[46%] max-h-[22rem] rotate-[168deg] text-oro-300/60 sm:right-4"
    />

    <div class="mx-auto max-w-3xl">
      <p v-reveal class="eyebrow">¡Nos casamos!</p>

      <h1
        v-reveal="{ delay: 150 }"
        class="mt-6 font-serif text-[length:clamp(3.75rem,15vw,8.5rem)] font-light leading-[0.95] text-tierra-900"
      >
        {{ boda.novios.primero }}
        <span class="my-1 block text-[0.45em] italic text-oro-500">&amp;</span>
        {{ boda.novios.segundo }}
      </h1>

      <div v-reveal="{ delay: 300 }" class="mt-10 flex items-center justify-center gap-4 text-tierra-700">
        <span class="hidden h-px w-14 bg-oro-400 sm:block" />
        <p class="text-sm uppercase tracking-[0.28em] sm:text-base">{{ fechaLarga }}</p>
        <span class="hidden h-px w-14 bg-oro-400 sm:block" />
      </div>
      <p v-reveal="{ delay: 380 }" class="mt-2 text-sm tracking-[0.2em] text-tierra-500">{{ hora }} h</p>

      <p
        v-reveal="{ delay: 480 }"
        class="mx-auto mt-8 max-w-md font-serif text-xl italic text-tierra-600 sm:text-2xl"
      >
        {{ boda.mensajeHero }}
      </p>

      <div v-reveal="{ delay: 620 }" class="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <RouterLink :to="{ name: 'encuesta' }" class="btn-gold px-10 py-4">
          Confirmar asistencia
        </RouterLink>
        <RouterLink :to="{ name: 'home', hash: '#historia' }" class="btn-ghost">
          Nuestra historia
        </RouterLink>
      </div>
    </div>

    <!-- Indicador de scroll -->
    <div
      class="absolute bottom-6 left-1/2 h-12 w-px -translate-x-1/2 animate-scroll-cue bg-gradient-to-b from-oro-400 to-transparent"
      aria-hidden="true"
    />
  </section>
</template>
