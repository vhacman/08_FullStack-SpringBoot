import { Component } from '@angular/core';
import { TodaysArrivals } from '../todays-arrivals/todays-arrivals';
import { InsertQuickBooking } from '../insert-quick-booking/insert-quick-booking';
import { TodaysDepartures } from '../todays-departures/todays-departures';

@Component({
  selector: 'app-home-page',
  imports: [TodaysArrivals, TodaysDepartures, InsertQuickBooking],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}
