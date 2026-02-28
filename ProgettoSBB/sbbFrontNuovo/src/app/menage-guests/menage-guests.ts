import { Component, inject, signal } from '@angular/core';
import { InsertGuest } from '../insert-guest/insert-guest';
import { GuestService } from '../APIservices/guest/guest-service';
import { Guest } from '../model/hotel.entities';

/**
 * Pagina di gestione ospiti: mostra la lista di tutti gli ospiti registrati
 * e permette di aggiungerne di nuovi tramite un modal con InsertGuest.
 * Dopo la creazione, la lista si aggiorna automaticamente e il modal si chiude
 * con un piccolo ritardo per dare il tempo al messaggio di successo di essere visto.
 */
@Component({
  selector: 'app-menage-guests',
  imports: [InsertGuest],
  templateUrl: './menage-guests.html',
  styleUrl: './menage-guests.css',
})
export class MenageGuests {

  private guestService = inject(GuestService);

  guests    = signal<Guest[]>([]);
  showModal = signal(false);

  constructor() {
    this.loadGuests();
  }

  private loadGuests(): void {
    this.guestService.findAll().subscribe({
      next:  g   => this.guests.set(g),
      error: err => console.error('Errore caricamento ospiti:', err)
    });
  }

  openModal():  void { this.showModal.set(true);  }
  closeModal(): void { this.showModal.set(false); }

  onGuestCreated(_id: number): void {
    this.loadGuests();
    // Il setTimeout dà il tempo a InsertGuest di mostrare il messaggio "salvato"
    // prima che il modal scompaia: senza ritardo la chiusura è troppo brusca.
    setTimeout(() => this.closeModal(), 1500);
  }
}
