import {Component, HostListener, computed, input, output, signal} from '@angular/core';
import {CalendarDay} from '../model/calendar.model';

/**
 * Griglia del calendario: disegna le celle dei giorni e gestisce il drag.
 * Tutta la logica mousedown/mouseenter/mouseup è incapsulata qui.
 * Emette due eventi verso il padre:
 * - dayClicked: click singolo su un giorno
 * - dragCompleted: trascinamento completato, con il range normalizzato
 */
@Component({
  selector: 'app-calendar-grid',
  templateUrl: './calendar-grid.html',
  styleUrl: './calendar-grid.css',
})
export class CalendarGrid {
  // calendarDays: array di celle costruito dal computed() nel padre.
  // La griglia lo riceve già pronto e lo usa solo per il rendering.
  calendarDays = input.required<CalendarDay[]>();
  // dayClicked: emesso quando l'utente fa click su un singolo giorno (senza drag).
  // Il padre ascolta questo evento per aprire il modal dettaglio giorno.
  dayClicked = output<CalendarDay>();
  // dragCompleted: emesso quando il drag termina su un range di più giorni.
  // Il padre riceve { from, to } e decide quale modal aprire in base
  // alla presenza di giorni chiusi nel range.
  dragCompleted = output<{from: string; to: string}>();
  readonly weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  // STATO DRAG (tutto interno: il padre non ha bisogno di conoscerlo)
  // isDragging e hasDragged sono variabili plain perché non devono triggerare
  // il rilevamento cambiamenti di Angular: sono solo flag logici interni.
  private isDragging = false;
  private hasDragged = false;
  // dragStart e dragEnd SONO Signal perché selectionRange (computed) li legge
  // per aggiornare l'evidenziazione CSS in tempo reale durante il trascinamento.
  private dragStart = signal<string | null>(null);
  private dragEnd = signal<string | null>(null);


  // selectionRange: l'insieme delle date evidenziate durante il drag.
  // Usato da getDayClass() per applicare la classe CSS 'selecting'.
  // Si ricalcola automaticamente a ogni aggiornamento di dragStart/dragEnd.
  selectionRange = computed((): Set<string> => {
    const startDate = this.dragStart();
    const endDate = this.dragEnd();
    if (!startDate)
      return new Set();
    // effectiveEnd: gestisce il caso in cui endDate sia ancora null (click senza spostamento).
    // from/to: normalizzano il range, from è sempre la data minore (gestisce drag verso sinistra).
    const effectiveEnd = endDate ?? startDate;
    const from = startDate <= effectiveEnd ? startDate : effectiveEnd;
    const to = startDate <= effectiveEnd ? effectiveEnd : startDate;
    const range = new Set<string>();
    const current = new Date(from);
    const last = new Date(to);
    while (current <= last) {
      range.add(this.toDateStr(current));
      current.setDate(current.getDate() + 1);
    }
    return range;
  });

  // toDateStr: converte una Date in "YYYY-MM-DD" con orario locale (non UTC).
  // Estratta fuori dal computed per non ridefinirla ad ogni ricalcolo.
  private toDateStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // getDayClass: restituisce le classi CSS per ogni cella.
  // switch(true): confronta ogni case con true, eseguendo il primo soddisfatto.
  // L'ordine conta: 'selecting' ha priorità su tutto (feedback drag in tempo reale),
  // poi closed, poi i gradi di occupazione.
  getDayClass(day: CalendarDay): string {
    switch (true) {
      case !day.isCurrentMonth:
        // Giorni del mese precedente/successivo: sfondo grigio, non cliccabili.
        return 'day other-month';

      case this.selectionRange().has(day.dateStr):
        // Giorno incluso nel range di drag corrente: evidenziato in blu.
        return 'day selecting';

      case day.isClosed:
        // Hotel chiuso in questo giorno: sfondo rosso chiaro.
        return 'day closed';

      case day.totalRooms === 0:
        // Nessuna camera configurata: cella neutra, nessuna indicazione di occupazione.
        return 'day';

      case day.occupiedRooms >= day.totalRooms:
        // Tutte le camere occupate: sfondo rosso (tutto esaurito).
        return 'day full';

      case day.occupiedRooms > 0:
        // Almeno una camera occupata ma non tutte: sfondo arancione (parzialmente occupato).
        return 'day partial';

      default:
        // Nessuna camera occupata: sfondo bianco (disponibile).
        return 'day';
    }
  }

  // onDayMouseDown: avvia il drag impostando la data di partenza.
  // event.preventDefault() blocca il comportamento predefinito del mousedown:
  // senza di esso, trascinando il mouse sui numeri dei giorni il browser
  // li selezionerebbe come testo (evidenziazione blu), interferendo con il drag.
  onDayMouseDown(day: CalendarDay, event: MouseEvent): void {
    if (!day.isCurrentMonth)
      return;
    event.preventDefault();
    this.isDragging = true;
    this.hasDragged = false;
    this.dragStart.set(day.dateStr);
    this.dragEnd.set(day.dateStr);
  }

  // onDayMouseEnter: aggiorna dragEnd in tempo reale durante il trascinamento,
  // triggerando selectionRange e ridisegnando l'evidenziazione CSS.
  onDayMouseEnter(day: CalendarDay): void {
    if (!this.isDragging || !day.isCurrentMonth)
      return;
    this.hasDragged = true;
    this.dragEnd.set(day.dateStr);
  }

  // onDocumentMouseUp: @HostListener intercetta il mouseup ovunque nel documento,
  // non solo sulla griglia. Senza questo, rilasciare il mouse fuori dalla griglia
  // lascerebbe isDragging = true per sempre.
  // Decide cosa emettere in base a hasDragged:
  // - false (click singolo) → emette dayClicked con il CalendarDay cliccato
  // - true (drag) → emette dragCompleted con il range { from, to }
  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    if (!this.isDragging)
      return;
    this.isDragging = false;

    const startDate = this.dragStart();
    const endDate = this.dragEnd();
    if (!startDate) {
      this.clearDrag();
      return;
    }
    // effectiveEnd gestisce il caso in cui endDate sia null (click senza spostamento).
    // from/to normalizzano il range: from è sempre la data minore (gestisce drag verso sinistra).
    const effectiveEnd = endDate ?? startDate;
    const from = startDate <= effectiveEnd ? startDate : effectiveEnd;
    const to = startDate <= effectiveEnd ? effectiveEnd : startDate;

    if (!this.hasDragged) {
      // Click singolo: cerco il CalendarDay corrispondente nell'input e lo emetto.
      const day = this.calendarDays().find(d => d.dateStr === from);
      if (day)
        this.dayClicked.emit(day);
      this.clearDrag();
      return;
    }

    // Drag completato: il padre riceverà { from, to } e sceglierà il modal appropriato.
    this.dragCompleted.emit({from, to});
    this.clearDrag();
  }

  // clearDrag: resetta lo stato drag dopo ogni operazione.
  // Azzerare dragStart fa tornare selectionRange a Set vuoto,
  // rimuovendo subito l'evidenziazione dalla griglia.
  private clearDrag(): void {
    this.dragStart.set(null);
    this.dragEnd.set(null);
    this.hasDragged = false;
  }
}
