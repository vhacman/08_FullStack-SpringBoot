import { Component, inject, signal, computed, output } from '@angular/core';
import { GuestService } from '../services/guest/guest-service';
import { Guest } from '../model/hotel.entities';

@Component({
  selector: 'app-guest-picker',
  imports: [],
  templateUrl: './guest-picker.html',
  styleUrl: './guest-picker.css',
})
export class GuestPicker {

  private guestService = inject(GuestService);

  guestSelected = output<number>();

  // Solo stato UI: testo digitato e visibilità dropdown
  guestInput   = signal('');
  showDropdown = signal(false);

  // Il computed delega al servizio: la logica di filtraggio non è più qui
  filteredGuests = computed(() => this.guestService.filter(this.guestInput()));

  onGuestInput(value: string): void {
    this.guestInput.set(value);
    this.guestSelected.emit(0);
    this.showDropdown.set(true);
  }

  selectGuest(g: Guest): void {
    this.guestInput.set(`${g.lastName} ${g.firstName}`);
    this.guestSelected.emit(g.id!);
    this.showDropdown.set(false);
  }

  onGuestBlur(): void {
    // Timeout: lascia il tempo al mousedown sull'item di scattare prima del blur
    setTimeout(() => this.showDropdown.set(false), 150);
  }

  // Metodo pubblico: il padre lo chiama tramite viewChild quando resetta il form
  reset(): void {
      this.guestInput.set('');
      this.showDropdown.set(false);
  }
}
