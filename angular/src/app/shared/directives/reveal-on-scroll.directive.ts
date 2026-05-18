import { Directive, ElementRef, inject, OnInit, input } from '@angular/core';
import { ScrollService } from '../../core/services/scroll.service';

/**
 * Uso:
 *   <h2 revealOnScroll>Hola</h2>
 *   <h2 revealOnScroll [delay]="200">Con delay (ms)</h2>
 *
 * Aplica .reveal al montar y .in cuando entra al viewport.
 * Consume el IntersectionObserver compartido del ScrollService
 * (no crea uno nuevo por elemento → rendimiento).
 */
@Directive({
  selector: '[revealOnScroll]',
  standalone: true,
  host: {
    'class': 'reveal',
  },
})
export class RevealOnScrollDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly scroll = inject(ScrollService);

  readonly delay = input<number>(0);

  ngOnInit(): void {
    const node = this.el.nativeElement;
    if (this.delay()) {
      node.style.transitionDelay = `${this.delay()}ms`;
    }
    this.scroll.observeReveal(node, () => node.classList.add('in'));
  }
}
