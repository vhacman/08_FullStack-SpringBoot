import { Component, inject, signal } from '@angular/core';
import { InsertGuest } from '../insert-guest/insert-guest';
import { GuestService } from '../APIservices/guest/guest-service';
import { Guest } from '../model/hotel.entities';

@Component({
  selector: 'app-menage-guests',
  imports: [InsertGuest],
  templateUrl: './menage-guests.html',
  styleUrl: './menage-guests.css',
})
export class MenageGuests {
  private guestService = inject(GuestService);

  guests = signal<Guest[]>([]);
  showModal = signal(false);

  constructor() {
    this.loadGuests();
  }

  private loadGuests(): void {
    this.guestService.findAll().subscribe({
      next: g => this.guests.set(g),
      error: err => console.error('Errore caricamento ospiti:', err)
    });
  }

  openModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onGuestCreated(_id: number): void {
    this.loadGuests();
    setTimeout(() => this.closeModal(), 1500);
  }
}
