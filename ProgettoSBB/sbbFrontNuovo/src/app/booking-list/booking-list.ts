import { Component, computed, effect, inject, signal } from '@angular/core';
import { BookingRow } from '../booking-row/booking-row';
import { BookingService } from '../APIservices/booking/booking-service';
import { UserLogicService } from '../ComponentLogicService/user-logic-service';
import { Booking } from '../model/hotel.entities';

// Tipo locale che aggiunge 'TUTTI' ai valori di BookingStatus.
// Serve per il filtro UI: non esiste nel backend, è solo un'opzione visiva.
type FilterOption = 'TUTTI' | 'PENDING' | 'CHECKED_IN' | 'CHECKED_OUT' | 'COMPLETE' | 'CANCELED';

/**
 * Lista completa delle prenotazioni dell'hotel con filtro per stato.
 * Usa un effect() per ricaricare automaticamente i dati quando l'utente
 * loggato è disponibile (il segnale potrebbe arrivare in ritardo rispetto
 * al render del componente, quindi non possiamo fare la chiamata nel costruttore
 * con un valore statico).
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

  // computed() ricalcola automaticamente la lista filtrata ogni volta che
  // bookings() o activeFilter() cambiano: non serve gestire manualmente l'aggiornamento.
  filtered = computed(() => {
    const f = this.activeFilter();
    const sorted = [...this.bookings()].sort((a, b) =>
      String(b.checkIn).localeCompare(String(a.checkIn))
    );
    return f === 'TUTTI' ? sorted : sorted.filter(b => b.status === f);
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
