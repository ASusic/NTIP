const db = require('../db/bob.js');

class Artikli {
  // Dohvati sve artikle
  static getAll(callback) {
    db.all('SELECT * FROM Artikli', callback);
  }

  // Dohvati artikl po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Artikli WHERE id = ?', [id], callback);
  }

  // Dodaj novi artikl
  static add(naziv, opis, cijena, kolicina_na_stanju, kategorija_id, slika_url, callback) {
    const query = `
      INSERT INTO Artikli (naziv, opis, cijena, kolicina_na_stanju, kategorija_id, slika_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [naziv, opis, cijena, kolicina_na_stanju, kategorija_id, slika_url], function (err) {
      callback(err, this?.lastID);
    });
  }

  // Ažuriraj artikl po ID-u
  static updateById(id, naziv, opis, cijena, kolicina_na_stanju, kategorija_id, slika_url, callback) {
    const query = `
      UPDATE Artikli
      SET naziv = ?, opis = ?, cijena = ?, kolicina_na_stanju = ?, kategorija_id = ?, slika_url = ?
      WHERE id = ?
    `;
    db.run(query, [naziv, opis, cijena, kolicina_na_stanju, kategorija_id, slika_url, id], function (err) {
      callback(err, this?.changes);
    });
  }

  // Obriši artikl po ID-u
  static deleteById(id, callback) {
    db.run('DELETE FROM Artikli WHERE id = ?', [id], function (err) {
      callback(err, this?.changes);
    });
  }
}

module.exports = Artikli;
