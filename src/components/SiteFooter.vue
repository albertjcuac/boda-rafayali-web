<script setup>
import { RouterLink } from 'vue-router'
import { boda } from '@/config/boda'
import { formatearFechaNumerica } from '@/utils/fechas'

const fecha = formatearFechaNumerica()
const anio = new Date().getFullYear()
</script>

<template>
  <footer class="relative border-t border-oro-200/60 bg-crema-200 px-6 py-16 text-center">
    <div class="mx-auto max-w-xl">
      <div class="flex items-center justify-center gap-3" aria-hidden="true">
        <span class="h-px w-12 bg-oro-300" />
        <span class="h-1.5 w-1.5 rotate-45 bg-oro-400" />
        <span class="h-px w-12 bg-oro-300" />
      </div>

      <p class="mt-8 font-serif text-4xl font-light text-tierra-900 sm:text-5xl">
        {{ boda.novios.primero }}
        <span class="italic text-oro-500">&amp;</span>
        {{ boda.novios.segundo }}
      </p>
      <p class="mt-4 text-sm uppercase tracking-[0.35em] text-oro-700">{{ fecha }}</p>
      <p class="mt-6 font-serif text-lg italic text-tierra-500">{{ boda.pie }}</p>

      <p class="mt-12 text-xs text-tierra-400">
        © {{ anio }} · Hecho con cariño
        <span aria-hidden="true">·</span>
        <RouterLink :to="{ name: 'admin' }" class="underline-offset-4 hover:text-tierra-600 hover:underline">
          Acceso novios
        </RouterLink>
      </p>
    </div>
  </footer>
</template>
