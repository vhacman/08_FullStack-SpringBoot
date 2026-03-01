import {Component, inject, signal} from '@angular/core';
import {InsertGuest} from '../insert-guest/insert-guest';
import {GuestService} from '../APIservices/guest/guest-service';
import {Guest} from '../model/hotel.entities';

/**
 * Pagina di gestione ospiti: mostra la lista di tutti gli ospiti registrati
 * e permette di aggiungerne di nuovi tramite un modal con InsertGuest.
 * Dopo la creazione, la lista si aggiorna automaticamente e il modal si chiude.
 */
@Component({
  selector: 'app-menage-guests',
  imports: [InsertGuest],
  templateUrl: './menage-guests.html',
  styleUrl: './menage-guests.css',
})
export class MenageGuests {

  private guestService = inject(GuestService);

  guests = signal<Guest[]>([]); // lista completa degli ospiti caricata dal backend
  showModal = signal(false);       // controlla la visibilità del modal di inserimento

  // guestToDelete: ospite in attesa di conferma eliminazione.
  // null = nessun popup aperto; Guest = popup aperto per quell'ospite.
  guestToDelete = signal<Guest | null>(null);

  constructor() {
    // Carico subito la lista al montaggio del componente.
    // Non uso effect() qui perché non dipendo da nessun Signal: il caricamento
    // avviene una volta sola, indipendentemente dall'utente loggato.
    this.loadGuests();
  }

  private loadGuests(): void {
    // Chiedo al backend tutti gli ospiti e aggiorno il Signal.
    // Viene chiamato sia nel costruttore (caricamento iniziale)
    // sia dopo ogni nuova creazione (onGuestCreated) per mantenere la lista aggiornata.
    this.guestService.findAll().subscribe({
      next: g => this.guests.set(g),
      error: err => console.error('Errore caricamento ospiti:', err)
    });
  }

  // Due metodi separati (invece di un toggle) per chiarezza nel template:
  // (click)="openModal()" è più esplicito di (click)="toggleModal()".
  openModal(): void { this.showModal.set(true); }
  closeModal(): void { this.showModal.set(false); }

  onGuestCreated(_id: number): void {
    // Ricarico la lista dal server per includere il nuovo ospite appena creato,
    // poi chiudo subito il modal.
    this.loadGuests();
    this.closeModal();
  }

  // Apre il popup di conferma impostando l'ospite da eliminare.
  // La cancellazione vera avviene solo in confirmDelete(), dopo che l'utente conferma.
  requestDelete(guest: Guest): void {
    this.guestToDelete.set(guest);
  }

  // Chiude il popup senza fare nulla: l'ospite rimane nella lista.
  cancelDelete(): void {
    this.guestToDelete.set(null);
  }

  confirmDelete(): void {
    const guest = this.guestToDelete();
    if (!guest?.id) return;

    // Chiamo DELETE /guests/{id}: il frontend non sa (e non deve sapere) se il backend
    // fa un delete fisico o un soft delete. La logica di "marcare deleted = true invece di cancellare"
    //  nascosta nel backend — qui arriva solo un 200 OK.
    // In caso di successo rimuovo la card localmente con filter(): più veloce
    // che ricaricare tutta la lista con una nuova GET.
    this.guestService.delete(guest.id).subscribe({
      next: () => {
        this.guests.update(list => list.filter(g => g.id !== guest.id));
        this.guestToDelete.set(null);
      },
      error: err => console.error('Errore eliminazione ospite:', err)
    });
  }
}
