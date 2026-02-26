import { Injectable, signal, computed, inject } from '@angular/core';
import { Booking } from './model/hotel.entities';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class BookingService {

    private http = inject(HttpClient);

    private apiURL = "http://localhost:8080/sbb/api/bookings";

    public getTodaysArrivals(id:number):Observable<Booking[]>{

        let url = this.apiURL+"/todaysarrivals/"+id;
        console.log(url);

        return this.http.get<Booking[]>(url);
    }

    // TODO 25-02-26
    // Aggiunto rispetto a getTodaysArrivals:
    // chiama /todaysdepartures invece di /todaysarrivals.
    public getTodaysDepartures(id:number): Observable<Booking[]> {
      let url = this.apiURL + "/todaysdepartures/" + id;
      console.log(url);

      return (this.http.get<Booking[]>(url));
    }

    public doCheckIn(id:number): Observable<Booking> {
      let url = this.apiURL+"/" +id + "/executed";
      return this.http.patch<Booking>(url, null);
    }

    //TODO aggiunere metodi doCleaned e doCancel

    public doCancel(id:number): Observable<Booking> {
      let url = this.apiURL+"/" +id + "/canceled";
      return this.http.patch<Booking>(url, null);
    }

    public doCleaned(id:number):Observable<Booking>{
      let url = this.apiURL+"/" +id + "/cleaned";
      return this.http.patch<Booking>(url, null);
    }

}
