import {Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {GuestPicker} from '../guest-picker/guest-picker';
import {RouterLink} from '@angular/router';
import {BookingService} from '../services/booking/booking-service';
import {RoomService} from '../services/room/room-service';
import {UserService} from '../services/user/user-service';
import {differenceInDays} from 'date-fns';
import {Room} from '../model/hotel.entities';

@Component({
  selector: 'app-insert-booking',
  imports: [FormsModule, GuestPicker, RouterLink],
  templateUrl: './insert-booking.html',
  styleUrl: './insert-booking.css',
})
export class InsertBooking {

  // Iniezione dei servizi tramite inject() — alternativa moderna al costruttore
  private bookingService = inject(BookingService);
  private roomService = inject(RoomService);
  private userService = inject(UserService);
  private guestPicker = inject(GuestPicker);

  // Signal che tiene l'ID dell'ospite selezionato (null = nessuno)
  guestId = signal<number | null>(null);

  // Computed: si aggiorna automaticamente quando guestId cambia
  guestSelected = computed(() => this.guestId() !== null);

  // Signal per le date di inizio e fine prenotazione
  checkIn  = signal<string | null>(null);
  checkOut = signal<string | null>(null);

  // Data odierna in formato "YYYY-MM-DD", usata come min negli input date
  today: string = new Date().toISOString().split('T')[0];

  // Data minima selezionabile per il check-out:
  // se checkIn non è ancora impostato, usa oggi come fallback,
  // altrimenti restituisce il giorno successivo al check-in
  // (non puoi fare check-out lo stesso giorno del check-in)
  minimumCheckOut = computed(() => {
    if (!this.checkIn())
      return this.today;
    const date = new Date(this.checkIn()!);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  });

  // Calcola il numero di notti tra check-in e check-out.
  // Se una delle due date manca, restituisce 0.
  // Usa differenceInDays() di date-fns al posto del calcolo manuale in ms
  nights = computed(() => {
    if (!this.checkIn() || !this.checkOut())
      return 0;
    return differenceInDays(new Date(this.checkOut()!), new Date(this.checkIn()!));
  });


  //FREE ROOMS
  freeRooms = signal<Room[]>([]);
  roomsSearched = signal(false);



}
