import { Component, ChangeDetectionStrategy, inject, computed, OnInit } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RsvpService, type WizardStep } from '../../core/services/rsvp.service';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

/**
 * Wizard de RSVP — 3 pasos + 2 estados terminales (success / declined).
 *
 * Patrón:
 *  - FormBuilder con FormArray para acompañantes dinámicos.
 *  - El estado del paso vive en RsvpService (signal global).
 *  - Animación de entrada de cada paso = CSS keyframe disparado
 *    cuando cambia la clase .active (no animaciones de Angular,
 *    para no incluir runtime adicional).
 */
@Component({
  selector: 'app-rsvp',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RevealOnScrollDirective],
  templateUrl: './rsvp.component.html',
  styleUrl: './rsvp.component.scss',
})
export class RsvpComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  readonly rsvp = inject(RsvpService);

  readonly form = this.fb.nonNullable.group({
    mainName: ['', [Validators.required, Validators.minLength(2)]],
    companions: this.fb.array<string>([]),
    song: [''],
    message: [''],
    phone: [''],
  });

  // Computed convenience
  readonly maxCompanions = computed(() => (this.rsvp.guest()?.pasesPermitidos ?? 1) - 1);
  readonly canAddCompanion = computed(() => this.companions.length < this.maxCompanions());

  get companions(): FormArray { return this.form.controls.companions; }

  async ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) await this.rsvp.loadGuestByToken(token);
    if (this.maxCompanions() > 0) this.addCompanion();
  }

  accept(): void {
    this.rsvp.goTo(this.maxCompanions() > 0 ? 2 : 3);
  }

  decline(): void {
    this.rsvp.goTo('declined');
    // Aún sin pases podemos guardar el "no":
    this.rsvp.submit({
      token: this.rsvp.guest()?.token ?? '',
      willAttend: false,
      mainName: this.rsvp.guest()?.name ?? '',
      companions: [],
    });
  }

  next(step: WizardStep): void { this.rsvp.goTo(step); }
  back(): void {
    const cur = this.rsvp.currentStep();
    if (cur === 3) this.rsvp.goTo(this.maxCompanions() > 0 ? 2 : 1);
    else if (cur === 2) this.rsvp.goTo(1);
  }

  addCompanion(): void {
    if (!this.canAddCompanion()) return;
    this.companions.push(this.fb.nonNullable.control('', Validators.required));
  }

  removeCompanion(i: number): void {
    this.companions.removeAt(i);
  }

  async submit() {
    if (this.form.invalid) return;
    const guest = this.rsvp.guest();
    if (!guest) return;
    try {
      await this.rsvp.submit({
        token: guest.token,
        willAttend: true,
        mainName: this.form.controls.mainName.value,
        companions: this.companions.value as string[],
        song: this.form.controls.song.value || undefined,
        message: this.form.controls.message.value || undefined,
        phone: this.form.controls.phone.value || undefined,
      });
      this.fireConfetti();
    } catch {
      // Toast de error (no implementado aquí)
    }
  }

  /** Genera y descarga el .ics del evento. */
  addToCalendar(): void {
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Boda I&S//ES','BEGIN:VEVENT',
      'UID:isabella-sebastian-2026@boda',
      'DTSTAMP:20260101T000000Z',
      'DTSTART:20261018T000000Z',
      'DTEND:20261018T060000Z',
      'SUMMARY:Boda Isabella & Sebastián',
      'LOCATION:Hacienda Los Robles, Valle del Sol',
      'DESCRIPTION:Ceremonia 6:00 PM · Recepción 8:30 PM',
      'END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'boda-isabella-sebastian.ics';
    a.click(); URL.revokeObjectURL(url);
  }

  /** Confetti dorado se importa dinámicamente para no inflar bundle. */
  private async fireConfetti() {
    // const { fire } = await import('../../shared/utils/confetti');
    // fire();
  }
}
