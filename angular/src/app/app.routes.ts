import { Routes } from '@angular/router';

/**
 * Rutas principales de la SPA.
 * - "/"            → Invitación pública (genérica)
 * - "/rsvp/:token" → Invitación personalizada por invitado
 *
 * Los componentes se cargan con loadComponent para lazy-load por ruta.
 * Dentro del shell, el lazy-load fino lo hacen los bloques @defer.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell.component').then(m => m.ShellComponent),
    title: 'Isabella & Sebastián · 17 de Octubre, 2026',
  },
  {
    path: 'rsvp/:token',
    loadComponent: () =>
      import('./layout/shell/shell.component').then(m => m.ShellComponent),
    title: 'Confirma tu asistencia',
    data: { rsvpDirect: true },
  },
  { path: '**', redirectTo: '' },
];
