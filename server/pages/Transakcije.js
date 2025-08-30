const db = require('../db/bob.js');

class Transakcije {
  // Dohvati sve transakcije
  static getAll(callback) {
    db.all('SELECT * FROM Transakcije', callback);
  }

  // Dohvati transakciju po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Transakcije WHERE id = ?', [id], callback);
  }

  // Dodaj novu transakciju
  static add(narudzba_id, iznos, datum, status, callback) {
    const q = 'INSERT INTO Transakcije (narudzba_id, iznos, datum, status) VALUES (?, ?, ?, ?)';
    db.run(q, [narudzba_id, iznos, datum, status], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriraj transakciju po ID-u
  static updateById(id, narudzba_id, iznos, datum, status, callback) {
    const q = 'UPDATE Transakcije SET narudzba_id = ?, iznos = ?, datum = ?, status = ? WHERE id = ?';
    db.run(q, [narudzba_id, iznos, datum, status, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Obriši transakciju po ID-u
  static deleteById(id, callback) {
    db.run('DELETE FROM Transakcije WHERE id = ?', [id], function (err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Transakcije;
