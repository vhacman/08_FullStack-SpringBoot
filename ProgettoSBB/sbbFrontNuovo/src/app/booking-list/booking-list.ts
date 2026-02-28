import { Component, computed, effect, inject, signal } from '@angular/core';
import { BookingRow } from '../booking-row/booking-row';
import { BookingService } from '../APIservices/booking/booking-service';
import { UserLogicService } from '../ComponentLogicService/user-logic-service';
import { Booking } from '../model/hotel.entities';

type FilterOption = 'TUTTI' | 'PENDING' | 'CHECKED_IN' | 'CHECKED_OUT' | 'COMPLETE' | 'CANCELED';

@Component({
  selector: 'app-booking-list',
  imports: [BookingRow],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.css',
})
export class BookingList {
  private bookingService = inject(BookingService);
  private userLogicService = inject(UserLogicService);
  private loggedUser = this.userLogicService.loggedUser;

  bookings = signal<Booking[]>([]);
  activeFilter = signal<FilterOption>('TUTTI');

  filtered = computed(() => {
    const f = this.activeFilter();
    const sorted = [...this.bookings()].sort((a, b) =>
      String(b.checkIn).localeCompare(String(a.checkIn))
    );
    return f === 'TUTTI' ? sorted : sorted.filter(b => b.status === f);
  });

  readonly filters: { label: string; value: FilterOption }[] = [
    { label: 'Tutti', value: 'TUTTI' },
    { label: 'In attesa', value: 'PENDING' },
    { label: 'Check-in', value: 'CHECKED_IN' },
    { label: 'Check-out', value: 'CHECKED_OUT' },
    { label: 'Completate', value: 'COMPLETE' },
    { label: 'Cancellate', value: 'CANCELED' },
  ];

  constructor() {
    effect(() => {
      const user = this.loggedUser();
      if (user && user.hotel?.id) {
        this.loadBookings(user.hotel.id);
      }
    });
  }

  private loadBookings(hotelId: number): void {
    this.bookingService.getByHotel(hotelId).subscribe({
      next: list => this.bookings.set(list),
      error: err => console.error('Errore caricamento prenotazioni:', err),
    });
  }

  countFor(status: FilterOption): number {
    if (status === 'TUTTI') return this.bookings().length;
    return this.bookings().filter(b => b.status === status).length;
  }

  setFilter(f: FilterOption): void {
    this.activeFilter.set(f);
  }

  refresh(): void {
    const user = this.loggedUser();
    if (user && user.hotel?.id) {
      this.loadBookings(user.hotel.id);
    }
  }
}
