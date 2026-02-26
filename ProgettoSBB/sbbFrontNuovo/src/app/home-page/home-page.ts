import { Component } from '@angular/core';
import { TodaysArrivals } from '../todays-arrivals/todays-arrivals';
import { TodaysDepartures } from '../todays-departures/todays-departures';
import { InsertGuest } from '../insert-guest/insert-guest';
import { InsertQuickBooking } from '../insert-quick-booking/insert-quick-booking';

@Component({
  selector: 'app-home-page',
  imports: [TodaysArrivals, TodaysDepartures, InsertGuest, InsertQuickBooking],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}
