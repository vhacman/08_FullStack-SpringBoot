import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { BookingService } from '../booking-service';
import { Booking } from '../model/hotel.entities';
import { UserService } from '../user-service';
import { BookingRow } from '../booking-row/booking-row';

@Component({
  selector: 'app-today-arrivals',
  imports: [BookingRow],
  templateUrl: './today-arrivals.html',
  styleUrl: './today-arrivals.css',
})
export class TodayArrivals {

    // BookingService
    private bookingService = inject(BookingService);

    // UserService
    // lo UserService carica utenti e mantiene un signal che contiene l'utente LOGGATO
    private userService = inject(UserService);

    // signal<User | null> -> potrebbe esserci un utente loggato o potrebbe non esserci ancora
    loggedUser = this.userService.loggedUser;

    // PRENOTAZIONI DI CHI STA ARRIVANDO OGGI
    bookings = signal<Booking[]>([]);


    constructor(){

        /*
            effect è un altro tipo di SIGNAL
            ed è una OPERAZIONE che viene eseguita quando un altro signal cambia
            computed ricalcola un valore
            effect esegue una operazione (effect è short hand for side effect)
            computed ritorna qualcosa
            effect lo puoi pensare come un metodo void

            signal<User | null> loggedUser => utente loggato o non presente, origin of truth
            niceName = computed<string>(()=>loggedUser().name=='Ferdinando' ? "BELLISSIMO NOME" : "NOME NORMALE");
            saluto = (()=>{ const user=this.loggedUser(); console.log(user);});

        */
        effect(() => {
            let user = this.loggedUser();
            
            // Se l'utente c'è e ha un hotel ID, allora faccio la chiamata
            if (user && user.hotel?.id) {
                console.log("Caricamento per hotel:", user.hotel.id);
                
                this.bookingService.getTodaysArrivals(user.hotel.id).subscribe({
                    next: (json) => this.bookings.set(json),
                    error: (err) => console.error(err)
                });
            }
        });

    }

}
