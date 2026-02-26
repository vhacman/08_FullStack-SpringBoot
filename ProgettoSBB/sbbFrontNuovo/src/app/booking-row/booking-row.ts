import {Component, inject, model} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Booking} from '../model/hotel.entities';
import {BookingService} from '../booking-service';
/**
 * Componente che rappresenta una singola riga di prenotazione.
 * Riceve un Booking dal componente padre e gestisce le azioni su di esso.
 */
@Component({
  selector: 'app-booking-row',
  imports: [CommonModule], // fornisce le direttive base di Angular nel template HTML @if, @for
  templateUrl: './booking-row.html',
  styleUrl: './booking-row.css',
})
export class BookingRow {
  // model.required = signal bidirezionale: il padre passa il valore, questo componente può modificarlo
  // e la modifica si propaga automaticamente verso l'alto (two-way binding)
  booking = model.required<Booking>();
  bookingService = inject(BookingService);
  /**
   * Esegue il check-in della prenotazione corrente.
   * Chiama il backend e, solo in caso di successo, aggiorna lo stato locale del booking.
   */
  doCheckIn(): void {
    // Fallback a 0 se l'id è undefined, ma in condizioni normali non dovrebbe mai esserlo
    const id: number = this.booking().id ?? 0;
    this.bookingService.doCheckIn(id).subscribe({
      next: () => {
        // Non ricarica tutto dal server: aggiorna solo il campo status localmente.
        // L'operatore spread {...old} crea un nuovo oggetto mantenendo tutti i campi
        // precedenti e sovrascrivendo solo status → immutabilità del segnale
        this.booking.update(old => ({ ...old, status: "executed" }));
      },
      error: err => console.error('Errore durante il check-in:', err)
    });
  }
}
