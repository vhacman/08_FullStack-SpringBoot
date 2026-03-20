<div align="center">

# 08 — FullStack Spring Boot + Angular

Applicazioni full-stack con backend **Spring Boot 4** + **MySQL** e frontend **Angular 21**.

</div>

---

## Progetti

| Progetto | Descrizione | Stack |
|----------|-------------|-------|
| [BloodWork](BloodWork/) | Gestione parametri esami del sangue ospedalieri | Spring Boot 4.0.2, Angular, MySQL, JPA, DTO, MapStruct |
| [PetShelter](PetShelter/) | Gestionale rifugio animali con adozioni e stato animali | Spring Boot 4.0.3, Angular, MySQL, JPA, DTO, Enum |
| [ProgettoSBB](ProgettoSBB/) | Gestione hotel: prenotazioni, camere, ospiti e autenticazione con ruoli | Spring Boot 4.0.2, Angular 21, MySQL, JWT-like auth, MapStruct |
| [BloggerV01](BloggerV01/) | Piattaforma blog con utenti, blog e palette — solo backend | Spring Boot, MySQL, JPA, PortalUser, Blog, Enum |
| [SBBPROF](SBBPROF/) | Gestione hotel full-stack: ospiti, camere, prenotazioni, utenti | Spring Boot, Angular 21, MySQL, CRUD completo |
| [VezioCastelManager](VezioCastelManager/) | Gestione visitatori e biglietti per museo/castello | Spring Boot, Angular 21, MySQL, Ticket, Visitor, Auth |
| [people](people/) | Albero genealogico con query JPQL avanzate — base didattica del professore | Spring Boot, MySQL, JPA, JPQL, Jest |

---

## Struttura comune

```
ProjectName/
├── [project]be/          # Backend Spring Boot (REST API)
├── [project]fe/          # Frontend Angular 21 (versione corrente)
└── [project]FeVecchio/   # Frontend (versione precedente, se presente)
```

---

## Stack Tecnologico

| Layer | Tecnologie |
|-------|------------|
| **Backend** | Java 21, Spring Boot 4, Spring Data JPA, Hibernate, MySQL, Maven |
| **Frontend** | Angular 21, TypeScript 5.9, HttpClient, Signals |
| **Mapping** | MapStruct 1.6.3, Lombok |
| **Testing** | Jest (people), Postman |
| **Pattern** | DTO, Repository, Service, MapStruct mapper |

---

## Concetti sviluppati

| Concetto | Progetti |
|----------|----------|
| REST API + DTO + MapStruct | BloodWork, PetShelter, ProgettoSBB, fooddelivery |
| Enum su entità JPA | PetShelter, BloggerV01 |
| Autenticazione con ruoli | ProgettoSBB, VezioCastelManager |
| CRUD completo fullstack | SBBPROF, PetShelter, BloodWork |
| Query JPQL con `@Query` | people |
| Test automatici con Jest | people |
| Relazioni Many-to-One / One-to-Many | Tutti |

---

## Avvio backend

```bash
# Da [project]be/
./mvnw spring-boot:run
```

Richiede MySQL in esecuzione. Configurare credenziali in `src/main/resources/application.properties`.
Porta default: `8080`.

## Avvio frontend

```bash
cd [project]fe
npm install
npm start   # → http://localhost:4200
```

---

<div align="center">

**Hacman Viorica Gabriela** | Generation Italy — Java Full Stack Developer

[Torna al README principale](../README.md)

</div>
