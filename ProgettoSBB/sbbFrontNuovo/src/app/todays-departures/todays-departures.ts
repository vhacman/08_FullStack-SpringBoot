import {Component, effect, inject, signal} from '@angular/core';
import {Booking} from '../model/hotel.entities';
import {BookingService} from '../APIservices/booking/booking-service';
import {UserLogicService} from '../APIservices/user/user-logic-service';
import {BookingRow} from '../booking-row/booking-row';

/**
 * Gab:
 * Widget della homepage che mostra le partenze di oggi (checkOut = oggi).
 * Distingue le prenotazioni ancora da gestire (CHECKED_IN o CHECKED_OUT)
 * da quelle già completate (COMPLETE), permettendo al personale di sapere
 * quali camere devono ancora essere pulite.
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
  cleanedExpanded = signal(false); // true = sezione completate visibile nel template

  constructor()
  {
    // effect() si ri-esegue automaticamente ogni volta che loggedUser() cambia.
    // Serve per caricare i dati non appena sappiamo qual è l'hotel dell'utente loggato.
    effect(() =>
    {
      const user = this.loggedUser();
      // Se l'utente non è ancora caricato o non ha un hotel associato, non facciamo nulla.
      if (user && user.hotel?.id)
        this.loadBookings(user.hotel.id);
    });
  }

  private     loadBookings(hotelId: number): void
  {
    // Chiedo al backend tutte le prenotazioni con checkOut = oggi per questo hotel.
    // La risposta arriva come array JSON, gestita con subscribe().
    this.bookingService.getTodaysDepartures(hotelId).subscribe({
      next: (json) =>
      {
        // Il backend mi manda tutto insieme: devo separare io le prenotazioni in base allo stato.
        // CHECKED_IN = l'ospite è ancora in camera (non ha ancora fatto checkout formale).
        // CHECKED_OUT = il checkout è stato registrato ma la camera non è ancora stata pulita.
        // Entrambi questi stati significano che c'è ancora lavoro da fare → vanno in toCleanBookings.
        this.toCleanBookings.set(json.filter(b => b.status === 'CHECKED_IN' || b.status === 'CHECKED_OUT'));
        // COMPLETE = camera già pulita e tutto sistemato → va in cleanedBookings (lista "fatto").
        this.cleanedBookings.set(json.filter(b => b.status === 'COMPLETE'));
      },
      error: (err) => console.error(err)
    });
  }

  onCleanedDone(booking: Booking): void
  {
    // Questo metodo viene chiamato da BookingRow quando l'operatore segna una camera come pulita.
    // Invece di ricaricare tutto dal server, aggiorno le due liste localmente: è più veloce
    // e risparmia una chiamata HTTP inutile dato che conosciamo già il nuovo stato.
    // Rimuovo la prenotazione dalla lista "da fare", filtrando via quella con lo stesso id.
    this.toCleanBookings.update(list => list.filter(b => b.id !== booking.id));
    // La aggiungo in fondo alla lista "completate", così appare subito nella sezione giusta.
    this.cleanedBookings.update(list => [...list, booking]);
  }

  toggleCleaned(): void {
    // Inverte il valore booleano: se la sezione era chiusa la apre, e viceversa.
    // cleanedExpanded è letto dal template per mostrare/nascondere la lista delle completate.
    this.cleanedExpanded.update(v => !v);
  }

  refresh(): void
  {
    // Ricarica i dati dal server, utile se nel frattempo altri operatori hanno aggiornato
    // lo stato di qualche prenotazione e vogliamo vedere la situazione aggiornata.
    const user = this.loggedUser();
    // Controlliamo di avere ancora l'utente e l'hotel prima di fare la chiamata.
    if (user && user.hotel?.id) {
      this.loadBookings(user.hotel.id);
    }
  }
}
