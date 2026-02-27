import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../../model/hotel.entities';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private http      = inject(HttpClient);
  private apiURL    = 'http://localhost:8080/sbb/api/rooms';
  private hotelsURL = 'http://localhost:8080/sbb/api/hotels';

  findAll(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiURL);
  }

  findById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiURL}/${id}`);
  }

  insert(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiURL, room);
  }

  update(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiURL}/${id}`, room);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  getFreeRooms(hotelId: number, checkIn: string, checkOut: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.hotelsURL}/${hotelId}/free-rooms`, {
      params: { checkIn, checkOut }
    });
  }
}
