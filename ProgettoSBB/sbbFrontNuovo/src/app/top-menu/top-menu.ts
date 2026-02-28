import {RouterLink} from '@angular/router';
import {TitleCasePipe} from '@angular/common';
import {Component, computed, inject, signal} from '@angular/core';
import {UserLogicService} from '../ComponentLogicService/user-logic-service';

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
