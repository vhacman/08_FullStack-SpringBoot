import { Injectable, inject, signal } from '@angular/core';
import { UserService } from '../APIservices/user/user-service';
import { User } from '../model/hotel.entities';

@Injectable({
  providedIn: 'root'
})
export class UserLogicService {
  private userService = inject(UserService);

  private _loggedUser = signal<User | null>(null);
  loggedUser = this._loggedUser.asReadonly();

  constructor() {
    this.userService.getDefaultUser().subscribe({
      next:  user  => this._loggedUser.set(user),
      error: err   => console.error('Errore caricamento utente:', err)
    });
  }
}
