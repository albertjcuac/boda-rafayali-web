<script setup>
defineProps({
  etiqueta: { type: String, required: true },
  valor: { type: [Number, String], required: true },
  detalle: { type: String, default: '' },
  tono: { type: String, default: 'neutro' }, // 'neutro' | 'verde' | 'tierra' | 'oro'
})

const tonos = {
  neutro: 'text-tierra-900',
  verde: 'text-salvia-700',
  tierra: 'text-tierra-600',
  oro: 'text-oro-700',
}
</script>

<template>
  <div class="rounded-3xl border border-oro-200/70 bg-white/80 p-5 shadow-soft sm:p-6">
    <p class="text-[0.65rem] uppercase tracking-[0.25em] text-tierra-500 sm:text-xs">{{ etiqueta }}</p>
    <p class="mt-3 font-serif text-5xl font-light leading-none" :class="tonos[tono]">{{ valor }}</p>
    <p v-if="detalle" class="mt-2 text-xs text-tierra-400">{{ detalle }}</p>
  </div>
</template>
