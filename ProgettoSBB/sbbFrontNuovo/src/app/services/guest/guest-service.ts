import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guest } from '../../model/hotel.entities';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private http = inject(HttpClient);
  private apiURL = 'http://localhost:8080/sbb/api/guests';

  // Lista ospiti come signal: il dato appartiene al servizio, non al componente
  guests = signal<Guest[]>([]);

  constructor() {
    // Caricamento all'avvio del servizio: essendo singleton viene fatto una sola volta
    this.findAll().subscribe({
      next:  g   => this.guests.set(g),
      error: err => console.error('Errore caricamento ospiti:', err)
    });
  }

  // Logica di filtraggio qui: è regola di dominio (come si cerca un ospite),
  // non responsabilità del componente che mostra la lista
  filter(input: string): Guest[] {
    const s = input.toLowerCase().trim();
    if (!s)
      return this.guests();
    return this.guests().filter(g =>
            g.firstName.toLowerCase().includes(s) ||
            g.lastName.toLowerCase().includes(s)
    );
  }

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
