import { Component, inject, signal, computed, output } from '@angular/core';
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

  private guestService = inject(GuestService);

  // La lista completa viene caricata una volta sola nel costruttore.
  // Il filtro poi avviene lato client su questa lista, senza altre chiamate HTTP.
  guests       = signal<Guest[]>([]);
  guestInput   = signal('');
  showDropdown = signal(false);

  guestSelected = output<number>();
  guestNotFound = output<string>();

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

  constructor() {
    this.guestService.findAll().subscribe({
      next:  g   => this.guests.set(g),
      error: err => console.error('Errore caricamento ospiti:', err)
    });
  }

  onGuestInput(value: string): void {
    this.guestInput.set(value);
    this.guestSelected.emit(0);
    this.showDropdown.set(true);
    if (value.trim().length > 0 && this.filteredGuests().length === 0) {
      this.guestNotFound.emit(value);
    }
  }

  selectGuest(g: Guest): void {
    this.guestInput.set(`${g.lastName} ${g.firstName}`);
    this.guestSelected.emit(g.id!);
    this.showDropdown.set(false);
  }

  // Il setTimeout da 150ms è necessario perché il blur dell'input si attiva
  // PRIMA del click sull'elemento del dropdown. Senza il ritardo, il dropdown
  // si chiuderebbe prima che il click venga registrato e selectGuest() non verrebbe mai chiamato.
  // Nel template usiamo mousedown invece di click proprio per questo motivo:
  // mousedown si attiva prima del blur e bypassa il problema.
  onGuestBlur(): void {
    setTimeout(() => this.showDropdown.set(false), 150);
  }

  reset(): void {
    this.guestInput.set('');
    this.showDropdown.set(false);
  }
}
