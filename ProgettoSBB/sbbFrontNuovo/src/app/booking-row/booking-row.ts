import {Component, model, output, signal, inject} from '@angular/core';
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
  private bookingService = inject(BookingService);

  ssnVisible = signal(false);
  addressVisible = signal(false);

  toggleSsn(): void {
    this.ssnVisible.update(v => !v);
  }

  toggleAddress(): void {
    this.addressVisible.update(v => !v);
  }

  readonly today = new Date().toISOString().split('T')[0];

  isToday(date: any): boolean {
    return String(date) === this.today;
  }

  isPast(date: any): boolean {
    return String(date) < this.today;
  }

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

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'In attesa';
      case 'CHECKED_IN': return 'Ospite presente';
      case 'CHECKED_OUT': return 'Da pulire';
      case 'COMPLETE': return 'Disponibile';
      case 'CANCELED': return 'Cancellata';
      default: return status;
    }
  }
}
