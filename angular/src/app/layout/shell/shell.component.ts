import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroComponent } from '../../features/hero/hero.component';
import { CountdownComponent } from '../../features/countdown/countdown.component';
import { NavFloatingComponent } from '../nav-floating/nav-floating.component';

/**
 * Shell de la SPA: orquesta el orden de secciones.
 *
 * Las secciones pesadas (galería, mapa, RSVP) se cargan con @defer
 * para sacarlas del bundle inicial. La cuenta regresiva y el hero
 * son críticos y entran eager.
 *
 * El placeholder de @defer muestra un esqueleto dorado mientras
 * se resuelve el chunk — sin layout shift.
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroComponent, CountdownComponent, NavFloatingComponent],
  template: `
    <app-nav-floating />

    <app-hero />

    @defer (on viewport; prefetch on idle) {
      <app-story />
    } @placeholder {
      <div class="skeleton-section" aria-hidden="true"></div>
    }

    <app-countdown />

    @defer (on viewport; prefetch on idle) {
      <app-event-details />
    } @placeholder { <div class="skeleton-section"></div> }

    @defer (on viewport) {
      <app-dress-code />
    }

    @defer (on viewport) {
      <app-gallery />
    } @placeholder { <div class="skeleton-section"></div> }

    @defer (on viewport) {
      <app-location />
    } @placeholder { <div class="skeleton-section"></div> }

    <!-- RSVP se hidrata en cuanto el usuario se acerca o interactúa con cualquier CTA "Confirmar" -->
    @defer (on viewport; on interaction; prefetch on idle) {
      <app-rsvp />
    } @placeholder { <div class="skeleton-section"></div> }

    @defer (on idle) {
      <app-footer />
    }
  `,
  styles: [`
    :host { display: block; }
    .skeleton-section {
      min-height: 60vh;
      background: linear-gradient(90deg, transparent, rgba(201,169,97,.04), transparent);
      background-size: 200% 100%;
      animation: shimmer 2s linear infinite;
    }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  `],
})
export class ShellComponent {}
