import { Injectable, signal, inject, PLATFORM_ID, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Observador de scroll centralizado.
 * Un único IntersectionObserver coordina:
 *  - Reveal de secciones al entrar al viewport (lo consume la directiva).
 *  - Sección activa para el nav lateral (signal `activeSection`).
 *
 * Centralizar evita decenas de observadores y mejora rendimiento.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly activeSection = signal<string>('hero');

  private revealObserver: IntersectionObserver | null = null;
  private navObserver: IntersectionObserver | null = null;
  private readonly revealCallbacks = new Map<Element, () => void>();

  constructor() {
    if (!this.isBrowser) return;

    this.revealObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.revealCallbacks.get(entry.target)?.();
            this.revealObserver?.unobserve(entry.target);
            this.revealCallbacks.delete(entry.target);
          }
        }
      },
      { rootMargin: '-12% 0px -12% 0px' }
    );

    this.navObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            this.activeSection.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    inject(DestroyRef).onDestroy(() => {
      this.revealObserver?.disconnect();
      this.navObserver?.disconnect();
    });
  }

  observeReveal(el: Element, onReveal: () => void): void {
    if (!this.revealObserver) return;
    this.revealCallbacks.set(el, onReveal);
    this.revealObserver.observe(el);
  }

  observeSection(el: Element): void {
    this.navObserver?.observe(el);
  }
}
