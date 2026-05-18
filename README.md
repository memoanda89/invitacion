# Invitación Digital — Isabella & Sebastián
**Boda · Estilo Gala Nocturna · 17 de Octubre, 2026**

Este proyecto contiene **dos entregables paralelos**:

| Carpeta / Archivo | Propósito |
|---|---|
| `index.html` | Prototipo funcional de alta fidelidad. Abre en cualquier navegador sin instalación. Sirve para validar visualmente toda la experiencia. |
| `angular/` | Estructura del proyecto Angular 18 con componentes standalone, signals, SSR y `@defer`. Lista para escalar a producción. |
| `propuesta-invitacion-gala-nocturna.md` | Documento conceptual con las 5 secciones validadas (estética, arquitectura, animaciones, RSVP, rendimiento). |

---

## Cómo ver el prototipo HTML

Abre **`index.html`** directamente en tu navegador (doble click) o sirve la carpeta con cualquier servidor estático:

```bash
# Opción A: doble click sobre index.html

# Opción B: servidor local rápido
npx serve .
# o
python -m http.server 8000
```

No requiere instalar dependencias ni compilar. Las fuentes Google Fonts se cargan desde CDN.

---

## Personalización — qué editar en el HTML

Todo el contenido editable está al alcance de un buscador (Ctrl+F):

| Buscar | Reemplazar por |
|---|---|
| `Isabella` | Nombre de la novia |
| `Sebastián` | Nombre del novio |
| `17 · Octubre · 2026` | Fecha del evento (mostrada) |
| `2026-10-17T18:00:00-06:00` | Fecha real ISO con timezone (para countdown) |
| `Catedral de San Gabriel` | Lugar de ceremonia |
| `Hacienda Los Robles` | Lugar de recepción |
| `Valle del Sol` | Ciudad / región (para deep-links de mapas) |
| `Once años de un mismo latido` | Subtítulo de "Nuestra historia" |
| `TOTAL_PASES` (en el `<script>`) | Número de pases del invitado (incluye al titular) |
| `1 de septiembre de 2026` | Fecha límite de confirmación |

### Reemplazar la galería con fotos reales
Los `.gallery-item` actualmente usan gradientes decorativos. Para usar fotos:

```html
<!-- Antes -->
<div class="gallery-item"><div class="gph"></div></div>

<!-- Después -->
<div class="gallery-item">
  <img src="assets/galeria/01.jpg" loading="lazy" alt="" width="800" height="1067" />
</div>
```

Y agrega al CSS:
```css
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s var(--ease-out); }
.gallery-item:hover img { transform: scale(1.08); }
```

---

## Estructura del proyecto Angular 18

```
angular/
├── package.json
├── src/
│   ├── main.ts                                  # Bootstrap standalone
│   ├── styles.scss                              # Tokens globales
│   └── app/
│       ├── app.component.ts                     # Root con <router-outlet />
│       ├── app.config.ts                        # SSR + hydration + animations + HttpClient
│       ├── app.routes.ts                        # Lazy: "/" y "/rsvp/:token"
│       ├── core/services/
│       │   ├── countdown.service.ts             # Signals tabular-nums seguros en SSR
│       │   ├── scroll.service.ts                # IntersectionObserver compartido
│       │   └── rsvp.service.ts                  # Estado wizard + envío al backend
│       ├── shared/directives/
│       │   └── reveal-on-scroll.directive.ts    # [revealOnScroll] + delay()
│       ├── layout/
│       │   └── shell/shell.component.ts         # Orquesta secciones con @defer
│       └── features/
│           ├── hero/hero.component.ts           # Canvas partículas + letter-by-letter
│           ├── countdown/countdown.component.ts # Consume CountdownService
│           └── rsvp/rsvp.component.ts           # Wizard 3 pasos con FormArray
```

### Para terminar de scaffoldear el proyecto Angular

Las piezas críticas (servicios, directivas, hero, countdown, rsvp, shell, config) ya están. Faltan los componentes feature más simples (`story`, `event-details`, `dress-code`, `gallery`, `location`, `nav-floating`, `footer`) que se generan rápido:

```bash
cd angular
npm install
npx ng generate component features/story --standalone --change-detection=OnPush
npx ng generate component features/event-details --standalone --change-detection=OnPush
npx ng generate component features/dress-code --standalone --change-detection=OnPush
npx ng generate component features/gallery --standalone --change-detection=OnPush
npx ng generate component features/location --standalone --change-detection=OnPush
npx ng generate component layout/nav-floating --standalone --change-detection=OnPush
npx ng generate component layout/footer --standalone --change-detection=OnPush

# Habilitar SSR
npx ng add @angular/ssr
```

Toma el markup correspondiente de `index.html` y pásalo a cada template. La directiva `[revealOnScroll]` reemplaza a la clase `.reveal` (lo hace todo automáticamente).

---

## Conectar el RSVP a un backend

El servicio `RsvpService.submit()` ya hace `POST /api/rsvp`. Dos opciones rápidas:

1. **Firebase Firestore** — crea un documento por confirmación. Ideal por ser sin servidor y barato.
2. **Google Sheets vía Apps Script** — un endpoint `doPost` que agrega filas. Cero costo, muy práctico para una boda.
3. **Supabase** — si quieres dashboard + autenticación.

Payload que envía el servicio (`RsvpPayload`):
```json
{
  "token": "isabella-maria-001",
  "willAttend": true,
  "mainName": "María García",
  "companions": ["Juan García"],
  "song": "Frank Sinatra — Fly Me to the Moon",
  "message": "Los queremos mucho",
  "phone": "+52 55 1234 5678"
}
```

---

## Métricas objetivo (Core Web Vitals)

| Métrica | Objetivo | Cómo se logra |
|---|---|---|
| **LCP** | ≤ 2.0 s | SSR + hero text como LCP element (no el canvas), preconnect a fonts, `font-display: swap` |
| **CLS** | ≤ 0.05 | Aspect-ratios declarados en imágenes y countdown; tabular-nums |
| **INP** | ≤ 200 ms | OnPush, IntersectionObserver compartido, sin scroll listeners no-passive |
| **JS inicial** | ≤ 90 KB gzip | `@defer` envuelve galería, mapa, lightbox, confetti, RSVP |

---

## Siguiente paso recomendado

1. Abre `index.html` y valida la estética + animaciones en tu móvil.
2. Decide nombres reales, fecha, fotos. Edita el HTML con buscar/reemplazar.
3. Si validas la dirección, ejecuta `npm install` dentro de `angular/` y termina de generar los componentes faltantes.
4. Conecta el backend del RSVP.
5. Deploy: Vercel, Netlify, Cloudflare Pages — todos soportan Angular SSR.

---

Para iterar sobre cualquier sección, dime qué pulir y lo ajusto sin romper el resto.
