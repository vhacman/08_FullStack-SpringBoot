import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GuestPicker } from '../guest-picker/guest-picker';
import { RoomPicker } from '../room-picker/room-picker';
import { InsertGuest } from '../insert-guest/insert-guest';
import { BookingService } from '../APIservices/booking/booking-service';
import { UserLogicService } from '../ComponentLogicService/user-logic-service';
import { differenceInDays } from 'date-fns';
import { Room } from '../model/hotel.entities';

@Component({
  selector: 'app-insert-booking',
  imports: [FormsModule, GuestPicker, RoomPicker, InsertGuest],
  templateUrl: './insert-booking.html',
  styleUrl: './insert-booking.css',
})
export class InsertBooking {

  private bookingService   = inject(BookingService);
  private userLogicService = inject(UserLogicService);
  private guestPicker      = viewChild(GuestPicker);
  private roomPicker       = viewChild(RoomPicker);

  // ID dell'ospite selezionato (null = nessuno)
  guestId       = signal<number | null>(null);
  guestSelected = computed(() => this.guestId() !== null);

  // Mostra form inserimento ospite se non trovato
  showInsertGuest = signal(false);

  // Data odierna "YYYY-MM-DD", usata come min negli input date
  today: string = new Date().toISOString().split('T')[0];

  private getTomorrow(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  // Signal per le date di check-in e check-out
  checkIn  = signal<string>(this.today);
  checkOut = signal<string>(this.getTomorrow());

  // Data minima per il check-out: giorno successivo al check-in
  minCheckOut = computed(() => {
    const date = new Date(this.checkIn());
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  });

  // Numero di notti tra check-in e check-out
  nights = computed(() => {
    return differenceInDays(new Date(this.checkOut()), new Date(this.checkIn()));
  });

  // Price come signal per renderlo reattivo
  price = signal<number>(0);

  // Totale calcolato: price × nights
  totalCost = computed(() => this.price() * this.nights());

  // Oggetto plain per i campi del form non reattivi (solo roomId e notes)
  form = { roomId: 0, notes: '' };

  // Camera attualmente selezionata (arriva dal RoomPicker)
  selectedRoom = signal<Room | null>(null);

  // Stato della submit: true = successo, false = idle
  success      = signal<boolean>(false);
  errorMessage = signal<string>('');

  // ── Handlers ──

  // Chiamato dal GuestPicker quando l'utente seleziona un ospite
  onGuestSelected(id: number): void {
    this.guestId.set(id);
    this.showInsertGuest.set(false);
    this.checkIn.set(this.today);
    this.checkOut.set(this.getTomorrow());
    this.resetRoom();
  }

  // Chiamato dal GuestPicker quando non trova nessun ospite
  onGuestNotFound(name: string): void {
    this.showInsertGuest.set(true);
    this.guestId.set(null);
  }

  // Chiamato quando un nuovo ospite viene creato
  onGuestCreated(id: number): void {
    this.showInsertGuest.set(false);
    this.guestId.set(id);
    this.checkIn.set(this.today);
    this.checkOut.set(this.getTomorrow());
    this.resetRoom();
  }

  // Aggiorna il check-in; se il check-out esistente diventasse precedente o uguale,
  // lo sposta automaticamente al giorno successivo
  onCheckInChange(value: string): void {
    console.log('onCheckInChange:', value);
    this.checkIn.set(value);
    if (this.checkOut() <= value) {
      const d = new Date(value);
      d.setDate(d.getDate() + 1);
      this.checkOut.set(d.toISOString().split('T')[0]);
    }
    this.resetRoom();
  }

  // Aggiorna il check-out e resetta i risultati della ricerca
  onCheckOutChange(value: string): void {
    console.log('onCheckOutChange:', value);
    this.checkOut.set(value);
    this.resetRoom();
  }

  // Chiamato dal RoomPicker quando l'utente seleziona una camera
  onRoomSelected(room: Room): void {
    console.log('onRoomSelected:', room);
    this.selectedRoom.set(room);
    this.form.roomId = room.id!;
    this.price.set(room.basePrice);
  }

  // Invia la prenotazione al backend; in caso di successo resetta il form
  submit(): void {
    console.log('Submitting booking:', {
      guestId: this.guestId(),
      roomId: this.form.roomId,
      checkIn: this.checkIn(),
      checkOut: this.checkOut(),
      price: this.price()
    });
    this.bookingService.insert({
      guestId:  this.guestId()!,
      roomId:   this.form.roomId,
      checkIn:  this.checkIn(),
      checkOut: this.checkOut(),
      price:    this.price(),
      notes:    this.form.notes,
      cleaned:  false
    }).subscribe({
      next: () => {
        this.success.set(true);
        this.errorMessage.set('');
        this.resetForm();
      },
      error: err => {
        const msg = err.error?.message || err.message || 'Errore durante il salvataggio. Riprova.';
        this.errorMessage.set(msg);
        console.error('Booking error:', err);
      }
    });
  }

  // Resetta tutto il form inclusi i messaggi di stato
  reset(): void {
    this.resetForm();
    this.success.set(false);
    this.errorMessage.set('');
  }

  // Resetta tutti i signal, l'oggetto form e il GuestPicker/RoomPicker
  private resetForm(): void {
    this.guestId.set(null);
    this.checkIn.set(this.today);
    this.checkOut.set(this.getTomorrow());
    this.selectedRoom.set(null);
    this.price.set(0);
    this.form = { roomId: 0, notes: '' };
    this.guestPicker()?.reset();
    this.roomPicker()?.reset();
  }

  // Svuota la selezione della camera
  private resetRoom(): void {
    this.selectedRoom.set(null);
    this.form.roomId = 0;
    this.price.set(0);
  }
}
