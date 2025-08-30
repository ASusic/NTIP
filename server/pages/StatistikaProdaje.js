const sqlite3 = require('sqlite3').verbose();
const db = require('../db/bob.js');

class StatistikaProdaje {
  static getAll(callback) {
    db.all('SELECT * FROM StatistikaProdaje', [], (err, rows) => {
      callback(err, rows);
    });
  }

  static getById(id, callback) {
    db.get('SELECT * FROM StatistikaProdaje WHERE id = ?', [id], (err, row) => {
      callback(err, row);
    });
  }

  static create(statistika, callback) {
    const { datum, ukupna_prodaja_dan, broj_narudzbi_dan, artikl_id, kolicina_prodata } = statistika;
    db.run(
      `INSERT INTO StatistikaProdaje (datum, ukupna_prodaja_dan, broj_narudzbi_dan, artikl_id, kolicina_prodata)
       VALUES (?, ?, ?, ?, ?)`,
      [datum, ukupna_prodaja_dan, broj_narudzbi_dan, artikl_id, kolicina_prodata],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  }

  static update(id, statistika, callback) {
    const { datum, ukupna_prodaja_dan, broj_narudzbi_dan, artikl_id, kolicina_prodata } = statistika;
    db.run(
      `UPDATE StatistikaProdaje SET datum = ?, ukupna_prodaja_dan = ?, broj_narudzbi_dan = ?, artikl_id = ?, kolicina_prodata = ?
       WHERE id = ?`,
      [datum, ukupna_prodaja_dan, broj_narudzbi_dan, artikl_id, kolicina_prodata, id],
      function (err) {
        callback(err, { changes: this.changes });
      }
    );
  }

  static delete(id, callback) {
    db.run('DELETE FROM StatistikaProdaje WHERE id = ?', [id], function (err) {
      callback(err, { changes: this.changes });
    });
  }
}

module.exports = StatistikaProdaje;
