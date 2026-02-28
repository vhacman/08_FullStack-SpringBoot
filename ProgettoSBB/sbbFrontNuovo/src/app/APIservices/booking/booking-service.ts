import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../../model/hotel.entities';

/**
 * Servizio Angular per le chiamate HTTP al BookingAPI del backend.
 * Ogni metodo restituisce un Observable: i componenti si sottoscrivono
 * con .subscribe() per ricevere i dati quando arrivano.
 * Le operazioni di cambio stato (checkin, cancel, checkout, complete)
 * usano PATCH per indicare una modifica parziale della risorsa.
 */
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private apiURL = 'http://localhost:8080/sbb/api/bookings';

  /** @returns prenotazioni con checkIn = oggi per l'hotel dato */
  getTodaysArrivals(id: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiURL}/todaysarrivals/${id}`);
  }

  /** @returns prenotazioni con checkOut = oggi per l'hotel dato */
  getTodaysDepartures(id: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiURL}/todaysdepartures/${id}`);
  }

  /** @returns tutte le prenotazioni dell'hotel (usato dal calendario e dalla lista) */
  getByHotel(hotelId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiURL}/hotel/${hotelId}`);
  }

  /** PENDING → CHECKED_IN | room → OCCUPIED */
  acceptBooking(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/checkin`, null);
  }

  /** PENDING → CANCELED */
  cancel(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/cancel`, null);
  }

  /** CHECKED_IN → CHECKED_OUT | room → TO_CLEAN */
  checkout(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/checkout`, null);
  }

  /** CHECKED_OUT → COMPLETE | room → AVAILABLE + lastCleaned aggiornato */
  complete(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/complete`, null);
  }

  /**
   * Crea una nuova prenotazione.
   * @param data dati della prenotazione (guest, room, date, prezzo, note)
   */
  insert(data: { guestId: number; roomId: number; checkIn: string; checkOut: string; price: number; notes: string; cleaned: boolean }): Observable<void> {
    return this.http.post<void>(this.apiURL, data);
  }
}
