# 09 — FullStack Spring Boot

Applicazioni full-stack con backend Spring Boot REST API e frontend Angular 21. Ogni progetto è strutturato con backend e frontend separati.

## Progetti

| Progetto | Descrizione | Stack |
|----------|-------------|-------|
| [BloodWork](BloodWork/) | Gestione parametri esami del sangue ospedalieri | Spring Boot 4.0.2, Angular, MySQL, JPA, DTO, MapStruct |
| [PetShelter](PetShelter/) | Gestionale rifugio animali con adozioni e stato animali | Spring Boot 4.0.3, Angular, MySQL, JPA, DTO, Enum |
| [ProgettoSBB](ProgettoSBB/) | Gestione hotel: prenotazioni, camere, ospiti e autenticazione con ruoli | Spring Boot 4.0.2, Angular 21, MySQL, JWT-like auth, MapStruct |

## Struttura comune

```
ProjectName/
├── [project]be/          # Backend Spring Boot (REST API)
├── [project]fe/          # Frontend Angular 21 (versione corrente)
└── [project]FeVecchio/   # Frontend (versione precedente, se presente)
```

## Stack

**Backend:** Java 21, Spring Boot 4, Spring Data JPA, Hibernate, MySQL, Maven
**Frontend:** Angular 21, TypeScript, HttpClient
