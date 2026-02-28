import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelClosure } from '../../model/hotel.entities';

/**
 * Servizio Angular per le chiamate HTTP a HotelClosureAPI.
 * La gestione delle chiusure è volutamente separata da BookingService
 * perché riguarda la disponibilità dell'hotel nel suo insieme,
 * non una singola prenotazione.
 */
@Injectable({
  providedIn: 'root',
})
export class HotelClosureService {
  private http   = inject(HttpClient);
  private apiURL = 'http://localhost:8080/sbb/api/closures';

  /** @returns tutti i periodi di chiusura registrati per l'hotel */
  findByHotel(hotelId: number): Observable<HotelClosure[]> {
    return this.http.get<HotelClosure[]>(`${this.apiURL}/hotel/${hotelId}`);
  }

  /**
   * Crea un nuovo periodo di chiusura.
   * Il backend valida che le date non siano nel passato.
   * @param dto periodo da chiudere con motivazione opzionale
   * @returns la closure salvata con id assegnato dal DB
   */
  save(dto: { hotelId: number; startDate: string; endDate: string; reason: string }): Observable<HotelClosure> {
    return this.http.post<HotelClosure>(this.apiURL, dto);
  }

  /**
   * Elimina un'intera closure per id.
   * Usato solo quando si vuole cancellare tutto il periodo.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  /**
   * Riapre un range di date all'interno di una (o più) closure esistente.
   * Il backend gestisce lo split automatico: se il range è in mezzo a una
   * closure, questa viene spezzata in due preservando le parti esterne.
   * @param hotelId hotel di riferimento
   * @param from data iniziale del range da riaprire (YYYY-MM-DD)
   * @param to data finale del range da riaprire (YYYY-MM-DD)
   */
  reopenRange(hotelId: number, from: string, to: string): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/hotel/${hotelId}/range`, {
      params: { from, to },
    });
  }
}
