import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guest } from '../../model/hotel.entities';

/**
 * Servizio Angular per le chiamate HTTP all'API degli ospiti.
 * Ogni metodo restituisce un Observable: i componenti si sottoscrivono
 * con .subscribe() per ricevere il risultato quando arriva dal server.
 * Le operazioni CRUD seguono le convenzioni REST:
 *   GET    per leggere
 *   POST   per creare (ritorna l'entità con id assegnato dal DB)
 *   PUT    per aggiornare completamente (sovrascrive tutti i campi)
 *   DELETE per eliminare (void = il backend non ritorna body)
 */
@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private http = inject(HttpClient);
  private apiURL = 'http://localhost:8080/sbb/api/guests';

  /** @returns tutti gli ospiti registrati nel sistema */
  findAll(): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.apiURL);
  }

  /** @returns un singolo ospite cercato per id */
  findById(id: number): Observable<Guest> {
    return this.http.get<Guest>(`${this.apiURL}/${id}`);
  }

  /**
   * Crea un nuovo ospite.
   * Il backend assegna l'id e lo restituisce nell'oggetto di risposta:
   * per questo il tipo di ritorno è Observable<Guest> e non Observable<void>.
   * @param guest i dati del nuovo ospite da salvare
   */
  insert(guest: Guest): Observable<Guest> {
    return this.http.post<Guest>(this.apiURL, guest);
  }

  /**
   * Aggiorna completamente un ospite esistente.
   * PUT sostituisce l'intera risorsa: tutti i campi vengono riscritti.
   * @param id ospite da aggiornare
   * @param guest nuovi dati completi dell'ospite
   */
  update(id: number, guest: Guest): Observable<Guest> {
    return this.http.put<Guest>(`${this.apiURL}/${id}`, guest);
  }

  /** Elimina un ospite per id. void = il backend non ritorna body. */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
