import { Component, inject, signal, input, output, effect } from '@angular/core';
import { RoomService } from '../APIservices/room/room-service';
import { UserLogicService } from '../APIservices/user/user-logic-service';
import { Room } from '../model/hotel.entities';

/**
 * Componente figlio che mostra le camere disponibili per un dato periodo.
 * Riceve checkIn e checkOut dal componente padre tramite input(),
 * e comunica la camera scelta al padre tramite output().
 * Cercando come passare dati tra componenti in Angular ho trovato due approcci:
 * il classico @Input/@Output con decoratori, e il più recente input()/output()
 * basato su Signals (Angular 17+): ho usato quest'ultimo perché si integra
 * meglio con il resto del codice reattivo.
 */
@Component({
  selector: 'app-room-picker',
  imports: [],
  templateUrl: './room-picker.html',
  styleUrl: './room-picker.css',
})
export class RoomPicker {

  private roomService = inject(RoomService);
  private userLogicService = inject(UserLogicService);

  // input() crea un Signal in sola lettura alimentato dal componente padre.
  // Quando il padre aggiorna checkIn o checkOut, l'effect() qui sotto
  // si attiva automaticamente e rilancia la ricerca.
  checkIn      = input<string | null>(null);
  checkOut     = input<string | null>(null);
  // Stesso meccanismo di GuestPicker: quando il padre incrementa questo valore,
  // l'effect() qui sotto resetta la camera selezionata.
  resetTrigger = input<number>(0);

  // output() è il canale di comunicazione inverso: dal figlio al padre.
  // Il padre si iscrive con (roomSelected)="onRoomSelected($event)" nel template.
  roomSelected = output<Room>();

  rooms        = signal<Room[]>([]);
  searched     = signal(false);
  selectedRoom = signal<Room | null>(null);

  constructor() {
    // Questo effect() reagisce a tre Signal contemporaneamente: checkIn, checkOut e loggedUser.
    // Ogni volta che uno dei tre cambia, Angular riesegue automaticamente il blocco.
    effect(() => {
      const checkIn  = this.checkIn();
      const checkOut = this.checkOut();
      const user     = this.userLogicService.loggedUser();
      const hotelId  = user?.hotel?.id;

      if (!checkIn || !checkOut || !hotelId) {
        this.rooms.set([]);
        this.searched.set(false);
        return;
      }

      this.roomService.getFreeRooms(hotelId, checkIn, checkOut).subscribe({
        next: result => {
          this.rooms.set(result ?? []);
          this.searched.set(true);
          this.selectedRoom.set(null);
        },
        error: err => {
          console.error('Errore ricerca camere:', err);
          this.rooms.set([]);
          this.searched.set(true);
        }
      });
    });

    effect(() => {
      this.resetTrigger();
      this.selectedRoom.set(null);
    });
  }

  // emit() invia l'evento al padre. È l'equivalente di un evento DOM custom:
  // il padre lo ascolta nel template e riceve la camera selezionata.
  select(room: Room): void {
    this.selectedRoom.set(room);
    this.roomSelected.emit(room);
  }

  reset(): void {
    this.selectedRoom.set(null);
  }
}
