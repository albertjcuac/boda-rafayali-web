<script setup>
import { boda } from '@/config/boda'
import SectionTitle from './SectionTitle.vue'
</script>

<template>
  <section id="como-llegar" class="scroll-mt-20 px-6 py-24 sm:py-32">
    <div class="mx-auto max-w-6xl">
      <SectionTitle eyebrow="Dónde" title="Cómo llegar" />

      <div class="mt-16 grid gap-8 md:grid-cols-2">
        <article
          v-for="(lugar, i) in boda.lugares"
          :key="lugar.id"
          v-reveal="{ delay: i * 150 }"
          class="overflow-hidden rounded-[2rem] border border-oro-200/70 bg-white/70 shadow-soft"
        >
          <!-- Mapa de Google Maps. La URL se cambia en src/config/boda.js -->
          <div class="aspect-[4/3] w-full bg-salvia-100">
            <iframe
              :src="lugar.mapaEmbed"
              :title="`Mapa de ${lugar.nombre}`"
              class="h-full w-full border-0 saturate-[0.85]"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            />
          </div>

          <div class="p-7 sm:p-8">
            <p class="eyebrow">{{ lugar.etiqueta }}</p>
            <h3 class="mt-3 font-serif text-3xl text-tierra-900">{{ lugar.nombre }}</h3>
            <p class="mt-2 text-tierra-600">{{ lugar.direccion }}</p>
            <a
              :href="lugar.mapaEnlace"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-salvia-700 transition hover:text-salvia-900"
            >
              Abrir en Google Maps
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
