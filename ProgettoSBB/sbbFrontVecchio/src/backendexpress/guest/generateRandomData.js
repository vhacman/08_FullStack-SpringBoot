const fs = require('fs');

const generator = {
    firstnames: ["Marco", "Sofia", "Giuseppe", "Giulia", "Alessandro", "Aurora", "Francesco", "Alice", "Roberto", "Emma", "Lorenzo", "Giorgia", "Matteo", "Beatrice", "Davide", "Greta", "Luca", "Vittoria", "Simone", "Chiara", "Andrea", "Martina", "Federico", "Elena", "Riccardo", "Sara", "Gabriele", "Gaia", "Antonio", "Anna", "Edoardo", "Noemi", "Leonardo", "Ludovica", "Michele", "Alessia", "Pietro", "Camilla", "Filippo", "Viola", "Valerio", "Marta", "Samuele", "Bianca", "Christian", "Arianna", "Emanuele", "Irene", "Domenico", "Eleonora"],
    lastnames: ["Rossi", "Ferrari", "Russo", "Bianchi", "Esposito", "Colombo", "Romano", "Ricci", "Marino", "Greco", "Bruno", "Gallo", "Conti", "De Luca", "Mancini", "Costa", "Giordano", "Rizzo", "Lombardi", "Moretti", "Barbieri", "Fontana", "Santoro", "Mariani", "Rinaldi", "Caruso", "Ferrara", "Galli", "Martini", "Leone", "Longo", "Gentile", "Martinelli", "Vitale", "Lombardo", "Serra", "Coppola", "De Santis", "D'Angelo", "Marchetti", "Parisi", "Villa", "Conte", "Ferraro", "Ferri", "Fabbri", "Bianco", "Marra", "Pellegrini", "Palumbo"],
    cities: ["Milano", "Roma", "Napoli", "Torino", "Palermo", "Genova", "Bologna", "Firenze", "Bari", "Catania"],
    streets: ["Via Roma", "Corso Italia", "Via Dante", "Via Garibaldi", "Via Mazzini", "Via Lepanto", "Piazza Duomo"]
};

// Generatore di Codice Fiscale "fake" (16 caratteri)
const genSSN = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let res = '';
    for (let i = 0; i < 16; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    return res;
};

// Generatore Data di nascita (formato stringa ISO per SQLite)
const genDOB = () => {
    const start = new Date(1950, 0, 1);
    const end = new Date(2005, 11, 31);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
};

const totalRows = 2000;
const rows = [];

for (let i = 0; i < totalRows; i++) {
    const firstName = generator.firstnames[Math.floor(Math.random() * generator.firstnames.length)];
    const lastName = generator.lastnames[Math.floor(Math.random() * generator.lastnames.length)].replace(/'/g, "''");
    const ssn = genSSN();
    const dob = genDOB();
    const city = generator.cities[Math.floor(Math.random() * generator.cities.length)];
    const address = `${generator.streets[Math.floor(Math.random() * generator.streets.length)]}, ${Math.floor(Math.random() * 200) + 1}`;

    // Niente id: SQLite lo genera da solo
    rows.push(`('${firstName}', '${lastName}', '${ssn}', '${dob}', '${address}', '${city}')`);
}

// Costruiamo la query omettendo la colonna id
const sql = `INSERT INTO guest (firstName, lastName, ssn, dob, address, city) VALUES \n${rows.join(',\n')};`;

fs.writeFileSync('insert_guests.sql', sql);
console.log(`✅ File 'insert_guests.sql' generato! (2000 record senza ID manuale)`);