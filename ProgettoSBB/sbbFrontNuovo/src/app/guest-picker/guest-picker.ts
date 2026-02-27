import { Component, inject, signal, computed, output } from '@angular/core';
import { GuestLogicService } from '../ComponentLogicService/guest-logic-service';
import { Guest } from '../model/hotel.entities';

@Component({
  selector: 'app-guest-picker',
  imports: [],
  templateUrl: './guest-picker.html',
  styleUrl: './guest-picker.css',
})
export class GuestPicker {

  private guestLogicService = inject(GuestLogicService);

  guestSelected = output<number>();
  guestNotFound = output<string>();

  // Solo stato UI: testo digitato e visibilità dropdown
  guestInput   = signal('');
  showDropdown = signal(false);

  // La logica di filtraggio vive nel service; il componente delega
  filteredGuests = computed(() => this.guestLogicService.filter(this.guestInput()));

  onGuestInput(value: string): void {
    this.guestInput.set(value);
    this.guestSelected.emit(0);
    this.showDropdown.set(true);
    
    // Se l'utente ha digitato qualcosa e non ci sono risultati, emetti evento
    if (value.trim().length > 0 && this.filteredGuests().length === 0) {
      this.guestNotFound.emit(value);
    }
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

  // Chiamato dal padre tramite viewChild per azzerare il campo
  reset(): void {
    this.guestInput.set('');
    this.showDropdown.set(false);
  }
}
