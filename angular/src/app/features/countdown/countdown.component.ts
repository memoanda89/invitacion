import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CountdownService } from '../../core/services/countdown.service';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

/**
 * Cuenta regresiva.
 * Lee directamente los signals del CountdownService — sin RxJS,
 * sin async pipe, sin lógica de tiempo en plantilla.
 *
 * `font-variant-numeric: tabular-nums` en CSS evita el salto de
 * dígitos durante los cambios.
 */
@Component({
  selector: 'app-countdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, RevealOnScrollDirective],
  template: `
    <section class="countdown" id="cuenta">
      <div class="container">
        <header class="section-head">
          <p class="eyebrow" revealOnScroll>Faltan</p>
          <h2 class="section-title" revealOnScroll [delay]="100">Para celebrar contigo</h2>
          <div class="divider-gold" revealOnScroll [delay]="200"></div>
        </header>

        <div class="countdown-grid" revealOnScroll [delay]="300">
          <div class="cd-cell">
            <div class="cd-number">{{ countdown.days() | number:'3.0-0' }}</div>
            <div class="cd-label">Días</div>
          </div>
          <div class="cd-cell">
            <div class="cd-number">{{ countdown.hours() | number:'2.0-0' }}</div>
            <div class="cd-label">Horas</div>
          </div>
          <div class="cd-cell">
            <div class="cd-number">{{ countdown.minutes() | number:'2.0-0' }}</div>
            <div class="cd-label">Minutos</div>
          </div>
          <div class="cd-cell">
            <div class="cd-number flip-trigger">{{ countdown.seconds() | number:'2.0-0' }}</div>
            <div class="cd-label">Segundos</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './countdown.component.scss',
})
export class CountdownComponent {
  readonly countdown = inject(CountdownService);
}
