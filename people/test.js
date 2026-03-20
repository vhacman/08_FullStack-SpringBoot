// script per testare automaticamente tutti gli endpoint REST del progetto
// alternativa rapida a fare le chiamate a mano su Postman
// cercato online + AI per capire come strutturarlo

// require() importa un modulo di Node. "fs" (file system) è built-in, non serve installarlo
// lo usiamo solo per writeFileSync alla fine
const fs = require("fs");

// url base comune a tutti gli endpoint, la mettiamo in una variabile
// per non ripeterla in ogni test e poterla cambiare in un posto solo
const BASE = "http://localhost:8080/api/people";

// array di oggetti: ogni oggetto è un test con nome, url e il metodo API corrispondente
// i backtick `` permettono di usare ${} per inserire variabili dentro la stringa (template literal)
const tests = [
  { name: "test 1  - findById",          url: `${BASE}/test`,                                             method: "PersonAPI.load2()" },
  { name: "test 2  - findBrothers",      url: `${BASE}/test2`,                                            method: "PersonAPI.getMatthewBrothers()" },
  { name: "test 3  - findSonsOf",        url: `${BASE}/test3`,                                            method: "PersonAPI.getFerdinandosChildren()" },
  { name: "test 4  - findByTrait",       url: `${BASE}/test4`,                                            method: "PersonAPI.getMiopi()" },
  { name: "test 5  - findByEitherTrait", url: `${BASE}/either-trait?trait1=Miopia&trait2=Presbiopia`,     method: "PersonAPI.getByEitherTrait()" },
  { name: "test 6  - avgFirstChildAge",  url: `${BASE}/avg-parental-age?year=1900`,                       method: "PersonAPI.getAvgParentalAge()" },
  { name: "test 7  - findCousins",       url: `${BASE}/2/cousins`,                                        method: "PersonAPI.getCousins()" },
  { name: "test 8  - multipleFathers",   url: `${BASE}/multiple-fathers`,                                 method: "PersonAPI.getMothersWithMultipleFathers()" },
  { name: "test 9  - parentsAgeDiff",    url: `${BASE}/parents-age-diff?years=1`,                         method: "PersonAPI.getByParentsAgeDifference()" },
];

// async: dichiara che questa funzione contiene operazioni asincrone (fetch)
// senza async non possiamo usare await dentro
async function runTests()
{
  // array vuoto che riempiremo con i risultati di ogni test
  const lines = [];

  // for...of itera sull'array tests, ad ogni giro "test" è l'oggetto corrente
  // usiamo for...of e non forEach perché forEach non supporta await:
  // con forEach tutti i fetch partirebbero insieme senza aspettarsi
  for (const test of tests)
  {
    // try/catch: proviamo a fare la chiamata, se va storto catturiamo l'errore
    // senza try/catch un errore farebbe crashare tutto lo script
    try
    {
      // fetch fa una chiamata HTTP GET all'url del test
      // await aspetta che il server risponda prima di andare alla riga successiva
      const res = await fetch(test.url);

      // res.ok è true se lo status HTTP è 2xx (200 OK, 201 Created ecc.)
      // operatore ternario: condizione ? valore_se_true : valore_se_false
      // push aggiunge la stringa risultato in fondo all'array lines
      lines.push(res.ok
        ? `${test.name} - PASSED  con status ${res.status} | ${test.url} --> ${test.method}`
        : `${test.name} - FAILED  con status ${res.status} | ${test.url} --> ${test.method}`
      );
    }
    catch (err)
    {
      // arriviamo qui se fetch non riesce nemmeno a connettersi
      // (es. il server Spring Boot non è avviato)
      // err.message contiene la descrizione dell'errore
      lines.push(`${test.name} - FAILED  (${err.message}) | ${test.url} --> ${test.method}`);
    }
  }

  // join("\n") unisce tutti gli elementi dell'array in una sola stringa
  // separandoli con un a capo. Il + "\n" aggiunge un a capo finale
  const output = lines.join("\n") + "\n";

  // writeFileSync scrive il file in modo sincrono (aspetta che sia finito)
  // se il file non esiste lo crea, se esiste lo sovrascrive
  fs.writeFileSync("test-results.txt", output);

  // stampa lo stesso output anche in console così lo vediamo subito
  console.log(output);
}

// chiamiamo la funzione per avviare i test
// senza questa riga la funzione sarebbe definita ma non eseguita
runTests();
