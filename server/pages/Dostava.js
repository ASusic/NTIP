const db = require('../db/bob');

class Dostava {
  // Dohvati sve dostave
  static getAll(callback) {
    db.all('SELECT * FROM Dostava', callback);
  }

  // Dohvati dostavu po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Dostava WHERE id = ?', [id], callback);
  }

  // Dodaj novu dostavu
  static add(narudzba_id, adresa, nacin, status, datum_dostave, callback) {
    const q = 'INSERT INTO Dostava (narudzba_id, adresa, nacin, status, datum_dostave) VALUES (?, ?, ?, ?, ?)';
    db.run(q, [narudzba_id, adresa, nacin, status, datum_dostave], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriraj dostavu
  static updateById(id, narudzba_id, adresa, nacin, status, datum_dostave, callback) {
    const q = 'UPDATE Dostava SET narudzba_id = ?, adresa = ?, nacin = ?, status = ?, datum_dostave = ? WHERE id = ?';
    db.run(q, [narudzba_id, adresa, nacin, status, datum_dostave, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Obriši dostavu
  static deleteById(id, callback) {
    db.run('DELETE FROM Dostava WHERE id = ?', [id], function (err) {
      callback(err, this.changes);
    });
  }

  // Dohvati sve dostave za određenu narudžbu
  static getByNarudzbaId(narudzba_id, callback) {
    db.all('SELECT * FROM Dostava WHERE narudzba_id = ?', [narudzba_id], callback);
  }
}

module.exports = Dostava;
