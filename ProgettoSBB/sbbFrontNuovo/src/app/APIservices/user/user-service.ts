import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../model/hotel.entities';

/**
 * Servizio HTTP per il recupero dell'utente corrente.
 * L'endpoint /default è una scorciatoia del backend che restituisce sempre
 * il primo utente registrato nel sistema: in un'app reale sarebbe sostituito
 * da un endpoint autenticato (es. /me con token JWT nell'header).
 *
 * Questo servizio NON viene chiamato direttamente dai componenti:
 * viene usato solo da UserLogicService, che lo converte in Signal
 * e lo espone a tutta l'app come valore reattivo condiviso.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiURL = 'http://localhost:8080/sbb/api/users/default';

  /** @returns l'utente di default con hotel e ruolo associati */
  getDefaultUser(): Observable<User> {
    return this.http.get<User>(this.apiURL);
  }
}
