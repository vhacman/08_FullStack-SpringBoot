import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PetService } from '../pet-service';
import { PetSex, PetStatus } from '../model/Pet';

@Component({
    selector: 'app-pet-form',
    // FormsModule è necessario per usare [(ngModel)] e (ngSubmit) nel template
    imports: [FormsModule],
    templateUrl: './pet-form.html',
    styleUrl: './pet-form.css',
})
export class PetForm {

    // inject() è il modo moderno di Angular per ottenere un'istanza del service.
    // Alternativa al vecchio costruttore con parametri (constructor(private ps: PetService)).
    petService = inject(PetService);

    // Un signal per ogni campo del form, inizializzati con valori di default.
    // I signal sono "contenitori reattivi": quando il loro valore cambia,
    // Angular aggiorna automaticamente la parte di template che li legge.
    name       = signal<string>('');
    species    = signal<string>('');
    age        = signal<number>(1);
    notes      = signal<string>('');
    sex        = signal<PetSex>('MALE');
    status     = signal<PetStatus>('AVAILABLE');
    sterilized = signal<boolean>(false);
    // Data di arrivo inizializzata ad oggi nel formato YYYY-MM-DD richiesto dall'input type="date"
    arrivalDate = signal<string>(new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }));

    submit(): void {
        // Costruisce l'oggetto Pet con i valori correnti dei signal (letti chiamando il signal come funzione)
        // e lo passa al service che fa la chiamata POST al backend.
        this.petService.insert({
            id:          0,             // il backend genera l'ID con AUTO_INCREMENT, qui mettiamo 0 come placeholder
            name:        this.name(),
            species:     this.species(),
            age:         this.age(),
            notes:       this.notes(),
            sex:         this.sex(),
            status:      this.status(),
            sterilized:  this.sterilized(),
            arrivalDate: this.arrivalDate(),
        });

        // Reset del form ai valori di default dopo l'invio
        this.name.set('');
        this.species.set('');
        this.age.set(1);
        this.notes.set('');
        this.sex.set('MALE');
        this.status.set('AVAILABLE');
        this.sterilized.set(false);
        this.arrivalDate.set(new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }));
    }
}
