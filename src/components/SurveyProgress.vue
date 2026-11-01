<script setup>
import { computed } from 'vue'

const props = defineProps({
  actual: { type: Number, required: true }, // pregunta actual (1, 2, 3…)
  total: { type: Number, required: true },
})

const porcentaje = computed(() => Math.round((props.actual / props.total) * 100))
</script>

<template>
  <div>
    <div class="mb-3 flex items-baseline justify-between text-xs uppercase tracking-[0.25em] text-tierra-500">
      <span>Pregunta {{ actual }} de {{ total }}</span>
      <span class="text-oro-700">{{ porcentaje }}%</span>
    </div>
    <div
      class="h-1.5 w-full overflow-hidden rounded-full bg-tierra-100"
      role="progressbar"
      aria-label="Progreso de la encuesta"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="porcentaje"
    >
      <div
        class="h-full rounded-full bg-gradient-to-r from-oro-300 via-oro-400 to-salvia-400 transition-[width] duration-500 ease-out"
        :style="{ width: `${porcentaje}%` }"
      />
    </div>
  </div>
</template>
