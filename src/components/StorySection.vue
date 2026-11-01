<script setup>
import { boda } from '@/config/boda'
import { assetUrl } from '@/utils/assets'
import LeafBranch from './LeafBranch.vue'
import SectionTitle from './SectionTitle.vue'

const imagen = boda.imagenes.historia ? assetUrl(boda.imagenes.historia) : null
</script>

<template>
  <section id="historia" class="relative scroll-mt-20 overflow-hidden px-6 py-24 sm:py-32">
    <div class="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2 md:gap-20">
      <!-- Marco en arco para la foto -->
      <div v-reveal class="relative mx-auto w-full max-w-sm md:max-w-md">
        <div class="absolute -inset-3 translate-x-4 translate-y-4 rounded-b-[2rem] rounded-t-[999px] border border-oro-300" />
        <div
          class="relative aspect-[3/4] overflow-hidden rounded-b-[2rem] rounded-t-[999px] bg-gradient-to-br from-salvia-200 via-crema-300 to-oro-200 shadow-soft"
        >
          <!-- FOTO REAL: pon la ruta en src/config/boda.js (imagenes.historia). -->
          <img
            v-if="imagen"
            :src="imagen"
            :alt="`${boda.novios.primero} y ${boda.novios.segundo}`"
            class="h-full w-full object-cover"
            loading="lazy"
          />
          <div v-else class="flex h-full flex-col items-center justify-center gap-4 pt-10 text-salvia-700/60">
            <LeafBranch class="h-40 w-auto" />
            <p class="px-8 text-center text-xs uppercase tracking-[0.3em]">Aquí irá vuestra foto</p>
          </div>
        </div>
      </div>

      <div>
        <SectionTitle align="left" :eyebrow="boda.historia.eyebrow" :title="boda.historia.titulo" />
        <div class="mt-10 space-y-5 text-lg leading-relaxed text-tierra-700">
          <p v-for="(parrafo, i) in boda.historia.parrafos" :key="i" v-reveal="{ delay: 100 + i * 120 }">
            {{ parrafo }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
