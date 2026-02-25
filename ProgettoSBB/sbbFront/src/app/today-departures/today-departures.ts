import { CommonModule } from '@angular/common';
// TODO 25-02-26 - rispetto a TodayArrivals: rimosso "computed" dagli import (non utilizzato)
import { Component, effect, inject, signal } from '@angular/core';
import { BookingService } from '../booking-service';
import { Booking } from '../model/hotel.entities';
import { UserService } from '../user-service';

@Component({
  selector: 'app-today-departures',
  imports: [CommonModule],
  templateUrl: './today-departures.html',
  styleUrl: './today-departures.css',
})
export class TodayDepartures {
  private bookingService = inject(BookingService);
  private userService = inject(UserService);
  loggedUser = this.userService.loggedUser;

  bookings = signal<Booking[]>([]);

  constructor() {
    effect(() => {
      const user = this.loggedUser();

      if (user && user.hotel?.id) {
        this.bookingService
            // TODO 25-02-26 - rispetto a TodayArrivals: chiama getTodaysDepartures invece di getTodaysArrivals
            .getTodaysDepartures(user.hotel.id)
            .subscribe({
                next: (json) => this.bookings.set(json),
                error: (err) => console.error(err)
            });
      }
    });
  }
}
