import {Component, effect, inject, signal} from '@angular/core';
import {BookingRow} from '../booking-row/booking-row';
import {BookingService} from '../APIservices/booking/booking-service';
import { UserLogicService } from '../APIservices/user/user-logic-service';
import {Booking} from '../model/hotel.entities';

/**
 * Widget della homepage che mostra le prenotazioni in arrivo oggi (checkIn = oggi).
 * Separa i PENDING (da accettare) dai CHECKED_IN (già accolti) per dare
 * una visione immediata di cosa manca ancora da fare.
 * La separazione avviene lato frontend con filter(): il backend restituisce
 * tutte le prenotazioni di oggi, e noi le dividiamo in due liste distinte.
 */
@Component({
  selector: 'app-todays-arrivals',
  imports: [BookingRow],
  templateUrl: './todays-arrivals.html',
  styleUrl: './todays-arrivals.css',
})
export class TodaysArrivals
{
  private bookingService = inject(BookingService);
  private userLogicService = inject(UserLogicService);
  loggedUser = this.userLogicService.loggedUser;

  bookings = signal<Booking[]>([]);
  checkedInBookings = signal<Booking[]>([]);
  checkedInExpanded = signal(false);

  constructor()
  {
    effect(() =>
    {
      let user = this.loggedUser();
      if (user && user.hotel?.id)
      {
        this.loadBookings(user.hotel.id);
      }
    });
  }

  private loadBookings(hotelId: number): void
  {
    this.bookingService.getTodaysArrivals(hotelId).subscribe({
      next: (json) => {
        this.bookings.set(json.filter(b => b.status === 'PENDING'));
        this.checkedInBookings.set(json.filter(b => b.status === 'CHECKED_IN'));
      },
      error: (err) => console.error(err)
    });
  }

  // update() è l'alternativa a set() quando il nuovo valore dipende da quello vecchio.
  // Riceve una funzione che prende il valore corrente e restituisce quello nuovo.
  // Qui sposto la prenotazione dalla lista "da fare" a quella "già fatti" senza ricaricare dal server.
  onCheckInDone(booking: Booking): void {
    this.bookings.update(list => list.filter(b => b.id !== booking.id));
    this.checkedInBookings.update(list => [...list, booking]);
  }

  // Il toggle usa update() con v => !v: prende il booleano corrente e lo nega.
  // È il modo idiomatico Angular per invertire un Signal booleano.
  toggleCheckedIn(): void {
    this.checkedInExpanded.update(v => !v);
  }

  refresh(): void
  {
    const user = this.loggedUser();
    if (user && user.hotel?.id)
    {
      this.loadBookings(user.hotel.id);
    }
  }
}
