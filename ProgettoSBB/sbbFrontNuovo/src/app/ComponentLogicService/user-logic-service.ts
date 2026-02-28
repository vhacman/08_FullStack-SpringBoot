import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../APIservices/user/user-service';
import { User } from '../model/hotel.entities';

@Injectable({ providedIn: 'root' })
export class UserLogicService {
  private userService = inject(UserService);

  loggedUser = toSignal<User | null>(this.userService.getDefaultUser(), { initialValue: null });
}
