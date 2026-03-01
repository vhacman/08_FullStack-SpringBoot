import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingService } from '../booking/booking-service';
import { HotelClosureService } from '../closure/hotel-closure-service';
import { RoomService } from '../room/room-service';
import { Booking, HotelClosure, Room } from '../../model/hotel.entities';

/**
 * Aggregatore HTTP per il componente Calendar.
 * Il componente Calendar non sa nulla di HTTP: delega qui e lavora
 * solo con Signal e logica di presentazione.
 */
@Injectable({
  providedIn: 'root',
})
export class CalendarService
{

  // I tre servizi HTTP specifici rimangono qui, nascosti al componente.
  private bookingService = inject(BookingService);
  private roomService = inject(RoomService);
  private closureService = inject(HotelClosureService);

  /** @returns tutte le prenotazioni dell'hotel */
  getBookings(hotelId: number): Observable<Booking[]> {
    return this.bookingService.getByHotel(hotelId);
  }

  /**
   * @returns le camere dell'hotel, già filtrate per hotelId.
   * Il filtro è fatto qui (non nel componente) perché è logica di recupero dati:
   * il backend restituisce tutte le camere, noi teniamo solo quelle dell'hotel corrente.
   * pipe(map(...)) trasforma l'Observable<Room[]> prima che il componente lo riceva.
   */
  getRooms(hotelId: number): Observable<Room[]> {
    return this.roomService.findAll().pipe(map(all => all.filter(r => r.hotelId === hotelId)));
  }

  /**
   * @returns le chiusure dell'hotel.
   * Chiamata sia al caricamento iniziale sia dopo confirmReopen() e confirmDelete()
   * perché il backend potrebbe aver spezzato o eliminato closure esistenti:
   * è più sicuro ricaricare dal server che calcolare lato client il risultato.
   */
  getClosures(hotelId: number): Observable<HotelClosure[]> {
    return this.closureService.findByHotel(hotelId);
  }

  /**
   * Crea un nuovo periodo di chiusura.
   * @param dto dati della chiusura: hotel, date di inizio/fine, motivazione
   * @returns la closure salvata con id assegnato dal DB
   */
  saveClosure(dto: {
    hotelId:   number;
    startDate: string;
    endDate:   string;
    reason:    string;
  }): Observable<HotelClosure> {
    return this.closureService.save(dto);
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
    return this.closureService.reopenRange(hotelId, from, to);
  }
}
