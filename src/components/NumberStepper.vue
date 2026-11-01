<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 10 },
})
const emit = defineEmits(['update:modelValue'])

const cambiar = (delta) => {
  const nuevo = Math.min(props.max, Math.max(props.min, props.modelValue + delta))
  emit('update:modelValue', nuevo)
}
</script>

<template>
  <div class="flex items-center justify-center gap-8 py-2">
    <button
      type="button"
      class="flex h-14 w-14 items-center justify-center rounded-full border border-tierra-200 bg-white text-3xl leading-none text-tierra-700 transition hover:border-oro-400 hover:text-oro-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-tierra-200 disabled:hover:text-tierra-700"
      :disabled="modelValue <= min"
      aria-label="Un acompañante menos"
      @click="cambiar(-1)"
    >
      −
    </button>

    <output class="min-w-[4rem] text-center font-serif text-6xl font-light text-tierra-900" aria-live="polite">
      {{ modelValue }}
    </output>

    <button
      type="button"
      class="flex h-14 w-14 items-center justify-center rounded-full border border-tierra-200 bg-white text-3xl leading-none text-tierra-700 transition hover:border-oro-400 hover:text-oro-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-tierra-200 disabled:hover:text-tierra-700"
      :disabled="modelValue >= max"
      aria-label="Un acompañante más"
      @click="cambiar(1)"
    >
      +
    </button>
  </div>
</template>
