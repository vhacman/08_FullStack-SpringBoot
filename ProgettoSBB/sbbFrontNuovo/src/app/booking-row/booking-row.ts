import {Component, inject, model, output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Booking} from '../model/hotel.entities';
import {BookingService} from '../services/booking/booking-service';

@Component({
  selector: 'app-booking-row',
  imports: [CommonModule],
  templateUrl: './booking-row.html',
  styleUrl: './booking-row.css',
})
export class BookingRow {
  booking = model.required<Booking>();
  checkInDone  = output<Booking>();
  cleanedDone  = output<Booking>();
  bookingService = inject(BookingService);

  ssnVisible = signal(false);
  addressVisible = signal(false);

  toggleSsn(): void {
    this.ssnVisible.update(v => !v);
  }

  toggleAddress(): void {
    this.addressVisible.update(v => !v);
  }

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
      next: () => {
        const updated = { ...this.booking(), status: 'EXECUTED' };
        this.booking.set(updated);
        this.checkInDone.emit(updated);
      },
      error: err => console.error('Errore check-in:', err)
    });
  }

  // Ho aggiunto questo metodo per gestire il click sul pulsante "Pulizie eseguite".
  // Chiama il backend per persistere il cambio, poi aggiorna il signal locale:
  // stesso pattern di doCheckIn() → il frontend non deve fare un'altra GET al server.
  setCleaned(): void {
    const id = this.booking().id ?? 0;
    this.bookingService.setCleaned(id).subscribe({
      next: () => {
        const updated = { ...this.booking(), cleaned: true };
        this.booking.set(updated);
        this.cleanedDone.emit(updated);
      },
      error: err => console.error('Errore pulizie:', err)
    });
  }
}
