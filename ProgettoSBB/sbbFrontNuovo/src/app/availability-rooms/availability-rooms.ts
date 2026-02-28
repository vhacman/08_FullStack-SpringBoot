import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../APIservices/room/room-service';
import { BookingService } from '../APIservices/booking/booking-service';
import { GuestPicker } from '../guest-picker/guest-picker';
import { InsertGuest } from '../insert-guest/insert-guest';
import { UserLogicService } from '../APIservices/user/user-logic-service';
import { Room, Booking } from '../model/hotel.entities';
import { differenceInDays } from 'date-fns';

type RoomFilter = 'TUTTI' | 'AVAILABLE' | 'OCCUPIED' | 'TO_CLEAN';

/**
 * Pagina di gestione camere: mostra lo stato di ogni camera (disponibile,
 * occupata, da pulire) con filtri rapidi e la possibilità di aprire una
 * nuova prenotazione direttamente dalla card della camera.
 */
@Component({
  selector: 'app-availability-rooms',
  imports: [CommonModule, FormsModule, GuestPicker, InsertGuest],
  templateUrl: './availability-rooms.html',
  styleUrl: './availability-rooms.css',
})
export class AvailabilityRooms {

  // SERVIZI
  private roomService    = inject(RoomService);
  private bookingService = inject(BookingService);
  private userService    = inject(UserLogicService);

  // STATO CAMERE E PRENOTAZIONI
  rooms    = signal<Room[]>([]);
  bookings = signal<Booking[]>([]);
  loading  = signal(true);

  // FILTRI
  activeFilter = signal<RoomFilter>('TUTTI');

  filtered = computed(() => {
    const f = this.activeFilter();
    return f === 'TUTTI' ? this.rooms() : this.rooms().filter(r => r.status === f);
  });

  readonly filters: {
    label: string;
    value: RoomFilter }[] = [
    { label: 'Tutte',       value: 'TUTTI'     },
    { label: 'Disponibili', value: 'AVAILABLE' },
    { label: 'Occupate',    value: 'OCCUPIED'  },
    { label: 'Da pulire',   value: 'TO_CLEAN'  },
  ];

  // STATO MODAL NUOVA PRENOTAZIONE
  // Un modal è una finestra che appare sopra la pagina principale per raccogliere
  // input dall'utente senza cambiare schermata. Lo chiamiamo "modal" perché blocca
  // l'interazione con il resto della pagina finché non viene chiuso o confermato.
  showModal       = signal(false);
  selectedRoom    = signal<Room | null>(null);
  guestId         = signal<number | null>(null);
  checkIn         = signal<string>('');
  checkOut        = signal<string>('');
  price           = signal<number>(0);
  notes           = signal<string>('');
  showInsertGuest = signal(false);
  bookingSuccess  = signal(false);
  bookingError    = signal<string>('');

  readonly today = new Date().toISOString().split('T')[0];

  // INIZIALIZZAZIONE
  constructor() {
    // effect() reagisce ogni volta che loggedUser() cambia.
    // Questo risolve il problema del timing: ngOnInit leggerebbe il Signal
    // una volta sola, quasi sempre quando è ancora null (HTTP non tornata).
    // Con effect() invece carichiamo i dati non appena l'utente è disponibile.
    effect(() => {
      const hotelId = this.userService.loggedUser()?.hotel?.id;
      if (!hotelId) return;

      this.roomService.findAll().subscribe({
        next: rooms => {
          this.rooms.set(rooms.filter(r => r.hotelId === hotelId));
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });

      this.bookingService.getByHotel(hotelId).subscribe({
        next:  bookings => this.bookings.set(bookings),
        error: err => console.error('Errore caricamento prenotazioni', err)
      });
    });
  }

  // LOGICA CAMERE
  /** Conta le camere per un dato stato (o tutte se TUTTI). */
  countFor(status: RoomFilter): number {
    if (status === 'TUTTI') return this.rooms().length;
    return this.rooms().filter(r => r.status === status).length;
  }

  setFilter(f: RoomFilter): void {
    this.activeFilter.set(f);
  }

  /** True se la camera ha almeno una prenotazione attiva (non conclusa né annullata). */
  hasActiveBooking(roomId: number): boolean {
    return this.bookings().some(b =>
      b.room?.id === roomId &&
      b.status !== 'COMPLETE' &&
      b.status !== 'CANCELED'
    );
  }

  /**
   * Cercando come applicare classi CSS dinamiche in Angular ho trovato [class]="espressione",
   * che valuta un'espressione TypeScript e applica il risultato come classe all'elemento.
   * Questo metodo fa da "traduttore": riceve lo stato della camera e restituisce
   * il nome della classe CSS corrispondente, così ogni card si colora in base al suo stato.
   */
  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'AVAILABLE': return 'status-available';
      case 'OCCUPIED':  return 'status-occupied';
      case 'TO_CLEAN':  return 'status-to-clean';
      default:          return '';
    }
  }

  // GESTIONE MODAL
  /** Apre il modal precompilando date (oggi/domani) e prezzo base della camera. */
  openBookingModal(room: Room): void {
    this.selectedRoom.set(room);
    this.resetForm();
    this.checkIn.set(this.today);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.checkOut.set(tomorrow.toISOString().split('T')[0]);
    this.price.set(room.basePrice ?? 0);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedRoom.set(null);
    this.resetForm();
  }

  private resetForm(): void {
    this.guestId.set(null);
    this.showInsertGuest.set(false);
    this.notes.set('');
    this.bookingSuccess.set(false);
    this.bookingError.set('');
  }

  // GESTIONE OSPITE
  /** Chiamato sia da GuestPicker (ospite trovato) sia da InsertGuest (ospite appena creato). */
  onGuestReady(id: number): void {
    this.guestId.set(id);
    this.showInsertGuest.set(false);
  }

  /** Chiamato da GuestPicker quando l'ospite non esiste: apre il form di inserimento. */
  onGuestNotFound(_name: string): void {
    this.showInsertGuest.set(true);
    this.guestId.set(null);
  }

  // GESTIONE DATE E COSTO
  onCheckInChange(value: string): void {
    this.checkIn.set(value);
    // Se checkOut è prima o uguale al nuovo checkIn, lo sposta al giorno successivo
    if (this.checkOut() <= value) {
      const d = new Date(value);
      d.setDate(d.getDate() + 1);
      this.checkOut.set(d.toISOString().split('T')[0]);
    }
  }

  onCheckOutChange(value: string): void {
    this.checkOut.set(value);
  }

  /** Numero di notti tra checkIn e checkOut. */
  get nights(): number {
    return differenceInDays(new Date(this.checkOut()), new Date(this.checkIn()));
  }

  /** Costo totale = prezzo per notte x notti. */
  get totalCost(): number {
    return this.price() * this.nights;
  }

  // INVIO PRENOTAZIONE
  /** Invia la nuova prenotazione al backend. */
  submitBooking(): void {
    if (!this.guestId() || !this.selectedRoom()) {
      this.bookingError.set('Seleziona un ospite');
      return;
    }

    this.bookingService.insert({
      guestId:  this.guestId()!,
      roomId:   this.selectedRoom()!.id!,
      checkIn:  this.checkIn(),
      checkOut: this.checkOut(),
      price:    this.price(),
      notes:    this.notes(),
      cleaned:  false
    }).subscribe({
      next: () => {
        this.bookingSuccess.set(true);
        setTimeout(() => this.closeModal(), 2000);
      },
      error: err => {
        this.bookingError.set(err.error?.message ?? 'Errore durante il salvataggio');
      }
    });
  }
}
