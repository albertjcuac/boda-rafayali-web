<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  align: { type: String, default: 'center' }, // 'center' | 'left'
  light: { type: Boolean, default: false }, // true sobre fondos oscuros
})
</script>

<template>
  <header v-reveal :class="align === 'center' ? 'text-center' : 'text-left'">
    <p v-if="eyebrow" class="eyebrow" :class="{ '!text-oro-200': light }">{{ eyebrow }}</p>
    <h2
      class="mt-3 font-serif text-4xl font-light sm:text-5xl"
      :class="light ? '!text-crema-50' : ''"
    >
      {{ title }}
    </h2>
    <div
      class="mt-5 flex items-center gap-3"
      :class="align === 'center' ? 'justify-center' : 'justify-start'"
      aria-hidden="true"
    >
      <span class="h-px w-12 bg-oro-300" />
      <span class="h-1.5 w-1.5 rotate-45 bg-oro-400" />
      <span class="h-px w-12 bg-oro-300" />
    </div>
  </header>
</template>
