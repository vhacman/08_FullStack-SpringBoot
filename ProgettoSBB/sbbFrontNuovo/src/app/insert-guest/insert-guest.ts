import {Component, effect, inject, input, signal, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {GuestService} from '../APIservices/guest/guest-service';
import {Guest} from '../model/hotel.entities';

/**
 * Form per la registrazione di un nuovo ospite nel sistema.
 * Può essere usato in due modi:
 * 1. Standalone (nella pagina Ospiti): l'utente lo apre manualmente con il toggle
 * 2. Embedded in un modal (in InsertBooking): si apre automaticamente se autoOpen=true
 * L'input autoOpen permette al padre di controllare questo comportamento.
 */
@Component({
  selector: 'app-insert-guest',
  imports: [FormsModule],
  templateUrl: './insert-guest.html',
  styleUrl: './insert-guest.css',
})
export class InsertGuest {

  private guestService = inject(GuestService);

  // autoOpen è un input() Signal: quando il padre lo imposta a true,
  // l'effect() qui sotto si attiva e apre il form automaticamente.
  autoOpen = input(false);

  // Emette l'id dell'ospite appena creato, così il padre può usarlo subito
  // (es. per pre-selezionarlo nella prenotazione in corso).
  guestCreated = output<number>();

  formVisible = signal(false);
  success = signal(false);
  errorMsg = signal('');

  constructor() {
    effect(() => { if (this.autoOpen()) this.formVisible.set(true); });
  }

  // Oggetto plain inizializzato con emptyGuest(): usare un oggetto separato
  // invece di Signal singoli per ogni campo è più comodo con [(ngModel)].
  guest: Guest = this.emptyGuest();

  /** Apre o chiude il form: se era visibile lo nasconde e viceversa.
   *  Pulisce anche successo ed errore così il form si presenta sempre pulito. */
  toggleForm(): void {
    this.formVisible.update(v => !v);
    this.success.set(false);
    this.errorMsg.set('');
  }

  submit(): void {
    // Chiamo il backend con i dati del form. Se va a buon fine:
    // - mostro il messaggio di successo
    // - emetto l'id del nuovo ospite al padre (per usarlo subito nella prenotazione)
    // - azzero il form per permettere un eventuale inserimento successivo
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
    // Ripristina il form allo stato iniziale senza chiuderlo:
    // utile se l'utente vuole correggere i dati senza dover riaprire il toggle.
    this.guest = this.emptyGuest();
    this.success.set(false);
    this.errorMsg.set('');
  }

  // Factory method che restituisce sempre un oggetto Guest vuoto.
  // Preferisco un metodo al posto di un letterale ripetuto: se i campi
  // dell'interfaccia Guest cambiano, devo aggiornare solo qui.
  private emptyGuest(): Guest {
    return {firstName: '', lastName: '', ssn: '', address: '', city: ''};
  }
}
