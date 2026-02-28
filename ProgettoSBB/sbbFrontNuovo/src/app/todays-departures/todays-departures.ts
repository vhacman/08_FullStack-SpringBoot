import {Component, effect, inject, signal} from '@angular/core';
import {Booking} from '../model/hotel.entities';
import {BookingService} from '../APIservices/booking/booking-service';
import { UserLogicService } from '../APIservices/user/user-logic-service';
import {BookingRow} from '../booking-row/booking-row';

/**
 * Widget della homepage che mostra le partenze di oggi (checkOut = oggi).
 * Distingue le prenotazioni ancora da gestire (CHECKED_IN o CHECKED_OUT)
 * da quelle già completate (COMPLETE), permettendo al personale di sapere
 * quali camere devono ancora essere pulite.
 * Come per gli arrivi, la divisione in due liste avviene lato frontend con filter():
 * il backend restituisce tutto, noi filtriamo in base allo stato.
 */
@Component({
  selector: 'app-todays-departures',
  imports: [BookingRow],
  templateUrl: './todays-departures.html',
  styleUrl: './todays-departures.css',
})
export class TodaysDepartures {
  private bookingService = inject(BookingService);
  private userLogicService = inject(UserLogicService);
  loggedUser = this.userLogicService.loggedUser;

  toCleanBookings = signal<Booking[]>([]); // partenze ancora da gestire (camera da pulire)
  cleanedBookings = signal<Booking[]>([]); // partenze già completate (camera pulita)
  cleanedExpanded = signal(false);         // true = sezione completate visibile nel template

  constructor() {
    effect(() => {
      const user = this.loggedUser();
      if (user && user.hotel?.id) {
        this.loadBookings(user.hotel.id);
      }
    });
  }

  /** Chiama il backend per le partenze di oggi e divide il risultato in due liste:
   *  quelle ancora da gestire (CHECKED_IN/CHECKED_OUT) e quelle già completate (COMPLETE). */
  private loadBookings(hotelId: number): void {
    this.bookingService.getTodaysDepartures(hotelId).subscribe({
      next: (json) => {
        this.toCleanBookings.set(json.filter(b => b.status === 'CHECKED_IN' || b.status === 'CHECKED_OUT'));
        this.cleanedBookings.set(json.filter(b => b.status === 'COMPLETE'));
      },
      error: (err) => console.error(err)
    });
  }

  /** Chiamato da BookingRow quando una camera viene marcata come pulita (COMPLETE).
   *  Sposta la prenotazione da toCleanBookings a cleanedBookings localmente,
   *  senza ricaricare dal server: più veloce e senza chiamate HTTP inutili. */
  onCleanedDone(booking: Booking): void {
    this.toCleanBookings.update(list => list.filter(b => b.id !== booking.id));
    this.cleanedBookings.update(list => [...list, booking]);
  }

  /** Espande o comprime la sezione delle partenze già completate nel template. */
  toggleCleaned(): void {
    this.cleanedExpanded.update(v => !v);
  }

  /** Ricarica le partenze dal server: usato dal pulsante di aggiornamento manuale nel template. */
  refresh(): void {
    const user = this.loggedUser();
    if (user && user.hotel?.id) {
      this.loadBookings(user.hotel.id);
    }
  }
}
