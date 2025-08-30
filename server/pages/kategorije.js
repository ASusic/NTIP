const db = require('../db/bob.js');

class Kategorije {
  // Dohvati sve kategorije
  static getAll(callback) {
    db.all('SELECT * FROM Kategorije', callback);
  }

  // Dohvati kategoriju po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Kategorije WHERE id = ?', [id], callback);
  }

  // Dodaj novu kategoriju
  static add(naziv, opis, callback) {
    const q = 'INSERT INTO Kategorije (naziv, opis) VALUES (?, ?)';
    db.run(q, [naziv, opis], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriraj kategoriju po ID-u
  static updateById(id, naziv, opis, callback) {
    const q = 'UPDATE Kategorije SET naziv = ?, opis = ? WHERE id = ?';
    db.run(q, [naziv, opis, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Obriši kategoriju po ID-u
  static deleteById(id, callback) {
    db.run('DELETE FROM Kategorije WHERE id = ?', [id], function (err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Kategorije;