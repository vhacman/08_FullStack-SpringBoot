import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LowerCasePipe } from '@angular/common';
import { PetService } from '../pet-service';
import { Pet, PetSex } from '../model/Pet';

@Component({
  selector: 'app-pet-list',
  // LowerCasePipe serve per il pipe | lowercase usato nel template per generare
  // la classe CSS del badge status (es. "IN_PROGRESS" → "in_progress")
  imports: [FormsModule, LowerCasePipe],
  templateUrl: './pet-list.html',
  styleUrl: './pet-list.css',
})
export class PetList {
  petService = inject(PetService);

  // Signal per ogni filtro: ogni volta che cambiano, filteredPets() si ricalcola
  // automaticamente perché è un computed che dipende da questi signal.
  filterName        = signal<string>("");
  filterSpecies     = signal<string>("");
  filterNotes       = signal<string>("");
  filterYoungerThan = signal<number>(0);
  filterOlderThan   = signal<number>(0);
  filterSex         = signal<PetSex | "">("");

  pets            = this.petService.pets;
  suppressionList = this.petService.suppressionList;

  // computed che filtra solo i pet ADOPTED: si aggiorna da solo quando pets() cambia
  adoptedPets = computed<Pet[]>(() => this.pets().filter(p => p.status === 'ADOPTED'));

  // Signal booleani per gestire il collapse/expand delle sezioni (accordion)
  showList            = signal<boolean>(false);
  showSuppressionList = signal<boolean>(false);
  showAdoptedList     = signal<boolean>(false);

  // I tre toggle negano il valore corrente del signal: true→false, false→true
  toggleList(): void {
    this.showList.set(!this.showList());
  }

  toggleSuppressionList(): void {
    this.showSuppressionList.set(!this.showSuppressionList());
  }

  toggleAdoptedList(): void {
    this.showAdoptedList.set(!this.showAdoptedList());
  }

  // Set degli ID espansi: nuovo Set ad ogni toggle per far rilevare il cambiamento ad Angular.
  // Angular confronta i signal per riferimento: modificare il Set esistente non
  // verrebbe rilevato, quindi creiamo sempre un nuovo Set.
  expandedPets = signal<Set<number>>(new Set());

  togglePet(id: number): void {
    this.expandedPets.update(current => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // computed che applica tutti i filtri in sequenza.
  // Ogni filtro attivo riduce ulteriormente la lista.
  // I filtri numerici si attivano solo se > 0 (valore di default = "disattivato").
  filteredPets = computed<Pet[]>(() => {
    // Gli animali adottati non figurano nella lista pubblica
    let res = this.pets().filter(p => p.status !== 'ADOPTED');

    if (this.filterName() !== "")
      res = res.filter(x => x.name.includes(this.filterName()));
    if (this.filterSpecies() !== "")
      res = res.filter(x => x.species.includes(this.filterSpecies()));
    if (this.filterNotes() !== "")
      res = res.filter(x => x.notes?.includes(this.filterNotes()) ?? false);
    if (this.filterOlderThan() > 0)
      res = res.filter(x => x.age >= this.filterOlderThan());
    if (this.filterYoungerThan() > 0)
      res = res.filter(x => x.age <= this.filterYoungerThan());
    if (this.filterSex() !== "")
      res = res.filter(x => x.sex === this.filterSex());
    return res;
  });
}
