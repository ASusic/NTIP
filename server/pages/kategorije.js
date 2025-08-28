const db = require('../db/eventim'); 

class Kategorije {

  // Dohvati sve kategorije
  static getAll(callback) {
    db.all('SELECT * FROM Kategorije', callback);
  }

  // Dohvati kategoriju po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Kategorije WHERE id = ?', [id], callback);
  }

  // Dodaj novu kategoriju
  static add(vrsta, event_id, callback) {
    const query = 'INSERT INTO Kategorije (vrsta, event_id) VALUES (?, ?)';
    db.run(query, [vrsta, event_id], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriraj kategoriju po ID-u
  static updateById(id, vrsta, event_id, callback) {
    const query = 'UPDATE Kategorije SET vrsta = ?, event_id = ? WHERE id = ?';
    db.run(query, [vrsta, event_id, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Obriši kategoriju po ID-u
  static deleteById(id, callback) {
    const query = 'DELETE FROM Kategorije WHERE id = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Kategorije;
