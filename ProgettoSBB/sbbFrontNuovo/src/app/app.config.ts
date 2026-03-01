import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

// Configurazione centrale dell'applicazione Angular.
// providers è l'array di servizi globali disponibili per iniezione in ogni componente:
// tutto ciò che viene registrato qui può essere iniettato con inject() ovunque nell'app.
export const appConfig: ApplicationConfig = {
  providers: [
    // Intercetta gli errori JavaScript non gestiti nel browser e li logga in modo uniforme.
    // Senza questo, errori come undefined is not a function passerebbero in silenzio.
    provideBrowserGlobalErrorListeners(),

    // Registra il router con le route definite in app.routes.ts.
    // Senza questo, RouterLink, RouterOutlet e routerLinkActive non funzionerebbero.
    provideRouter(routes),

    // Abilita HttpClient in tutta l'app: senza questo provider, ogni inject(HttpClient)
    // nei servizi lancerebbe un errore a runtime (NullInjectorError).
    provideHttpClient()
  ]
};
