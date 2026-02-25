import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from './model/hotel.entities';

/*
    io non mi limito a fare chiamate api
    io conservo anche un utente loggato diverso per ogni client
    potenzialmente...
    ogni client potrà memorizzare al suo interno
    un utente loggato diverso

*/
@Injectable({
  providedIn: 'root',
})
export class UserService {
  
    // cominciamo caricando un utente standard senza login 
    // solo per provare quello che devo provare

    apiURL = "http://localhost:8080/sbb/api/users/default";
    http = inject(HttpClient);

    private _loggedUser = signal<User | null>(null);
    loggedUser = this._loggedUser.asReadonly();

    constructor(){
        this.http.get<User>(this.apiURL).subscribe(
            {
                next:json=>{console.log(json);this._loggedUser.set(json)},
                error:error=>console.log(error)
            }
        );
    }

}
