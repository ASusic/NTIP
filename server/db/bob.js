const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'bob.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Greška pri konekciji na bazu:', err.message);
  } else {
    console.log('✅ Baza konektovana (bob.db)');
  }
});

module.exports = db;