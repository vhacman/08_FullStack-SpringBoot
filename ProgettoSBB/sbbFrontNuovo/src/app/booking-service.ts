import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Booking} from './model/hotel.entities';

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

  public getTodaysArrivals(id:number):Observable<Booking[]>{

    let url = this.apiURL+"/todaysarrivals/"+id;
    console.log(url);

    return this.http.get<Booking[]>(url);
  }

  public doCheckIn(id:number): Observable<Booking> {
    let url = this.apiURL+"/" +id + "/executed";
    return this.http.patch<Booking>(url, null);
  }



}
