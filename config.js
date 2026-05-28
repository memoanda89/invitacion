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
    venueName: 'El Tordillo Jardin De Eventos',
    addressLine1: 'Lib. Juventino Rosas S/N, 36441',
    addressLine2: 'San Francisco del Rincón, Gto.'
  },

  // ─────────────────────────────────────────────────────
  // RECEPCIÓN
  // ─────────────────────────────────────────────────────
  reception: {
    title: 'Recepción',
    icon: '❦',
    time: '8:30 pm',
    time24: '18:00 hrs',
      venueName: 'El Tordillo Jardin De Eventos',
    addressLine1: 'Lib. Juventino Rosas S/N, 36441',
    addressLine2: 'San Francisco del Rincón, Gto.',
    // Para los links de Google Maps, Apple Maps y Waze
    // Reemplaza espacios por +
    mapsQuery: 'El+Tordillo+Jardin+De+Eventos+Lib+Juventino+Rosas+San+Francisco+del+Rincon+Guanajuato'
  },

  // ─────────────────────────────────────────────────────
  // FOTOS — cambia los nombres de archivo aquí
  // Todas las fotos viven en assets/fotos/
  // ─────────────────────────────────────────────────────
  photos: {
    // Foto grande del hero (página principal)
    hero: 'assets/fotos/s43.jpg',

    // Pool de fotos del hero — se elige una al azar en cada visita
    heroPool: [
      'assets/fotos/s34.jpg',
      'assets/fotos/s38.jpg',
      'assets/fotos/s25.jpg',
      'assets/fotos/s26.jpg',
      'assets/fotos/s39.jpg'
    ],

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
    paragraph1: 'Hay encuentros que cambian el rumbo en silencio. El nuestro tuvo café, conversaciones largas y la certeza de que la vida iba a ser más amable de la mano.',
    quote: 'Amar no es mirarse uno al otro, sino mirar juntos en la misma dirección.',
    paragraph2: 'Hoy queremos celebrar este momento rodeados de las personas que han caminado con nosotros. Tu presencia hará que este día sea irrepetible.'
  },

  // ─────────────────────────────────────────────────────
  // CÓDIGO DE VESTIMENTA
  // ─────────────────────────────────────────────────────
  dressCode: {
    title: 'Formal elegante',
    description: 'Vestido largo o midi · Traje formal oscuro para caballeros · Te pedimos reservar el color blanco para la novia'
  },

  // ─────────────────────────────────────────────────────
  // HOSPEDAJE
  // ─────────────────────────────────────────────────────
  hotels: [
    {
      tag: 'Opción 1',
      name: 'Hotel Marcel',
      address: 'Tomas Padilla 105, Zona Centro',
      city: 'San Francisco del Rincón, Gto.',
      phone: '476 149 6535'
    },
    {
      tag: 'Opción 2',
      name: 'Hotel Margarita',
      address: 'Francisco I. Madero 610, Centro',
      city: 'San Francisco del Rincón, Gto.',
      phone: '476 744 3947'
    },
    {
      tag: 'Opción 3',
      name: 'Hotel Posada',
      address: 'C. Hermenegildo Bustos 110, Zona Centro',
      city: 'Purísima de Bustos, Gto.',
      phone: '476 112 7992'
    }
  ],

  // ─────────────────────────────────────────────────────
  // MESA DE REGALOS
  // ─────────────────────────────────────────────────────
  gifts: {
    liverpool: {
      number: '51982798',
      url: 'https://mesaderegalos.liverpool.com.mx/milistaderegalos/51982798'
    },
    palacio: {
      number: '406494',
      url: 'https://www.elpalaciodehierro.com/listaregalos?srsltid=AfmBOoqNO4CTCDmwyZlL25a5yrT0Q4Nlu22PkGi8EokubBASkVI6Fu1z#/event/406494'
    }
  },

  // ─────────────────────────────────────────────────────
  // LLUVIA DE SOBRES (datos bancarios)
  // ─────────────────────────────────────────────────────
  bank: {
    name: 'Banco santander',
    holder: 'luis guillermo anda reyes',
    clabe: '014225569337779277',
    account: '56933777927'
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
