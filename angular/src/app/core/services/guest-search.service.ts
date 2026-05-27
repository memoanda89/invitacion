import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface GuestRow {
  id: number;
  invitado: string;
  acompanantes: string[];   // arreglo: soporta 0, 1 o N acompañantes
}

export interface GuestGroup {
  row: GuestRow;
  members: string[];        // [invitado, ...acompanantes]
}

// ────────────────────────────────────────────────────────────────────────────
// Configura aquí la URL de tu Google Apps Script web app.
// Instrucciones: ver gas-script.js en la raíz del proyecto.
// Deja vacío ('') para modo demo: la búsqueda funciona pero no guarda en Sheets.
// ────────────────────────────────────────────────────────────────────────────
const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzBCvDqLDBXASV8W3Gv34aR7SecHc4YoVMX_5xTSS2UHl5FyP6P_DCfuQbzI3By0xHG/exec';

function normalize(s: string): string {
  return (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

@Injectable({ providedIn: 'root' })
export class GuestSearchService {
  private readonly http = inject(HttpClient);
  private guests: GuestRow[] = [];

  readonly loaded = signal(false);
  readonly loadError = signal(false);

  async loadGuests(): Promise<void> {
    if (this.loaded()) return;
    try {
      const data = await firstValueFrom(
        this.http.get<GuestRow[]>('assets/invitados.json')
      );
      this.guests = data;
      this.loaded.set(true);
    } catch {
      this.loadError.set(true);
    }
  }

  /**
   * Busca en el invitado principal Y en todos los acompañantes,
   * sin distinguir acentos ni mayúsculas.
   */
  search(query: string): GuestGroup[] {
    const q = normalize(query);
    if (q.length < 2) return [];

    return this.guests
      .filter(row =>
        normalize(row.invitado).includes(q) ||
        (row.acompanantes ?? []).some(a => normalize(a).includes(q))
      )
      .map(row => ({
        row,
        members: [row.invitado, ...(row.acompanantes ?? [])].filter(Boolean),
      }));
  }

  /**
   * Envía la confirmación al Google Apps Script (JSONP para evitar CORS).
   * Si GAS_ENDPOINT está vacío, retorna sin hacer nada (modo demo).
   */
  async confirm(
    id: number,
    asistentes: string[],
    phone: string
  ): Promise<void> {
    if (!GAS_ENDPOINT) return;

    const params = new URLSearchParams({
      action: 'confirm',
      id: String(id),
      phone,
      asistentes: asistentes.join('|'),
    });

    await firstValueFrom(
      this.http.jsonp<{ success: boolean }>(
        `${GAS_ENDPOINT}?${params}`,
        'callback'
      )
    );
  }
}
