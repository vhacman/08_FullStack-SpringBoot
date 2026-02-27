import {Component, inject, model, output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Booking} from '../model/hotel.entities';
import {BookingService} from '../APIservices/booking/booking-service';

@Component({
  selector: 'app-booking-row',
  imports: [CommonModule],
  templateUrl: './booking-row.html',
  styleUrl: './booking-row.css',
})
export class BookingRow {
  booking = model.required<Booking>();
  checkInDone  = output<Booking>();
  completeDone = output<Booking>();
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
        const updated = { ...this.booking(), status: 'CANCELED' as const };
        this.booking.set(updated);
      },
      error: err => console.error('Errore cancel:', err)
    });
  }

  checkout(): void {
    const id = this.booking().id ?? 0;
    this.bookingService.checkout(id).subscribe({
      next: () => {
        const updated = { ...this.booking(), status: 'CHECKED_OUT' as const };
        this.booking.set(updated);
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
}
