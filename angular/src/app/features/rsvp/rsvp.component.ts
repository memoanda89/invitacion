import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { RsvpService } from '../../core/services/rsvp.service';
import { GuestSearchService, type GuestGroup } from '../../core/services/guest-search.service';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-rsvp',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScrollDirective],
  templateUrl: './rsvp.component.html',
  styleUrl: './rsvp.component.scss',
})
export class RsvpComponent implements OnInit {
  readonly rsvp = inject(RsvpService);
  private readonly guestSearch = inject(GuestSearchService);

  // ── Estado de búsqueda ────────────────────────────────────────────────────
  searchQuery = '';
  readonly searchResults = signal<GuestGroup[]>([]);
  readonly noResults = signal(false);

  // ── Estado de confirmación ────────────────────────────────────────────────
  readonly selectedGroup = signal<GuestGroup | null>(null);
  readonly selectedAttendees = signal<Set<string>>(new Set());
  phone = '';

  async ngOnInit(): Promise<void> {
    await this.guestSearch.loadGuests();
  }

  // ── Búsqueda ──────────────────────────────────────────────────────────────

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    const q = this.searchQuery.trim();
    if (q.length < 2) {
      this.searchResults.set([]);
      this.noResults.set(false);
      return;
    }
    const results = this.guestSearch.search(q);
    this.searchResults.set(results);
    this.noResults.set(results.length === 0);
  }

  selectGroup(group: GuestGroup): void {
    this.selectedGroup.set(group);
    this.selectedAttendees.set(new Set(group.members));
    this.rsvp.goTo('confirm');
  }

  // ── Confirmación ──────────────────────────────────────────────────────────

  toggleAttendee(name: string): void {
    const next = new Set(this.selectedAttendees());
    next.has(name) ? next.delete(name) : next.add(name);
    this.selectedAttendees.set(next);
  }

  isSelected(name: string): boolean {
    return this.selectedAttendees().has(name);
  }

  onPhoneInput(event: Event): void {
    this.phone = (event.target as HTMLInputElement).value;
  }

  backToSearch(): void {
    this.rsvp.goTo('search');
    this.searchResults.set([]);
    this.noResults.set(false);
    this.searchQuery = '';
  }

  async confirm(): Promise<void> {
    const group = this.selectedGroup();
    if (!group || this.selectedAttendees().size === 0) return;
    const asistentes = [...this.selectedAttendees()];

    this.rsvp.submitting.set(true);
    try {
      await this.guestSearch.confirm(group.row.id, asistentes, this.phone);
    } catch {
      // Optimistic: mostramos éxito aunque falle el guardado remoto.
    } finally {
      this.rsvp.submitting.set(false);
    }
    this.rsvp.goTo('success');
  }

  decline(): void {
    const group = this.selectedGroup();
    if (group) this.guestSearch.confirm(group.row.id, [], '').catch(() => {});
    this.rsvp.goTo('declined');
  }

  /** Genera y descarga el .ics del evento. */
  addToCalendar(): void {
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Boda I&S//ES', 'BEGIN:VEVENT',
      'UID:isabella-sebastian-2026@boda',
      'DTSTAMP:20260101T000000Z',
      'DTSTART:20261018T000000Z',
      'DTEND:20261018T060000Z',
      'SUMMARY:Boda Isabella & Sebastián',
      'LOCATION:Hacienda Los Robles, Valle del Sol',
      'DESCRIPTION:Ceremonia 6:00 PM · Recepción 8:30 PM',
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'boda-isabella-sebastian.ics';
    a.click(); URL.revokeObjectURL(url);
  }
}
