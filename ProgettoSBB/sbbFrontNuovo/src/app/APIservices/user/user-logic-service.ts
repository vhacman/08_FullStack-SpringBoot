import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from './user-service';
import { User } from '../../model/hotel.entities';

/**
 * Cercando come evitare di ripetere la stessa chiamata HTTP in ogni componente
 * ho trovato il pattern "service as state": la chiamata viene fatta qui una volta sola,
 * e tutti i componenti che hanno bisogno dell'utente iniettano questo servizio.
 * providedIn: 'root' è fondamentale: dice ad Angular di creare una sola istanza
 * condivisa da tutta l'app (singleton), quindi l'HTTP parte una volta sola.
 */
@Injectable({ providedIn: 'root' })
export class UserLogicService {
  private userService = inject(UserService);

  /**
   * toSignal() è un bridge tra il mondo RxJS (Observable) e Angular Signals.
   * Senza di esso avrei dovuto fare subscribe() in ogni componente e gestire
   * manualmente l'unsubscribe per evitare memory leak.
   * toSignal() gestisce tutto in automatico e converte il risultato in un Signal
   * leggibile con loggedUser() in qualsiasi componente o computed().
   * initialValue: null serve perché il Signal deve avere subito un valore —
   * null indica "ancora in caricamento", e i componenti lo gestiscono di conseguenza.
   */
  loggedUser = toSignal<User | null>(this.userService.getDefaultUser(), { initialValue: null });
}
