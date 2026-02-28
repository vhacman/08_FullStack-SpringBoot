import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BookingService } from '../APIservices/booking/booking-service';
import { HotelClosureService } from '../APIservices/closure/hotel-closure-service';
import { RoomService } from '../APIservices/room/room-service';
import { UserLogicService } from '../APIservices/user/user-logic-service';
import { Booking, HotelClosure, Room } from '../model/hotel.entities';
import { CalendarDay } from '../model/calendar.model';

/**
 * Calendario mensile interattivo per la gestione delle chiusure hotel.
 * Funzionalità principali:
 * - Visualizza occupazione giornaliera (camere libere / occupate / chiuse)
 * - Click su un giorno → mostra dettaglio prenotazioni di quel giorno
 * - Drag su più giorni → apre modal per chiudere o riaprire il range
 * - Rimozione di un singolo giorno da una closure multi-giorno:
 *   usa reopenRange(giorno, giorno) che spezza la closure nel backend
 *
 * calendarDays è un computed() che ricalcola tutta la griglia ogni volta
 * che cambiano bookings, rooms, closures o il mese visualizzato.
 * Non serve alcun aggiornamento manuale: è la reattività di Angular Signals.
 */
@Component({
  selector: 'app-calendar',
  imports: [FormsModule, DatePipe],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar {

  // ── DIPENDENZE ────────────────────────────────────────────────────────────────
  // inject() è il modo moderno di Angular per iniettare servizi senza costruttore
  // con parametri. Ho preferito inject() perché rende esplicito cosa usa il componente.
  private bookingService   = inject(BookingService);    // chiamate HTTP per le prenotazioni
  private roomService      = inject(RoomService);       // chiamate HTTP per le camere
  private closureService   = inject(HotelClosureService); // chiamate HTTP per le chiusure
  private userLogicService = inject(UserLogicService);  // fornisce l'utente loggato tramite Signal

  // ── COSTANTI ──────────────────────────────────────────────────────────────────
  // monthNames è usato da monthLabel() (computed) per costruire la stringa "Gennaio 2025".
  // weekDays è usato nel template con @for per disegnare l'intestazione Lun Mar Mer...
  // Sono readonly perché non cambiano mai: sono dati di configurazione, non stato.
  readonly monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
  ];
  readonly weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  // ── STATO DATI ─────────────────────────────────────────────────────────────────
  // Questi tre Signal contengono i dati grezzi arrivati dal backend.
  // Vengono scritti da loadData() e letti da calendarDays() e dayBookings() (computed).
  // Ogni volta che uno di questi Signal cambia, i computed che lo leggono si ricalcolano.

  // bookings: tutte le prenotazioni dell'hotel.
  // Usata in calendarDays() per calcolare quante camere sono occupate in ogni giorno,
  // e in dayBookings() per elencare le prenotazioni del giorno selezionato nel modal.
  bookings = signal<Booking[]>([]);

  // rooms: tutte le camere dell'hotel.
  // Usata in calendarDays() per sapere quante camere ci sono in totale (totalRooms),
  // così la griglia sa se un giorno è "tutto esaurito" o "parzialmente occupato".
  rooms = signal<Room[]>([]);

  // closures: tutte le chiusure attive dell'hotel.
  // Usata in calendarDays() per marcare ogni giorno come isClosed,
  // e in openDeleteForDay() per recuperare l'oggetto chiusura da mandare al modal.
  closures = signal<HotelClosure[]>([]);

  // currentHotelId: l'id dell'hotel dell'utente loggato.
  // Lo memorizzo qui per non doverlo ricalcolare ogni volta nei metodi che fanno
  // chiamate HTTP (confirmClosure, confirmReopen, confirmDelete).
  // È private perché il template non lo usa mai direttamente.
  private currentHotelId = signal<number | null>(null);

  // ── STATO NAVIGAZIONE ──────────────────────────────────────────────────────────
  // viewDate è la data che rappresenta il mese correntemente visualizzato.
  // Viene letta da monthLabel() per mostrare "Gennaio 2025" nell'header,
  // e da calendarDays() per sapere quali giorni costruire nella griglia.
  // Viene scritta da prevMonth(), nextMonth(), goToToday().
  viewDate = signal<Date>(new Date());

  // ── STATO DRAG ─────────────────────────────────────────────────────────────────
  // Gestisce la selezione di un range di giorni tramite click-e-trascina.

  // isDragging e hasDragged sono variabili plain (non Signal) perché cambiano
  // a ogni singolo evento mouse e non devono triggherare il rilevamento cambiamenti
  // di Angular: servono solo come flag interni alla logica del drag.

  // dragStart e dragEnd SONO Signal perché selectionRange (computed) li legge
  // per aggiornare l'evidenziazione CSS in tempo reale mentre si trascina.
  // Se fossero variabili plain, selectionRange non si ricalcolerebbe durante il drag.
  private isDragging = false; // true tra mousedown e mouseup
  private hasDragged = false; // true se il mouse si è spostato almeno su un altro giorno

  // dragStart: la data del giorno dove è iniziato il drag (YYYY-MM-DD).
  // Scritta da onDayMouseDown() e clearDrag(). Letta da selectionRange e onDocumentMouseUp().
  dragStart = signal<string | null>(null);

  // dragEnd: la data del giorno su cui si trova il cursore durante il drag (YYYY-MM-DD).
  // Aggiornata in tempo reale da onDayMouseEnter(). Letta da selectionRange e onDocumentMouseUp().
  dragEnd = signal<string | null>(null);

  // ── STATO MODAL CHIUSURA ───────────────────────────────────────────────────────
  // Un modal è una finestra di dialogo che appare sopra il contenuto della pagina,
  // bloccando l'interazione con il resto finché l'utente non conferma o annulla.
  // In Angular non esiste un componente modal built-in: si simula con un @if nel template
  // che mostra/nasconde un div con sfondo semi-trasparente (overlay) in base a un Signal booleano.
  //
  // Questo gruppo gestisce il modal che appare quando si seleziona un range senza chiusure.

  // showClosureModal: controlla se il modal di nuova chiusura è visibile nel template.
  // Messo a true da onDocumentMouseUp() (drag terminato su giorni liberi) e openClosureForDay().
  // Messo a false da cancelClosure() e confirmClosure() (dopo salvataggio).
  showClosureModal = signal<boolean>(false);

  // pendingStart e pendingEnd: le date di inizio e fine del range selezionato.
  // Condivise tra i modal di chiusura, riapertura e rimozione singolo giorno:
  // vengono scritte da onDocumentMouseUp() e lette da confirmClosure(), confirmReopen(), confirmDelete().
  // Il template le mostra nell'intestazione di ogni modal ("Periodo selezionato: X → Y").
  pendingStart = signal<string | null>(null);
  pendingEnd   = signal<string | null>(null);

  // closureReason: il testo della motivazione inserita dall'utente nel modal chiusura.
  // Legato all'<input> nel template tramite [value] / (input). Letto da confirmClosure()
  // per mandarlo al backend. Resettato a '' da cancelClosure() e openClosureForDay().
  closureReason = signal<string>('');

  // closureError: messaggio di errore mostrato sotto il form del modal chiusura.
  // Messo a null all'apertura o alla chiusura corretta, impostato con testo
  // descrittivo dal blocco error: di confirmClosure() in caso di errore HTTP.
  closureError = signal<string | null>(null);

  // ── STATO MODAL RIAPERTURA ─────────────────────────────────────────────────────
  // Questo modal appare quando il range selezionato contiene almeno un giorno chiuso.
  // Non ha stato aggiuntivo: usa pendingStart/pendingEnd già definiti sopra.

  // showReopenModal: controlla se il modal di riapertura range è visibile.
  // Messo a true da onDocumentMouseUp() se rangeHasClosed è true.
  // Messo a false da cancelReopen() e confirmReopen() (dopo l'operazione).
  showReopenModal = signal<boolean>(false);

  // ── STATO MODAL RIMOZIONE SINGOLO GIORNO ──────────────────────────────────────
  // Questo modal appare quando si clicca "Rimuovi chiusura" nel modal dettaglio giorno.
  // Permette di rimuovere un singolo giorno da una closure che potrebbe coprire più giorni,
  // spezzandola nel backend tramite reopenRange(giorno, giorno).

  // showDeleteModal: controlla la visibilità del modal di rimozione singolo giorno.
  // Messo a true da openDeleteForDay(). Messo a false da cancelDelete() e confirmDelete().
  showDeleteModal = signal<boolean>(false);

  // closureToDelete: la closure a cui appartiene il giorno che si vuole rimuovere.
  // Usata dal template per mostrare il range originale ("La chiusura X → Y verrà spezzata")
  // e la motivazione. Scritta da openDeleteForDay(), resettata a null da confirmDelete() e cancelDelete().
  closureToDelete = signal<HotelClosure | null>(null);

  // ── STATO MODAL DETTAGLIO GIORNO ──────────────────────────────────────────────
  // Questo modal appare quando si fa click (senza drag) su un singolo giorno.
  // Mostra quante camere sono occupate, elenca le prenotazioni, e offre i pulsanti
  // per aprire il modal chiusura o il modal rimozione chiusura.

  // showDayDetailModal: controlla la visibilità del modal dettaglio.
  // Messo a true da onDocumentMouseUp() quando hasDragged è false (semplice click).
  // Messo a false da closeDayDetailModal(), openClosureForDay(), openDeleteForDay().
  showDayDetailModal = signal<boolean>(false);

  // selectedDay: il CalendarDay del giorno cliccato.
  // Usato dal template per mostrare la data nel titolo del modal e il numero di camere.
  // Letto da dayBookings() (computed) per filtrare le prenotazioni di quel giorno.
  // Scritto da onDocumentMouseUp(), resettato a null da closeDayDetailModal().
  selectedDay = signal<CalendarDay | null>(null);

  // ── COMPUTED ──────────────────────────────────────────────────────────────────
  // I computed() sono valori derivati che si ricalcolano automaticamente quando
  // uno dei Signal che leggono cambia. Non devono essere aggiornati a mano.

  // monthLabel: stringa "Mese Anno" mostrata nell'header del calendario.
  // Dipende da viewDate: quando si naviga al mese precedente/successivo,
  // questa stringa si aggiorna da sola. Usata nel template come {{ monthLabel() }}.
  monthLabel = computed(() => {
    const d = this.viewDate();
    return `${this.monthNames[d.getMonth()]} ${d.getFullYear()}`;
  });

  // calendarDays: il cuore del calendario. Costruisce l'array di 35 o 42 celle
  // (sempre multiplo di 7 per le righe settimanali) che il template disegna con @for.
  //
  // Per ogni cella calcola:
  // - dateStr: la data in formato YYYY-MM-DD (chiave univoca per track)
  // - occupiedRooms: quante prenotazioni PENDING o CHECKED_IN coprono quel giorno
  // - isClosed: se esiste una closure che include quel giorno
  //
  // Si ricalcola automaticamente quando cambiano bookings, rooms, closures o viewDate.
  // Non ho bisogno di chiamarlo manualmente dopo ogni operazione: basta aggiornare
  // i Signal sorgente e Angular fa il resto.
  calendarDays = computed((): CalendarDay[] => {
    const bookings = this.bookings();
    const rooms    = this.rooms();
    const closures = this.closures();
    const vd       = this.viewDate();
    const year     = vd.getFullYear();
    const month    = vd.getMonth();
    const today    = this.fmt(new Date());
    const total    = rooms.length;

    // Solo le prenotazioni in questi stati contano come "occupazione di una camera".
    // CHECKED_OUT e CANCELLED non devono colorare il calendario.
    const ACTIVE = new Set(['PENDING', 'CHECKED_IN']);

    // buildDay è una funzione locale che costruisce un singolo CalendarDay.
    // La definisco qui dentro computed() così ha accesso a bookings, closures, total
    // senza doverli passare come parametri ogni volta.
    const buildDay = (date: Date, isCurrentMonth: boolean): CalendarDay => {
      const dateStr = this.fmt(date);

      // Costruisco un Set di id-camera occupate in questo giorno.
      // Uso un Set (invece di un contatore) per evitare di contare due volte
      // la stessa camera se ci fossero dati duplicati: occupied.size è il numero
      // di camere distinte occupate.
      // La condizione checkIn <= dateStr < checkOut rispecchia la logica hotel:
      // il giorno di check-out la camera non è più occupata dall'ospite precedente.
      const occupied = new Set(
        bookings
          .filter(b =>
            ACTIVE.has(b.status) &&
            String(b.checkIn)  <= dateStr &&
            String(b.checkOut) >  dateStr
          )
          .map(b => b.room?.id)
          .filter((id): id is number => id != null)
      );

      // Cerco la closure che include questo giorno, se esiste.
      // find() restituisce undefined se nessuna closure copre il giorno.
      const closure = closures.find(c =>
        String(c.startDate) <= dateStr && String(c.endDate) >= dateStr
      );

      return {
        dateStr,
        day: date.getDate(),
        isCurrentMonth,
        isToday:       dateStr === today,
        occupiedRooms: occupied.size,
        totalRooms:    total,
        isClosed:      !!closure,       // !! converte undefined in false, oggetto in true
        closureId:     closure?.id,     // undefined se non c'è closure
        closureReason: closure?.reason,
      };
    };

    const days: CalendarDay[] = [];

    // Celle del mese precedente: riempiono gli spazi vuoti prima del 1° del mese.
    // getDay() restituisce 0=domenica … 6=sabato; nel calendario italiano la settimana
    // inizia il lunedì, quindi devo ricalcolare: se getDay()==0 (domenica) ci vogliono 6
    // celle vuote, altrimenti getDay()-1.
    const firstDow = new Date(year, month, 1).getDay();
    const padding  = firstDow === 0 ? 6 : firstDow - 1;
    for (let i = padding; i > 0; i--) {
      days.push(buildDay(new Date(year, month, 1 - i), false));
    }

    // Celle del mese corrente: da 1 all'ultimo giorno del mese.
    // new Date(year, month+1, 0) è un trucco JS: il giorno 0 del mese successivo
    // è l'ultimo giorno del mese corrente. Quindi getDate() dà 28, 29, 30 o 31.
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(buildDay(new Date(year, month, d), true));
    }

    // Celle del mese successivo: riempiono gli spazi dopo l'ultimo giorno del mese
    // per completare l'ultima riga della griglia (che deve avere esattamente 7 celle).
    let next = 1;
    while (days.length % 7 !== 0) {
      days.push(buildDay(new Date(year, month + 1, next++), false));
    }

    return days;
  });

  // dayBookings: le prenotazioni attive nel giorno selezionato.
  // Usata esclusivamente dal modal dettaglio giorno per elencare gli ospiti.
  // Si ricalcola automaticamente quando cambia selectedDay o bookings.
  // Restituisce [] se selectedDay è null (modal chiuso), evitando errori nel template.
  dayBookings = computed(() => {
    const day = this.selectedDay();
    if (!day) return [];
    const ACTIVE = new Set(['PENDING', 'CHECKED_IN']);
    return this.bookings().filter(b =>
      ACTIVE.has(b.status) &&
      String(b.checkIn)  <= day.dateStr &&
      String(b.checkOut) >  day.dateStr
    );
  });

  // selectionRange: l'insieme delle date evidenziate durante il drag.
  // Usata da getDayClass() per applicare la classe CSS 'selecting' alle celle
  // incluse nel trascinamento, dando il feedback visivo in tempo reale.
  //
  // Ho usato Set<string> invece di Array perché getDayClass() chiama .has() per ogni cella:
  // con un Array sarebbe O(n) per cella, con un Set è O(1).
  // Il confronto s <= e funziona perché le date sono "YYYY-MM-DD": l'ordinamento
  // lessicografico coincide con quello cronologico per questo formato.
  // [from, to] = s <= e ? [s, e] : [e, s] gestisce il caso in cui l'utente trascini
  // verso sinistra (data fine prima della data inizio).
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

  // ── COSTRUTTORE ───────────────────────────────────────────────────────────────
  // Uso effect() invece di ngOnInit() perché userLogicService.loggedUser() è un Signal
  // che vale null al primo render (l'utente non è ancora arrivato dall'HTTP).
  // Con ngOnInit() chiamerei loadData(null) e tutto fallirebbe.
  // Con effect() il blocco viene rieseguito automaticamente ogni volta che il Signal
  // cambia: la prima esecuzione utile è quando loggedUser() passa da null all'utente reale.
  constructor() {
    effect(() => {
      const user = this.userLogicService.loggedUser();
      if (user && user.hotel?.id) {
        this.currentHotelId.set(user.hotel.id);
        this.loadData(user.hotel.id);
      }
    });
  }

  // ── CARICAMENTO DATI ──────────────────────────────────────────────────────────

  // loadData: carica in parallelo prenotazioni, camere e chiusure dal backend.
  // È private perché viene chiamata solo dal costruttore (via effect) e non dall'esterno.
  // Ogni subscribe scrive il proprio Signal (bookings, rooms, closures): questo triggera
  // automaticamente il ricalcolo di calendarDays() senza che debba fare altro.
  private loadData(hotelId: number): void {
    this.bookingService.getByHotel(hotelId).subscribe({
      next:  list => this.bookings.set(list),
      error: err  => console.error('Errore booking calendar:', err),
    });
    this.roomService.findAll().subscribe({
      // findAll() ritorna tutte le camere: filtro lato client per l'hotel corrente
      // perché non esiste un endpoint /rooms/by-hotel nell'API.
      next:  all => this.rooms.set(all.filter(r => r.hotelId === hotelId)),
      error: err => console.error('Errore rooms calendar:', err),
    });
    this.closureService.findByHotel(hotelId).subscribe({
      next:  list => this.closures.set(list),
      error: err  => console.error('Errore closures calendar:', err),
    });
  }

  // ── NAVIGAZIONE MESE ─────────────────────────────────────────────────────────

  // prevMonth / nextMonth: spostano il calendario di un mese indietro o avanti.
  // Creo una nuova Date (new Date(this.viewDate())) per non mutare l'oggetto già nel Signal.
  // setDate(1) prima di setMonth() evita il bug "gennaio + 1 mese = marzo" che succede
  // quando il giorno corrente non esiste nel mese successivo (es. 31 gennaio → 31 febbraio).
  // Chiamate dai pulsanti ‹ e › nel template.
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

  // goToToday: riporta il calendario al mese corrente. Non è usato nel template attuale
  // ma è utile da tenere per un eventuale pulsante "Oggi".
  goToToday(): void {
    this.viewDate.set(new Date());
  }

  // ── GESTIONE DRAG ─────────────────────────────────────────────────────────────

  // onDayMouseDown: si attiva quando il tasto del mouse viene premuto su una cella.
  // event.preventDefault() serve a impedire che il browser avvii la selezione del testo
  // durante il trascinamento, che interferirebbe con il drag del calendario.
  // Chiamato dal (mousedown) di ogni cella nel template.
  onDayMouseDown(day: CalendarDay, event: MouseEvent): void {
    if (!day.isCurrentMonth) return;
    event.preventDefault();
    this.isDragging = true;
    this.hasDragged = false;
    this.dragStart.set(day.dateStr);
    this.dragEnd.set(day.dateStr);
  }

  // onDayMouseEnter: si attiva quando il cursore entra in una cella durante il drag.
  // Aggiorna dragEnd con il giorno corrente, triggherando il ricalcolo di selectionRange.
  // hasDragged viene messo a true: serve a distinguere un drag da un semplice click
  // in onDocumentMouseUp().
  // Chiamato dal (mouseenter) di ogni cella nel template.
  onDayMouseEnter(day: CalendarDay): void {
    if (!this.isDragging || !day.isCurrentMonth) return;
    this.hasDragged = true;
    this.dragEnd.set(day.dateStr);
  }

  // onDocumentMouseUp: si attiva quando il tasto del mouse viene rilasciato, ovunque
  // nella pagina. @HostListener('document:mouseup') ascolta l'evento sull'intero documento
  // (non solo sulla griglia): senza questo, se l'utente rilasciasse il mouse fuori dalla
  // griglia il drag rimarrebbe "attivo" per sempre.
  // L'ho trovato cercando come intercettare eventi globali in Angular senza usare
  // addEventListener su window/document direttamente (che richiederebbe anche di
  // rimuoverlo manualmente con removeEventListener per evitare memory leak).
  //
  // Logica decisionale:
  // - Se hasDragged è false → era un semplice click → apre modal dettaglio giorno
  // - Se il range contiene almeno un giorno chiuso → apre modal riapertura
  // - Altrimenti → apre modal nuova chiusura
  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    const s = this.dragStart();
    const e = this.dragEnd();
    if (!s) { this.clearDrag(); return; }

    // Normalizzo il range: from è sempre la data minore, to la maggiore.
    // Gestisce il caso in cui l'utente trascini verso sinistra.
    const [from, to] = s <= (e ?? s) ? [s, e ?? s] : [e ?? s, s];

    // Click singolo (nessun trascinamento): apre il modal dettaglio giorno.
    if (!this.hasDragged) {
      const day = this.calendarDays().find(d => d.dateStr === from);
      if (day) {
        this.selectedDay.set(day);
        this.showDayDetailModal.set(true);
        this.clearDrag();
        return;
      }
    }

    // Controlla se nel range selezionato c'è almeno un giorno già chiuso.
    // In quel caso l'utente probabilmente vuole riaprire, non chiudere.
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
    this.clearDrag();
  }

  // clearDrag: resetta i Signal del drag dopo che l'operazione è terminata.
  // Chiamata da onDocumentMouseUp() sia nei casi "click" che "drag completato".
  // Resettare dragStart e dragEnd azzera anche selectionRange (che restituisce Set vuoto
  // quando dragStart è null), rimuovendo immediatamente l'evidenziazione dal calendario.
  private clearDrag(): void {
    this.dragStart.set(null);
    this.dragEnd.set(null);
    this.hasDragged = false;
  }

  // ── AZIONI MODAL CHIUSURA ─────────────────────────────────────────────────────

  // confirmClosure: invia la nuova chiusura al backend e aggiorna il Signal closures.
  // Invece di ricaricare tutte le chiusure con una nuova GET, aggiungo direttamente
  // la closure appena salvata all'array esistente con closures.update(list => [...list, newClosure]).
  // Il [...list] crea un nuovo array (spread): Angular rileva il cambiamento di riferimento
  // e ricalcola calendarDays(), che aggiorna la griglia senza un secondo round-trip HTTP.
  // Chiamata dal pulsante "Conferma chiusura" nel modal chiusura del template.
  confirmClosure(): void {
    const hotelId = this.currentHotelId();
    const start   = this.pendingStart();
    const end     = this.pendingEnd();
    if (!hotelId || !start || !end) return;

    this.closureService.save({
      hotelId,
      startDate: start,
      endDate:   end,
      reason:    this.closureReason(),
    }).subscribe({
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

  // cancelClosure: chiude il modal chiusura senza fare nulla.
  // Resetta anche closureError per non mostrare l'errore precedente alla prossima apertura.
  // Chiamata dal pulsante "Annulla" e dal click sull'overlay nel template.
  cancelClosure(): void {
    this.closureError.set(null);
    this.showClosureModal.set(false);
  }

  // ── AZIONI MODAL RIAPERTURA ───────────────────────────────────────────────────

  // confirmReopen: chiama il backend per riaprire il range selezionato.
  // Il backend gestisce la logica di "spezzare" le closure che si sovrappongono al range:
  // se c'è una closure 1-15 gennaio e riaprgo 5-10, il backend crea due closure 1-4 e 11-15.
  // Dopo il successo, ricarico tutte le chiusure con una GET (invece di calcolarle lato client)
  // per non dover replicare la logica di spezzamento in Angular: è più semplice e più sicuro.
  // Chiamata dal pulsante "Riapri" nel modal riapertura del template.
  confirmReopen(): void {
    const hotelId = this.currentHotelId();
    const from    = this.pendingStart();
    const to      = this.pendingEnd();
    if (!hotelId || !from || !to) return;

    this.closureService.reopenRange(hotelId, from, to).subscribe({
      next: () => {
        // Dopo la riapertura devo ricaricare le chiusure perché il backend
        // potrebbe aver spezzato o eliminato closure esistenti.
        this.closureService.findByHotel(hotelId).subscribe({
          next: list => this.closures.set(list),
          error: err => console.error('Errore refresh closures:', err),
        });
        this.showReopenModal.set(false);
      },
      error: err => console.error('Errore riapertura date:', err),
    });
  }

  // cancelReopen: chiude il modal riapertura senza fare nulla.
  // Chiamata dal pulsante "Annulla" e dal click sull'overlay nel template.
  cancelReopen(): void {
    this.showReopenModal.set(false);
  }

  // ── AZIONI MODAL RIMOZIONE SINGOLO GIORNO ────────────────────────────────────

  // confirmDelete: rimuove un singolo giorno da una closure esistente.
  // Usa la stessa API di confirmReopen (reopenRange) ma con from === to === un solo giorno.
  // Il backend spezza automaticamente la closure originale se necessario.
  // Chiamata dal pulsante "Rimuovi chiusura" nel modal rimozione del template.
  confirmDelete(): void {
    const hotelId = this.currentHotelId();
    const from    = this.pendingStart();
    const to      = this.pendingEnd();
    if (!hotelId || !from || !to) return;

    this.closureService.reopenRange(hotelId, from, to).subscribe({
      next: () => {
        this.closureService.findByHotel(hotelId).subscribe({
          next: list => this.closures.set(list),
          error: err => console.error('Errore refresh closures:', err),
        });
        this.showDeleteModal.set(false);
        this.closureToDelete.set(null);
      },
      error: err => console.error('Errore rimozione giorno chiusura:', err),
    });
  }

  // cancelDelete: chiude il modal rimozione senza fare nulla.
  // Resetta anche closureToDelete per non tenere in memoria la closure precedente.
  // Chiamata dal pulsante "Annulla" e dal click sull'overlay nel template.
  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.closureToDelete.set(null);
  }

  // ── AZIONI MODAL DETTAGLIO GIORNO ─────────────────────────────────────────────

  // closeDayDetailModal: chiude il modal dettaglio e deseleziona il giorno.
  // Resettare selectedDay a null fa tornare dayBookings() a [] immediatamente,
  // così la lista prenotazioni nel modal si svuota prima che il modal sparisca.
  // Chiamata dal pulsante × e dal click sull'overlay nel template.
  closeDayDetailModal(): void {
    this.showDayDetailModal.set(false);
    this.selectedDay.set(null);
  }

  // openClosureForDay: apre il modal chiusura pre-compilato con il giorno selezionato.
  // Chiamata dal pulsante "Chiudi hotel per questo giorno" nel modal dettaglio.
  // Chiude il modal dettaglio e apre quello di chiusura in sequenza,
  // impostando pendingStart e pendingEnd entrambi sulla stessa data (chiusura di un solo giorno).
  openClosureForDay(): void {
    const day = this.selectedDay();
    if (!day) return;
    this.pendingStart.set(day.dateStr);
    this.pendingEnd.set(day.dateStr);
    this.closureReason.set('');
    this.showDayDetailModal.set(false);
    this.showClosureModal.set(true);
  }

  // openDeleteForDay: apre il modal rimozione per il giorno selezionato.
  // Chiamata dal pulsante "Rimuovi chiusura" nel modal dettaglio.
  // Cerca la closure completa (non solo l'id) nel Signal closures per poter mostrare
  // il range originale nel modal ("La chiusura X→Y verrà spezzata di conseguenza").
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

  // ── UTILITY ───────────────────────────────────────────────────────────────────

  /**
   * getDayClass: restituisce la stringa di classi CSS per ogni cella del calendario.
   * Chiamata dal [class]="getDayClass(day)" nel template per ogni cella @for.
   *
   * L'ordine delle condizioni è deliberato:
   * 1. other-month: giorni del mese precedente/successivo (grigio, non interattivi)
   * 2. selecting: in corso di drag (evidenziatura blu)
   * 3. closed: giorno chiuso (colore chiusura)
   * 4. full: tutte le camere occupate (rosso)
   * 5. partial: alcune camere occupate (giallo)
   * 6. day: disponibile (verde o neutro)
   */
  getDayClass(day: CalendarDay): string {
    const isSelecting = this.selectionRange().has(day.dateStr);
    if (!day.isCurrentMonth)                    return 'day other-month';
    if (isSelecting)                            return 'day selecting';
    if (day.isClosed)                           return 'day closed';
    if (day.totalRooms === 0)                   return 'day';
    if (day.occupiedRooms >= day.totalRooms)    return 'day full';
    if (day.occupiedRooms > 0)                  return 'day partial';
    return 'day';
  }

  /**
   * fmt: formatta una Date in stringa "YYYY-MM-DD".
   * È private perché usata solo internamente (buildDay, selectionRange, prevMonth...).
   *
   * Uso questo formato invece di toISOString() perché toISOString() converte in UTC:
   * se l'utente è in un fuso orario UTC+2 e crea una Date("2025-01-15"),
   * toISOString() potrebbe restituire "2025-01-14T22:00:00Z", quindi la data sbaglia.
   * Con getFullYear()/getMonth()/getDate() lavoro sempre in orario locale.
   * padStart(2, '0') aggiunge lo zero iniziale per i mesi e giorni a una cifra (es. "01", "09").
   */
  private fmt(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
