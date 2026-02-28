import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BookingService } from '../APIservices/booking/booking-service';
import { HotelClosureService } from '../APIservices/closure/hotel-closure-service';
import { RoomService } from '../APIservices/room/room-service';
import { UserLogicService } from '../ComponentLogicService/user-logic-service';
import { Booking, HotelClosure, Room } from '../model/hotel.entities';

interface CalendarDay {
  dateStr: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  occupiedRooms: number;
  totalRooms: number;
  isClosed: boolean;
  closureId?: number;
  closureReason?: string;
}

@Component({
  selector: 'app-calendar',
  imports: [FormsModule, DatePipe],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar {
  private bookingService = inject(BookingService);
  private roomService = inject(RoomService);
  private closureService = inject(HotelClosureService);
  private userLogicService = inject(UserLogicService);

  bookings = signal<Booking[]>([]);
  rooms = signal<Room[]>([]);
  closures = signal<HotelClosure[]>([]);
  viewDate = signal(new Date());

  private currentHotelId = signal<number | null>(null);

  readonly monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
  ];
  readonly weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  monthLabel = computed(() => {
    const d = this.viewDate();
    return `${this.monthNames[d.getMonth()]} ${d.getFullYear()}`;
  });

  calendarDays = computed((): CalendarDay[] => {
    const bookings = this.bookings();
    const rooms = this.rooms();
    const closures = this.closures();
    const vd = this.viewDate();
    const year = vd.getFullYear();
    const month = vd.getMonth();
    const today = this.fmt(new Date());
    const total = rooms.length;

    const ACTIVE = new Set(['PENDING', 'CHECKED_IN']);

    const buildDay = (date: Date, isCurrentMonth: boolean): CalendarDay => {
      const dateStr = this.fmt(date);

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

      const closure = closures.find(c =>
        String(c.startDate) <= dateStr && String(c.endDate) >= dateStr
      );

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

    const firstDow = new Date(year, month, 1).getDay();
    const padding = firstDow === 0 ? 6 : firstDow - 1;
    for (let i = padding; i > 0; i--) {
      days.push(buildDay(new Date(year, month, 1 - i), false));
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(buildDay(new Date(year, month, d), true));
    }

    let next = 1;
    while (days.length % 7 !== 0) {
      days.push(buildDay(new Date(year, month + 1, next++), false));
    }

    return days;
  });

  private isDragging = false;
  private hasDragged = false;
  dragStart = signal<string | null>(null);
  dragEnd = signal<string | null>(null);

  showClosureModal = signal(false);
  pendingStart = signal<string | null>(null);
  pendingEnd = signal<string | null>(null);
  closureReason = signal('');

  showReopenModal = signal(false);

  showDeleteModal = signal(false);
  closureToDelete = signal<HotelClosure | null>(null);

  showDayDetailModal = signal(false);
  selectedDay = signal<CalendarDay | null>(null);

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

  selectionRange = computed((): Set<string> => {
    const s = this.dragStart();
    const e = this.dragEnd();
    if (!s) return new Set();
    const [from, to] = s <= (e ?? s) ? [s, e ?? s] : [e ?? s, s];
    const set = new Set<string>();
    const cur = new Date(from);
    const end = new Date(to);
    while (cur <= end) {
      set.add(this.fmt(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return set;
  });

  constructor() {
    effect(() => {
      const user = this.userLogicService.loggedUser();
      if (user && user.hotel?.id) {
        this.currentHotelId.set(user.hotel.id);
        this.loadData(user.hotel.id);
      }
    });
  }

  private loadData(hotelId: number): void {
    this.bookingService.getByHotel(hotelId).subscribe({
      next: list => this.bookings.set(list),
      error: err => console.error('Errore booking calendar:', err),
    });
    this.roomService.findAll().subscribe({
      next: all => this.rooms.set(all.filter(r => r.hotelId === hotelId)),
      error: err => console.error('Errore rooms calendar:', err),
    });
    this.closureService.findByHotel(hotelId).subscribe({
      next: list => this.closures.set(list),
      error: err => console.error('Errore closures calendar:', err),
    });
  }

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

  goToToday(): void {
    this.viewDate.set(new Date());
  }

  onDayMouseDown(day: CalendarDay, event: MouseEvent): void {
    if (!day.isCurrentMonth) return;
    event.preventDefault();
    this.isDragging = true;
    this.hasDragged = false;
    this.dragStart.set(day.dateStr);
    this.dragEnd.set(day.dateStr);
  }

  onDayMouseEnter(day: CalendarDay): void {
    if (!this.isDragging || !day.isCurrentMonth) return;
    this.hasDragged = true;
    this.dragEnd.set(day.dateStr);
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    const s = this.dragStart();
    const e = this.dragEnd();
    if (!s) { this.clearDrag(); return; }

    const [from, to] = s <= (e ?? s) ? [s, e ?? s] : [e ?? s, s];

    if (!this.hasDragged) {
      const day = this.calendarDays().find(d => d.dateStr === from);
      if (day) {
        this.selectedDay.set(day);
        this.showDayDetailModal.set(true);
        this.clearDrag();
        return;
      }
    }

    const days = this.calendarDays();
    const rangeHasClosed = days
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
    this.clearDrag();
  }

  private clearDrag(): void {
    this.dragStart.set(null);
    this.dragEnd.set(null);
    this.hasDragged = false;
  }

  confirmClosure(): void {
    const hotelId = this.currentHotelId();
    const start = this.pendingStart();
    const end = this.pendingEnd();
    if (!hotelId || !start || !end) return;

    this.closureService.save({
      hotelId,
      startDate: start,
      endDate: end,
      reason: this.closureReason(),
    }).subscribe({
      next: newClosure => {
        this.closures.update(list => [...list, newClosure]);
        this.showClosureModal.set(false);
      },
      error: err => console.error('Errore salvataggio chiusura:', err),
    });
  }

  cancelClosure(): void {
    this.showClosureModal.set(false);
  }

  confirmReopen(): void {
    const hotelId = this.currentHotelId();
    const from = this.pendingStart();
    const to = this.pendingEnd();
    if (!hotelId || !from || !to) return;

    this.closureService.reopenRange(hotelId, from, to).subscribe({
      next: () => {
        this.closureService.findByHotel(hotelId).subscribe({
          next: list => this.closures.set(list),
        });
        this.showReopenModal.set(false);
      },
      error: err => console.error('Errore riapertura date:', err),
    });
  }

  cancelReopen(): void {
    this.showReopenModal.set(false);
  }

  confirmDelete(): void {
    const c = this.closureToDelete();
    if (!c?.id) return;
    this.closureService.delete(c.id).subscribe({
      next: () => {
        this.closures.update(list => list.filter(x => x.id !== c.id));
        this.showDeleteModal.set(false);
        this.closureToDelete.set(null);
      },
      error: err => console.error('Errore eliminazione chiusura:', err),
    });
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.closureToDelete.set(null);
  }

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

  openDeleteForDay(): void {
    const day = this.selectedDay();
    if (!day || !day.closureId) return;
    const closure = this.closures().find(c => c.id === day.closureId);
    if (closure) {
      this.closureToDelete.set(closure);
      this.showDayDetailModal.set(false);
      this.showDeleteModal.set(true);
    }
  }

  getDayClass(day: CalendarDay): string {
    const isSelecting = this.selectionRange().has(day.dateStr);
    if (!day.isCurrentMonth) return 'day other-month';
    if (isSelecting) return 'day selecting';
    if (day.isClosed) return 'day closed';
    if (day.totalRooms === 0) return 'day';
    if (day.occupiedRooms >= day.totalRooms) return 'day full';
    if (day.occupiedRooms > 0) return 'day partial';
    return 'day';
  }

  private fmt(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
