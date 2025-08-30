const db = require('../db/bob.js');

class Kosarica {
  // Dohvati sve unose iz košarice
  static getAll(callback) {
    db.all('SELECT * FROM Kosarica', callback);
  }

  // Dohvati unos po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Kosarica WHERE id = ?', [id], callback);
  }

  // Dodaj artikl u košaricu
  static add(korisnik_id, artikl_id, kolicina, callback) {
    const q = 'INSERT INTO Kosarica (korisnik_id, artikl_id, kolicina) VALUES (?, ?, ?)';
    db.run(q, [korisnik_id, artikl_id, kolicina], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriraj količinu artikla u košarici
  static updateById(id, korisnik_id, artikl_id, kolicina, callback) {
    const q = 'UPDATE Kosarica SET korisnik_id = ?, artikl_id = ?, kolicina = ? WHERE id = ?';
    db.run(q, [korisnik_id, artikl_id, kolicina, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Obriši unos iz košarice
  static deleteById(id, callback) {
    db.run('DELETE FROM Kosarica WHERE id = ?', [id], function (err) {
      callback(err, this.changes);
    });
  }

  // Dohvati sve artikle u košarici za jednog korisnika
  static getByUserId(korisnik_id, callback) {
    const q = `
      SELECT k.id, k.korisnik_id, k.artikl_id, k.kolicina, a.naziv, a.cijena
      FROM Kosarica k
      JOIN Artikli a ON k.artikl_id = a.id
      WHERE k.korisnik_id = ?
    `;
    db.all(q, [korisnik_id], callback);
  }

  // Obriši sve unose iz košarice za jednog korisnika
  static clearByUserId(korisnik_id, callback) {
    db.run('DELETE FROM Kosarica WHERE korisnik_id = ?', [korisnik_id], function (err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Kosarica;
