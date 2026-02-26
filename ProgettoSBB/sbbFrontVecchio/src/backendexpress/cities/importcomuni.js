const fs = require('fs');

const escapeSQL = (val) => {
  if (val === null || val === undefined) return "NULL";
  // Raddoppia l'apostrofo per SQL (es: Sant'Angelo -> Sant''Angelo)
  const safeVal = String(val).replace(/'/g, "''");
  return `'${safeVal}'`;
};

/**
 * Genera la query INSERT
 */
const toInsert = (obj) => {
  const table = "cities";
  const columns = "id, name, province, region";
  
  const values = [
    escapeSQL(obj.istat),
    escapeSQL(obj.comune),
    escapeSQL(obj.provincia),
    escapeSQL(obj.regione)
  ].join(", ");

  return `INSERT INTO ${table} (${columns}) VALUES (${values});`;
};
try {
    
    const rawData = fs.readFileSync('comuni.json', 'utf8');
    const json = JSON.parse(rawData);
    let comuni = json.Foglio1;
    comuni.forEach(x=>console.log(toInsert(x)));

} catch (err) {
    console.error("Impossibile leggere il file:", err);
}