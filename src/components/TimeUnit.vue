<script setup>
import { computed } from 'vue'

const props = defineProps({
  valor: { type: Number, required: true },
  etiqueta: { type: String, required: true },
  compacto: { type: Boolean, default: false },
})

// Siempre dos dígitos como mínimo (07, 12…). Los días pueden tener tres.
const texto = computed(() => String(props.valor).padStart(2, '0'))
</script>

<template>
  <div class="flex flex-col items-center">
    <div
      class="flex items-center justify-center overflow-hidden rounded-2xl border border-oro-300/40 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
      :class="
        compacto
          ? 'h-16 w-16 sm:h-20 sm:w-20'
          : 'h-[4.5rem] w-full max-w-[7.5rem] sm:h-28'
      "
    >
      <Transition name="tick" mode="out-in">
        <span
          :key="texto"
          class="font-serif font-light tabular-nums text-oro-200"
          :class="compacto ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-6xl'"
        >
          {{ texto }}
        </span>
      </Transition>
    </div>
    <span class="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-salvia-100/80 sm:text-xs">
      {{ etiqueta }}
    </span>
  </div>
</template>
