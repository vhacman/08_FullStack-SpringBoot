import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../model/hotel.entities';

/**
 * Servizio globale per la gestione dell'utente autenticato e delle prenotazioni.
 * Fornito a livello root → singola istanza per tutta l'applicazione (Singleton).
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {

  // Endpoint temporaneo: carica un utente di default senza autenticazione reale
  apiURL = "http://localhost:8080/sbb/api/users/default";

  // inject() è l'alternativa moderna al costruttore per l'Dependency Injection
  http = inject(HttpClient);

  // Signal privato in scrittura: solo questo servizio può modificare l'utente loggato
  private _loggedUser = signal<User | null>(null);

  // Esposto in sola lettura verso i componenti: nessuno può modificarlo dall'esterno
  loggedUser = this._loggedUser.asReadonly();

  /**
   * Al momento della creazione del servizio, recupera subito l'utente di default dal backend.
   * In un'app reale questo verrebbe sostituito da un flusso di login.
   */
  constructor() {
    this.http.get<User>(this.apiURL).subscribe({
      next:  user  => { console.log(user); this._loggedUser.set(user); },
      error: error => { console.error('Errore caricamento utente:', error); }
    });
  }
}
