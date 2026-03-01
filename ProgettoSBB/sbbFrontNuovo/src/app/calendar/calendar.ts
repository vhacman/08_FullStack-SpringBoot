import {Component, computed, effect, inject, signal} from '@angular/core';
import {CalendarService} from '../APIservices/calendar/calendar-service';
import {UserLogicService} from '../APIservices/user/user-logic-service';
import {Booking, HotelClosure, Room} from '../model/hotel.entities';
import {CalendarDay} from '../model/calendar.model';
import {CalendarHeader} from '../calendar-header/calendar-header';
import {CalendarGrid} from '../calendar-grid/calendar-grid';
import {CalendarModals} from '../calendar-modals/calendar-modals';

/**
 * Contenitore del calendario: possiede tutti i Signal e orchestra i tre figli.
 * - CalendarHeader: navigazione mese e legenda
 * - CalendarGrid: griglia celle + gestione drag (completamente incapsulata)
 * - CalendarModals: tutti e 4 i modal (presentazionale, nessuna logica HTTP)
 *
 * Questo componente non gestisce più mousedown/mouseenter/mouseup:
 * CalendarGrid emette dayClicked e dragCompleted, e qui decidiamo quale modal aprire.
 */
@Component({
  selector: 'app-calendar',
  imports: [CalendarHeader, CalendarGrid, CalendarModals],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar
{
  private calendarService = inject(CalendarService);
  private userLogicService = inject(UserLogicService);
  // ── STATO DATI ────────────────────────────────────────────────────────────
  bookings = signal<Booking[]>([]);
  rooms = signal<Room[]>([]);
  closures = signal<HotelClosure[]>([]);
  // Memorizzato per non ricalcolarlo in ogni metodo che chiama CalendarService.
  private currentHotelId = signal<number | null>(null);
  // ── STATO NAVIGAZIONE ─────────────────────────────────────────────────────
  viewDate = signal<Date>(new Date());
  // ── STATO MODAL CHIUSURA ──────────────────────────────────────────────────
  showClosureModal = signal(false);
  pendingStart = signal<string | null>(null);
  pendingEnd = signal<string | null>(null);
  closureReason = signal('');
  closureError = signal<string | null>(null);
  // ── STATO MODAL RIAPERTURA ────────────────────────────────────────────────
  showReopenModal = signal(false);
  // ── STATO MODAL RIMOZIONE SINGOLO GIORNO ─────────────────────────────────
  showDeleteModal = signal(false);
  closureToDelete = signal<HotelClosure | null>(null);
  // ── STATO MODAL DETTAGLIO GIORNO ──────────────────────────────────────────
  showDayDetailModal = signal(false);
  selectedDay = signal<CalendarDay | null>(null);
  // ── COMPUTED ──────────────────────────────────────────────────────────────
  // calendarDays: costruisce l'array di celle (35 o 42) per la griglia.
  // Si ricalcola automaticamente quando cambiano bookings, rooms, closures o viewDate.
  calendarDays = computed((): CalendarDay[] =>
  {
    const bookings = this.bookings();
    const rooms = this.rooms();
    const closures = this.closures();
    const vd = this.viewDate();
    const year = vd.getFullYear();
    const month = vd.getMonth();
    const total = rooms.length;

    // Converte Date in "YYYY-MM-DD" con orario locale (non UTC, per evitare sfasamenti in UTC+2).
    const toDateStr = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const today = toDateStr(new Date());
    const ACTIVE = new Set(['PENDING', 'CHECKED_IN']);

    const buildDay = (date: Date, isCurrentMonth: boolean): CalendarDay => {
      const dateStr = toDateStr(date);

      // Set di id-camera distinte occupate in questo giorno.
      // La condizione checkIn <= dateStr < checkOut rispecchia la logica hotel:
      // il giorno di check-out la camera non è più occupata.
      const occupied = new Set(
        bookings
          .filter(b =>
            ACTIVE.has(b.status) &&
            String(b.checkIn) <= dateStr &&
            String(b.checkOut) > dateStr
          )
          .map(b => b.room?.id)
          .filter((id): id is number => id != null)
      );

      const closure = closures.find(c =>  String(c.startDate) <= dateStr && String(c.endDate) >= dateStr);

      return {
        dateStr,
        day: date.getDate(),
        isCurrentMonth,
        isToday: dateStr === today,
        occupiedRooms: occupied.size,
        totalRooms: total,
        isClosed: !!closure,
        closureId: closure?.id,
        closureReason: closure?.reason,
      };
    };

    const days: CalendarDay[] = [];

    // Celle mese precedente (padding iniziale).
    // getDay()==0 è domenica → 6 celle vuote; altrimenti getDay()-1.
    const firstDow = new Date(year, month, 1).getDay();
    const padding = firstDow === 0 ? 6 : firstDow - 1;
    for (let i = padding; i > 0; i--) {
      days.push(buildDay(new Date(year, month, 1 - i), false));
    }

    // Celle mese corrente.
    // new Date(year, month+1, 0) → giorno 0 del mese successivo = ultimo giorno del corrente.
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(buildDay(new Date(year, month, d), true));
    }

    // Celle mese successivo (padding finale per completare l'ultima riga).
    let next = 1;
    while (days.length % 7 !== 0) {
      days.push(buildDay(new Date(year, month + 1, next++), false));
    }

    return days;
  });

  // dayBookings: prenotazioni attive nel giorno selezionato, per il modal dettaglio.
  // Restituisce [] se selectedDay è null (modal chiuso).
  dayBookings = computed(() => {
    const day = this.selectedDay();
    if (!day) return [];
    const ACTIVE = new Set(['PENDING', 'CHECKED_IN']);
    return this.bookings().filter(b =>
      ACTIVE.has(b.status) &&
      String(b.checkIn) <= day.dateStr &&
      String(b.checkOut) > day.dateStr
    );
  });

  // ── COSTRUTTORE ───────────────────────────────────────────────────────────

  // effect() invece di ngOnInit() perché loggedUser() è null al primo render.
  // Il blocco si riesegue quando il Signal cambia: la prima esecuzione utile
  // è quando loggedUser() passa da null all'utente reale.
  constructor() {
    effect(() => {
      const user = this.userLogicService.loggedUser();
      if (user && user.hotel?.id) {
        this.currentHotelId.set(user.hotel.id);
        this.loadData(user.hotel.id);
      }
    });
  }

  // ── CARICAMENTO DATI ──────────────────────────────────────────────────────

  private loadData(hotelId: number): void {
    this.calendarService.getBookings(hotelId).subscribe({
      next: list => this.bookings.set(list),
      error: err => console.error('Errore caricamento prenotazioni:', err),
    });
    this.calendarService.getRooms(hotelId).subscribe({
      next: list => this.rooms.set(list),
      error: err => console.error('Errore caricamento camere:', err),
    });
    this.calendarService.getClosures(hotelId).subscribe({
      next: list => this.closures.set(list),
      error: err => console.error('Errore caricamento chiusure:', err),
    });
  }

  // ── NAVIGAZIONE MESE ──────────────────────────────────────────────────────

  // setDate(1) prima di setMonth() evita il bug "31 gennaio + 1 mese = 3 marzo".
  prevMonth(): void {
    const d = new Date(this.viewDate());
    d.setDate(1);
    d.setMonth(d.getMonth() - 1);
    this.viewDate.set(d);
  }

  nextMonth(): void {
    const d = new Date(this.viewDate());
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    this.viewDate.set(d);
  }

  // ── EVENTI DA CalendarGrid ────────────────────────────────────────────────

  // onDayClicked: CalendarGrid ha rilevato un click singolo (nessun drag).
  // Apre il modal dettaglio per il giorno cliccato.
  onDayClicked(day: CalendarDay): void {
    this.selectedDay.set(day);
    this.showDayDetailModal.set(true);
  }

  // onDragCompleted: CalendarGrid ha completato un trascinamento.
  // Controlla se nel range c'è almeno un giorno chiuso per scegliere il modal giusto.
  onDragCompleted(range: {from: string; to: string}): void {
    const {from, to} = range;
    const rangeHasClosed = this.calendarDays()
      .filter(d => d.dateStr >= from && d.dateStr <= to)
      .some(d => d.isClosed);

    this.pendingStart.set(from);
    this.pendingEnd.set(to);

    if (rangeHasClosed) {
      this.showReopenModal.set(true);
    } else {
      this.closureReason.set('');
      this.showClosureModal.set(true);
    }
  }

  // ── AZIONI MODAL CHIUSURA ─────────────────────────────────────────────────

  confirmClosure(): void {
    const hotelId = this.currentHotelId();
    const start = this.pendingStart();
    const end = this.pendingEnd();
    if (!hotelId || !start || !end) return;

    // Aggiungo la nuova closure direttamente all'array con spread [...list, new]:
    // Angular rileva il cambio di riferimento e ricalcola calendarDays() senza una GET.
    this.calendarService.saveClosure({hotelId, startDate: start, endDate: end, reason: this.closureReason()}).subscribe({
      next: newClosure => {
        this.closures.update(list => [...list, newClosure]);
        this.closureError.set(null);
        this.showClosureModal.set(false);
      },
      error: () => {
        this.closureError.set('Data/e selezionate non valide, prova con una data successiva alla data odierna e senza prenotazioni programmate.');
      },
    });
  }

  cancelClosure(): void {
    this.closureError.set(null);
    this.showClosureModal.set(false);
  }

  // ── AZIONI MODAL RIAPERTURA ───────────────────────────────────────────────

  confirmReopen(): void {
    const hotelId = this.currentHotelId();
    const from = this.pendingStart();
    const to = this.pendingEnd();
    if (!hotelId || !from || !to) return;

    // Dopo la riapertura il backend potrebbe aver spezzato closure esistenti:
    // ricarico tutto dal server invece di calcolare lato client.
    this.calendarService.reopenRange(hotelId, from, to).subscribe({
      next: () => {
        this.calendarService.getClosures(hotelId).subscribe({
          next: list => this.closures.set(list),
          error: err => console.error('Errore refresh chiusure:', err),
        });
        this.showReopenModal.set(false);
      },
      error: err => console.error('Errore riapertura date:', err),
    });
  }

  cancelReopen(): void {
    this.showReopenModal.set(false);
  }

  // ── AZIONI MODAL RIMOZIONE SINGOLO GIORNO ────────────────────────────────

  confirmDelete(): void {
    const hotelId = this.currentHotelId();
    const from = this.pendingStart();
    const to = this.pendingEnd();
    if (!hotelId || !from || !to) return;

    this.calendarService.reopenRange(hotelId, from, to).subscribe({
      next: () => {
        this.calendarService.getClosures(hotelId).subscribe({
          next: list => this.closures.set(list),
          error: err => console.error('Errore refresh chiusure:', err),
        });
        this.showDeleteModal.set(false);
        this.closureToDelete.set(null);
      },
      error: err => console.error('Errore rimozione giorno chiusura:', err),
    });
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.closureToDelete.set(null);
  }

  // ── AZIONI MODAL DETTAGLIO GIORNO ─────────────────────────────────────────

  // Resettare selectedDay a null svuota dayBookings() prima che il modal sparisca.
  closeDayDetailModal(): void {
    this.showDayDetailModal.set(false);
    this.selectedDay.set(null);
  }

  openClosureForDay(): void {
    const day = this.selectedDay();
    if (!day) return;
    this.pendingStart.set(day.dateStr);
    this.pendingEnd.set(day.dateStr);
    this.closureReason.set('');
    this.showDayDetailModal.set(false);
    this.showClosureModal.set(true);
  }

  // Cerca la closure completa nel Signal closures per mostrare il range nel modal
  // ("La chiusura X→Y verrà spezzata di conseguenza").
  openDeleteForDay(): void {
    const day = this.selectedDay();
    if (!day || !day.closureId) return;
    const closure = this.closures().find(c => c.id === day.closureId);
    if (closure) {
      this.closureToDelete.set(closure);
      this.pendingStart.set(day.dateStr);
      this.pendingEnd.set(day.dateStr);
      this.showDayDetailModal.set(false);
      this.showDeleteModal.set(true);
    }
  }
}
