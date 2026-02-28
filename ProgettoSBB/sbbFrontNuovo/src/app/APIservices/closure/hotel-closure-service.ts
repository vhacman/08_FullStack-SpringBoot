import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelClosure } from '../../model/hotel.entities';

@Injectable({
  providedIn: 'root',
})
export class HotelClosureService {
  private http   = inject(HttpClient);
  private apiURL = 'http://localhost:8080/sbb/api/closures';

  findByHotel(hotelId: number): Observable<HotelClosure[]> {
    return this.http.get<HotelClosure[]>(`${this.apiURL}/hotel/${hotelId}`);
  }

  save(dto: { hotelId: number; startDate: string; endDate: string; reason: string }): Observable<HotelClosure> {
    return this.http.post<HotelClosure>(this.apiURL, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  reopenRange(hotelId: number, from: string, to: string): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/hotel/${hotelId}/range`, {
      params: { from, to },
    });
  }
}
