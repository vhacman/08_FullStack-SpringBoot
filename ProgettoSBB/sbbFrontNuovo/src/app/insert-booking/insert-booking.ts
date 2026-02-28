import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GuestPicker } from '../guest-picker/guest-picker';
import { RoomPicker } from '../room-picker/room-picker';
import { InsertGuest } from '../insert-guest/insert-guest';
import { BookingService } from '../APIservices/booking/booking-service';
import { differenceInDays } from 'date-fns';
import { Room } from '../model/hotel.entities';

/**
 * Form principale per la creazione di una nuova prenotazione.
 * Il flusso è guidato: prima ospite → poi date → poi camera → poi prezzo e note.
 * Ogni sezione appare solo quando quella precedente è completata,
 * grazie ai Signal e computed() che controllano la visibilità condizionale nel template.
 */
@Component({
  selector: 'app-insert-booking',
  imports: [FormsModule, GuestPicker, RoomPicker, InsertGuest],
  templateUrl: './insert-booking.html',
  styleUrl: './insert-booking.css',
})
export class InsertBooking {

  private bookingService = inject(BookingService);

  // viewChild() permette di ottenere un riferimento al componente figlio
  // per chiamarne i metodi direttamente (es. reset() dopo il submit).
  // È l'equivalente di @ViewChild con i decoratori classici.
  private guestPicker = viewChild(GuestPicker);
  private roomPicker  = viewChild(RoomPicker);

  // today e getTomorrow() devono essere dichiarati PRIMA dei Signal che li usano:
  // TypeScript inizializza i campi della classe nell'ordine in cui appaiono,
  // quindi checkIn = signal(this.today) fallirebbe se today fosse più in basso.
  readonly today = new Date().toISOString().split('T')[0];

  private getTomorrow(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  guestId      = signal<number | null>(null);
  selectedRoom = signal<Room | null>(null);
  checkIn      = signal<string>(this.today);
  checkOut     = signal<string>(this.getTomorrow());
  price        = signal<number>(0);

  showInsertGuest = signal(false);
  success         = signal<boolean>(false);
  errorMessage    = signal<string>('');

  // computed() derivato: true solo se guestId è un numero valido (non null e non 0).
  // Usato nel template per mostrare/nascondere i passi successivi.
  guestSelected = computed(() => this.guestId() !== null);

  // minCheckOut è sempre il giorno dopo il checkIn: così l'input date nel template
  // non permette fisicamente di selezionare una data di uscita precedente all'entrata.
  minCheckOut = computed(() => {
    const date = new Date(this.checkIn());
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  });

  // differenceInDays viene da date-fns, libreria per operazioni sulle date.
  // Ho preferito usarla invece di calcolare manualmente in millisecondi perché
  // gestisce automaticamente fusi orari e casi limite.
  nights    = computed(() => differenceInDays(new Date(this.checkOut()), new Date(this.checkIn())));
  totalCost = computed(() => this.price() * this.nights());

  // form è un oggetto plain (non Signal) perché è legato a [(ngModel)]:
  // ngModel usa il two-way binding classico di Angular, non i Signal.
  form = { roomId: 0, notes: '' };

  onGuestSelected(id: number): void {
    this.guestId.set(id);
    this.showInsertGuest.set(false);
    this.checkIn.set(this.today);
    this.checkOut.set(this.getTomorrow());
    this.resetRoom();
  }

  onGuestNotFound(_name: string): void {
    this.showInsertGuest.set(true);
    this.guestId.set(null);
  }

  onGuestCreated(id: number): void {
    this.showInsertGuest.set(false);
    this.guestId.set(id);
    this.checkIn.set(this.today);
    this.checkOut.set(this.getTomorrow());
    this.resetRoom();
  }

  onCheckInChange(value: string): void {
    this.checkIn.set(value);
    if (this.checkOut() <= value) {
      const d = new Date(value);
      d.setDate(d.getDate() + 1);
      this.checkOut.set(d.toISOString().split('T')[0]);
    }
    this.resetRoom();
  }

  onCheckOutChange(value: string): void {
    this.checkOut.set(value);
    this.resetRoom();
  }

  onRoomSelected(room: Room): void {
    this.selectedRoom.set(room);
    this.form.roomId = room.id!;
    this.price.set(room.basePrice);
  }

  submit(): void {
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
        const msg = err.error?.message ?? err.message ?? 'Errore durante il salvataggio. Riprova.';
        this.errorMessage.set(msg);
      }
    });
  }

  reset(): void {
    this.resetForm();
    this.success.set(false);
    this.errorMessage.set('');
  }

  private resetForm(): void {
    this.guestId.set(null);
    this.checkIn.set(this.today);
    this.checkOut.set(this.getTomorrow());
    this.selectedRoom.set(null);
    this.price.set(0);
    this.form = { roomId: 0, notes: '' };
    // Chiamo reset() sui componenti figli tramite viewChild():
    // senza questo, GuestPicker e RoomPicker manterrebbero il loro stato interno
    // anche dopo il submit, mostrando ancora i dati della prenotazione precedente.
    this.guestPicker()?.reset();
    this.roomPicker()?.reset();
  }

  private resetRoom(): void {
    this.selectedRoom.set(null);
    this.form.roomId = 0;
    this.price.set(0);
  }
}
