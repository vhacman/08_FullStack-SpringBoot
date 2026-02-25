# BloodWork

Applicazione full-stack per la gestione dei parametri degli esami del sangue in ambito ospedaliero. Il backend espone REST API per la gestione di `ExamParameter`, il frontend Angular consuma le API.

## Tecnologie

**Backend:**
- Java 21
- Spring Boot
- Spring Data JPA / Hibernate
- DTO Pattern + MapStruct
- Maven

**Frontend:**
- Angular 21
- TypeScript
- HttpClient

## Architettura

Il backend segue un'architettura a layer: API → Service → Repository → Entity, con DTO per separare la rappresentazione esterna dal modello interno.

## Struttura

```
BloodWork/
├── bloodworkbe/                    # Backend Spring Boot
│   └── src/main/java/.../
│       ├── BloodworkbeApplication.java
│       ├── api/ExamParameterAPI.java       # REST Controller
│       ├── dto/ExamParameterDTO.java
│       ├── mapper/ExamParameterMapper.java
│       ├── model/ExamParameter.java        # Entity JPA
│       ├── repository/ExamParameterRepository.java
│       └── service/ExamParameterService.java
└── bloodworkfe/                    # Frontend Angular 21
```

## Come eseguire

**Backend:**
```bash
cd bloodworkbe
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd bloodworkfe
npm install && ng serve
```
