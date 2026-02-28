import { Component, computed, effect, inject, signal } from '@angular/core';
import { BookingRow } from '../booking-row/booking-row';
import { BookingService } from '../APIservices/booking/booking-service';
import { UserLogicService } from '../APIservices/user/user-logic-service';
import { Booking } from '../model/hotel.entities';

// Tipo locale che aggiunge 'TUTTI' ai valori di BookingStatus.
// Non esiste nel backend, è solo un'opzione visiva per il filtro UI.
// Ho usato un union type TypeScript invece di un enum perché è più leggero
// e non genera codice extra a runtime.
type FilterOption = 'TUTTI' | 'PENDING' | 'CHECKED_IN' | 'CHECKED_OUT' | 'COMPLETE' | 'CANCELED';

/**
 * Lista completa delle prenotazioni dell'hotel con filtro per stato.
 * Usa effect() per caricare i dati non appena l'utente loggato è disponibile:
 * non possiamo farlo direttamente nel costruttore perché loggedUser() potrebbe
 * essere ancora null (la risposta HTTP non è ancora arrivata).
 */
@Component({
  selector: 'app-booking-list',
  imports: [BookingRow],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.css',
})
export class BookingList {
  private bookingService = inject(BookingService);
  private userLogicService = inject(UserLogicService);
  private loggedUser = this.userLogicService.loggedUser;

  bookings = signal<Booking[]>([]);
  activeFilter = signal<FilterOption>('TUTTI');

  // computed() ricalcola automaticamente ogni volta che bookings() o activeFilter() cambiano.
  // Il [...this.bookings()] è lo spread operator: serve a copiare l'array prima di ordinarlo,
  // perché sort() modifica l'array originale e Angular Signals non vuole mutazioni dirette.

  // localCompare -> values returns a number indicating whether this string comes before,
  // or after, or is the same as the given string in sort order
  filtered = computed(() => {
    const filterOption = this.activeFilter();
    const sorted = [...this.bookings()].sort((a, b) =>
      String(b.checkIn).localeCompare(String(a.checkIn))
    );
    return filterOption === 'TUTTI' ? sorted : sorted.filter(b => b.status === filterOption);
  });

  readonly filters: { label: string; value: FilterOption }[] = [
    { label: 'Tutti', value: 'TUTTI' },
    { label: 'In attesa', value: 'PENDING' },
    { label: 'Check-in', value: 'CHECKED_IN' },
    { label: 'Check-out', value: 'CHECKED_OUT' },
    { label: 'Completate', value: 'COMPLETE' },
    { label: 'Cancellate', value: 'CANCELED' },
  ];

  constructor() {
    effect(() => {
      const user = this.loggedUser();
      if (user && user.hotel?.id) {
        this.loadBookings(user.hotel.id);
      }
    });
  }

  private loadBookings(hotelId: number): void {
    this.bookingService.getByHotel(hotelId).subscribe({
      next: list => this.bookings.set(list),
      error: err => console.error('Errore caricamento prenotazioni:', err),
    });
  }

  /**
   * @param status filtro di cui contare le prenotazioni
   * @returns numero di prenotazioni per quello stato (o totale se 'TUTTI')
   */
  countFor(status: FilterOption): number {
    if (status === 'TUTTI') return this.bookings().length;
    return this.bookings().filter(b => b.status === status).length;
  }

  /** @param f filtro da attivare */
  setFilter(f: FilterOption): void {
    this.activeFilter.set(f);
  }

  /** Ricarica le prenotazioni dal server (es. dopo un'azione su una riga). */
  refresh(): void {
    const user = this.loggedUser();
    if (user && user.hotel?.id) {
      this.loadBookings(user.hotel.id);
    }
  }
}
