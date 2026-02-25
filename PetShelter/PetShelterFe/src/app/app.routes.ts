import { Routes } from '@angular/router';
import { PetForm } from './pet-form/pet-form';
import { AdoptionForm } from './adoption-form/adoption-form';

// Il router di Angular mappa un URL a un componente da mostrare.
// Questo file definisce le rotte disponibili nell'applicazione.
// Al momento i form sono gestiti tramite flag nel componente App
// (non tramite navigazione URL), quindi queste rotte sono definite
// ma non ancora utilizzate attivamente nel layout principale.
export const routes: Routes = [
    { path: 'insert-pet', component: PetForm },
    { path: 'insert-adoption', component: AdoptionForm },
];
