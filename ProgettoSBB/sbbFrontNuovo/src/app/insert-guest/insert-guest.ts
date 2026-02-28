import { Component, effect, inject, input, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GuestService } from '../APIservices/guest/guest-service';
import { Guest } from '../model/hotel.entities';

@Component({
  selector: 'app-insert-guest',
  imports: [FormsModule],
  templateUrl: './insert-guest.html',
  styleUrl: './insert-guest.css',
})
export class InsertGuest {
  private guestService = inject(GuestService);

  // Se true, il form viene aperto automaticamente (utile quando InsertGuest è in un modal)
  autoOpen = input(false);

  guestCreated = output<number>();

  formVisible = signal(false);
  success     = signal(false);
  errorMsg    = signal('');

  constructor() {
    effect(() => { if (this.autoOpen()) this.formVisible.set(true); });
  }

  guest: Guest = this.emptyGuest();

  toggleForm(): void {
    this.formVisible.update(v => !v);
    this.success.set(false);
    this.errorMsg.set('');
  }

  submit(): void {
    this.guestService.insert(this.guest).subscribe({
      next: (createdGuest) => {
        this.success.set(true);
        this.errorMsg.set('');
        this.guestCreated.emit(createdGuest.id!);
        this.guest = this.emptyGuest();
      },
      error: err => {
        this.errorMsg.set('Errore durante il salvataggio. Riprova.');
        console.error(err);
      }
    });
  }

  reset(): void {
    this.guest = this.emptyGuest();
    this.success.set(false);
    this.errorMsg.set('');
  }

  private emptyGuest(): Guest {
    return { firstName: '', lastName: '', ssn: '', address: '', city: '' };
  }
}
