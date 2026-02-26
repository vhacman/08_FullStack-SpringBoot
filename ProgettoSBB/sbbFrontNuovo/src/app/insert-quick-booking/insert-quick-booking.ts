import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../services/booking/booking-service';
import { GuestService } from '../services/guest/guest-service';
import { RoomService } from '../services/room/room-service';
import { UserService } from '../services/user/user-service';
import { Guest, Room } from '../model/hotel.entities';

@Component({
  selector: 'app-insert-quick-booking',
  imports: [FormsModule],
  templateUrl: './insert-quick-booking.html',
  styleUrl: './insert-quick-booking.css',
})
export class InsertQuickBooking implements OnInit {
  private bookingService = inject(BookingService);
  private guestService   = inject(GuestService);
  private roomService    = inject(RoomService);
  private userService    = inject(UserService);

  formVisible  = signal(false);
  success      = signal(false);
  errorMsg     = signal('');

  // ── Guest autocomplete ──
  guests         = signal<Guest[]>([]);
  guestInput     = signal('');
  showDropdown   = signal(false);
  filteredGuests = computed(() => {
    const s = this.guestInput().toLowerCase().trim();
    if (!s) return this.guests();
    return this.guests().filter(g =>
      g.firstName.toLowerCase().includes(s) ||
      g.lastName.toLowerCase().includes(s)
    );
  });

  // ── Camere ──
  freeRooms     = signal<Room[]>([]);
  roomsSearched = signal(false);

  form = { guestId: 0, roomId: 0, from: '', to: '', price: 0, notes: '' };

  ngOnInit(): void {
    this.guestService.findAll().subscribe({
      next:  g   => this.guests.set(g),
      error: err => console.error('Errore caricamento ospiti:', err)
    });
  }

  toggleForm(): void {
    this.formVisible.update(v => !v);
    this.success.set(false);
    this.errorMsg.set('');
  }

  // ── Autocomplete handlers ──
  onGuestInput(value: string): void {
    this.guestInput.set(value);
    this.form.guestId = 0;
    this.showDropdown.set(true);
  }

  selectGuest(g: Guest): void {
    this.guestInput.set(`${g.lastName} ${g.firstName}`);
    this.form.guestId = g.id!;
    this.showDropdown.set(false);
  }

  onGuestBlur(): void {
    // Timeout: lascia il tempo al mousedown sull'item di scattare prima del blur
    setTimeout(() => this.showDropdown.set(false), 150);
  }

  // ── Camere ──
  searchRooms(): void {
    const hotelId = this.userService.loggedUser()?.hotel?.id;
    if (!hotelId || !this.form.from || !this.form.to) return;
    this.roomService.getFreeRooms(hotelId, this.form.from, this.form.to).subscribe({
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
    this.form = { guestId: 0, roomId: 0, from: '', to: '', price: 0, notes: '' };
    this.guestInput.set('');
    this.freeRooms.set([]);
    this.roomsSearched.set(false);
  }
}
