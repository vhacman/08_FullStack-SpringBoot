import { Component, inject, signal, input, output, effect } from '@angular/core';
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

  private roomService = inject(RoomService);
  private userLogicService = inject(UserLogicService);

  checkIn = input<string | null>(null);
  checkOut = input<string | null>(null);

  roomSelected = output<Room>();

  rooms = signal<Room[]>([]);
  searched = signal(false);
  selectedRoom = signal<Room | null>(null);

  constructor() {
    effect(() => {
      const ci = this.checkIn();
      const co = this.checkOut();
      const user = this.userLogicService.loggedUser();
      const hotelId = user?.hotel?.id;

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
