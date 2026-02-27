import {Component, effect, inject, signal} from '@angular/core';
import {BookingRow} from '../booking-row/booking-row';
import {BookingService} from '../APIservices/booking/booking-service';
import {UserLogicService} from '../ComponentLogicService/user-logic-service';
import {Booking} from '../model/hotel.entities';
/**
 * Componente che mostra le prenotazioni in arrivo oggi per l'hotel dell'utente loggato.
 * Si aggiorna automaticamente al cambio dell'utente grazie agli Angular Signals.
 */
@Component({
  selector: 'app-todays-arrivals',
  imports: [BookingRow],
  templateUrl: './todays-arrivals.html',
  styleUrl: './todays-arrivals.css',
})
export class TodaysArrivals
{
  private bookingService   = inject(BookingService);
  private userLogicService = inject(UserLogicService);
  loggedUser = this.userLogicService.loggedUser;
  // Signal<Booking[]>: lista prenotazioni, si aggiorna tramite .set() → la view si ridisegna da sola
  bookings = signal<Booking[]>([]);
  checkedInBookings  = signal<Booking[]>([]);
  checkedInExpanded  = signal(false);

  constructor()
  {
    /*
     * effect() si comporta come un "ascoltatore":
     * ogni volta che loggedUser() cambia, questo blocco viene rieseguito automaticamente.
     * È il meccanismo reattivo di Angular Signals: niente subscribe manuale sul signal.
     */
    effect(() =>
    {
      let user = this.loggedUser();
      // Guardia: procedo solo se l'utente è loggato e ha un hotel associato
      if (user && user.hotel?.id)
      {
        this.loadBookings(user.hotel.id);
      }
    });
  }

  private loadBookings(hotelId: number): void
  {
    console.log("Caricamento per hotel:", hotelId);
    this.bookingService.getTodaysArrivals(hotelId).subscribe({
      next:  (json) => {
        this.bookings.set(json.filter(b => b.status === 'PENDING'));
        this.checkedInBookings.set(json.filter(b => b.status === 'CHECKED_IN'));
      },
      error: (err)  => console.error(err)
    });
  }

  onCheckInDone(booking: Booking): void {
    this.bookings.update(list => list.filter(b => b.id !== booking.id));
    this.checkedInBookings.update(list => [...list, booking]);
  }

  toggleCheckedIn(): void {
    this.checkedInExpanded.update(v => !v);
  }

  /** Ricarica manualmente gli arrivi di oggi */
  refresh(): void
  {
    const user = this.loggedUser();
    if (user && user.hotel?.id)
    {
      this.loadBookings(user.hotel.id);
    }
  }
}
