const db = require('../db/eventim');  // Veza na bazu

class Korisnici {

  static getAll(callback) {
    db.all('SELECT * FROM Korisnici', callback);
  }

  static getById(id, callback) {
    db.get('SELECT * FROM Korisnici WHERE ID = ?', [id], callback);
  }

  static add(email, sifra, username, uloga, callback) {
    const query = 'INSERT INTO Korisnici (email, sifra, username, uloga) VALUES (?, ?, ?, ?)';
    db.run(query, [email, sifra, username, uloga], function (err) {
      callback(err, this.lastID);
    });
  }

  static updateById(email, sifra, username, uloga, callback) {
    const query = 'UPDATE Korisnici SET email = ?, sifra = ?, username = ?, uloga= ?';
    db.run(query, [email, sifra, username, uloga], function (err) {
      callback(err, this.changes);
    });
  }

  static deleteById(id, callback) {
    const query = 'DELETE FROM Korisnici WHERE ID = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }

  // Funkcija za login bez bcrypt
  static login(email, sifra, callback) {
    const query = 'SELECT * FROM Korisnici WHERE email = ?';
    db.get(query, [email], (err, user) => {
      if (err) {
        return callback(err, null);
      }
      if (!user) {
        return callback(null, null); // Korisnik ne postoji
      }
  
      // Provjera lozinke (bez hashiranja, samo za testiranje)
      if (user.sifra === sifra) {
        // Vraćamo KOMPLETNE podatke o korisniku
        callback(null, {
          id: user.id,          // Ovo je ključno - ID iz baze
          email: user.email,
          username: user.username,
          uloga: user.uloga
        });
      } else {
        callback(null, null); // Pogrešna lozinka
      }
    });
  }
  
  
}

module.exports = Korisnici;
