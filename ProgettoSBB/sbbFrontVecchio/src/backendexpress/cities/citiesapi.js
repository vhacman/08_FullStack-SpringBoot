const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors'); // 1. Importa il pacchetto

const app = express();
app.use(express.json());
app.use(cors());
// Inizializzazione Database (crea il file database.db se non esiste)
const db = new Database('cities.db');

// Creazione tabella Cities
db.exec(`
    CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY, 
        name TEXT NOT NULL,
        province TEXT NOT NULL,
        region TEXT NOT NULL
    )
`);

// --- METODI CRUD ---

// [GET] Tutte le città (con ricerca opzionale per nome)
app.get('/cities', (req, res) => {
    const searchTerm = req.query.name; // Prende il valore da ?name=...

    try {
        let rows;
        if (searchTerm) {
            // Usiamo LIKE con i simboli % per la ricerca parziale
            // Il parametro è passato in modo sicuro per evitare SQL Injection
            const query = db.prepare('SELECT * FROM cities WHERE name LIKE ?');
            rows = query.all(`${searchTerm}%`);
        } else {
            // Se non c'è ricerca, restituisci tutto
            rows = db.prepare('SELECT * FROM cities').all();
        }
        
        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Errore durante la ricerca nel database" });
    }
});

// [GET] Singola città per ID ISTAT
app.get('/cities/:id', (req, res) => {
    const city = db.prepare('SELECT * FROM cities WHERE id = ?').get(req.params.id);
    if (!city) return res.status(404).json({ error: 'Città non trovata' });
    res.json(cities);
});

// [POST] Crea una nuova città
app.post('/cities', (req, res) => {
    const { id, name, province, region } = req.body;

    // Validazione base
    if (!id || !name || !province || !region) {
        return res.status(400).json({ error: 'Tutti i campi (id, name, province, region) sono obbligatori' });
    }

    try {
        const stmt = db.prepare('INSERT INTO cities (id, name, province, region) VALUES (?, ?, ?, ?)');
        stmt.run(id, name, province, region);
        res.status(201).json({ id, name, province, region });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
            return res.status(400).json({ error: 'ID ISTAT già esistente' });
        }
        res.status(500).json({ error: 'Errore interno del server' });
    }
});

// [PUT] Aggiorna una città
app.put('/cities/:id', (req, res) => {
    const { name, province, region } = req.body;
    const { id } = req.params;

    if (!name || !province || !region) {
        return res.status(400).json({ error: 'Dati mancanti per l\'aggiornamento' });
    }

    const info = db.prepare(
        'UPDATE cities SET name = ?, province = ?, region = ? WHERE id = ?'
    ).run(name, province, region, id);

    if (info.changes === 0) return res.status(404).json({ error: 'Città non trovata' });
    res.json({ id: Number(id), name, province, region });
});

// [DELETE] Elimina una città
app.delete('/cities/:id', (req, res) => {
    const info = db.prepare('DELETE FROM cities WHERE id = ?').run(req.params.id);
    
    if (info.changes === 0) return res.status(404).json({ error: 'Città non trovata' });
    res.status(204).send(); // Successo, nessun contenuto da restituire
});

// Avvio server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 API cities pronta su http://localhost:${PORT}`);
    console.log(`📁 Database SQLite attivo (database.db)`);
});