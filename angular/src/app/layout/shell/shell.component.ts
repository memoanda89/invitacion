import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroComponent } from '../../features/hero/hero.component';
import { CountdownComponent } from '../../features/countdown/countdown.component';
import { RsvpComponent } from '../../features/rsvp/rsvp.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroComponent, CountdownComponent, RsvpComponent],
  template: `
    <app-hero />
    <app-countdown />
    <app-rsvp />
  `,
})
export class ShellComponent {}
