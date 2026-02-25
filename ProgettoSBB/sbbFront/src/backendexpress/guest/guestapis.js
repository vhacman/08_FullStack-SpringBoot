const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors'); // <--- Importiamo CORS

const app = express();
app.use(cors());
app.use(express.json()); // Middleware per leggere il body in JSON

// --- 1. CONFIGURAZIONE DATABASE ---
const db = new Database('hotel.db', { verbose: console.log });

// Creazione tabella basata sull'interfaccia Guest
db.exec(`
  CREATE TABLE IF NOT EXISTS guest (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    ssn TEXT UNIQUE NOT NULL,
    dob TEXT,
    address TEXT NOT NULL,
    cities TEXT NOT NULL
  )
`);

// --- 2. ROTTE API ---

/**
 * @route   GET /api/guests
 * @desc    Recupera la lista di tutti i guest
 */
app.get('/api/guests', (req, res) => {
  try {
    const guests = db.prepare('SELECT * FROM guest ORDER BY ID DESC LIMIT 1000').all();
    res.json(guests);
  } catch (err) {
    res.status(500).json({ error: "Errore nel database", details: err.message });
  }
});



app.get('/api/guests/byssn/:ssn', (req, res) => {
  try {
    const guest = db.prepare('SELECT * FROM guest WHERE ssn = ?').get(req.params.ssn);
    if (!guest) return res.status(404).json({ error: "Guest non trovato" });
    res.json(guest);
  } catch (err) {
    res.status(500).json({ error: "Errore nel database" });
  }
});

app.get('/api/guests/search', (req, res) => {
  const lastNamePart = req.query.q; // q sta per query ed è il valore che cerchiamo

  if (!lastNamePart || lastNamePart.length < 2) {
    return res.status(400).json({ error: "Fornire almeno 2 caratteri per la ricerca" });
  }

  try {
    // Usiamo LIKE per la ricerca parziale (es: 'Ros' troverà 'Rossi', 'Rossetti', etc.)
    const stmt = db.prepare('SELECT * FROM guest WHERE lastName LIKE ?');
    const results = stmt.all(`%${lastNamePart}%`);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore durante la ricerca nel database" });
  }
});

/**
 * @route   POST /api/guests
 * @desc    Crea un nuovo guest
 */
app.post('/api/guests', (req, res) => {
  const { firstName, lastName, ssn, dob, address, cities } = req.body;

  // Validazione minima
  if (!firstName || !lastName || !ssn || !address || !cities) {
    return res.status(400).json({ error: "Campi obbligatori mancanti" });
  }

  const insert = db.prepare(`
    INSERT INTO guest (firstName, lastName, ssn, dob, address, cities)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = insert.run(firstName, lastName, ssn, dob, address, cities);
    res.status(201).json({
      id: result.lastInsertRowid,
      firstName, lastName, ssn, dob, address, cities
    });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: "Il codice fiscale (SSN) esiste già" });
    } else {
      res.status(500).json({ error: "Errore durante il salvataggio" });
    }
  }
});

/**
 * @route   DELETE /api/guests/:id
 * @desc    Elimina un guest
 */
app.delete('/api/guests/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM guest WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: "Guest non trovato" });
    res.json({ message: "Guest eliminato con successo" });
  } catch (err) {
    res.status(500).json({ error: "Errore nel database" });
  }
});

/**
 * @route   GET /api/guests/:id
 * @desc    Recupera un singolo guest per ID
 */
app.get('/api/guests/:id', (req, res) => {
  try {
    const guest = db.prepare('SELECT * FROM guest WHERE id = ?').get(req.params.id);
    if (!guest) return res.status(404).json({ error: "Guest non trovato" });
    res.json(guest);
  } catch (err) {
    res.status(500).json({ error: "Errore nel database" });
  }
});

// --- 3. AVVIO SERVER ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`--- Server in esecuzione su http://localhost:${PORT} ---`);
  console.log(`Database SQLite pronto.`);
});