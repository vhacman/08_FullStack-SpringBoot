import { Component, signal } from '@angular/core';
import { TodaysArrivals } from '../todays-arrivals/todays-arrivals';
import { TodaysDepartures } from '../todays-departures/todays-departures';
import { InsertBooking } from '../insert-booking/insert-booking';

@Component({
  selector: 'app-home-page',
  imports: [TodaysArrivals, TodaysDepartures, InsertBooking],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  showBookingModal = signal(false);

  openBookingModal(): void  { this.showBookingModal.set(true);  }
  closeBookingModal(): void { this.showBookingModal.set(false); }
}
