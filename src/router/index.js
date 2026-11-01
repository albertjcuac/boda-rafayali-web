import { createRouter, createWebHistory } from 'vue-router'
import { boda } from '@/config/boda'
import HomeView from '@/views/HomeView.vue'

const nombres = `${boda.novios.primero} & ${boda.novios.segundo}`

const router = createRouter({
  // BASE_URL vale "/" en local y "/boda-rafayali-web/" en producción (ver vite.config.js).
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { titulo: `${nombres} · Nuestra boda` },
    },
    {
      path: '/encuesta',
      name: 'encuesta',
      // Carga diferida: estas páginas solo se descargan cuando se visitan.
      component: () => import('@/views/SurveyView.vue'),
      meta: { titulo: `Confirmar asistencia · ${nombres}` },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { titulo: `Panel privado · ${nombres}` },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'no-encontrada',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { titulo: `Página no encontrada · ${nombres}` },
    },
  ],

  scrollBehavior(to, from, guardada) {
    // Si cambiamos de página esperamos a que termine la transición antes de hacer scroll.
    const espera = from.name && from.name !== to.name ? 450 : 0

    return new Promise((resolver) => {
      setTimeout(() => {
        if (guardada) resolver(guardada)
        else if (to.hash) resolver({ el: to.hash, top: 90, behavior: 'smooth' })
        else resolver({ top: 0 })
      }, espera)
    })
  },
})

router.afterEach((to) => {
  document.title = to.meta.titulo ?? `${nombres} · Nuestra boda`
})

export default router
