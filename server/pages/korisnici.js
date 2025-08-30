const sqlite3 = require('sqlite3').verbose();
const db = require('../db/bob.js');

class Korisnici {
  static getAll(callback) {
    db.all('SELECT id, ime, prezime, email, telefon, adresa, tip_korisnika, naziv_firme, pib, datum_registracije FROM Korisnici', [], (err, rows) => {
      callback(err, rows);
    });
  }

  static getById(id, callback) {
    db.get('SELECT id, ime, prezime, email, telefon, adresa, tip_korisnika, naziv_firme, pib, datum_registracije FROM Korisnici WHERE id = ?', [id], (err, row) => {
      callback(err, row);
    });
  }

  static getByEmail(email, callback) {
    db.get('SELECT * FROM Korisnici WHERE email = ?', [email], (err, row) => {
      callback(err, row);
    });
  }

  static create(korisnik, callback) {
    const { ime, prezime, email, lozinka_hash, telefon, adresa, tip_korisnika, naziv_firme, pib } = korisnik;
    db.run(
      `INSERT INTO Korisnici (ime, prezime, email, lozinka_hash, telefon, adresa, tip_korisnika, naziv_firme, pib) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ime, prezime, email, lozinka_hash, telefon, adresa, tip_korisnika, naziv_firme, pib],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  }

  static update(id, korisnik, callback) {
    const { ime, prezime, email, lozinka_hash, telefon, adresa, tip_korisnika, naziv_firme, pib } = korisnik;
    db.run(
      `UPDATE Korisnici SET ime = ?, prezime = ?, email = ?, lozinka_hash = ?, telefon = ?, adresa = ?, tip_korisnika = ?, naziv_firme = ?, pib = ? WHERE id = ?`,
      [ime, prezime, email, lozinka_hash, telefon, adresa, tip_korisnika, naziv_firme, pib, id],
      function (err) {
        callback(err, { changes: this.changes });
      }
    );
  }

  static delete(id, callback) {
    db.run('DELETE FROM Korisnici WHERE id = ?', [id], function (err) {
      callback(err, { changes: this.changes });
    });
  }
  static login(email, sifra, callback) {
  const query = 'SELECT * FROM Korisnici WHERE email = ?';
  db.get(query, [email], (err, user) => {
    if (err) {
      return callback(err, null);
    }
    if (!user) {
      return callback(null, null);
    }
    if (user.lozinka_hash === sifra) {
      callback(null, {
        id: user.id,
        ime: user.ime,
        prezime: user.prezime,
        email: user.email,
        telefon: user.telefon,
        adresa: user.adresa,
        tip_korisnika: user.tip_korisnika,
        naziv_firme: user.naziv_firme,
        pib: user.pib,
        datum_registracije: user.datum_registracije
      });
    } else {
      callback(null, null); 
    }
  });
}
}
module.exports = Korisnici;
