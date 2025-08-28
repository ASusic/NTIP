const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'eventim.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Greška pri konekciji na bazu:', err.message);
  } else {
    console.log('✅ Baza konektovana (eventim.db)');
  }
});

module.exports = db;
