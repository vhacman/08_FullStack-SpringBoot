# bloodworkfe — Frontend Angular

Frontend Angular 21 del progetto **BloodWork**. Consuma le REST API del backend per visualizzare e inserire parametri degli esami del sangue.

## Tecnologie

- Angular 21
- TypeScript
- HttpClient
- Routing (`app.routes.ts`)

## Componenti

| Componente | Descrizione |
|------------|-------------|
| `exam-parameter-list` | Lista dei parametri degli esami |
| `exam-parameter-form` | Form per inserire un nuovo parametro |

## Servizi

| Servizio | Endpoint backend |
|----------|-----------------|
| `exam-parameter-service` | `/bloodwork/api/examparameters` |

## Come eseguire

```bash
npm install
ng serve
```

L'app si avvia su `http://localhost:4200`. Richiede il backend attivo su `http://localhost:8080`.
