import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guest } from '../../model/hotel.entities';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private http = inject(HttpClient);
  private apiURL = 'http://localhost:8080/sbb/api/guests';

  findAll(): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.apiURL);
  }

  findById(id: number): Observable<Guest> {
    return this.http.get<Guest>(`${this.apiURL}/${id}`);
  }

  insert(guest: Guest): Observable<Guest> {
    return this.http.post<Guest>(this.apiURL, guest);
  }

  update(id: number, guest: Guest): Observable<Guest> {
    return this.http.put<Guest>(`${this.apiURL}/${id}`, guest);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
