import { Component, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../services/booking/booking-service';
import { RoomService }    from '../services/room/room-service';
import { UserService }    from '../services/user/user-service';
import { Room }           from '../model/hotel.entities';
import { GuestPicker }    from '../guest-picker/guest-picker';

@Component({
  selector: 'app-insert-quick-booking',
  // GuestPicker aggiunto agli imports: ora è lui a gestire autocomplete e caricamento
  imports: [FormsModule, GuestPicker],
  templateUrl: './insert-quick-booking.html',
  styleUrl: './insert-quick-booking.css',
})
export class InsertQuickBooking {
  private bookingService = inject(BookingService);
  private roomService    = inject(RoomService);
  private userService    = inject(UserService);

  // Riferimento al picker per poterne chiamare reset() quando si azzera il form
  private guestPicker = viewChild(GuestPicker);

  formVisible = signal(false);
  success     = signal(false);
  errorMsg    = signal('');

  // ── Camere ──
  freeRooms     = signal<Room[]>([]);
  roomsSearched = signal(false);

  form = { guestId: 0, roomId: 0, checkIn: '', checkOut: '', price: 0, notes: '' };

  toggleForm(): void {
    this.formVisible.update(v => !v);
    this.success.set(false);
    this.errorMsg.set('');
  }

  // Aggiorna form.guestId quando il picker emette la selezione
  onGuestSelected(id: number): void {
    this.form.guestId = id;
  }

  // ── Camere ──
  searchRooms(): void {
    const hotelId = this.userService.loggedUser()?.hotel?.id;
    if (!hotelId || !this.form.checkIn || !this.form.checkOut) return;
    this.roomService.getFreeRooms(hotelId, this.form.checkIn, this.form.checkOut).subscribe({
      next: rooms => {
        this.freeRooms.set(rooms);
        this.roomsSearched.set(true);
        this.form.roomId = 0;
        this.form.price  = 0;
      },
      error: err => console.error('Errore ricerca camere:', err)
    });
  }

  onRoomChange(): void {
    const room = this.freeRooms().find(r => r.id === +this.form.roomId);
    if (room) this.form.price = room.basePrice;
  }

  // ── Submit ──
  submit(): void {
    this.bookingService.insert(this.form).subscribe({
      next: () => {
        this.success.set(true);
        this.errorMsg.set('');
        this.resetForm();
      },
      error: err => {
        this.errorMsg.set('Errore durante il salvataggio. Riprova.');
        console.error(err);
      }
    });
  }

  reset(): void {
    this.resetForm();
    this.success.set(false);
    this.errorMsg.set('');
  }

  private resetForm(): void {
    this.form = { guestId: 0, roomId: 0, checkIn: '', checkOut: '', price: 0, notes: '' };
    // Il picker gestisce il proprio stato: gli deleghiamo il reset del testo
    this.guestPicker()?.reset();
    this.freeRooms.set([]);
    this.roomsSearched.set(false);
  }
}
