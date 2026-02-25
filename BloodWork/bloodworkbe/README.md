# bloodworkbe — Backend Spring Boot

Backend REST API del progetto **BloodWork**. Espone endpoint per la gestione dei parametri degli esami del sangue in ambito ospedaliero.

## Tecnologie

- Java 21
- Spring Boot 4.0.2
- Spring Data JPA / Hibernate
- MySQL (`bloodwork`)
- DTO Pattern + MapStruct
- Maven

## Struttura

```
bloodworkbe/src/main/java/com/generation/bloodworkbe/
├── BloodworkbeApplication.java
├── api/
│   └── ExamParameterAPI.java       # /bloodwork/api/examparameters
├── dto/
│   └── ExamParameterDTO.java
├── mapper/
│   └── ExamParameterMapper.java    # MapStruct
├── model/
│   └── ExamParameter.java          # Entity JPA
├── repository/
│   └── ExamParameterRepository.java
└── service/
    └── ExamParameterService.java
```

## API

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `GET` | `/bloodwork/api/examparameters` | Lista parametri |
| `POST` | `/bloodwork/api/examparameters` | Crea nuovo parametro |

## Configurazione

Modifica `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bloodwork
spring.datasource.username=root
spring.datasource.password=password1234
```

## Come eseguire

```bash
./mvnw spring-boot:run
```

Il server si avvia su `http://localhost:8080`. CORS abilitato per `http://localhost:4200`.
