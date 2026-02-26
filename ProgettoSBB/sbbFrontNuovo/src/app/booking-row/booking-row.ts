import {Component, inject, model} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Booking} from '../model/hotel.entities';
import {BookingService} from '../booking-service';

/**
 * Componente che rappresenta una singola riga di prenotazione.
 * Riceve un Booking dal componente padre e gestisce le azioni su di esso.
 *
 * Logica pulsanti in base allo stato:
 *   SCHEDULED                        → [Check-in]
 *   EXECUTED + oggi == booking.to    → [Pulizie eseguite] (cleaned: false → true)
 *   EXECUTED + oggi >  booking.to    → indicatore cleaned read-only
 */
@Component({
  selector: 'app-booking-row',
  imports: [CommonModule],
  templateUrl: './booking-row.html',
  styleUrl: './booking-row.css',
})
export class BookingRow {
  booking = model.required<Booking>();
  bookingService = inject(BookingService);

  // Calcolo oggi una volta sola al momento della creazione del componente
  // e la tengo come stringa "YYYY-MM-DD" (es. "2026-02-26").
  // La uso per confrontarla con booking.to che arriva dal JSON nello stesso formato.
  // Non uso Date() per il confronto perché le date JavaScript hanno problemi
  // di timezone: toISOString() garantisce sempre il formato UTC corretto.
  readonly today = new Date().toISOString().split('T')[0];

  // Confronto stringhe invece di oggetti Date: "2026-02-26" === "2026-02-26".
  // Funziona perché il formato ISO YYYY-MM-DD è ordinabile lessicograficamente,
  // quindi < e > funzionano correttamente anche come stringhe.
  isToday(date: any): boolean {
    return String(date) === this.today;
  }

  // Uso < tra stringhe ISO: "2026-02-25" < "2026-02-26" è true → la data è nel passato.
  isPast(date: any): boolean {
    return String(date) < this.today;
  }

  // Più chiaro di !isToday() && !isPast() - una data è sempre oggi/passato/futuro
  isFuture(date: any): boolean {
    return String(date) > this.today;
  }

  doCheckIn(): void {
    const id = this.booking().id ?? 0;
    this.bookingService.doCheckIn(id).subscribe({
      // Aggiorno solo il campo status nel signal locale senza ricaricare dal server.
      // L'operatore spread {...old} crea un nuovo oggetto con tutti i campi precedenti
      // e sovrascrive solo status → il signal si aggiorna e Angular ridisegna la view.
      next:  () => this.booking.update(old => ({ ...old, status: 'EXECUTED' })),
      error: err => console.error('Errore check-in:', err)
    });
  }

  // Ho aggiunto questo metodo per gestire il click sul pulsante "Pulizie eseguite".
  // Chiama il backend per persistere il cambio, poi aggiorna il signal locale:
  // stesso pattern di doCheckIn() → il frontend non deve fare un'altra GET al server.
  setCleaned(): void {
    const id = this.booking().id ?? 0;
    this.bookingService.setCleaned(id).subscribe({
      next:  () => this.booking.update(old => ({ ...old, cleaned: true })),
      error: err => console.error('Errore pulizie:', err)
    });
  }
}
