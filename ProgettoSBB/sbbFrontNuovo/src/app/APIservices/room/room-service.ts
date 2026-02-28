import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../../model/hotel.entities';

/**
 * Servizio Angular per le chiamate HTTP alle API delle camere.
 * getFreeRooms usa un endpoint separato sotto /hotels/ perché la disponibilità
 * dipende dall'hotel: non è una proprietà della camera da sola, ma della
 * combinazione camera + hotel + periodo richiesto.
 */
@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private http      = inject(HttpClient);
  private apiURL    = 'http://localhost:8080/sbb/api/rooms';
  private hotelsURL = 'http://localhost:8080/sbb/api/hotels';

  /** @returns tutte le camere registrate nel sistema */
  findAll(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiURL);
  }

  /** @returns una singola camera per id */
  findById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiURL}/${id}`);
  }

  /** @param room dati della nuova camera da creare */
  insert(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiURL, room);
  }

  /** @param id camera da aggiornare, @param room nuovi dati */
  update(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiURL}/${id}`, room);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  /**
   * Restituisce le camere libere per un dato hotel nel periodo checkIn–checkOut.
   * Il backend filtra le camere che non hanno prenotazioni attive in quel range.
   * I parametri checkIn e checkOut vengono passati come query string:
   * params: { checkIn, checkOut } li serializza automaticamente in ?checkIn=...&checkOut=...
   * @param hotelId hotel di riferimento
   * @param checkIn data inizio soggiorno (YYYY-MM-DD)
   * @param checkOut data fine soggiorno (YYYY-MM-DD)
   */
  getFreeRooms(hotelId: number, checkIn: string, checkOut: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.hotelsURL}/${hotelId}/free-rooms`, {
      params: { checkIn, checkOut }
    });
  }
}
