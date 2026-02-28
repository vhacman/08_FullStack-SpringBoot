import {RouterLink} from '@angular/router';
import {TitleCasePipe} from '@angular/common';
import {Component, computed, inject, signal} from '@angular/core';
import { UserLogicService } from '../APIservices/user/user-logic-service';

/**
 * Barra superiore dell'applicazione. Mostra nome hotel e utente loggato
 * e gestisce il popup del profilo con toggle al click.
 * TitleCasePipe è una pipe Angular che capitalizza la prima lettera di ogni parola:
 * invece di scrivere la logica a mano l'ho trovata già pronta nel framework.
 */
@Component({
  selector: 'app-top-menu',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.css',
})
export class TopMenu {

  userLogicService = inject(UserLogicService);

  loggedUser = this.userLogicService.loggedUser;

  showProfile = signal(false);

  toggleProfile() {
    this.showProfile.update(v => !v);
  }

  // computed() costruisce la stringa "Nome Cognome" reagendo al Signal loggedUser.
  // Mentre l'utente non è ancora arrivato mostra "loading", evitando errori di null.
  // Ho usato computed() invece di una proprietà normale perché si aggiorna
  // automaticamente quando loggedUser() cambia, senza bisogno di chiamate manuali.
  userInfo = computed(() => this.loggedUser() == null
                                                  ? 'loading'
                                                  : this.loggedUser()?.firstName + ' ' + this.loggedUser()?.lastName
  );


}
