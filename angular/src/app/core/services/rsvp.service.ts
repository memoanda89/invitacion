import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Guest {
  token: string;
  name: string;
  pasesPermitidos: number;
}

export interface RsvpPayload {
  token: string;
  willAttend: boolean;
  mainName: string;
  companions: string[];
  song?: string;
  message?: string;
  phone?: string;
}

export type WizardStep = 1 | 2 | 3 | 'success' | 'declined';

@Injectable({ providedIn: 'root' })
export class RsvpService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/rsvp';

  readonly guest = signal<Guest | null>(null);
  readonly currentStep = signal<WizardStep>(1);
  readonly submitting = signal(false);

  async loadGuestByToken(token: string): Promise<void> {
    // En producción: GET /api/guests/:token
    // Aquí placeholder con shape esperado:
    this.guest.set({
      token,
      name: 'Invitado',
      pasesPermitidos: 2,
    });
  }

  goTo(step: WizardStep): void {
    this.currentStep.set(step);
  }

  async submit(payload: RsvpPayload): Promise<void> {
    this.submitting.set(true);
    try {
      await firstValueFrom(this.http.post(this.endpoint, payload));
      this.goTo('success');
      // Persistir local para que al volver al enlace muestre estado.
      localStorage.setItem(`rsvp:${payload.token}`, JSON.stringify(payload));
    } catch (err) {
      // Rollback elegante: mantenemos el wizard en el paso 3 con un toast.
      console.error('RSVP submit failed', err);
      throw err;
    } finally {
      this.submitting.set(false);
    }
  }

  hasConfirmed(token: string): RsvpPayload | null {
    const raw = localStorage.getItem(`rsvp:${token}`);
    return raw ? (JSON.parse(raw) as RsvpPayload) : null;
  }
}
