import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Booking} from '../../model/hotel.entities';

/**
 * Servizio globale per la gestione dell'utente autenticato e delle prenotazioni.
 * Fornito a livello root → singola istanza per tutta l'applicazione (Singleton).
 */
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);

  private apiURL = "http://localhost:8080/sbb/api/bookings";

  public getTodaysArrivals(id: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiURL}/todaysarrivals/${id}`);
  }

  public getTodaysDepartures(id: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiURL}/todaysdepartures/${id}`);
  }

  // PENDING → CHECKED_IN  |  room → OCCUPIED
  public acceptBooking(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/checkin`, null);
  }

  // PENDING → CANCELED
  public cancel(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/cancel`, null);
  }

  // CHECKED_IN → CHECKED_OUT  |  room → TO_CLEAN
  public checkout(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/checkout`, null);
  }

  // CHECKED_OUT → COMPLETE  |  room → AVAILABLE  (camera pulita)
  public complete(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/complete`, null);
  }

  public insert(data: { guestId: number; roomId: number; checkIn: string; checkOut: string; price: number; notes: string }): Observable<void> {
    return this.http.post<void>(this.apiURL, data);
  }
}
