import {Component, computed, inject, input, model} from '@angular/core';
import { Booking } from '../model/hotel.entities';
import { CommonModule } from '@angular/common';
import { BookingService } from '../booking-service';

/*
    Questo componente riceve un booking come input
    e lo grafica
    Questo in java sarebbe stato
    viewBooking.render(booking)
*/
@Component({
  selector: 'app-booking-row',
  imports: [CommonModule],
  templateUrl: './booking-row.html',
  styleUrl: './booking-row.css',
})
export class BookingRow {

    // ricevo un dato da graficare, come se fosse un parametro
    // come fosse Antani


    booking = model.required<Booking>();

    bookingService = inject(BookingService);

    // TODO: aggiungere computed/metodo isCheckOutToday() → confronta booking().to con la data odierna
    //        usato nel template per decidere se mostrare il pulsante pulizie
  /*
   * Computed Signal — Verifica Data di Checkout:
   * → computed() ricalcola automaticamente il valore ogni volta
   * che il signal booking() cambia (reattività automatica)
   * → Non si confrontano le date con === direttamente perché
   * due oggetti Date sono sempre diversi in memoria
   * → Si confrontano i singoli campi: anno, mese e giorno
   * */
    isCheckOutToday = computed(() => {
      const today = new Date();
      const to = new Date(this.booking().to);

      return to.getFullYear() === today.getFullYear() &&
                to.getMonth() === today.getMonth() &&
                to.getDate() === today.getDate();

    });

    doCheckIn():void{

        let id:number = this.booking().id ?? 0;

        this.bookingService.doCheckIn(id).subscribe(
        {
            next:()=> {
                this.booking.update(old=>{return {...old, status:"executed"}})
            },
            error:err=>console.log(err)
        });
    }

    doCancel():void{
      let id:number = this.booking().id ?? 0;
      this.bookingService.doCancel(id).subscribe({
          next:()=> {
            this.booking.update(old =>({...old, status:"cancelled"}))
          },
          error:err=>console.log(err)
        });
    }

    doCleaned():void{
      let id:number = this.booking().id ?? 0;
      this.bookingService.doCleaned(id).subscribe({
        next:()=> {
          this.booking.update(old =>({...old, status:"cleaned"}))
        },
        error:err=>console.log(err)
      })
    }
}
