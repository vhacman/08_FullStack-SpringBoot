import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../../model/hotel.entities';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private apiURL = 'http://localhost:8080/sbb/api/bookings';

  getTodaysArrivals(id: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiURL}/todaysarrivals/${id}`);
  }

  getTodaysDepartures(id: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiURL}/todaysdepartures/${id}`);
  }

  getByHotel(hotelId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiURL}/hotel/${hotelId}`);
  }

  // PENDING → CHECKED_IN  |  room → OCCUPIED
  acceptBooking(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/checkin`, null);
  }

  // PENDING → CANCELED
  cancel(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/cancel`, null);
  }

  // CHECKED_IN → CHECKED_OUT  |  room → TO_CLEAN
  checkout(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/checkout`, null);
  }

  // CHECKED_OUT → COMPLETE  |  room → AVAILABLE
  complete(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/complete`, null);
  }

  insert(data: { guestId: number; roomId: number; checkIn: string; checkOut: string; price: number; notes: string; cleaned: boolean }): Observable<void> {
    return this.http.post<void>(this.apiURL, data);
  }
}
