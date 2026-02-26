import {Component, effect, inject, signal} from '@angular/core';
import {BookingRow} from '../booking-row/booking-row';
import {BookingService} from '../booking-service';
import {UserService} from '../user-service';
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
  private bookingService = inject(BookingService);
  private userService    = inject(UserService);
  // Signal<User | null>: valore reattivo — null finché l'utente non è loggato
  loggedUser = this.userService.loggedUser;
  // Signal<Booking[]>: lista prenotazioni, si aggiorna tramite .set() → la view si ridisegna da sola
  bookings = signal<Booking[]>([]);
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
        console.log("Caricamento per hotel:", user.hotel.id);
        // Chiamata HTTP al backend → subscribe gestisce risposta (next) ed errori (error)
        this.bookingService.getTodaysArrivals(user.hotel.id).subscribe({
          next:  (json) => this.bookings.set(json),   // aggiorna il signal con i dati ricevuti
          error: (err)  => console.error(err)         // logga l'errore senza bloccare l'app
        });
      }
    });
  }
}
