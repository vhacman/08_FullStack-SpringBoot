import { Injectable, inject, signal } from '@angular/core';
import { GuestService } from '../APIservices/guest/guest-service';
import { Guest } from '../model/hotel.entities';

@Injectable({
  providedIn: 'root'
})
export class GuestLogicService {
  private guestService = inject(GuestService);

  // Lista ospiti: caricata una sola volta all'avvio (singleton)
  guests = signal<Guest[]>([]);

  constructor() {
    this.guestService.findAll().subscribe({
      next:  g   => this.guests.set(g),
      error: err => console.error('Errore caricamento ospiti:', err)
    });
  }

  filter(input: string): Guest[] {
    const s = input.toLowerCase().trim();
    if (!s) return this.guests();
    return this.guests().filter(g =>
      g.firstName.toLowerCase().includes(s) ||
      g.lastName.toLowerCase().includes(s)
    );
  }
}
