# PetShelterFe — Frontend Angular

Frontend Angular 21 del progetto **PetShelter**. Consuma le REST API del backend per gestire gli animali del rifugio e le adozioni.

## Tecnologie

- Angular 21
- TypeScript
- HttpClient
- Routing (`app.routes.ts`)

## Componenti

| Componente | Descrizione |
|------------|-------------|
| `menubar` | Menu di navigazione principale |
| `pet-list` | Lista degli animali nel rifugio |
| `pet-form` | Form per aggiungere o modificare un animale |
| `menage-pets` | Gestione completa degli animali |
| `adoption-form` | Form per registrare un'adozione |

## Servizi

| Servizio | Endpoint backend |
|----------|-----------------|
| `pet-service` | `/petshelterbe/api/pets` |

## Come eseguire

```bash
npm install
ng serve
```

L'app si avvia su `http://localhost:4200`. Richiede il backend attivo su `http://localhost:8080`.
