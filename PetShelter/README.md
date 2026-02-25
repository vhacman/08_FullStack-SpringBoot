# PetShelter

Applicazione full-stack per la gestione di un rifugio animali. Permette di censire gli animali con sesso e stato (disponibile, in adozione, adottato), esponendo REST API consumate dal frontend Angular.

## Tecnologie

**Backend:**
- Java 21
- Spring Boot
- Spring Data JPA / Hibernate
- DTO Pattern + MapStruct
- Enum (`PetSex`, `PetStatus`)
- Maven

**Frontend:**
- Angular 21
- TypeScript
- HttpClient

## Architettura

Il backend segue un'architettura a layer: API → Service → Repository → Entity, con DTO e Mapper per separare la rappresentazione esterna dal modello JPA. Gli enum `PetSex` e `PetStatus` gestiscono i valori discreti degli animali.

## Struttura

```
PetShelter/
├── PetShelterBe/                   # Backend Spring Boot
│   └── src/main/java/.../
│       ├── BackendApplication.java
│       ├── api/PetAPI.java                 # REST Controller
│       ├── dto/PetDTO.java
│       ├── mapper/PetDTOMapper.java
│       ├── model/
│       │   ├── entities/Pet.java           # Entity JPA
│       │   ├── enums/PetSex.java
│       │   ├── enums/PetStatus.java
│       │   └── repository/PetRepository.java
│       └── service/PetService.java
└── PetShelterFe/                   # Frontend Angular 21
```

## Come eseguire

**Backend:**
```bash
cd PetShelterBe
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd PetShelterFe
npm install && ng serve
```
