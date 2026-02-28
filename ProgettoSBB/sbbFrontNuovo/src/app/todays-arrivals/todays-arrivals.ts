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

  // L'effect si esegue automaticamente ogni volta che loggedUser() cambia.
  // Appena il login va a buon fine e l'utente ha un hotel associato,
  // triggera il primo caricamento dei dati. Usato solo nel costruttore
  // perché deve partire una sola volta all'avvio del componente.
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

  // Chiama il backend per ottenere tutte le prenotazioni con checkIn = oggi.
  // Il backend restituisce un array misto: noi lo splittiamo in due Signal
  // distinti con filter() lato frontend, così il template può mostrare
  // le due liste separatamente senza una seconda chiamata HTTP.
  // Privato perché è un dettaglio implementativo: dall'esterno si usa refresh().
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

  // Chiamato da BookingRow tramite output (checkInDone) quando il receptionist
  // fa il check-in di un ospite. Aggiorna le due liste localmente senza
  // ricaricare dal server: rimuove la prenotazione dai PENDING e la aggiunge
  // ai CHECKED_IN. update() è usato al posto di set() perché il nuovo valore
  // dipende da quello corrente (serve la lista attuale per filtrarla o estenderla).
  onCheckInDone(booking: Booking): void {
    this.bookings.update(list => list.filter(b => b.id !== booking.id));
    this.checkedInBookings.update(list => [...list, booking]);
  }

  // Chiamato dal template sul click dell'header della sezione "già accolti".
  // update(v => !v) è il modo idiomatico Angular Signals per invertire un booleano:
  // prende il valore corrente e restituisce il suo opposto, senza bisogno di leggerlo prima.
  toggleCheckedIn(): void {
    this.checkedInExpanded.update(v => !v);
  }

  // Chiamato dal pulsante di refresh nel template.
  // Rilegge l'utente corrente dal Signal (potrebbe essere cambiato) e
  // rilancia loadBookings() per aggiornare entrambe le liste dal server.
  refresh(): void
  {
    const user = this.loggedUser();
    if (user && user.hotel?.id)
    {
      this.loadBookings(user.hotel.id);
    }
  }
}
