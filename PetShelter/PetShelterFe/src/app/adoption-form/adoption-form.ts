import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PetService } from '../pet-service';

@Component({
    selector: 'app-adoption-form',
    imports: [FormsModule],
    templateUrl: './adoption-form.html',
    styleUrl: './adoption-form.css',
})
export class AdoptionForm {

    petService = inject(PetService);

    // computed() crea un signal derivato: si aggiorna automaticamente ogni volta che
    // petService.pets() cambia. Filtra solo i pet AVAILABLE così il select
    // non mostra animali già in adozione o già adottati.
    availablePets = computed(() => this.petService.pets().filter(p => p.status === 'AVAILABLE'));

    // I campi del form sono proprietà normali (non signal) perché non servono
    // per calcoli reattivi: vengono letti solo al momento del submit.
    adopterName = '';
    adopterEmail = '';
    adopterPhone = '';
    petId: number | null = null;  // null finché l'utente non seleziona un pet
    adoptionDate = '';
    notes = '';

    constructor() {
        // Inizializziamo la data ad oggi nel formato YYYY-MM-DD,
        // l'unico formato accettato dall'input type="date" HTML.
        this.adoptionDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
    }

    // Il select del pet usa (change) invece di [(ngModel)] perché il valore
    // del select è sempre una stringa, ma petId deve essere number | null.
    // Convertiamo manualmente con Number().
    onPetSelect(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        this.petId = value ? Number(value) : null;
    }

    submit(): void {
        // Guardia: se nessun pet è stato selezionato usciamo subito senza fare nulla
        if (this.petId === null) return;

        // Invia la PATCH al backend per aggiornare lo status a IN_PROGRESS:
        // la richiesta è "in lavorazione", in attesa di conferma dello staff.
        this.petService.updateStatus(this.petId, 'IN_PROGRESS');

        // Reset del form
        this.adopterName = '';
        this.adopterEmail = '';
        this.adopterPhone = '';
        this.petId = null;
        this.adoptionDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
        this.notes = '';
    }
}
