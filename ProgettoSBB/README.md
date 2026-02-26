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
- Angular 21
- TypeScript
- HttpClient
- Routing

## Architettura

Il backend segue un'architettura a layer: API → Service → Repository → Entity, con DTO e Mapper per separare la rappresentazione esterna dal modello JPA. Il sistema di autenticazione distingue due ruoli: `ADMIN` e `RECEPTIONIST`.

## Entità principali

| Entità | Descrizione |
|--------|-------------|
| `Hotel` | Hotel con nome, indirizzo e città |
| `Room` | Camera associata a un hotel |
| `Booking` | Prenotazione con date, prezzo, note e stato (`SCHEDULED`) |
| `Guest` | Ospite associato a una prenotazione |
| `User` | Utente del sistema con ruolo (`ADMIN`, `RECEPTIONIST`) |

## Struttura

```
ProgettoSBB/
├── sbbBack/         # Backend Spring Boot (REST API su /sbb/api/)
├── sbbFrontNuovo/  # Frontend Angular 21 (versione corrente)
└── sbbFrontVecchio/ # Frontend Angular (versione precedente)
```

## Come eseguire

**Backend** (richiede MySQL su localhost:3306):
```bash
cd sbbBack
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd sbbFront
npm install && ng serve
```
