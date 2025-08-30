const db = require('../db/bob.js');

class Narudzbe {
  // Dohvati sve narudžbe
  static getAll(callback) {
    db.all('SELECT * FROM Narudzbe', callback);
  }

  // Dohvati narudžbu po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Narudzbe WHERE id = ?', [id], callback);
  }

  // Dodaj novu narudžbu (ažurirano za sva polja)
  static add(
    korisnik_id,
    datum_narudzbe,
    ukupna_cijena,
    status,
    nacin_placanja,
    tip_dostave,
    adresa_dostave,
    callback
  ) {
    const q = `
      INSERT INTO Narudzbe (
        korisnik_id,
        datum_narudzbe,
        ukupna_cijena,
        status,
        nacin_placanja,
        tip_dostave,
        adresa_dostave
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(
      q,
      [
        korisnik_id,
        datum_narudzbe,
        ukupna_cijena,
        status,
        nacin_placanja,
        tip_dostave,
        adresa_dostave
      ],
      function(err) {
        callback(err, this.lastID);
      }
    );
  }

  // Ažuriraj narudžbu po ID-u (ažurirano za sva polja)
  static updateById(
    id,
    korisnik_id,
    datum_narudzbe,
    ukupna_cijena,
    status,
    nacin_placanja,
    tip_dostave,
    adresa_dostave,
    callback
  ) {
    const q = `
      UPDATE Narudzbe SET
        korisnik_id = ?,
        datum_narudzbe = ?,
        ukupna_cijena = ?,
        status = ?,
        nacin_placanja = ?,
        tip_dostave = ?,
        adresa_dostave = ?
      WHERE id = ?
    `;
    
    db.run(
      q,
      [
        korisnik_id,
        datum_narudzbe,
        ukupna_cijena,
        status,
        nacin_placanja,
        tip_dostave,
        adresa_dostave,
        id
      ],
      function(err) {
        callback(err, this.changes);
      }
    );
  }

  // Obriši narudžbu po ID-u
  static deleteById(id, callback) {
    db.run('DELETE FROM Narudzbe WHERE id = ?', [id], function(err) {
      callback(err, this.changes);
    });
  }

  // Dohvati narudžbe po korisniku
  static getByKorisnikId(korisnik_id, callback) {
    db.all('SELECT * FROM Narudzbe WHERE korisnik_id = ?', [korisnik_id], callback);
  }
}

module.exports = Narudzbe;