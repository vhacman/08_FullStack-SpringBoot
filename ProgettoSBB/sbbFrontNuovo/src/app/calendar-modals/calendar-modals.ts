import {Component, input, output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Booking, HotelClosure} from '../model/hotel.entities';
import {CalendarDay} from '../model/calendar.model';

/**
 * Raccoglie tutti e 4 i modal del calendario in un unico componente presentazionale.
 * Non possiede stato né logica HTTP: riceve tutto dal padre tramite input()
 * e notifica le azioni dell'utente tramite output().
 * Il padre (Calendar) reagisce agli output aggiornando i propri Signal
 * e chiamando CalendarService.
 */
@Component({
  selector: 'app-calendar-modals',
  imports: [DatePipe],
  templateUrl: './calendar-modals.html',
  styleUrl: './calendar-modals.css',
})
export class CalendarModals {

  // ── Modal chiusura ────────────────────────────────────────────────────────
  showClosureModal = input.required<boolean>();
  pendingStart = input.required<string | null>();
  pendingEnd = input.required<string | null>();
  // closureReason: il padre lo passa come valore e ascolta closureReasonChange
  // per aggiornare il proprio Signal ad ogni keystroke dell'utente.
  closureReason = input.required<string>();
  closureError = input.required<string | null>();

  closureReasonChange = output<string>();   // two-way: keystroke → aggiorna signal nel padre
  confirmClosure = output<void>();
  cancelClosure = output<void>();

  // ── Modal riapertura range ────────────────────────────────────────────────
  // Usa pendingStart/pendingEnd già definiti sopra (condivisi tra i modal).
  showReopenModal = input.required<boolean>();

  confirmReopen = output<void>();
  cancelReopen = output<void>();

  // ── Modal rimozione singolo giorno ────────────────────────────────────────
  showDeleteModal = input.required<boolean>();
  closureToDelete = input.required<HotelClosure | null>();

  confirmDelete = output<void>();
  cancelDelete = output<void>();

  // ── Modal dettaglio giorno ────────────────────────────────────────────────
  showDayDetailModal = input.required<boolean>();
  selectedDay = input.required<CalendarDay | null>();
  dayBookings = input.required<Booking[]>();

  closeDayDetailModal = output<void>();
  openClosureForDay = output<void>();
  openDeleteForDay = output<void>();
}
