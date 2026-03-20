# People

Progetto Spring Boot scritto dal professore come base didattica.
Modella un albero genealogico con entità `Person` e `Trait`.

Sulla base fornita ho aggiunto degli esercizi per imparare a scrivere query JPQL con Spring Data JPA.

## Esercizi

**Esercizio 1** — trovare tutte le persone che abbiano almeno uno fra due tratti specifici
`GET /api/people/either-trait?trait1=Miopia&trait2=Presbiopia`

**Esercizio 2** — trovare l'età media a cui una donna nata dopo un dato anno ha avuto il primo figlio
`GET /api/people/avg-parental-age?year=1930`

**Esercizio 3** — trovare tutti i cugini primi di una persona
`GET /api/people/{id}/cousins`

**Esercizio 4** — trovare tutte le donne che abbiano avuto figli da uomini diversi
`GET /api/people/multiple-fathers`

**Esercizio 5** — trovare tutte le persone i cui genitori abbiano una differenza di età superiore a n anni
`GET /api/people/parents-age-diff?years=10`

## Avvio

Richiede MySQL in esecuzione. Configurare le credenziali in `src/main/resources/application.properties`, poi:

```bash
mvn spring-boot:run
```

## Test automatici

Sono disponibili due approcci per testare gli endpoint senza Postman.

### test.js — script manuale
Esegue una chiamata GET a ogni endpoint e scrive i risultati in `test-results.txt`.

```bash
node test.js
```

Esempio di output:
```
test 1  - findById - PASSED  con status 200 | http://localhost:8080/api/people/test --> PersonAPI.load2()
test 6  - avgFirstChildAge - FAILED  con status 404 | ...
```

### test.spec.js — Jest
Test strutturati con Jest, verificano status HTTP e corpo della risposta.
Richiede l'installazione di Jest (solo la prima volta):

```bash
npm install --save-dev jest
```

Per eseguire i test e salvare l'output con data e ora in `test-results-jest.txt`:

```bash
node run-tests.js
```

Per eseguire i test solo in console senza salvare il file:

```bash
npx jest test.spec.js
```

Il server Spring Boot deve essere avviato prima di eseguire qualsiasi test.
