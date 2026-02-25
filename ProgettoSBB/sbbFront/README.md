# sbbFront — Frontend Angular

Frontend Angular 21 del progetto **Superior Bed and Breakfast**. Consuma le REST API del backend per gestire prenotazioni, ospiti e camere dell'hotel.

## Tecnologie

- Angular 21
- TypeScript
- HttpClient
- Routing (`app.routes.ts`)

## Componenti principali

| Componente | Descrizione |
|------------|-------------|
| `booking-row` | Riga di prenotazione nella lista |
| `city-input` | Input con autocompletamento città (API Express locale) |
| `guest-picker` | Selezione ospite per una prenotazione |
| `guest-preview` | Anteprima dati ospite |
| `guest-search` | Ricerca ospiti |
| `refund-calculator` | Calcolo rimborso in caso di cancellazione |
| `today-arrivals` | Arrivi del giorno |
| `today-departures` | Partenze del giorno |
| `top-menu` | Menu di navigazione principale |

## Servizi

| Servizio | Endpoint backend |
|----------|-----------------|
| `booking-service` | `/sbb/api/bookings` |
| `room-service` | `/sbb/api/rooms` |
| `guest-service` | `/sbb/api/guests` |
| `city-service` | API Express locale (cities) |
| `user-service` | `/sbb/api/users` |

## Backend Express (cities)

La cartella `src/backendexpress/cities/` contiene un microservizio Node.js/Express separato per l'autocompletamento dei comuni italiani, basato su SQLite.

## Come eseguire

```bash
npm install
ng serve
```

L'app si avvia su `http://localhost:4200`.
