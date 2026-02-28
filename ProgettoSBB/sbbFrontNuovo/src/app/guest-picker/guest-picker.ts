import { Component, inject, signal, computed, output, effect } from '@angular/core';
import { GuestService } from '../APIservices/guest/guest-service';
import { Guest } from '../model/hotel.entities';

@Component({
  selector: 'app-guest-picker',
  imports: [],
  templateUrl: './guest-picker.html',
  styleUrl: './guest-picker.css',
})
export class GuestPicker {

  private guestService = inject(GuestService);

  guests = signal<Guest[]>([]);

  guestSelected = output<number>();
  guestNotFound = output<string>();

  guestInput = signal('');
  showDropdown = signal(false);

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
      next: g => this.guests.set(g),
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

  onGuestBlur(): void {
    setTimeout(() => this.showDropdown.set(false), 150);
  }

  reset(): void {
    this.guestInput.set('');
    this.showDropdown.set(false);
  }
}
