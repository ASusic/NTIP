const db = require('../db/eventim');

class Lokacije {
  // Dohvati sve lokacije
  static getAll(callback) {
    db.all('SELECT * FROM Lokacije', callback);
  }

  // Dohvati lokaciju po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Lokacije WHERE ID = ?', [id], callback);
  }

  // Dodaj novu lokaciju
  static add(naziv, adresa, callback) {
    const query = 'INSERT INTO Lokacije (naziv, adresa) VALUES (?, ?)';
    db.run(query, [naziv, adresa], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriraj lokaciju po ID-u
  static updateById(id, naziv, adresa, callback) {
    const query = 'UPDATE Lokacije SET naziv = ?, adresa = ? WHERE ID = ?';
    db.run(query, [naziv, adresa, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Obriši lokaciju po ID-u
  static deleteById(id, callback) {
    const query = 'DELETE FROM Lokacije WHERE ID = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Lokacije;
