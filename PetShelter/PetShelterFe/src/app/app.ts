import { Component } from '@angular/core';
import { PetList } from './pet-list/pet-list';
import { PetForm } from './pet-form/pet-form';
import { AdoptionForm } from './adoption-form/adoption-form';
import { MenuBar } from './menubar/menubar';
import { MenagePets } from './menage-pets/menage-pets';

// App è il componente radice: è il primo che Angular monta nella pagina (index.html).
// Tutti gli altri componenti sono "figli" di questo.
// imports elenca i componenti figli usati nel template: in Angular standalone
// non esiste più NgModule, quindi ogni componente dichiara da sé le sue dipendenze.
@Component({
  selector: 'app-root',
  imports: [PetList, PetForm, AdoptionForm, MenagePets, MenuBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Queste tre proprietà controllano quale form mostrare nella colonna destra.
  // Solo una alla volta può essere true: quando il menu cambia, le altre diventano false.
  showPetForm = false;
  showAdoptionForm = false;
  showManagePets = false;

  // Questo metodo viene chiamato dal MenuBar tramite un evento custom (Output).
  // In base alla stringa ricevuta, imposta a true solo il flag corrispondente.
  // L'espressione  menu === 'pet'  restituisce un booleano: true se uguale, false altrimenti.
  onMenuChange(menu: string): void {
    this.showPetForm = menu === 'pet';
    this.showAdoptionForm = menu === 'adoption';
    this.showManagePets = menu === 'manage';
  }
}
