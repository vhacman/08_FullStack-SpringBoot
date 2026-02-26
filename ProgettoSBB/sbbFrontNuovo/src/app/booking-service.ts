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

  public getTodaysArrivals(id: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiURL}/todaysarrivals/${id}`);
  }

  public getTodaysDepartures(id: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiURL}/todaysdepartures/${id}`);
  }

  // Ho cambiato il path da "/executed" a "/EXECUTED" (maiuscolo) per allinearlo
  // al valore che Hibernate salva nel DB e che il backend restituisce nel JSON.
  // Prima c'era un'incongruenza: il DB aveva "EXECUTED" ma il frontend inviava "executed",
  // creando status diversi a seconda di come veniva creata la prenotazione.
  // Ora tutto il sistema usa lo stesso valore → meno bug nascosti.
  public doCheckIn(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/EXECUTED`, null);
  }

  // Ho aggiunto questo metodo per chiamare il nuovo endpoint PATCH /bookings/{id}/cleaned.
  // Restituisce Observable<void> perché il backend risponde 204 No Content:
  // non mi serve il body della risposta, mi interessa solo sapere se è andata bene.
  // Il frontend aggiornerà il signal localmente senza ricaricare tutto dal server.
  public setCleaned(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/cleaned`, null);
  }
}
