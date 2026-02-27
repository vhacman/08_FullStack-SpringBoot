import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../model/hotel.entities';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http   = inject(HttpClient);
  private apiURL = 'http://localhost:8080/sbb/api/users/default';

  getDefaultUser(): Observable<User> {
    return this.http.get<User>(this.apiURL);
  }
}
