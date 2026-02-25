# sbbBack — Backend Spring Boot

Backend REST API del progetto **Superior Bed and Breakfast**. Espone endpoint per la gestione di hotel, camere, prenotazioni, ospiti e utenti.

## Tecnologie

- Java 21
- Spring Boot 4.0.2
- Spring Data JPA / Hibernate
- MySQL (`sbbv03`)
- MapStruct + Lombok
- Bean Validation (`jakarta.validation`)
- Maven

## Struttura

```
sbbBack/src/main/java/com/generation/sbb/
├── SbbApplication.java
├── api/
│   ├── BookingAPI.java     # /sbb/api/bookings
│   ├── GuestAPI.java       # /sbb/api/guests
│   ├── HotelAPI.java       # /sbb/api/hotels
│   ├── RoomAPI.java        # /sbb/api/rooms
│   └── UserAPI.java        # /sbb/api/users + /login
├── dto/
│   ├── BookingDTO.java
│   ├── GuestDTO.java
│   ├── HotelDTO.java
│   ├── LoginDTO.java
│   ├── RoomDTO.java
│   ├── TokenDTO.java
│   └── UserDTO.java
├── mapper/                 # Interfacce MapStruct
├── model/
│   ├── Booking.java        # prenotazione con stato SCHEDULED
│   ├── Guest.java
│   ├── Hotel.java
│   ├── Room.java
│   ├── User.java
│   └── UserRole.java       # enum: ADMIN, RECEPTIONIST
├── repository/             # Interfacce Spring Data JPA
└── service/                # Logica di business + PasswordHasher
```

## API principali

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `POST` | `/sbb/api/users/login` | Autenticazione, ritorna token |
| `GET` | `/sbb/api/hotels` | Lista hotel |
| `GET` | `/sbb/api/rooms` | Lista camere |
| `GET` | `/sbb/api/bookings` | Lista prenotazioni |
| `GET` | `/sbb/api/guests` | Lista ospiti |

## Configurazione

Modifica `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sbbv03
spring.datasource.username=root
spring.datasource.password=password1234
```

## Come eseguire

```bash
./mvnw spring-boot:run
```

Il server si avvia su `http://localhost:8080`. CORS abilitato per `http://localhost:4200`.
