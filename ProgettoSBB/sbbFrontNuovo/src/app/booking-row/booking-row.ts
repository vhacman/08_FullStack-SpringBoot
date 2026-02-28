import { Component, model, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../model/hotel.entities';
import { BookingService } from '../APIservices/booking/booking-service';

/**
 * Card di una singola prenotazione. Mostra i dati dell'ospite, le date e
 * i pulsanti di azione disponibili in base allo stato attuale della prenotazione.
 * I dati sensibili (codice fiscale, indirizzo) sono nascosti per default
 * e rivelati solo al click, per rispettare la privacy in ambienti condivisi.
 */
@Component({
  selector: 'app-booking-row',
  imports: [CommonModule],
  templateUrl: './booking-row.html',
  styleUrl: './booking-row.css',
})
export class BookingRow {

  // model() è diverso da input(): permette al padre di passare la prenotazione
  // E al figlio di aggiornarla localmente quando cambia stato (es. dopo check-in).
  // Senza model(), dovrei emettere un evento e lasciare che il padre aggiorni i dati.
  booking      = model.required<Booking>();
  checkInDone  = output<Booking>();
  completeDone = output<Booking>();

  private bookingService = inject(BookingService);

  // Signals booleani per il toggle privacy: false = nascosto (default)
  ssnVisible     = signal(false);
  addressVisible = signal(false);

  toggleSsn():     void { this.ssnVisible.update(v => !v);     }
  toggleAddress(): void { this.addressVisible.update(v => !v); }

  // La data di oggi in formato YYYY-MM-DD: serve per confrontare le date
  // delle prenotazioni e decidere quali pulsanti mostrare (es. checkout
  // è disponibile solo dal giorno della partenza in poi).
  readonly today = new Date().toISOString().split('T')[0];

  isToday(date: any):  boolean { return String(date) === this.today; }
  isPast(date: any):   boolean { return String(date) <   this.today; }
  isFuture(date: any): boolean { return String(date) >   this.today; }

  // Dopo ogni transizione di stato, aggiorno la prenotazione localmente
  // con lo spread operator { ...booking, status: nuovo } invece di ricaricare
  // dal server: è più veloce e non serve un'altra chiamata HTTP.
  // 'CHECKED_IN' as const dice a TypeScript che non è una stringa generica
  // ma esattamente quel letterale, così il tipo rimane BookingStatus.
  acceptBooking(): void {
    const id = this.booking().id ?? 0;
    this.bookingService.acceptBooking(id).subscribe({
      next: () => {
        const updated = { ...this.booking(), status: 'CHECKED_IN' as const };
        this.booking.set(updated);
        this.checkInDone.emit(updated);
      },
      error: err => console.error('Errore check-in:', err)
    });
  }

  cancel(): void {
    const id = this.booking().id ?? 0;
    this.bookingService.cancel(id).subscribe({
      next: () => {
        this.booking.set({ ...this.booking(), status: 'CANCELED' as const });
      },
      error: err => console.error('Errore cancel:', err)
    });
  }

  checkout(): void {
    const id = this.booking().id ?? 0;
    this.bookingService.checkout(id).subscribe({
      next: () => {
        this.booking.set({ ...this.booking(), status: 'CHECKED_OUT' as const });
      },
      error: err => console.error('Errore check-out:', err)
    });
  }

  complete(): void {
    const id = this.booking().id ?? 0;
    this.bookingService.complete(id).subscribe({
      next: () => {
        const updated = { ...this.booking(), status: 'COMPLETE' as const };
        this.booking.set(updated);
        this.completeDone.emit(updated);
      },
      error: err => console.error('Errore complete:', err)
    });
  }

  /** Mapper stato backend → testo italiano leggibile per l'interfaccia. */
  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING':     return 'In attesa';
      case 'CHECKED_IN':  return 'Ospite presente';
      case 'CHECKED_OUT': return 'Da pulire';
      case 'COMPLETE':    return 'Disponibile';
      case 'CANCELED':    return 'Cancellata';
      default:            return status;
    }
  }
}
