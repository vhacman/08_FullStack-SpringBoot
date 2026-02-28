import { Component, inject, signal, computed, output, input, effect } from '@angular/core';
import { GuestService } from '../APIservices/guest/guest-service';
import { Guest } from '../model/hotel.entities';

/**
 * Componente autocomplete per la ricerca di un ospite esistente.
 * Man mano che si digita, filtra la lista in tempo reale con computed().
 * Se nessun ospite corrisponde, emette guestNotFound per segnalare
 * al padre che probabilmente bisogna crearne uno nuovo.
 */
@Component({
  selector: 'app-guest-picker',
  imports: [],
  templateUrl: './guest-picker.html',
  styleUrl: './guest-picker.css',
})
export class GuestPicker {

  // SERVIZI
  private guestService = inject(GuestService);

  // STATO
  // La lista completa viene caricata una volta sola nel costruttore.
  // Il filtro poi avviene lato client su questa lista, senza altre chiamate HTTP.
  guests       = signal<Guest[]>([]);
  guestInput   = signal('');
  showDropdown = signal(false);

  // INPUT
  // Quando il padre incrementa resetTrigger, l'effect() qui sotto si attiva
  // e azzera lo stato interno del componente senza bisogno di viewChild().
  resetTrigger = input<number>(0);

  // OUTPUT
  guestSelected = output<number>();
  guestNotFound = output<string>();

  // FILTRO
  // computed() filtra la lista ogni volta che guestInput() cambia.
  // includes() fa una ricerca case-insensitive: converto tutto in lowercase
  // sia l'input che i dati per confrontarli alla pari.
  filteredGuests = computed(() => {
    const s = this.guestInput().toLowerCase().trim();
    if (!s) return this.guests();
    return this.guests().filter(g =>
      g.firstName.toLowerCase().includes(s) ||
      g.lastName.toLowerCase().includes(s)
    );
  });

  // INIZIALIZZAZIONE
  constructor() {
    this.guestService.findAll().subscribe({
      next:  g   => this.guests.set(g),
      error: err => console.error('Errore caricamento ospiti:', err)
    });

    effect(() => {
      this.resetTrigger(); // traccia il signal: ogni volta che cambia, esegue il blocco
      this.guestInput.set('');
      this.showDropdown.set(false);
    });
  }

  // GESTIONE INPUT
  /** Aggiorna il testo cercato, apre il dropdown e notifica il padre se nessun ospite corrisponde. */
  onGuestInput(value: string): void {
    this.guestInput.set(value);
    this.guestSelected.emit(0);
    this.showDropdown.set(true);
    if (value.trim().length > 0 && this.filteredGuests().length === 0) {
      this.guestNotFound.emit(value);
    }
  }

  /** Seleziona un ospite dal dropdown: aggiorna il campo e notifica il padre con l'id. */
  selectGuest(g: Guest): void {
    this.guestInput.set(`${g.lastName} ${g.firstName}`);
    this.guestSelected.emit(g.id!);
    this.showDropdown.set(false);
  }

  /** Svuota il campo di ricerca e chiude il dropdown. */
  reset(): void {
    this.guestInput.set('');
    this.showDropdown.set(false);
  }
}
