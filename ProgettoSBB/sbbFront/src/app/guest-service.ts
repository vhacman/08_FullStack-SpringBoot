import { Injectable, signal, computed, inject } from '@angular/core';
import { Guest } from './model/hotel.entities';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GuestService {

    http = inject(HttpClient);

    apiURL = "http://localhost:3000/api/guests";

    public findBySsn(ssn:string):Observable<Guest> {
        let url = this.apiURL+"/byssn/"+ssn;
        return this.http.get<Guest>(url);
    }

    public findBySurname(surname:string):Observable<Guest[]>{
        let url = this.apiURL+"/search/?q="+surname;
        return this.http.get<Guest[]>(url);
    }

    public insert(guest:Guest):Observable<Guest>{
        return this.http.post<Guest>(this.apiURL, guest);
    }

}