import { Component, computed, inject } from '@angular/core';
import { UserService } from '../user-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-menu',
  imports: [RouterLink],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.css',
})
export class TopMenu {

    userService = inject(UserService);

    loggedUser = this.userService.loggedUser;

    userInfo = computed(()=> this.loggedUser()==null ? "loading" : this.loggedUser()?.firstName+" "+this.loggedUser()?.lastName);


}
