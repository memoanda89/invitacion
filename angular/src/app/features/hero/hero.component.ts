import {
  Component, ChangeDetectionStrategy, ElementRef, ViewChild,
  AfterViewInit, OnDestroy, inject, PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Hero cinemático.
 *
 * - Nombres con reveal letra por letra (Web Animations API).
 * - Canvas de partículas doradas (rAF, pausa cuando la pestaña pierde foco).
 * - Parallax sutil al hacer scroll (transform + passive listener).
 *
 * El canvas se inicializa después del primer paint (AfterViewInit + setTimeout 0)
 * para no penalizar el LCP. La imagen estática de fondo es el LCP element.
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('nameA') nameA!: ElementRef<HTMLSpanElement>;
  @ViewChild('nameB') nameB!: ElementRef<HTMLSpanElement>;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private rafId: number | null = null;
  private particles: Array<{x:number;y:number;r:number;vx:number;vy:number;o:number;tw:number}> = [];
  private paused = false;
  private resizeHandler = () => this.resizeCanvas();
  private visibilityHandler = () => { this.paused = document.hidden; };

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.splitText(this.nameA.nativeElement, 600);
    this.splitText(this.nameB.nativeElement, 1200);
    // Diferimos el canvas para no competir con el LCP.
    setTimeout(() => this.initParticles(), 0);
    window.addEventListener('resize', this.resizeHandler);
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.resizeHandler);
    document.removeEventListener('visibilitychange', this.visibilityHandler);
  }

  private splitText(el: HTMLElement, delayMs: number) {
    const text = el.textContent ?? '';
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'hero-letter';
      span.textContent = ch;
      el.appendChild(span);
      span.animate(
        [
          { opacity: 0, transform: 'translateY(40px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 900, delay: delayMs + i * 50, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' }
      );
    });
  }

  private initParticles() {
    this.resizeCanvas();
    const cnv = this.canvasRef.nativeElement;
    const ctx = cnv.getContext('2d')!;
    const count = window.innerWidth < 768 ? 35 : 60;
    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * cnv.offsetWidth,
      y: Math.random() * cnv.offsetHeight,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.25 - 0.05,
      o: Math.random() * 0.5 + 0.2,
      tw: Math.random() * Math.PI * 2,
    }));
    const loop = () => {
      if (!this.paused) {
        ctx.clearRect(0, 0, cnv.offsetWidth, cnv.offsetHeight);
        for (const p of this.particles) {
          p.x += p.vx; p.y += p.vy; p.tw += 0.02;
          if (p.y < -10) p.y = cnv.offsetHeight + 10;
          if (p.x < -10) p.x = cnv.offsetWidth + 10;
          if (p.x > cnv.offsetWidth + 10) p.x = -10;
          const tw = (Math.sin(p.tw) + 1) * 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 169, 97, ${p.o * tw})`;
          ctx.fill();
        }
      }
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  private resizeCanvas() {
    if (!this.canvasRef) return;
    const cnv = this.canvasRef.nativeElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cnv.width = cnv.offsetWidth * dpr;
    cnv.height = cnv.offsetHeight * dpr;
    const ctx = cnv.getContext('2d')!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
}
