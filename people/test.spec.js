// versione Jest del file test.js
// cercato online + AI per capire come strutturarlo con Jest
// per eseguirlo: npm install --save-dev jest  poi  npx jest test.jest.js

const BASE = "http://localhost:8080/api/people";

// describe() raggruppa test correlati sotto un'etichetta comune
// in JUnit corrisponde alla classe di test
// il primo argomento è il nome del gruppo che appare nel report
describe("People API - endpoint originali del prof", () => {

  // test() è il singolo caso di test, corrisponde a @Test in JUnit
  // async perché dentro usiamo await per aspettare la risposta del server
  test("findById restituisce 200", async () => {
    const res = await fetch(`${BASE}/test`);
    // expect() è l'asserzione: "mi aspetto che questo valore sia..."
    // .toBe() verifica l'uguaglianza stretta (===)
    // in JUnit sarebbe: assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK)
    expect(res.status).toBe(200);
  });

  test("findBrothers restituisce 200", async () => {
    const res = await fetch(`${BASE}/test2`);
    expect(res.status).toBe(200);
  });

  test("findSonsOf restituisce 200", async () => {
    const res = await fetch(`${BASE}/test3`);
    expect(res.status).toBe(200);
  });

  test("findByTrait restituisce 200", async () => {
    const res = await fetch(`${BASE}/test4`);
    expect(res.status).toBe(200);
  });

});

// secondo gruppo: gli esercizi JPQL che ho implementato io
describe("People API - esercizi JPQL", () => {

  test("findByEitherTrait restituisce 200 e un array non vuoto", async () => {
    const res = await fetch(`${BASE}/either-trait?trait1=Miopia&trait2=Presbiopia`);
    // res.json() legge il corpo della risposta e lo converte da stringa JSON a oggetto JS
    // await perché anche questa è un'operazione asincrona
    const body = await res.json();
    expect(res.status).toBe(200);
    // Array.isArray() verifica che sia un array e non un oggetto o un numero
    expect(Array.isArray(body)).toBe(true);
    // toBeGreaterThan(0) verifica che l'array abbia almeno un elemento
    expect(body.length).toBeGreaterThan(0);
  });

  test("avgFirstChildAge con anno valido restituisce un numero positivo", async () => {
    const res = await fetch(`${BASE}/avg-parental-age?year=1930`);
    const body = await res.json();
    expect(res.status).toBe(200);
    // typeof restituisce il tipo della variabile come stringa
    // verifica che la risposta sia proprio un numero e non un oggetto o stringa
    expect(typeof body).toBe("number");
    expect(body).toBeGreaterThan(0);
  });

  // questo test verifica esplicitamente che il 404 venga lanciato correttamente
  // a differenza del test.js originale dove 404 era sempre FAILED,
  // qui il 404 è il comportamento ATTESO e il test passa se lo riceve
  test("avgFirstChildAge con anno senza dati restituisce 404", async () => {
    // usiamo un anno futuro: non ci sono donne nate dopo il 2100 nel database
    const res = await fetch(`${BASE}/avg-parental-age?year=2100`);
    expect(res.status).toBe(404);
  });

  test("findCousins restituisce 200 e un array", async () => {
    const res = await fetch(`${BASE}/2/cousins`);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("multipleFathers restituisce 200 e un array", async () => {
    const res = await fetch(`${BASE}/multiple-fathers`);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("parentsAgeDiff restituisce 200 e un array", async () => {
    const res = await fetch(`${BASE}/parents-age-diff?years=1`);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

});
