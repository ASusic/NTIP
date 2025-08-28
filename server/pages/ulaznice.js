const db = require('../db/eventim');

class Ulaznice {

  // Dohvati sve ulaznice
  static getAll(callback) {
    db.all('SELECT * FROM Ulaznice', callback);
  }

  // Dohvati ulaznicu po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Ulaznice WHERE id = ?', [id], callback);
  }

  // Dodaj novu ulaznicu
  static add(broj_ulaznice, cijena, status, korisnik_id, event_id, callback) {
    if (!event_id || isNaN(event_id)) {
      return callback(new Error('Nevažeći event_id'));
    }

    const query = 'INSERT INTO Ulaznice (broj_ulaznice, cijena, status, korisnik_id, event_id) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [broj_ulaznice, cijena, status, korisnik_id, event_id], function (err) {
      if (err) {
        console.error('SQL greška:', err.message);
        return callback(err);
      }
      callback(null, this.lastID);
    });
  }

  // Ažuriraj ulaznicu po ID-u
  static updateById(id, broj_ulaznice, cijena, status, korisnik_id, event_id, callback) {
    const query = 'UPDATE Ulaznice SET broj_ulaznice = ?, cijena = ?, status = ?, korisnik_id = ?, event_id = ? WHERE id = ?';
    db.run(query, [broj_ulaznice, cijena, status, korisnik_id, event_id, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Obriši ulaznicu po ID-u
  static deleteById(id, callback) {
    const query = 'DELETE FROM Ulaznice WHERE id = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }


  static getStatsForEvent(event_id, callback) {
    const query = `
    SELECT 
      COUNT(*) AS total_tickets,
      SUM(cijena) AS total_revenue
    FROM Ulaznice 
    WHERE event_id = ?
  `;
    db.get(query, [event_id], callback);
  }

  
  static getByEventId(event_id, callback) {
    const query = 'SELECT * FROM Ulaznice WHERE event_id = ?';
    db.all(query, [event_id], callback);
  }
}

module.exports = Ulaznice;