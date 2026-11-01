/**
 * Directiva v-reveal: el elemento aparece con una animación suave cuando entra en pantalla.
 *
 * Uso:
 *   <div v-reveal>…</div>
 *   <div v-reveal="{ delay: 200 }">…</div>   (retraso en milisegundos)
 *
 * Los estilos (.reveal / .is-visible) están en src/style.css.
 * Nota: no la uses en elementos que ya tengan clases `translate-*` o `rotate-*`.
 */
export const reveal = {
  beforeMount(el, binding) {
    el.classList.add('reveal')
    const retraso = binding.value?.delay ?? 0
    if (retraso) el.style.setProperty('--reveal-delay', `${retraso}ms`)
  },

  mounted(el) {
    // Navegadores muy antiguos: mostramos el contenido sin animar.
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            el.classList.add('is-visible')
            observador.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    observador.observe(el)
    el._observadorReveal = observador
  },

  unmounted(el) {
    el._observadorReveal?.disconnect()
  },
}
