const sqlite3 = require('sqlite3').verbose();
const db = require('../db/bob.js');

class StavkeNarudzbe {
  static getAll(callback) {
    db.all('SELECT * FROM StavkeNarudzbe', [], (err, rows) => {
      callback(err, rows);
    });
  }

  static getById(id, callback) {
    db.get('SELECT * FROM StavkeNarudzbe WHERE id = ?', [id], (err, row) => {
      callback(err, row);
    });
  }

  static create(stavka, callback) {
    const { narudzba_id, artikl_id, kolicina, cijena_po_komadu } = stavka;
    db.run(
      `INSERT INTO StavkeNarudzbe (narudzba_id, artikl_id, kolicina, cijena_po_komadu) VALUES (?, ?, ?, ?)`,
      [narudzba_id, artikl_id, kolicina, cijena_po_komadu],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  }

  static update(id, stavka, callback) {
    const { narudzba_id, artikl_id, kolicina, cijena_po_komadu } = stavka;
    db.run(
      `UPDATE StavkeNarudzbe SET narudzba_id = ?, artikl_id = ?, kolicina = ?, cijena_po_komadu = ? WHERE id = ?`,
      [narudzba_id, artikl_id, kolicina, cijena_po_komadu, id],
      function (err) {
        callback(err, { changes: this.changes });
      }
    );
  }

  static delete(id, callback) {
    db.run('DELETE FROM StavkeNarudzbe WHERE id = ?', [id], function (err) {
      callback(err, { changes: this.changes });
    });
  }
}

module.exports = StavkeNarudzbe;
