const sqlite3 = require('sqlite3').verbose();
const db = require('../db/bob.js');

class StavkeKosarice {
  static getAll(callback) {
    db.all('SELECT * FROM StavkeKosarice', [], (err, rows) => {
      callback(err, rows);
    });
  }

  static getById(id, callback) {
    db.get('SELECT * FROM StavkeKosarice WHERE id = ?', [id], (err, row) => {
      callback(err, row);
    });
  }

  static create(stavka, callback) {
    const { kosarica_id, artikl_id, kolicina } = stavka;
    db.run(
      `INSERT INTO StavkeKosarice (kosarica_id, artikl_id, kolicina) VALUES (?, ?, ?)`,
      [kosarica_id, artikl_id, kolicina],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  }

  static update(id, stavka, callback) {
    const { kosarica_id, artikl_id, kolicina } = stavka;
    db.run(
      `UPDATE StavkeKosarice SET kosarica_id = ?, artikl_id = ?, kolicina = ? WHERE id = ?`,
      [kosarica_id, artikl_id, kolicina, id],
      function (err) {
        callback(err, { changes: this.changes });
      }
    );
  }

  static delete(id, callback) {
    db.run('DELETE FROM StavkeKosarice WHERE id = ?', [id], function (err) {
      callback(err, { changes: this.changes });
    });
  }
}

module.exports = StavkeKosarice;
