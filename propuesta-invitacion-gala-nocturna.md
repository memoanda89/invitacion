# Propuesta Conceptual — Invitación Digital de Boda
## Estilo: Gala Nocturna de Lujo · Angular 18 · Alto Impacto

> Documento de validación previo al desarrollo. No incluye código de implementación; describe la dirección estética, arquitectura técnica, interactividad, flujo de RSVP y pautas de rendimiento para revisión conjunta antes de codificar.

---

## 1. Concepto Visual y Paleta de Colores

### Dirección estética

La invitación evoca el momento exacto en que se enciende el candelabro de un salón de gala: oscuridad envolvente, destellos dorados, texturas terciopeladas y luz dirigida que revela detalles. La narrativa visual prioriza el contraste profundo entre negros saturados y dorados cálidos, con vidrios traslúcidos (efecto glassmorphism nocturno) sobre fondos con grano sutil para evitar la planitud digital. Cada sección debe sentirse como una "escena" cinematográfica: la página no se navega, se *recorre*.

### Paleta principal

| Rol | Color | HEX | Uso |
|---|---|---|---|
| Fondo profundo | Noir vellum | `#0B0B0F` | Base de toda la SPA |
| Fondo elevado | Obsidian | `#15151C` | Tarjetas, modales, secciones secundarias |
| Acento primario | Champagne gold | `#C9A961` | Tipografía decorativa, líneas, CTAs |
| Acento luminoso | Aurum light | `#E8D9A8` | Hover, microdestellos, partículas |
| Texto principal | Ivory mist | `#F2EDE4` | Cuerpo de texto sobre fondo oscuro |
| Texto secundario | Pearl shadow | `#A89F92` | Subtítulos, metadatos |
| Acento dramático | Garnet velvet | `#5C1A2B` | Detalles puntuales (sellos, "Reservado") |

### Tipografías (Google Fonts)

La combinación recomendada es **Cormorant Garamond** (serif de alto contraste, italics con ductus caligráfico) para titulares y nombres de los novios, **Italiana** como display para los momentos hero (tamaños muy grandes, letterspacing amplio), e **Inter** como sans-serif neutra para cuerpo, formularios e información práctica. Esta tríada equilibra elegancia editorial con legibilidad funcional en pantalla pequeña.

Para fechas y números destacados (la cuenta regresiva, la hora del evento) sugiero **Cormorant en peso Light con `font-variant-numeric: tabular-nums`** para evitar el "salto" de dígitos durante la animación.

### Reglas de composición

El sistema visual descansa sobre cuatro principios: (a) generosidad de aire negativo —mínimo 120 px de respiración vertical entre bloques en desktop—, (b) un único elemento focal por viewport, (c) líneas doradas finas (1 px) como divisores ornamentales en lugar de bordes pesados, y (d) imágenes siempre tratadas con un overlay degradado oscuro inferior para preservar contraste con la tipografía.

---

## 2. Arquitectura de Componentes (Angular 18)

### Estrategia general

Angular 18 con **standalone components** (sin NgModules), **Signals** para estado reactivo, **`@defer`** para carga diferida declarativa, **SSR + hydration** para LCP rápido, y rutas con `loadComponent`. La aplicación es una SPA de una sola ruta visible (`/`) con anchors internos animados; un segmento secundario `/rsvp/:invitadoId` para el flujo de confirmación con enlace personalizado.

### Estructura de carpetas

```
src/app/
├── core/
│   ├── services/
│   │   ├── rsvp.service.ts          (HTTP + estado RSVP)
│   │   ├── scroll.service.ts        (IntersectionObserver centralizado)
│   │   ├── countdown.service.ts     (signal con tick de 1s)
│   │   └── analytics.service.ts
│   ├── tokens/                      (InjectionTokens config)
│   └── interceptors/
├── shared/
│   ├── ui/                          (átomos: button, input, divider-gold)
│   ├── directives/
│   │   ├── reveal-on-scroll.directive.ts
│   │   └── parallax.directive.ts
│   └── pipes/
├── features/
│   ├── hero/
│   │   └── hero.component.ts        (nombre, fecha, video/canvas de fondo)
│   ├── story/
│   │   └── story.component.ts       (timeline de la pareja)
│   ├── countdown/
│   │   └── countdown.component.ts
│   ├── event-details/
│   │   ├── ceremony.component.ts
│   │   └── reception.component.ts
│   ├── location/
│   │   ├── location.component.ts
│   │   └── map-embed.component.ts   (lazy, @defer on viewport)
│   ├── gallery/
│   │   ├── gallery.component.ts
│   │   └── lightbox.component.ts    (lazy, @defer on interaction)
│   ├── dress-code/
│   │   └── dress-code.component.ts
│   └── rsvp/
│       ├── rsvp.component.ts
│       ├── rsvp-form.component.ts
│       ├── rsvp-success.component.ts
│       └── guest-passes.component.ts
├── layout/
│   ├── shell.component.ts           (host de toda la SPA)
│   ├── nav-floating.component.ts    (nav minimal flotante)
│   └── footer.component.ts
└── app.routes.ts
```

### Principios de la arquitectura

Los componentes feature son **dumb / presentational** y reciben datos vía `input()` signals; toda la lógica vive en servicios `providedIn: 'root'` o en signals de un store ligero. La cuenta regresiva, por ejemplo, expone un `computed()` que cualquier componente puede consumir sin lógica duplicada. La directiva `revealOnScroll` reemplaza el uso disperso de IntersectionObserver para mantener un único observador compartido (rendimiento). El componente `MapEmbed` se monta solo cuando entra al viewport, evitando cargar la API de mapas en el primer paint.

### Comunicación entre secciones

Una `ScrollService` mantiene un signal `activeSection` que el nav flotante consume para resaltar el ancla actual. El RSVP publica eventos al `RsvpService` que actualizan un signal global; si el usuario regresa al hero ya confirmado, este muestra un sello dorado "Asistencia confirmada" sin recargar.

---

## 3. Interactividad y Animaciones Avanzadas

### Inventario de efectos

**Hero cinemático:** al cargar, los nombres de los novios aparecen letra por letra con un *stagger* de ~40 ms usando Web Animations API. Detrás, un canvas con partículas doradas flotando lentamente (50–80 partículas máximo, `requestAnimationFrame` pausado cuando la pestaña pierde foco). Opcional: video loop de 4–6 s en H.265 con poster blur-hash para evitar flash.

**Reveal on scroll:** cada sección entra con un fade + translate Y de 24 px y una línea dorada que se "dibuja" de izquierda a derecha (animación CSS `clip-path` o SVG `stroke-dashoffset`). La directiva usa un único `IntersectionObserver` compartido con `rootMargin: '-15% 0px'` para que el disparo ocurra cuando la sección está bien encuadrada.

**Cuenta regresiva:** dígitos con efecto *flip card* sutil al cambiar (rotación 3D de 180° en eje X, 300 ms). Solo se anima el dígito que cambia, no toda la tarjeta. Implementado con CSS transforms y `will-change: transform` solo durante el cambio.

**Galería:** cuadrícula masonry con hover que aplica un sutil *zoom + lift* (scale 1.03 + box-shadow dorada). Click abre lightbox con transición FLIP (la imagen "crece" desde su posición origen hasta el centro). Navegación con swipe en móvil usando Pointer Events.

**Parallax de capas:** en el hero y en la sección de ubicación, capas de fondo se desplazan a ~30 % de la velocidad del scroll. Implementado con `transform: translate3d()` actualizado dentro de un `requestAnimationFrame` controlado por `passive: true` scroll listener — NO con `background-attachment: fixed` (rompe en iOS).

**Microinteracciones:** botones con borde dorado que "se traza" en hover (200 ms), inputs con label flotante elegante, divisores ornamentales que respiran (animación `opacity` 4 s loop infinito muy sutil), cursor personalizado en desktop opcional (un punto dorado que sigue al mouse con delay).

### Implementación eficiente en Angular

Para animaciones de entrada/salida de componentes uso el paquete oficial `@angular/animations` con triggers declarativos. Para todo lo demás —especialmente partículas, parallax, y scroll-linked— uso **CSS puro + Web Animations API**, evitando librerías pesadas. Si la complejidad lo exige, **GSAP** se carga *dinámicamente* solo en desktop y solo cuando el primer scroll del usuario ocurre (no en el initial bundle).

Tres reglas no negociables: (1) toda animación que se dispare por scroll usa `IntersectionObserver`, jamás `window.scroll` con cálculos en cada tick; (2) `prefers-reduced-motion` se respeta globalmente con una clase en `<body>` que desactiva animaciones decorativas; (3) `will-change` se aplica **solo** durante la animación (vía clase agregada/removida), nunca de forma permanente —de lo contrario se penaliza la memoria GPU constantemente.

### Impacto en Core Web Vitals

El hero usa una imagen estática como LCP element (no el video ni el canvas), con `fetchpriority="high"` y `preload`. El canvas de partículas se inicializa **después** del evento `load`. La cuenta regresiva renderiza valores iniciales server-side para evitar CLS. Todas las imágenes tienen `width`, `height` y `aspect-ratio` declarados.

---

## 4. Flujo de Usuario — RSVP

### Filosofía del flujo

El RSVP debe sentirse como abrir un sobre lacrado, no como llenar un formulario web. Por eso el flujo se divide en **tres pasos cortos** (uno por pantalla, con transición horizontal entre ellos) en lugar de un formulario largo. Cada paso valida en tiempo real y permite retroceder sin perder datos.

### Acceso personalizado

Cada invitado recibe un enlace único `/rsvp/<token>`. Al abrir, el servicio resuelve el token contra el backend y precarga el nombre del invitado y los pases asignados. Si el token es inválido, se muestra una pantalla elegante con CTA a contactar a los novios. Esto convierte la confirmación en una experiencia personal: "Te esperamos, María" en lugar de un formulario genérico.

### Los tres pasos

**Paso 1 — Confirmación inicial.** Pantalla a página completa con el nombre del invitado en grande y dos botones: "Confirmo mi asistencia" (dorado, primario) y "No podré asistir" (outline, secundario). Si rechaza, se muestra un campo opcional de mensaje y termina el flujo con un agradecimiento.

**Paso 2 — Pases adicionales.** Solo si el invitado tiene pases extra asignados (`pasesPermitidos > 1`). Muestra `pasesPermitidos - 1` filas dinámicas donde escribe los nombres de sus acompañantes. Las filas se agregan/eliminan con animación suave (max-height transition). Si solo viene él/ella, este paso se omite automáticamente.

**Paso 3 — Detalles finales.** Campos opcionales: canción favorita para la pista, mensaje para los novios, teléfono de contacto (validado). Botón final "Sellar mi confirmación" que dispara una animación de sello lacre dorado cayendo sobre el nombre del invitado antes de redirigir a la pantalla de éxito.

### Pantalla de éxito

Después de confirmar, la pantalla muestra un sello dorado animado, los datos esenciales del evento (fecha, hora, lugar) y dos CTAs: "Agregar a mi calendario" (genera archivo `.ics` on the fly) y "Ver ubicación" (deep-link a Google/Apple Maps según OS). El estado se guarda en el backend y en `localStorage` para que al volver a abrir el enlace muestre directamente "Tu asistencia ya está confirmada" con opción de modificar.

### Lógica técnica

Formulario **reactivo** (`ReactiveFormsModule`) con validadores síncronos. El estado del wizard vive en un signal `currentStep` en el `RsvpService`. Los pases adicionales son un `FormArray` con validación de nombres mínimos. El envío es optimista: la UI muestra éxito mientras la petición se procesa, con rollback elegante si falla. Se respeta el **principio de no-bloqueo**: el usuario nunca ve un spinner cubriendo pantalla; las transiciones entre pasos sirven como duración natural para resolver la red.

### Accesibilidad

Cada paso es navegable por teclado, focus management automático al cambiar de paso (foco al primer input), `aria-live="polite"` para anunciar cambios de paso, etiquetas reales en todos los inputs (no solo placeholders), y contraste verificado AA mínimo sobre fondo oscuro.

---

## 5. Optimización Móvil y Rendimiento

### Estrategia Mobile-First

Todo el diseño se construye primero a 360 px de ancho y se escala hacia arriba. Los breakpoints sugeridos son 640, 1024 y 1440 px (con contenedor que centra a 1280 max). Tipografía con `clamp()` para escalado fluido sin media queries por tamaño. Tap targets mínimo 44×44 px. Gestos nativos en galería y wizard. Vibración háptica en móvil al confirmar RSVP (`navigator.vibrate(20)` donde esté disponible).

### Presupuestos de rendimiento (objetivo)

- **LCP** ≤ 2.0 s en 4G simulado.
- **CLS** ≤ 0.05.
- **INP** ≤ 200 ms.
- **JS inicial** ≤ 90 KB gzip (sin contar Angular core).
- **Imágenes hero** ≤ 120 KB en AVIF, fallback WebP, último fallback JPEG.

### Carga diferida con `@defer`

El nuevo bloque `@defer` de Angular es la herramienta central. La galería completa, el embed del mapa, el lightbox y el canvas de partículas se envuelven en `@defer (on viewport)` con un `@placeholder` que muestra un esqueleto dorado animado. La sección RSVP se carga con `@defer (on interaction)` cuando el usuario hace scroll cerca de ella o hace click en cualquier CTA "Confirmar". Esto saca del bundle inicial cerca de 60 % del JS de la aplicación.

### Imágenes y media

Todas las imágenes pasan por un pipeline que genera AVIF + WebP + JPEG en tres anchos (`srcset`), con `loading="lazy"` excepto la imagen del hero. La directiva `[ngOptimizedImage]` se usa donde aplique. El video del hero (si se incluye) es máximo 6 s, sin audio, `<video muted playsinline preload="none" poster="...">`. Se reemplaza por una imagen estática si `prefers-reduced-data` está activo.

### Service Worker y precarga

Service Worker de Angular (`@angular/service-worker`) configurado en modo `prefetch` para assets críticos y `lazy` para galería. La segunda visita debe ser instantánea. Fonts cargadas con `font-display: swap` + `preconnect` a Google Fonts. Considerar self-hosting de las tres fuentes en formato WOFF2 subset (solo glifos latinos usados) para eliminar dependencia externa y reducir ~80 KB.

### Renderizado

**SSR con hydration** habilitado para que el HTML llegue ya pintado: nombres de los novios, fecha y CTA principal son visibles sin esperar a que el JS termine de bootear. Angular 18 soporta *event replay* en hidratación, así que un click temprano no se pierde.

### Métricas en producción

Integrar `web-vitals` library + analytics propio (no Google Analytics pesado): cada métrica se envía con `navigator.sendBeacon()` al backend. Esto permite monitorear el rendimiento real de invitados en redes lentas y ajustar antes del evento.

---

## Siguiente paso sugerido

Si validas esta dirección, propongo arrancar por: (1) montar el esqueleto Angular 18 con SSR, las rutas y la `ScrollService`; (2) implementar Hero + Cuenta regresiva como prueba de concepto de la estética y las animaciones; (3) iterar visualmente sobre ese par antes de continuar con el resto de secciones. Cualquier sección de la propuesta puede ajustarse antes de empezar a codificar — dime qué pulir o profundizar.
