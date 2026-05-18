import { Injectable, computed, signal, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Cuenta regresiva centralizada con Signals.
 * Cualquier componente que la consuma se actualiza automáticamente
 * sin lógica duplicada ni cálculos en plantillas.
 *
 * En SSR no arranca el intervalo: el primer paint muestra valores
 * iniciales calculados sincrónicamente para evitar CLS.
 */
@Injectable({ providedIn: 'root' })
export class CountdownService implements OnDestroy {
  // Fecha del evento (configurable vía environment.ts en producción).
  private readonly targetDate = new Date('2026-10-17T18:00:00-06:00').getTime();

  private readonly nowMs = signal(Date.now());
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    if (this.isBrowser) {
      this.intervalId = setInterval(() => this.nowMs.set(Date.now()), 1000);
    }
  }

  /** Diferencia total en ms — siempre >= 0. */
  readonly diff = computed(() => Math.max(0, this.targetDate - this.nowMs()));

  readonly days = computed(() => Math.floor(this.diff() / 86_400_000));
  readonly hours = computed(() => Math.floor((this.diff() % 86_400_000) / 3_600_000));
  readonly minutes = computed(() => Math.floor((this.diff() % 3_600_000) / 60_000));
  readonly seconds = computed(() => Math.floor((this.diff() % 60_000) / 1000));

  readonly isLive = computed(() => this.diff() === 0);

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
