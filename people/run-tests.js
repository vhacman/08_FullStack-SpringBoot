// script wrapper che esegue Jest e salva l'output in un file txt
// con data e ora di esecuzione in cima

const { spawnSync } = require("child_process");
const fs = require("fs");

// Date() crea un oggetto data con il momento attuale
// toLocaleString("it-IT") lo formatta in italiano: gg/mm/aaaa, hh:mm:ss
const timestamp = new Date().toLocaleString("it-IT");
const header = `Test eseguiti il ${timestamp}\n${"─".repeat(60)}\n\n`;

let output;

// spawnSync esegue il comando e aspetta che finisca
// a differenza di execSync, cattura stdout e stderr separatamente
// { encoding: "utf8" } fa sì che l'output sia una stringa e non un Buffer
// shell: true è necessario su Windows per trovare npx nel PATH
const result = spawnSync("npx", ["jest", "test.spec.js", "--verbose"], {
  encoding: "utf8",
  shell: true
});

// Jest scrive il report su stderr (non stdout), quindi prendiamo entrambi
// result.stdout contiene eventuale output standard
// result.stderr contiene il report di Jest con i risultati dei test
output = (result.stdout || "") + (result.stderr || "");

const content = header + output;

// scrive tutto nel file, sovrascrivendo ogni volta
fs.writeFileSync("test-results-jest.txt", content);

// stampa anche in console
console.log(content);
console.log(`\nRisultati salvati in test-results-jest.txt`);
