import {Component, effect, inject, signal} from '@angular/core';
import {Booking} from '../model/hotel.entities';
import {BookingService} from '../booking-service';
import {UserService} from '../user-service';
import {BookingRow} from '../booking-row/booking-row';

@Component({
  selector: 'app-todays-departures',
  imports: [BookingRow],
  templateUrl: './todays-departures.html',
  styleUrl: './todays-departures.css',
})
export class TodaysDepartures {
  private bookingService = inject(BookingService);
  private userService    = inject(UserService);
  loggedUser = this.userService.loggedUser;
  bookings = signal<Booking[]>([]);

  constructor() {
    effect(() => {
      const user = this.loggedUser();
      if (user && user.hotel?.id) {
        this.loadBookings(user.hotel.id);
      }
    });
  }

  private loadBookings(hotelId: number): void {
    this.bookingService.getTodaysDepartures(hotelId).subscribe({
      next:  (json) => this.bookings.set(json),
      error: (err)  => console.error(err)
    });
  }

  refresh(): void {
    const user = this.loggedUser();
    if (user && user.hotel?.id) {
      this.loadBookings(user.hotel.id);
    }
  }
}
