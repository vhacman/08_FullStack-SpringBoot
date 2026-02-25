import {Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {PetService} from '../pet-service';

@Component({
  selector: 'app-menage-pets',
  imports: [FormsModule],
  templateUrl: './menage-pets.html',
  styleUrl: './menage-pets.css',
})
export class MenagePets {

  petService = inject(PetService);

  // pets include tutti gli animali (anche ADOPTED): lo staff deve poterli gestire tutti.
  pets = this.petService.pets;

  // pendingPets è un computed signal: si aggiorna automaticamente ogni volta che
  // la lista pets cambia (es. dopo una PATCH). Mostra solo le adozioni in attesa.
  pendingPets = computed(() => this.petService.pets().filter(p => p.status === 'IN_PROGRESS'));

  // signal per tenere traccia del pet selezionato nel form di gestione manuale
  selectedPetId = signal<number | null>(null);
  // signal per il nuovo status da applicare tramite il form manuale
  newStatus = signal<string>('AVAILABLE');

  onPetSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedPetId.set(value ? Number(value) : null);
  }

  // accept ed reject agiscono direttamente sulle card delle adozioni pendenti:
  // non serve un form, basta il click sul bottone che passa l'id del pet.
  accept(id: number): void {
    this.petService.updateStatus(id, 'ADOPTED');
  }

  reject(id: number): void {
    // Rifiutare un'adozione riporta il pet a AVAILABLE così può essere adottato da altri
    this.petService.updateStatus(id, 'AVAILABLE');
  }

  // submit() gestisce il form manuale per cambiare lo status di qualsiasi pet
  submit(): void {
    const petId = this.selectedPetId();
    if (!petId) return;  // guardia: non fare nulla se nessun pet è selezionato

    this.petService.updateStatus(petId, this.newStatus());

    // Reset del form dopo l'invio
    this.selectedPetId.set(null);
    this.newStatus.set('AVAILABLE');
  }

}
