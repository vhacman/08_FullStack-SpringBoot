import {Component, computed, input, output} from '@angular/core';

/**
 * Barra superiore del calendario: titolo, navigazione mese (‹ ›), legenda e hint.
 * Riceve viewDate dal padre, calcola monthLabel internamente ed
 * emette prevMonth / nextMonth per delegare la navigazione al padre.
 */
@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.html',
  styleUrl: './calendar-header.css',
})
export class CalendarHeader {

  // viewDate: passata dal padre, serve per calcolare la stringa "Mese Anno".
  viewDate = input.required<Date>();

  // prevMonth / nextMonth: eventi emessi verso il padre quando l'utente
  // clicca i pulsanti ‹ e ›. La navigazione vera (set del Signal) rimane nel padre.
  prevMonth = output<void>();
  nextMonth = output<void>();

  private readonly monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
  ];

  // monthLabel: stringa "Mese Anno" mostrata tra le frecce di navigazione.
  // Si ricalcola automaticamente ogni volta che viewDate() cambia.
  monthLabel = computed(() => {
    const d = this.viewDate();
    return `${this.monthNames[d.getMonth()]} ${d.getFullYear()}`;
  });
}
