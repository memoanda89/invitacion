import { Injectable, signal } from '@angular/core';

export type WizardStep = 'search' | 'confirm' | 'success' | 'declined';

@Injectable({ providedIn: 'root' })
export class RsvpService {
  readonly currentStep = signal<WizardStep>('search');
  readonly submitting = signal(false);

  goTo(step: WizardStep): void {
    this.currentStep.set(step);
  }
}
