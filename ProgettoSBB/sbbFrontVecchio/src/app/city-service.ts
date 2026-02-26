import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from './model/city';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  
    http = inject(HttpClient);
    apiURL = "http://localhost:3001/cities"

    public findCitiesByName(name:string):Observable<City[]>{
        let query:string = "/?name="+name;
        return this.http.get<City[]>(this.apiURL+query);
    }

}
