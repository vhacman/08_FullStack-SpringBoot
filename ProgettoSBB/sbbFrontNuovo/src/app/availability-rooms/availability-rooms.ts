import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../APIservices/room/room-service';
import { BookingService } from '../APIservices/booking/booking-service';
import { GuestPicker } from '../guest-picker/guest-picker';
import { InsertGuest } from '../insert-guest/insert-guest';
import { UserLogicService } from '../ComponentLogicService/user-logic-service';
import { Room, Booking } from '../model/hotel.entities';
import { differenceInDays } from 'date-fns';

type RoomFilter = 'TUTTI' | 'AVAILABLE' | 'OCCUPIED' | 'TO_CLEAN';

@Component({
  selector: 'app-availability-rooms',
  imports: [CommonModule, FormsModule, GuestPicker, InsertGuest],
  templateUrl: './availability-rooms.html',
  styleUrl: './availability-rooms.css',
})
export class AvailabilityRooms implements OnInit {
  private roomService = inject(RoomService);
  private bookingService = inject(BookingService);
  private userLogicService = inject(UserLogicService);

  rooms = signal<Room[]>([]);
  bookings = signal<Booking[]>([]);
  loading = signal(true);

  activeFilter = signal<RoomFilter>('TUTTI');

  filtered = computed(() => {
    const f = this.activeFilter();
    return f === 'TUTTI' ? this.rooms() : this.rooms().filter(r => r.status === f);
  });

  readonly filters: { label: string; value: RoomFilter }[] = [
    { label: 'Tutte', value: 'TUTTI' },
    { label: 'Disponibili', value: 'AVAILABLE' },
    { label: 'Occupate', value: 'OCCUPIED' },
    { label: 'Da pulire', value: 'TO_CLEAN' },
  ];

  showModal = signal(false);
  selectedRoom = signal<Room | null>(null);

  guestId = signal<number | null>(null);
  checkIn = signal<string>('');
  checkOut = signal<string>('');
  price = signal<number>(0);
  notes = signal<string>('');
  showInsertGuest = signal(false);
  bookingSuccess = signal(false);
  bookingError = signal<string>('');

  today: string = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    const hotelId = this.userLogicService.loggedUser()?.hotel?.id;
    if (hotelId) {
      this.roomService.findAll().subscribe({
        next: (allRooms) => {
          this.rooms.set(allRooms.filter((r: Room) => r.hotelId === hotelId));
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
      
      this.bookingService.getByHotel(hotelId).subscribe({
        next: (bookings) => this.bookings.set(bookings),
        error: () => {}
      });
    } else {
      this.loading.set(false);
    }
  }

  countFor(status: RoomFilter): number {
    if (status === 'TUTTI') return this.rooms().length;
    return this.rooms().filter(r => r.status === status).length;
  }

  setFilter(f: RoomFilter): void {
    this.activeFilter.set(f);
  }

  hasActiveBooking(roomId: number): boolean {
    return this.bookings().some(b => 
      b.room?.id === roomId && 
      b.status !== 'COMPLETE' && 
      b.status !== 'CANCELED'
    );
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'AVAILABLE': return 'status-available';
      case 'OCCUPIED': return 'status-occupied';
      case 'TO_CLEAN': return 'status-to-clean';
      default: return '';
    }
  }

  openBookingModal(room: Room): void {
    this.selectedRoom.set(room);
    this.showModal.set(true);
    this.resetForm();
    this.checkIn.set(this.today);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.checkOut.set(tomorrow.toISOString().split('T')[0]);
    this.price.set(room.basePrice || 0);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedRoom.set(null);
    this.resetForm();
  }

  resetForm(): void {
    this.guestId.set(null);
    this.showInsertGuest.set(false);
    this.notes.set('');
    this.bookingSuccess.set(false);
    this.bookingError.set('');
  }

  onGuestSelected(id: number): void {
    this.guestId.set(id);
    this.showInsertGuest.set(false);
  }

  onGuestNotFound(name: string): void {
    this.showInsertGuest.set(true);
    this.guestId.set(null);
  }

  onGuestCreated(id: number): void {
    this.showInsertGuest.set(false);
    this.guestId.set(id);
  }

  onCheckInChange(value: string): void {
    this.checkIn.set(value);
    if (this.checkOut() <= value) {
      const d = new Date(value);
      d.setDate(d.getDate() + 1);
      this.checkOut.set(d.toISOString().split('T')[0]);
    }
  }

  onCheckOutChange(value: string): void {
    this.checkOut.set(value);
  }

  get nights(): number {
    return differenceInDays(new Date(this.checkOut()), new Date(this.checkIn()));
  }

  get totalCost(): number {
    return this.price() * this.nights;
  }

  submitBooking(): void {
    if (!this.guestId() || !this.selectedRoom()) {
      this.bookingError.set('Seleziona un ospite');
      return;
    }

    this.bookingService.insert({
      guestId: this.guestId()!,
      roomId: this.selectedRoom()!.id!,
      checkIn: this.checkIn(),
      checkOut: this.checkOut(),
      price: this.price(),
      notes: this.notes(),
      cleaned: false
    }).subscribe({
      next: () => {
        this.bookingSuccess.set(true);
        setTimeout(() => this.closeModal(), 2000);
      },
      error: err => {
        this.bookingError.set(err.error?.message || 'Errore durante il salvataggio');
      }
    });
  }
}
