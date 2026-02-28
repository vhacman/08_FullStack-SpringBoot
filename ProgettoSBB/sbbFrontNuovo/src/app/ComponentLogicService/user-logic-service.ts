import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../APIservices/user/user-service';
import { User } from '../model/hotel.entities';

/**
 * Servizio di stato per l'utente autenticato.
 * Invece di iniettare UserService direttamente in ogni componente,
 * centralizzo qui il caricamento e lo espongo come Signal: qualsiasi
 * componente che inietta UserLogicService ottiene automaticamente
 * il riferimento reattivo all'utente, senza duplicare la chiamata HTTP.
 *
 * toSignal() converte l'Observable in un Signal Angular: initialValue: null
 * garantisce un valore iniziale mentre la risposta non è ancora arrivata.
 */
@Injectable({ providedIn: 'root' })
export class UserLogicService {
  private userService = inject(UserService);

  /** Signal dell'utente loggato. Null finché la risposta HTTP non arriva. */
  loggedUser = toSignal<User | null>(this.userService.getDefaultUser(), { initialValue: null });
}
