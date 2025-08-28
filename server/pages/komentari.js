const db = require('../db/eventim'); 

class Komentari {

  // Dohvati sve komentare
  static getAll(callback) {
    db.all('SELECT * FROM Komentari', callback);
  }

  // Dohvati komentar po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Komentari WHERE id = ?', [id], callback);
  }

  // Dodaj novi komentar
  static add(opis, ocjena, datum, korisnik_id, event_id, callback) {
    const query = 'INSERT INTO Komentari (opis, ocjena, datum, korisnik_id, event_id) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [opis, ocjena, datum, korisnik_id, event_id], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriraj komentar po ID-u
  static updateById(id, opis, ocjena, datum, callback) {
    const query = 'UPDATE Komentari SET opis = ?, ocjena = ?, datum = ? WHERE id = ?';
    db.run(query, [opis, ocjena, datum, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Obriši komentar po ID-u
  static deleteById(id, callback) {
    const query = 'DELETE FROM Komentari WHERE id = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Komentari;
