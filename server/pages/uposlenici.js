const db = require('../db/eventim');

class Uposlenici {

  // Dohvati sve uposlenike
  static getAll(callback) {
    db.all('SELECT * FROM Uposlenici', callback);
  }

  // Dohvati uposlenika po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Uposlenici WHERE id = ?', [id], callback);
  }

  // Dodaj novog uposlenika
  static add(ime, prezime, uloga, kontakt, event_id, callback) {
    const query = 'INSERT INTO Uposlenici (ime, prezime, uloga, kontakt, event_id) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [ime, prezime, uloga, kontakt, event_id], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriraj uposlenika po ID-u
  static updateById(id, ime, prezime, uloga, kontakt, event_id, callback) {
    const query = 'UPDATE Uposlenici SET ime = ?, prezime = ?, uloga = ?, kontakt = ?, event_id = ? WHERE id = ?';
    db.run(query, [ime, prezime, uloga, kontakt, event_id, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Obriši uposlenika po ID-u
  static deleteById(id, callback) {
    const query = 'DELETE FROM Uposlenici WHERE id = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Uposlenici;
