// ============================================================================
//  CONFIGURACIÓN DE LA BODA
//  Aquí está todo lo que querrás personalizar: nombres, fecha, textos y mapas.
// ============================================================================

// ---------------------------------------------------------------------------
//  MAPAS DE GOOGLE MAPS
//  Cómo conseguir la URL de cada mapa:
//    1. Abre Google Maps y busca el lugar.
//    2. Pulsa "Compartir" → pestaña "Incorporar un mapa" → "Copiar HTML".
//    3. Del código copiado, quédate SOLO con lo que hay dentro de src="..."
//       (empieza por https://www.google.com/maps/embed?pb=...).
//  Las URLs de abajo son de ejemplo (apuntan a Madrid): sustitúyelas.
// ---------------------------------------------------------------------------
export const MAPA_IGLESIA_URL =
'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.88132319754!2d-5.995048924807511!3d37.392638772084105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd126c0569264e8b%3A0x5551ddd7337a70d5!2sIglesia%20de%20la%20Anunciaci%C3%B3n!5e0!3m2!1ses!2ses!4v1793549274032!5m2!1ses!2ses" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin">'
export const MAPA_HACIENDA_URL =
  'https://www.google.com/maps?q=Casa+de+Campo,+Madrid&output=embed'

// Enlaces para abrir cada lugar en la app de Google Maps (botón "Abrir en Google Maps").
// Puedes pegar aquí el enlace corto que te da el botón "Compartir" (https://maps.app.goo.gl/...).
export const ENLACE_IGLESIA_URL =
'https://maps.app.goo.gl/VQ2JSgqvcy6WyVQC7'
export const ENLACE_HACIENDA_URL =
  'https://www.google.com/maps/search/?api=1&query=Casa+de+Campo,+Madrid'

// ---------------------------------------------------------------------------
//  DATOS GENERALES
// ---------------------------------------------------------------------------
export const boda = {
  // Nombres que aparecen en el título, el menú y el pie de página.
  novios: {
    primero: 'Rafael',
    segundo: 'Alicia',
  },

  // Fecha y hora de la CEREMONIA, en formato ISO 8601 con zona horaria.
  // Verano en España (CEST) = +02:00 · Invierno (CET) = +01:00.
  // Ejemplo: 12 de junio de 2027 a las 17:00 → '2027-06-12T17:00:00+02:00'
  fecha: '2027-06-12T17:00:00+02:00',
  zonaHoraria: 'Europe/Madrid',

  // Frase corta bajo los nombres en la portada.
  mensajeHero: 'Nos casamos, y no sería lo mismo sin ti.',

  // Fecha límite para confirmar (texto libre). Déjalo vacío ('') para ocultarlo.
  confirmarAntesDe: '1 de mayo de 2027',

  // Máximo de acompañantes que se pueden indicar en la encuesta.
  maxAcompanantes: 5,

  // -------------------------------------------------------------------------
  //  FOTOS (opcional)
  //  1. Copia tus fotos en la carpeta  public/fotos/
  //  2. Escribe aquí la ruta relativa, por ejemplo: 'fotos/portada.jpg'
  //  Si lo dejas vacío ('') se muestra un degradado elegante en su lugar.
  // -------------------------------------------------------------------------
  imagenes: {
    hero: '', // Fondo de la portada (horizontal o vertical, se recorta al centro)
    historia: 'public/pexels-lauraoliveira-19448264.jpg', // Foto de la pareja para "Nuestra historia" (mejor vertical, 3:4)
  },

  // -------------------------------------------------------------------------
  //  NUESTRA HISTORIA — texto editable
  // -------------------------------------------------------------------------
  historia: {
    eyebrow: 'Cómo empezó todo',
    titulo: 'Nuestra historia',
    parrafos: [
      'Todo empezó con una conversación que ninguno de los dos pensaba alargar tanto. Un café que se enfrió, una tarde que se hizo noche y la sensación de que nos conocíamos desde siempre.',
      'Desde entonces hemos compartido viajes, risas, mudanzas, domingos de sofá y la certeza de que la vida es mejor en compañía. Hoy queremos dar un paso más y celebrarlo con las personas que más queremos.',
    ],
  },

  // -------------------------------------------------------------------------
  //  HORARIOS DEL DÍA — añade, quita o reordena las líneas que quieras
  // -------------------------------------------------------------------------
  horarios: [
    {
      hora: '16:30',
      titulo: 'Llegada de invitados',
      descripcion: 'Os esperamos en la puerta de la iglesia. Llegad con tiempo para encontrar sitio.',
    },
    {
      hora: '17:00',
      titulo: 'Ceremonia',
      descripcion: 'El momento más importante del día. ¡Que no falten los pañuelos!',
    },
    {
      hora: '18:30',
      titulo: 'Traslado a la hacienda',
      descripcion: 'Habrá autobús desde la iglesia. También podéis ir en vuestro coche.',
    },
    {
      hora: '19:30',
      titulo: 'Cóctel de bienvenida',
      descripcion: 'Aperitivos y bebidas en los jardines mientras nos hacemos las fotos.',
    },
    {
      hora: '21:30',
      titulo: 'Banquete',
      descripcion: 'Cena, brindis y discursos (cortos, lo prometemos).',
    },
    {
      hora: '23:30',
      titulo: 'Baile y fiesta',
      descripcion: 'Primer baile, barra libre y la música que nos habéis pedido.',
    },
  ],

  // -------------------------------------------------------------------------
  //  LUGARES (usa las constantes de mapas definidas arriba)
  // -------------------------------------------------------------------------
  lugares: [
    {
      id: 'iglesia',
      etiqueta: 'La ceremonia',
      nombre: 'Iglesia de la Anunciación', // ← cambia por el nombre real
      direccion: 'C. Laraña, s/n, Casco Antiguo, 41003 Sevilla', // ← cambia por la dirección real
      mapaEmbed: MAPA_IGLESIA_URL,
      mapaEnlace: ENLACE_IGLESIA_URL,
    },
    {
      id: 'hacienda',
      etiqueta: 'La celebración',
      nombre: 'Hacienda (nombre del lugar)', // ← cambia por el nombre real
      direccion: 'Dirección de la hacienda · Localidad', // ← cambia por la dirección real
      mapaEmbed: MAPA_HACIENDA_URL,
      mapaEnlace: ENLACE_HACIENDA_URL,
    },
  ],

  // Texto pequeño del pie de página.
  pie: 'Gracias por ser parte de nuestra historia.',
}
