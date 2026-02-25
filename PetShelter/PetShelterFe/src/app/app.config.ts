import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// appConfig è la configurazione globale dell'applicazione Angular standalone.
// providers è l'array dei "servizi globali" resi disponibili a tutta l'app:
// - provideBrowserGlobalErrorListeners: cattura errori JavaScript non gestiti
// - provideRouter(routes): attiva il sistema di routing con le rotte definite in app.routes.ts
// - provideHttpClient(): rende disponibile HttpClient per le chiamate HTTP al backend
//   (senza questa riga il PetService non potrebbe fare le chiamate GET/POST/PATCH)
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient()
  ]
};
