const express = require('express');
const Eventi = require('./pages/events');
const Korisnici = require('./pages/korisnici');
const Ulaznice = require('./pages/ulaznice');
const Kategorije = require('./pages/kategorije');
const Komentari = require('./pages/komentari');
const Uposlenici = require('./pages/uposlenici');
const Lokacija = require('./pages/lokacija');

const jwt = require('jsonwebtoken');
const app = express();
const hostname = 'localhost';
const cors = require('cors');
const port = 3000;
app.use(cors());

// Omogućavanje parsiranja JSON tijela
app.use(express.json());

// 1. GET - Dohvati sve događaje
app.get('/events', (req, res) => {
  Eventi.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju evenata.' });
    } else {
      res.json(rows);
    }
  });
});

// 2. GET - Dohvati događaj po ID-u
app.get('/events/:id', (req, res) => {
  const id = req.params.id;  // Dohvati ID iz URL-a
  Eventi.getById(id, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dohvaćanju eventa.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Event nije pronađen.' });
    }
    res.json(row);
  });
});

// 3. POST - Dodaj novi događaj
app.post('/events', (req, res) => {
  const { naziv, opis, vrijeme, datum, lokacija_id, uposlenici_id, cijena } = req.body;

  if (!naziv || !vrijeme || !datum || !lokacija_id || !uposlenici_id || cijena === undefined) {
    return res.status(400).json({ error: 'Svi podaci su obavezni.' });
  }

  Eventi.add(naziv, opis, vrijeme, datum, lokacija_id, uposlenici_id, cijena, (err, lastID) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dodavanju eventa.' });
    }
    res.status(201).json({
      message: 'Event uspješno dodan.',
      id: lastID,
      event: {
        id: lastID,
        naziv,
        opis,
        vrijeme,
        datum,
        lokacija_id,
        uposlenici_id,
        cijena
      }
    });
  });
});


// 4. PUT - Ažuriraj događaj po ID-u

app.put('/events/:id', (req, res) => {
  const id = req.params.id;
  const { naziv, opis, vrijeme, datum, lokacija_id, uposlenici_id, cijena } = req.body;

  if (!naziv || !opis || !vrijeme || !datum || !lokacija_id || !uposlenici_id || cijena === undefined) {
    return res.status(400).json({ error: 'Svi podaci su obavezni.' });
  }

  Eventi.updateById(id, naziv, opis, vrijeme, datum, lokacija_id, uposlenici_id, cijena, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri ažuriranju eventa.' });
    }
    if (changes === 0) {
      return res.status(404).json({ error: 'Event nije pronađen.' });
    }
    res.json({ message: 'Event uspješno ažuriran.' });
  });
});

// 5. DELETE - Briši događaj po ID-u
app.delete('/events/:id', (req, res) => {
  const id = req.params.id;  // Dohvati ID iz URL-a

  Eventi.deleteById(id, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri brisanju eventa.' });
    }
    res.json({ message: 'Event uspješno obrisan.' });
  });
});
//KORISNICI

app.get('/korisnici', (req, res) => {
  Korisnici.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju korisnika.' });
    } else {
      res.json(rows);
    }
  });
});

app.get('/korisnici/:id', (req, res) => {
  const id = req.params.id;
  Korisnici.getById(id, (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju korisnika.' });
    } else if (!row) {
      res.status(404).json({ error: 'Korisnik nije pronađen.' });
    } else {
      res.json(row);
    }
  });
});

app.post('/korisnici', (req, res) => {
  const { email, sifra, username, uloga } = req.body;
  Korisnici.add(email, sifra, username, uloga, (err, id) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dodavanju korisnika.' });
    } else {
      res.status(201).json({ message: 'Korisnik uspješno dodan.', id: id });
    }
  });
});

app.put('/korisnici/:id', (req, res) => {
  const { email, sifra, username, uloga } = req.body;
  const id = req.params.id;
  Korisnici.updateById(id, email, sifra, username, uloga, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri ažuriranju korisnika.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Korisnik nije pronađen za ažuriranje.' });
    } else {
      res.json({ message: 'Korisnik uspješno ažuriran.' });
    }
  });
});

app.delete('/korisnici/:id', (req, res) => {
  const id = req.params.id;
  Korisnici.deleteById(id, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri brisanju korisnika.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Korisnik nije pronađen za brisanje.' });
    } else {
      res.json({ message: 'Korisnik uspješno obrisan.' });
    }
  });
});
//Ulaznice
// Dohvati sve ulaznice
app.get('/ulaznice', (req, res) => {
  Ulaznice.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju ulaznica.' });
    } else {
      res.json(rows);
    }
  });
});

// Dohvati ulaznicu po ID-u
app.get('/ulaznice/:id', (req, res) => {
  const id = req.params.id;
  Ulaznice.getById(id, (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju ulaznice.' });
    } else {
      res.json(row);
    }
  });
});

// Dodaj novu ulaznicu
app.post('/ulaznice', (req, res) => {
  const { broj_ulaznice, cijena, status, korisnik_id, event_id } = req.body;

  console.log('Primljeni podaci:', req.body); // Logirajte cijeli req.body

  if (!event_id || isNaN(event_id)) {
    console.error('Nevažeći event_id:', event_id);
    return res.status(400).json({ error: 'Nevažeći ID eventa' });
  }

  Ulaznice.add(
    broj_ulaznice,
    parseFloat(cijena),
    status,
    parseInt(korisnik_id),
    parseInt(event_id), // Osigurajte da je broj
    (err, lastID) => {
      if (err) {
        console.error('Greška u modelu:', err);
        return res.status(500).json({ error: err.message });
      }

      // Dohvati upravo dodanu ulaznicu za provjeru
      Ulaznice.getById(lastID, (err, ulaznica) => {
        if (err) {
          console.error('Greška pri dohvatu ulaznice:', err);
          return res.status(500).json({ error: 'Greška pri dohvatu ulaznice' });
        }

        console.log('Dodana ulaznica:', ulaznica);
        res.status(201).json({
          message: 'Ulaznica uspješno dodana',
          ulaznica: ulaznica // Vrati cijeli objekt za provjeru
        });
      });
    }
  );
});

// Ažuriraj ulaznicu po ID-u
app.put('/ulaznice/:id', (req, res) => {
  const id = req.params.id;
  const { broj_ulaznice, cijena, status, korisnik_id, event_id } = req.body;
  Ulaznice.updateById(id, broj_ulaznice, cijena, status, korisnik_id, event_id, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri ažuriranju ulaznice.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Ulaznica nije pronađena.' });
    } else {
      res.json({ message: 'Ulaznica uspješno ažurirana.' });
    }
  });
});

// Obriši ulaznicu po ID-u
app.delete('/ulaznice/:id', (req, res) => {
  const id = req.params.id;
  Ulaznice.deleteById(id, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri brisanju ulaznice.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Ulaznica nije pronađena.' });
    } else {
      res.json({ message: 'Ulaznica uspješno obrisana.' });
    }
  });
});
// Dohvati statistiku za event (broj ulaznica i zaradu)
app.get('/ulaznice/stats/:event_id', (req, res) => {
  const event_id = req.params.event_id;
  Ulaznice.getStatsForEvent(event_id, (err, stats) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju statistike.' });
    } else {
      // Ako nema ulaznica, vrati nule umjesto NULL
      const response = {
        total_tickets: stats.total_tickets || 0,
        total_revenue: stats.total_revenue || 0.00
      };
      res.json(response);
    }
  });
});

// Dohvati sve ulaznice za event (opcionalno, za detalje)
app.get('/ulaznice/event/:event_id', (req, res) => {
  const event_id = req.params.event_id;
  Ulaznice.getByEventId(event_id, (err, ulaznice) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju ulaznica.' });
    } else {
      res.json(ulaznice);
    }
  });
});
//Kategorije
// GET - Dohvati sve kategorije
app.get('/kategorije', (req, res) => {
  Kategorije.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju kategorija.' });
    } else {
      res.json(rows);
    }
  });
});

// GET by ID - Dohvati kategoriju po ID-u
app.get('/kategorije/:id', (req, res) => {
  const id = req.params.id;
  Kategorije.getById(id, (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju kategorije.' });
    } else {
      res.json(row);
    }
  });
});

// POST - Dodaj novu kategoriju
app.post('/kategorije', (req, res) => {
  const { vrsta, event_id } = req.body;
  Kategorije.add(vrsta, event_id, (err, lastID) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dodavanju kategorije.' });
    } else {
      res.status(201).json({ message: 'Kategorija dodana.', id: lastID });
    }
  });
});

// PUT - Ažuriraj kategoriju po ID-u
app.put('/kategorije/:id', (req, res) => {
  const id = req.params.id;
  const { vrsta, event_id } = req.body;
  Kategorije.updateById(id, vrsta, event_id, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri ažuriranju kategorije.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Kategorija nije pronađena.' });
    } else {
      res.json({ message: 'Kategorija ažurirana.' });
    }
  });
});

// DELETE - Obriši kategoriju po ID-u
app.delete('/kategorije/:id', (req, res) => {
  const id = req.params.id;
  Kategorije.deleteById(id, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri brisanju kategorije.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Kategorija nije pronađena.' });
    } else {
      res.json({ message: 'Kategorija obrisana.' });
    }
  });
});
//Komentari
// GET - Dohvati sve komentare
app.get('/komentari', (req, res) => {
  Komentari.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju komentara.' });
    } else {
      res.json(rows);
    }
  });
});

// GET by ID - Dohvati komentar po ID-u
app.get('/komentari/:id', (req, res) => {
  const id = req.params.id;
  Komentari.getById(id, (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju komentara.' });
    } else {
      res.json(row);
    }
  });
});

// POST - Dodaj novi komentar
app.post('/komentari', (req, res) => {
  console.log("BODY:", req.body);
  const { opis, ocjena, datum, korisnik_id, event_id } = req.body;

  Komentari.add(opis, ocjena, datum, korisnik_id, event_id, (err, lastID) => {
    if (err) {
      console.error("SQL GREŠKA:", err);
      res.status(500).json({ error: 'Greška pri dodavanju komentara.' });
    } else {
      res.status(201).json({ message: 'Komentar dodan.', id: lastID });
    }
  });
});



// PUT - Ažuriraj komentar po ID-u
app.put('/komentari/:id', (req, res) => {
  const id = req.params.id;
  const { opis, ocjena, datum } = req.body;
  Komentari.updateById(id, opis, ocjena, datum, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri ažuriranju komentara.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Komentar nije pronađen.' });
    } else {
      res.json({ message: 'Komentar ažuriran.' });
    }
  });
});

// DELETE - Obriši komentar po ID-u
app.delete('/komentari/:id', (req, res) => {
  const id = req.params.id;
  Komentari.deleteById(id, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri brisanju komentara.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Komentar nije pronađen.' });
    } else {
      res.json({ message: 'Komentar obrisan.' });
    }
  });
});
// Uposlenici
// GET - Dohvati sve uposlenike
app.get('/uposlenici', (req, res) => {
  Uposlenici.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju uposlenika.' });
    } else {
      res.json(rows);
    }
  });
});

// GET by ID - Dohvati uposlenika po ID-u
app.get('/uposlenici/:id', (req, res) => {
  const id = req.params.id;
  Uposlenici.getById(id, (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju uposlenika.' });
    } else {
      res.json(row);
    }
  });
});

// POST - Dodaj novog uposlenika
app.post('/uposlenici', (req, res) => {
  const { ime, prezime, uloga, kontakt, event_id } = req.body;
  Uposlenici.add(ime, prezime, uloga, kontakt, event_id, (err, lastID) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dodavanju uposlenika.' });
    } else {
      res.status(201).json({ message: 'Uposlenik dodan.', id: lastID });
    }
  });
});

// PUT - Ažuriraj uposlenika po ID-u
app.put('/uposlenici/:id', (req, res) => {
  const id = req.params.id;
  const { ime, prezime, uloga, kontakt, event_id } = req.body;
  Uposlenici.updateById(id, ime, prezime, uloga, kontakt, event_id, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri ažuriranju uposlenika.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Uposlenik nije pronađen.' });
    } else {
      res.json({ message: 'Uposlenik ažuriran.' });
    }
  });
});

// DELETE - Obriši uposlenika po ID-u
app.delete('/uposlenici/:id', (req, res) => {
  const id = req.params.id;
  Uposlenici.deleteById(id, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri brisanju uposlenika.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Uposlenik nije pronađen.' });
    } else {
      res.json({ message: 'Uposlenik obrisan.' });
    }
  });
});
// login
app.post('/login', (req, res) => {
  const { email, sifra } = req.body;

  Korisnici.login(email, sifra, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Neispravni kredencijali' });
    }

    // Kreiranje tokena sa SVIM potrebnim podacima
    const token = jwt.sign(
      {
        id: user.id,           // ID iz baze
        email: user.email,
        username: user.username,
        uloga: user.uloga
      },
      'tajni_kljuc',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        uloga: user.uloga
      }
    });
  });
});


//Lokacije
// GET sve lokacije
app.get('/lokacije', (req, res) => {
  Lokacija.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: 'Greška pri dohvaćanju lokacija.' });
    res.json(rows);
  });
});

// GET po ID
app.get('/lokacije/:id', (req, res) => {
  Lokacija.getById(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ error: 'Greška pri dohvaćanju lokacije.' });
    res.json(row);
  });
});

// POST nova lokacija
app.post('/lokacije', (req, res) => {
  const { naziv, adresa } = req.body;
  Lokacija.add(naziv, adresa, (err, lastID) => {
    if (err) return res.status(500).json({ error: 'Greška pri dodavanju lokacije.' });
    res.status(201).json({ message: 'Lokacija dodana.', id: lastID });
  });
});

// PUT ažuriranje lokacije
app.put('/lokacije/:id', (req, res) => {
  const { naziv, adresa } = req.body;
  Lokacija.updateById(req.params.id, naziv, adresa, (err, changes) => {
    if (err) return res.status(500).json({ error: 'Greška pri ažuriranju lokacije.' });
    if (changes === 0) return res.status(404).json({ error: 'Lokacija nije pronađena.' });
    res.json({ message: 'Lokacija ažurirana.' });
  });
});

// DELETE lokacije
app.delete('/lokacije/:id', (req, res) => {
  Lokacija.deleteById(req.params.id, (err, changes) => {
    if (err) return res.status(500).json({ error: 'Greška pri brisanju lokacije.' });
    if (changes === 0) return res.status(404).json({ error: 'Lokacija nije pronađena.' });
    res.json({ message: 'Lokacija obrisana.' });
  });
});

app.listen(port, () => {
  console.log(`🌐 Server running at http://${hostname}:${port}/`);
});
