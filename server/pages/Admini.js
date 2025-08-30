const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/db');

class Admini {
  static getAll(callback) {
    db.all('SELECT id, ime, email FROM Admini', [], (err, rows) => {
      callback(err, rows);
    });
  }

  static getById(id, callback) {
    db.get('SELECT id, ime, email FROM Admini WHERE id = ?', [id], (err, row) => {
      callback(err, row);
    });
  }

  static getByEmail(email, callback) {
    db.get('SELECT * FROM Admini WHERE email = ?', [email], (err, row) => {
      callback(err, row);
    });
  }

  static create(admin, callback) {
    const { ime, email, lozinka_hash } = admin;
    db.run(
      `INSERT INTO Admini (ime, email, lozinka_hash) VALUES (?, ?, ?)`,
      [ime, email, lozinka_hash],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  }

  static update(id, admin, callback) {
    const { ime, email, lozinka_hash } = admin;
    db.run(
      `UPDATE Admini SET ime = ?, email = ?, lozinka_hash = ? WHERE id = ?`,
      [ime, email, lozinka_hash, id],
      function (err) {
        callback(err, { changes: this.changes });
      }
    );
  }

  static delete(id, callback) {
    db.run('DELETE FROM Admini WHERE id = ?', [id], function (err) {
      callback(err, { changes: this.changes });
    });
  }
}

module.exports = Admini;
