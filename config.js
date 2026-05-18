/* ============================================================
   CONFIGURACIÓN — Invitación de Boda
   ============================================================
   Edita SOLO este archivo para cambiar el contenido del sitio.
   Después de guardar, sube este archivo a GitHub y los cambios
   se reflejan automáticamente en la versión pública.
   ============================================================ */

const CONFIG = {

  // ─────────────────────────────────────────────────────
  // NOMBRES DE LOS NOVIOS
  // ─────────────────────────────────────────────────────
  couple: {
    bride: 'Sandy',
    groom: 'Memo'
  },

  // ─────────────────────────────────────────────────────
  // FECHA DEL EVENTO
  // ─────────────────────────────────────────────────────
  date: {
    // Fecha y hora reales del evento (formato ISO con zona horaria)
    // Zona horaria México centro = -06:00
    iso: '2026-10-03T18:00:00-06:00',

    // Formatos de presentación
    display: '03 de Octubre, 2026',     // Para meta tags y título
    long: '03 · Octubre · 2026',        // Hero principal + footer
    short: '03 · Oct · 2026',           // Pase digital
    deadline: '01 de septiembre de 2026' // Fecha límite RSVP
  },

  // ─────────────────────────────────────────────────────
  // CEREMONIA
  // ─────────────────────────────────────────────────────
  ceremony: {
    title: 'Ceremonia',
    icon: '✦',
    time: '6:00 pm',
    venueName: 'Catedral de San Gabriel',
    addressLine1: 'Av. Reforma 120',
    addressLine2: 'Centro Histórico'
  },

  // ─────────────────────────────────────────────────────
  // RECEPCIÓN
  // ─────────────────────────────────────────────────────
  reception: {
    title: 'Recepción',
    icon: '❦',
    time: '8:30 pm',
    time24: '18:00 hrs',
    venueName: 'Hacienda Los Robles',
    addressLine1: 'Camino al Lago 45',
    addressLine2: 'Valle del Sol',
    // Para los links de Google Maps, Apple Maps y Waze
    // Reemplaza espacios por +
    mapsQuery: 'Valle+del+Sol'
  },

  // ─────────────────────────────────────────────────────
  // FOTOS — cambia los nombres de archivo aquí
  // Todas las fotos viven en assets/fotos/
  // ─────────────────────────────────────────────────────
  photos: {
    // Foto grande del hero (página principal)
    hero: 'assets/fotos/s56.jpg',

    // Foto destacada entre Ubicación y Cuenta regresiva
    feature: 'assets/fotos/s26.jpg',

    // Foto al final, antes del footer
    farewell: 'assets/fotos/s40.jpg',

    // Las 10 fotos de la galería del index
    // Edita la lista para cambiar qué fotos aparecen
    gallery: [
      'assets/fotos/s02.jpg',
      'assets/fotos/s10.jpg',
      'assets/fotos/s19.jpg',
      'assets/fotos/s22.jpg',
      'assets/fotos/s32.jpg',
      'assets/fotos/s35.jpg',
      'assets/fotos/s40.jpg',
      'assets/fotos/s42.jpg',
      'assets/fotos/s46.jpg',
      'assets/fotos/s50.jpg'
    ]
  },

  // ─────────────────────────────────────────────────────
  // MÚSICA DE FONDO
  // ─────────────────────────────────────────────────────
  music: {
    // Archivo principal (recomendado: MP3 128 kbps mono, max 4 MB)
    src: 'assets/fondo.mp3',
    // Fallback opcional para navegadores que no soporten MP3
    ogg: 'assets/fondo.ogg',
    // Volumen inicial (0 a 1)
    volume: 0.4
  },

  // ─────────────────────────────────────────────────────
  // HISTORIA — Nuestra historia
  // ─────────────────────────────────────────────────────
  story: {
    paragraph1: 'Hay encuentros que cambian el rumbo en silencio. El nuestro tuvo café, conversaciones largas y la certeza —desde muy temprano— de que la vida iba a ser más amable de la mano.',
    quote: 'Donde tú estás, también está mi casa.',
    paragraph2: 'Hoy queremos celebrar este momento rodeados de las personas que han caminado con nosotros. Tu presencia hará que este día sea irrepetible.'
  },

  // ─────────────────────────────────────────────────────
  // CÓDIGO DE VESTIMENTA
  // ─────────────────────────────────────────────────────
  dressCode: {
    title: 'Formal elegante',
    description: 'Vestido largo o midi en tonos cálidos. Traje formal oscuro para caballeros. Te pedimos reservar el color blanco para la novia.'
  },

  // ─────────────────────────────────────────────────────
  // HOSPEDAJE
  // ─────────────────────────────────────────────────────
  hotels: [
    {
      tag: 'Opción 1',
      name: 'Hotel Hacienda Real',
      address: 'Camino al Lago 12, Valle del Sol',
      distance: 'A 5 min de la recepción',
      priceFrom: '$2,400',
      priceUnit: 'MXN / noche',
      code: 'SANDYMEMO2026'
    },
    {
      tag: 'Opción 2',
      name: 'Boutique San Gabriel',
      address: 'Av. Reforma 145, Centro Histórico',
      distance: 'A 10 min de la catedral',
      priceFrom: '$1,950',
      priceUnit: 'MXN / noche',
      code: 'BODA-SM'
    }
  ],

  // ─────────────────────────────────────────────────────
  // MESA DE REGALOS
  // ─────────────────────────────────────────────────────
  gifts: {
    liverpool: {
      number: '51234567',
      url: 'https://mesaderegalos.liverpool.com.mx/'
    },
    palacio: {
      number: '89012345',
      url: 'https://www.elpalaciodehierro.com/mesa-de-regalos'
    },
    amazon: {
      username: 'sandyymemo',
      url: 'https://www.amazon.com.mx/wedding/registry'
    }
  },

  // ─────────────────────────────────────────────────────
  // LLUVIA DE SOBRES (datos bancarios)
  // ─────────────────────────────────────────────────────
  bank: {
    name: 'BBVA México',
    holder: 'Sandra López',
    clabe: '012 345 67890123 4567',
    account: '1234 5678'
  },

  // ─────────────────────────────────────────────────────
  // RSVP
  // ─────────────────────────────────────────────────────
  rsvp: {
    // Pases por invitado (incluye al titular). 2 = titular + 1 acompañante
    totalPases: 3
  },

  // ─────────────────────────────────────────────────────
  // COMPARTIR (Open Graph para WhatsApp/Facebook)
  // ─────────────────────────────────────────────────────
  share: {
    siteUrl: 'https://memoanda89.github.io/invitacion/',
    ogImage: 'https://memoanda89.github.io/invitacion/assets/og-preview.jpg'
  }
};
