import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { diaEnZona, fechaBoda } from '@/utils/fechas'

/**
 * Cuenta atrás hasta la hora de la ceremonia (src/config/boda.js).
 *
 * `fase` puede ser:
 *   - 'antes'   → todavía no es el día de la boda
 *   - 'hoy'     → es el día de la boda (diseño festivo)
 *   - 'despues' → la boda ya pasó
 */
export function useCountdown() {
  const ahora = ref(Date.now())
  let temporizador = null

  onMounted(() => {
    ahora.value = Date.now()
    // Se recalcula desde Date.now() cada segundo, así no se acumula desfase.
    temporizador = setInterval(() => {
      ahora.value = Date.now()
    }, 1000)
  })

  onBeforeUnmount(() => clearInterval(temporizador))

  const diaDeLaBoda = diaEnZona(fechaBoda)

  const fase = computed(() => {
    const hoy = diaEnZona(new Date(ahora.value))
    if (hoy === diaDeLaBoda) return 'hoy'
    return hoy < diaDeLaBoda ? 'antes' : 'despues'
  })

  const restante = computed(() => Math.max(0, fechaBoda.getTime() - ahora.value))

  const dias = computed(() => Math.floor(restante.value / 86_400_000))
  const horas = computed(() => Math.floor((restante.value % 86_400_000) / 3_600_000))
  const minutos = computed(() => Math.floor((restante.value % 3_600_000) / 60_000))
  const segundos = computed(() => Math.floor((restante.value % 60_000) / 1000))

  const ceremoniaEmpezada = computed(() => restante.value === 0)

  return { fase, dias, horas, minutos, segundos, ceremoniaEmpezada }
}
