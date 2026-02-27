import { Component, computed, inject } from '@angular/core';
import { UserLogicService } from '../ComponentLogicService/user-logic-service';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-top-menu',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.css',
})
export class TopMenu {

  userLogicService = inject(UserLogicService);

  loggedUser = this.userLogicService.loggedUser;

  userInfo = computed(()=> this.loggedUser()==null ? "loading" : this.loggedUser()?.firstName+" "+this.loggedUser()?.lastName);


}
