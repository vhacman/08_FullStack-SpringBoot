/**
 * Struttura dati per ogni cella del calendario.
 * Non corrisponde a nessuna entità del backend: viene calcolata interamente
 * lato frontend da calendarDays() in Calendar, aggregando bookings, rooms e closures.
 * La tengo nel model perché descrive la forma dei dati, anche se non viene mai inviata al server.
 */
export interface CalendarDay {
  dateStr        : string;
  day            : number;
  isCurrentMonth : boolean;
  isToday        : boolean;
  occupiedRooms  : number;
  totalRooms     : number;
  isClosed       : boolean;
  closureId?     : number;
  closureReason? : string;
}
