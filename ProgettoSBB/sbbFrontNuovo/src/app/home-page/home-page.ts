import { Component, signal } from '@angular/core';
import { TodaysArrivals } from '../todays-arrivals/todays-arrivals';
import { TodaysDepartures } from '../todays-departures/todays-departures';
import { InsertBooking } from '../insert-booking/insert-booking';

/**
 * Homepage dell'applicazione: mostra gli arrivi e le partenze di oggi
 * in due colonne affiancate, e permette di aprire il modal per una nuova prenotazione.
 * La logica è volutamente minima: il grosso del lavoro lo fanno
 * TodaysArrivals, TodaysDepartures e InsertBooking come componenti autonomi.
 */
@Component({
  selector: 'app-home-page',
  imports: [TodaysArrivals, TodaysDepartures, InsertBooking],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  showBookingModal = signal(false);

  openBookingModal():  void { this.showBookingModal.set(true);  }
  closeBookingModal(): void { this.showBookingModal.set(false); }
}
