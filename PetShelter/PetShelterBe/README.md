# PetShelterBe — Backend Spring Boot

Backend REST API del progetto **PetShelter**. Espone endpoint per la gestione degli animali di un rifugio, con supporto a filtri per stato, specie e sesso.

## Tecnologie

- Java 21
- Spring Boot 4.0.3
- Spring Data JPA / Hibernate
- MySQL (`petshelterbe`)
- DTO Pattern + MapStruct
- Enum (`PetSex`, `PetStatus`)
- Maven

## Struttura

```
PetShelterBe/src/main/java/com/generation/petshelterbe/
├── BackendApplication.java
├── api/
│   └── PetAPI.java                 # /petshelterbe/api/pets
├── dto/
│   └── PetDTO.java
├── mapper/
│   └── PetDTOMapper.java           # MapStruct
├── model/
│   ├── entities/
│   │   └── Pet.java                # Entity JPA
│   ├── enums/
│   │   ├── PetSex.java
│   │   └── PetStatus.java
│   └── repository/
│       └── PetRepository.java
└── service/
    └── PetService.java
```

## API

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `GET` | `/petshelterbe/api/pets` | Lista tutti gli animali |
| `GET` | `/petshelterbe/api/pets/{id}` | Dettaglio singolo animale |
| `POST` | `/petshelterbe/api/pets` | Crea nuovo animale |
| `PUT` | `/petshelterbe/api/pets/{id}` | Aggiorna animale |
| `DELETE` | `/petshelterbe/api/pets/{id}` | Elimina animale |
| `GET` | `/petshelterbe/api/pets/status/{status}` | Filtra per stato |
| `GET` | `/petshelterbe/api/pets/species/{species}` | Filtra per specie |
| `GET` | `/petshelterbe/api/pets/sex/{sex}` | Filtra per sesso |
| `GET` | `/petshelterbe/api/pets/suppression-list` | Lista animali soppressi |

## Configurazione

Modifica `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/petshelterbe
spring.datasource.username=root
spring.datasource.password=password1234
```

Il database viene popolato automaticamente da `data.sql` all'avvio.

## Come eseguire

```bash
./mvnw spring-boot:run
```

Il server si avvia su `http://localhost:8080`. CORS abilitato per `http://localhost:4200`.
