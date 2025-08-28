const db = require('../db/eventim'); 

class Eventi {
  // Dohvati sve evente
  static getAll(callback) {
    db.all('SELECT * FROM Eventi', callback);
  }

  // Dohvati event po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Eventi WHERE ID = ?', [id], callback);
  }

  // Dodaj novi event (uključujući cijenu)
  static add(naziv, opis, vrijeme, datum, lokacija_id, uposlenici_id, cijena, callback) {
    const query = 'INSERT INTO Eventi (naziv, opis, vrijeme, datum, lokacija_id, uposlenici_id, cijena) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.run(query, [naziv, opis, vrijeme, datum, lokacija_id, uposlenici_id, cijena], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriraj event po ID-u (uključujući cijenu)
  static updateById(id, naziv, opis, vrijeme, datum, lokacija_id, uposlenici_id, cijena, callback) {
    const query = 'UPDATE Eventi SET naziv = ?, opis = ?, vrijeme = ?, datum = ?, lokacija_id = ?, uposlenici_id = ?, cijena = ? WHERE ID = ?';
    db.run(query, [naziv, opis, vrijeme, datum, lokacija_id, uposlenici_id, cijena, id], function(err) {
      callback(err, this.changes);
    });
  }

  // Obriši event po ID-u
  static deleteById(id, callback) {
    const query = 'DELETE FROM Eventi WHERE ID = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }
  // Dohvati ukupan broj i zaradu za event
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


}

module.exports = Eventi;
