# ProgettoSBB — Superior Bed & Breakfast

Applicazione full-stack per la gestione di un hotel: prenotazioni, camere, ospiti e utenti con autenticazione basata su token. Il nome **SBB** sta per *Superior Bed and Breakfast*.

## Tecnologie

**Backend:**
- Java 21
- Spring Boot 4.0.2
- Spring Data JPA / Hibernate
- MySQL
- DTO Pattern + MapStruct + Lombok
- Autenticazione con token (LoginDTO → TokenDTO)
- Bean Validation
- Maven

**Frontend:**
- Angular 21.1
- TypeScript 5.9
- HttpClient
- Routing
- date-fns (gestione date)

## Architettura

Il backend segue un'architettura a layer: API → Service → Repository → Entity, con DTO e Mapper per separare la rappresentazione esterna dal modello JPA. Il sistema di autenticazione distingue due ruoli: `ADMIN` e `RECEPTIONIST`.

## Entità principali

| Entità | Descrizione |
|--------|-------------|
| `Hotel` | Hotel con nome, indirizzo e città |
| `Room` | Camera associata a un hotel |
| `Booking` | Prenotazione con date, prezzo, note e stato (`PENDING`, `CHECKED_IN`, `CHECKED_OUT`, `COMPLETE`, `CANCELED`) |
| `Guest` | Ospite associato a una prenotazione |
| `User` | Utente del sistema con ruolo (`ADMIN`, `RECEPTIONIST`) |
| `HotelClosure` | Periodo di chiusura dichiarato per un hotel (ferie, ristrutturazione) |

## Struttura

```
ProgettoSBB/
├── sbbBack/         # Backend Spring Boot (REST API su /sbb/api/)
├── sbbFrontNuovo/  # Frontend Angular 21 (versione corrente)
└── sbbFrontVecchio/ # Frontend Angular (versione precedente)
```

## Funzionalità

**Gestione Hotel:**
- Creazione e modifica hotel
- Gestione camere (tipologia, prezzo, stato)
- Calendario interattivo con visualizzazione disponibilità
- Gestione periodi di chiusura (ferie, ristrutturazione)

**Gestione Prenotazioni:**
- Creazione, modifica e cancellazione prenotazioni
- Check-in / Check-out
- Stati: PENDING, CHECKED_IN, CHECKED_OUT, COMPLETE, CANCELED
- Visualizzazione arrivi e partenze del giorno
- Filtro avanzato delle prenotazioni

**Gestione Ospiti:**
- Anagrafica ospiti
- Ricerca e selezione ospiti esistenti

**Dashboard:**
- Panoramica prenotazioni correnti
- Arrivi e partenze odierne
- Visualizzazione rapida disponibilità camere

## Database

**Configurazione MySQL:**
- Host: `localhost:3306`
- Database: `sbbv03`
- Username: `root`
- Password: `password1234`

Il database viene creato automaticamente all'avvio dell'applicazione (`createDatabaseIfNotExist=true`).

## Demo

[Demo.mp4](./Demo.mp4)

![Demo.gif](./Demo.gif)

## Come eseguire

**Backend** (richiede MySQL su localhost:3306):
```bash
cd sbbBack
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd sbbFrontNuovo
npm install && ng serve
```

## Componenti Frontend

- **Home Page**: Dashboard con statistiche e azioni rapide
- **Calendar**: Calendario mensile interattivo con disponibilità camere
- **Calendar Grid**: Griglia mensile per visualizzazione date
- **Calendar Header**: Intestazione del calendario con navigazione mesi
- **Calendar Modals**: Modali per gestione date e chiusure
- **Booking List**: Lista prenotazioni con filtri
- **Booking Row**: Riga singola per visualizzazione prenotazione
- **Insert Booking**: Form per creazione/modifica prenotazione
- **Room Picker**: Selezione camera con disponibilità
- **Guest Picker**: Ricerca e selezione ospite
- **Insert Guest**: Form per inserimento ospite
- **Menage Guests**: Gestione anagrafica ospiti
- **Todays Arrivals**: Visualizzazione arrivi odierni
- **Todays Departures**: Visualizzazione partenze odierne
- **Availability Rooms**: Visualizzazione disponibilità camere
- **Filter Bar**: Filtri avanzati per ricerca
- **Top Menu**: Menu di navigazione principale
