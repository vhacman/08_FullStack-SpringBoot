import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GuestService } from '../services/guest/guest-service';
import { Guest } from '../model/hotel.entities';

@Component({
  selector: 'app-insert-guest',
  imports: [FormsModule],
  templateUrl: './insert-guest.html',
  styleUrl: './insert-guest.css',
})
export class InsertGuest {
  private guestService = inject(GuestService);

  formVisible = signal(false);
  success     = signal(false);
  errorMsg    = signal('');

  guest: Guest = this.emptyGuest();

  toggleForm(): void {
    this.formVisible.update(v => !v);
    this.success.set(false);
    this.errorMsg.set('');
  }

  submit(): void {
    this.guestService.insert(this.guest).subscribe({
      next: () => {
        this.success.set(true);
        this.errorMsg.set('');
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
