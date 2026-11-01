<script setup>
import { boda } from '@/config/boda'
import SectionTitle from './SectionTitle.vue'
</script>

<template>
  <section id="horarios" class="scroll-mt-20 bg-salvia-50/80 px-6 py-24 sm:py-32">
    <div class="mx-auto max-w-2xl">
      <SectionTitle eyebrow="El gran día" title="Horarios" />

      <!-- Línea de tiempo: la hora queda a la izquierda de la línea dorada -->
      <ol class="ml-[5.25rem] mt-16 border-l border-oro-300 sm:ml-28">
        <li
          v-for="(item, i) in boda.horarios"
          :key="`${item.hora}-${item.titulo}`"
          v-reveal="{ delay: i * 90 }"
          class="relative pb-12 pl-8 last:pb-0"
        >
          <time
            class="absolute -left-[5.25rem] top-0 w-[4.25rem] text-right font-serif text-xl leading-7 text-oro-700 sm:-left-28 sm:w-24 sm:text-3xl sm:leading-8"
          >
            {{ item.hora }}
          </time>
          <span
            class="absolute -left-[5px] top-2.5 h-2.5 w-2.5 rounded-full bg-oro-400 ring-4 ring-salvia-50"
            aria-hidden="true"
          />
          <h3 class="font-serif text-2xl text-tierra-900 sm:text-3xl">{{ item.titulo }}</h3>
          <p v-if="item.descripcion" class="mt-2 text-tierra-600">{{ item.descripcion }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
