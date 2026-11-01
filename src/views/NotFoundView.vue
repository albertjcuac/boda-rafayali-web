<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="flex min-h-[80vh] flex-col items-center justify-center px-6 pb-16 pt-28 text-center">
    <p class="eyebrow">Error 404</p>
    <h1 class="mt-4 font-serif text-5xl font-light sm:text-6xl">Esta página no existe</h1>
    <p class="mt-4 max-w-md text-tierra-600">
      Puede que el enlace esté mal escrito. Pero la fiesta sigue en pie: vuelve al inicio.
    </p>
    <RouterLink :to="{ name: 'home' }" class="btn-primary mt-10">Volver al inicio</RouterLink>
  </section>
</template>
