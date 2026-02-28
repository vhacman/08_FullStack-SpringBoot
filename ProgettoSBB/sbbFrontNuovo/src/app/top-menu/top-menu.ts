import {RouterLink} from '@angular/router';
import {TitleCasePipe} from '@angular/common';
import {Component, computed, inject, signal} from '@angular/core';
import {UserLogicService} from '../ComponentLogicService/user-logic-service';

/**
 * Barra superiore dell'applicazione. Mostra nome hotel e utente loggato,
 * e gestisce il popup del profilo (toggle con click sull'icona utente).
 * userInfo è un computed() che costruisce la stringa "Nome Cognome"
 * solo quando loggedUser() non è null, evitando errori durante il caricamento.
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

  userInfo = computed(()=> this.loggedUser()==null ? "loading" : this.loggedUser()?.firstName+" "+this.loggedUser()?.lastName);


}
