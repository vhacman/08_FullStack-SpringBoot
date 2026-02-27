import { Component, inject, signal, input, output, effect } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, switchMap, of } from 'rxjs';
import { RoomService } from '../APIservices/room/room-service';
import { UserLogicService } from '../ComponentLogicService/user-logic-service';
import { Room } from '../model/hotel.entities';

@Component({
  selector: 'app-room-picker',
  imports: [],
  templateUrl: './room-picker.html',
  styleUrl: './room-picker.css',
})
export class RoomPicker {

  private roomService      = inject(RoomService);
  private userLogicService = inject(UserLogicService);

  // Date ricevute dal padre: quando cambiano, parte automaticamente una nuova ricerca
  checkIn  = input<string | null>(null);
  checkOut = input<string | null>(null);

  // Emette la camera selezionata verso il padre
  roomSelected = output<Room>();

  // Stato interno
  rooms        = signal<Room[]>([]);
  searched     = signal(false);
  selectedRoom = signal<Room | null>(null);

  constructor() {
    // Reagisce ai cambiamenti di checkIn, checkOut o utente loggato
    effect(() => {
      const ci = this.checkIn();
      const co = this.checkOut();
      const user = this.userLogicService.loggedUser();
      const hotelId = user?.hotel?.id;
      
      console.log('RoomPicker effect:', { ci, co, hotelId });

      if (!ci || !co || !hotelId) {
        this.rooms.set([]);
        this.searched.set(false);
        return;
      }

      this.roomService.getFreeRooms(hotelId, ci, co).subscribe({
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
    }, { allowSignalWrites: true });
  }

  select(room: Room): void {
    this.selectedRoom.set(room);
    this.roomSelected.emit(room);
  }

  reset(): void {
    this.selectedRoom.set(null);
  }
}
