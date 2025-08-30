const Artikli = require('./pages/Artikli');
const Kategorije = require('./pages/Kategorije');
const Narudzbe = require('./pages/Narudzbe');
const Transakcije = require('./pages/Transakcije');
const StatistikaProdaje = require('./pages/StatistikaProdaje');
const StavkeKosarice = require('./pages/StavkeKosarice');
const Admini = require ('./pages/Admini');
const Korisnici = require ('./pages/Korisnici');
const Kosarica = require ('./pages/Kosarica');
const Dostava = require ('./pages/Dostava');
const StavkeNarudzbe = require ('./pages/StavkeNarudzbe');

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const hostname = 'localhost';
const cors = require('cors');
const port = 3000;
app.use(cors());
app.use(express.json());


//Artikli
// 1. GET - Dohvati sve artikle
app.get('/artikli', (req, res) => {
  Artikli.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju artikala.' });
    } else {
      res.json(rows);
    }
  });
});

// 2. GET - Dohvati artikl po ID-u
app.get('/artikli/:id', (req, res) => {
  const id = req.params.id;
  Artikli.getById(id, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dohvaćanju artikla.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Artikl nije pronađen.' });
    }
    res.json(row);
  });
});

// 3. POST - Dodaj novi artikl
app.post('/artikli', (req, res) => {
  const { naziv, opis, cijena, kolicina_na_stanju, kategorija_id, slika_url } = req.body;

  if (!naziv || cijena === undefined || kolicina_na_stanju === undefined || !kategorija_id) {
    return res.status(400).json({ error: 'Obavezna polja nisu popunjena.' });
  }

  Artikli.add(naziv, opis, cijena, kolicina_na_stanju, kategorija_id, slika_url, (err, lastID) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dodavanju artikla.' });
    }
    res.status(201).json({
      message: 'Artikl uspješno dodan.',
      id: lastID,
      artikl: {
        id: lastID,
        naziv,
        opis,
        cijena,
        kolicina_na_stanju,
        kategorija_id,
        slika_url
      }
    });
  });
});

// 4. PUT - Ažuriraj artikl po ID-u
app.put('/artikli/:id', (req, res) => {
  const id = req.params.id;
  const { naziv, opis, cijena, kolicina_na_stanju, kategorija_id, slika_url } = req.body;

  if (!naziv || opis === undefined || cijena === undefined || kolicina_na_stanju === undefined || !kategorija_id) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  Artikli.updateById(id, naziv, opis, cijena, kolicina_na_stanju, kategorija_id, slika_url, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri ažuriranju artikla.' });
    }
    if (changes === 0) {
      return res.status(404).json({ error: 'Artikl nije pronađen.' });
    }
    res.json({ message: 'Artikl uspješno ažuriran.' });
  });
});

// 5. DELETE - Obriši artikl po ID-u
app.delete('/artikli/:id', (req, res) => {
  const id = req.params.id;

  Artikli.deleteById(id, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri brisanju artikla.' });
    }
    if (changes === 0) {
      return res.status(404).json({ error: 'Artikl nije pronađen.' });
    }
    res.json({ message: 'Artikl uspješno obrisan.' });
  });
});

// 1. GET - Dohvati sve kategorije
app.get('/kategorije', (req, res) => {
  Kategorije.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju kategorija.' });
    } else {
      res.json(rows);
    }
  });
});

// 2. GET - Dohvati kategoriju po ID-u
app.get('/kategorije/:id', (req, res) => {
  const id = req.params.id;
  Kategorije.getById(id, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dohvaćanju kategorije.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Kategorija nije pronađena.' });
    }
    res.json(row);
  });
});

// 3. POST - Dodaj novu kategoriju
app.post('/kategorije', (req, res) => {
  const { naziv, opis } = req.body;

  if (!naziv) {
    return res.status(400).json({ error: 'Naziv je obavezan.' });
  }

  Kategorije.add(naziv, opis || '', (err, lastID) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dodavanju kategorije.' });
    }
    res.status(201).json({
      message: 'Kategorija uspješno dodana.',
      id: lastID,
      kategorija: { id: lastID, naziv, opis: opis || '' }
    });
  });
});

// 4. PUT - Ažuriraj kategoriju po ID-u
app.put('/kategorije/:id', (req, res) => {
  const id = req.params.id;
  const { naziv, opis } = req.body;

  if (!naziv) {
    return res.status(400).json({ error: 'Naziv je obavezan.' });
  }

  Kategorije.updateById(id, naziv, opis || '', (err, changes) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri ažuriranju kategorije.' });
    }
    if (changes === 0) {
      return res.status(404).json({ error: 'Kategorija nije pronađena.' });
    }
    res.json({ message: 'Kategorija uspješno ažurirana.' });
  });
});

// 5. DELETE - Obriši kategoriju po ID-u
app.delete('/kategorije/:id', (req, res) => {
  const id = req.params.id;

  Kategorije.deleteById(id, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri brisanju kategorije.' });
    }
    if (changes === 0) {
      return res.status(404).json({ error: 'Kategorija nije pronađena.' });
    }
    res.json({ message: 'Kategorija uspješno obrisana.' });
  });
});
//Narudzbe
// GET sve narudžbe
app.get('/narudzbe', (req, res) => {
  Narudzbe.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju narudžbi.' });
    } else {
      res.json(rows);
    }
  });
});

// GET narudžba po ID-u
app.get('/narudzbe/:id', (req, res) => {
  const id = req.params.id;
  Narudzbe.getById(id, (err, row) => {
    if (err) return res.status(500).json({ error: 'Greška pri dohvaćanju narudžbe.' });
    if (!row) return res.status(404).json({ error: 'Narudžba nije pronađena.' });
    res.json(row);
  });
});

// POST nova narudžba
// POST nova narudžba
app.post('/narudzbe', (req, res) => {
  const { 
    korisnik_id, 
    datum_narudzbe, 
    ukupna_cijena, 
    status, 
    nacin_placanja, 
    tip_dostave, 
    adresa_dostave 
  } = req.body;

  // Validacija obaveznih polja
  if (!korisnik_id || !datum_narudzbe || !ukupna_cijena || !status || 
      !nacin_placanja || !tip_dostave || !adresa_dostave) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  // Validacija statusa
  const validniStatusi = ['u obradi', 'poslano', 'dostavljeno', 'otkazano'];
  if (!validniStatusi.includes(status)) {
    return res.status(400).json({ error: 'Nevažeći status narudžbe.' });
  }

  // Validacija načina plaćanja
  const validniNaciniPlacanja = ['pouzece', 'kartica'];
  if (!validniNaciniPlacanja.includes(nacin_placanja)) {
    return res.status(400).json({ error: 'Nevažeći način plaćanja.' });
  }

  // Validacija tipa dostave
  const validniTipoviDostave = ['standardna', 'brza'];
  if (!validniTipoviDostave.includes(tip_dostave)) {
    return res.status(400).json({ error: 'Nevažeći tip dostave.' });
  }

  Narudzbe.add(
    korisnik_id,
    datum_narudzbe,
    ukupna_cijena,
    status,
    nacin_placanja,
    tip_dostave,
    adresa_dostave,
    (err, lastID) => {
      if (err) {
        console.error('Greška pri dodavanju narudžbe:', err);
        return res.status(500).json({ error: 'Greška pri dodavanju narudžbe.' });
      }
      
      res.status(201).json({
        message: 'Narudžba uspješno dodana.',
        id: lastID
      });
    }
  );
});

// PUT ažuriraj narudžbu
app.put('/narudzbe/:id', (req, res) => {
  const id = req.params.id;
  const { 
    korisnik_id, 
    datum_narudzbe, 
    ukupna_cijena, 
    status, 
    nacin_placanja, 
    tip_dostave, 
    adresa_dostave 
  } = req.body;

  if (!korisnik_id || !datum_narudzbe || !ukupna_cijena || !status || 
      !nacin_placanja || !tip_dostave || !adresa_dostave) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  Narudzbe.updateById(
    id,
    korisnik_id,
    datum_narudzbe,
    ukupna_cijena,
    status,
    nacin_placanja,
    tip_dostave,
    adresa_dostave,
    (err, changes) => {
      if (err) return res.status(500).json({ error: 'Greška pri ažuriranju narudžbe.' });
      if (changes === 0) return res.status(404).json({ error: 'Narudžba nije pronađena.' });
      res.json({ message: 'Narudžba uspješno ažurirana.' });
    }
  );
});

// DELETE narudžba
app.delete('/narudzbe/:id', (req, res) => {
  const id = req.params.id;
  Narudzbe.deleteById(id, (err, changes) => {
    if (err) return res.status(500).json({ error: 'Greška pri brisanju narudžbe.' });
    if (changes === 0) return res.status(404).json({ error: 'Narudžba nije pronađena.' });
    res.json({ message: 'Narudžba uspješno obrisana.' });
  });
});

// GET sve transakcije
app.get('/transakcije', (req, res) => {
  Transakcije.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: 'Greška pri dohvaćanju transakcija.' });
    res.json(rows);
  });
});

// GET transakcija po ID-u
app.get('/transakcije/:id', (req, res) => {
  const id = req.params.id;
  Transakcije.getById(id, (err, row) => {
    if (err) return res.status(500).json({ error: 'Greška pri dohvaćanju transakcije.' });
    if (!row) return res.status(404).json({ error: 'Transakcija nije pronađena.' });
    res.json(row);
  });
});

// POST nova transakcija
app.post('/transakcije', (req, res) => {
  const { narudzba_id, iznos, datum, status } = req.body;  // promijenjeno u "datum"

  const validStatuses = ['placeno', 'na cekanju', 'neuspjelo'];
  if (!narudzba_id || iznos === undefined || !datum || !status) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Nevažeći status transakcije.' });
  }

  Transakcije.add(narudzba_id, iznos, datum, status, (err, lastID) => {
    if (err) return res.status(500).json({ error: 'Greška pri dodavanju transakcije.' });
    res.status(201).json({
      message: 'Transakcija uspješno dodana.',
      id: lastID
    });
  });
});

// PUT ažuriranje transakcije
app.put('/transakcije/:id', (req, res) => {
  const id = req.params.id;
  const { narudzba_id, iznos, datum, status } = req.body;  // promijenjeno u "datum"

  const validStatuses = ['placeno', 'na cekanju', 'neuspjelo'];
  if (!narudzba_id || iznos === undefined || !datum || !status) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Nevažeći status transakcije.' });
  }

  Transakcije.updateById(id, narudzba_id, iznos, datum, status, (err, changes) => {
    if (err) return res.status(500).json({ error: 'Greška pri ažuriranju transakcije.' });
    if (changes === 0) return res.status(404).json({ error: 'Transakcija nije pronađena.' });
    res.json({ message: 'Transakcija uspješno ažurirana.' });
  });
});

// DELETE transakcija
app.delete('/transakcije/:id', (req, res) => {
  const id = req.params.id;
  Transakcije.deleteById(id, (err, changes) => {
    if (err) return res.status(500).json({ error: 'Greška pri brisanju transakcije.' });
    if (changes === 0) return res.status(404).json({ error: 'Transakcija nije pronađena.' });
    res.json({ message: 'Transakcija uspješno obrisana.' });
  });
});



//Kosarica


// GET sve stavke iz košarice
app.get('/kosarica', (req, res) => {
  Kosarica.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: 'Greška pri dohvaćanju košarice.' });
    res.json(rows);
  });
});

// GET po ID-u stavke iz košarice
app.get('/kosarica/:id', (req, res) => {
  const id = req.params.id;
  Kosarica.getById(id, (err, row) => {
    if (err) return res.status(500).json({ error: 'Greška pri dohvaćanju stavke.' });
    if (!row) return res.status(404).json({ error: 'Stavka nije pronađena.' });
    res.json(row);
  });
});

// GET košarica za korisnika
app.get('/kosarica/korisnik/:korisnik_id', (req, res) => {
  const korisnik_id = req.params.korisnik_id;
  Kosarica.getByUserId(korisnik_id, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Greška pri dohvaćanju korisničke košarice.' });
    res.json(rows);
  });
});

// POST dodaj artikl u košaricu
app.post('/kosarica', (req, res) => {
  const { korisnik_id, artikl_id, kolicina } = req.body;

  if (!korisnik_id || !artikl_id || kolicina === undefined) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  Kosarica.add(korisnik_id, artikl_id, kolicina, (err, lastID) => {
    if (err) return res.status(500).json({ error: 'Greška pri dodavanju u košaricu.' });
    res.status(201).json({ message: 'Dodano u košaricu.', id: lastID });
  });
});

// PUT ažuriraj stavku
app.put('/kosarica/:id', (req, res) => {
  const id = req.params.id;
  const { korisnik_id, artikl_id, kolicina } = req.body;

  if (!korisnik_id || !artikl_id || kolicina === undefined) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  Kosarica.updateById(id, korisnik_id, artikl_id, kolicina, (err, changes) => {
    if (err) return res.status(500).json({ error: 'Greška pri ažuriranju košarice.' });
    if (changes === 0) return res.status(404).json({ error: 'Stavka nije pronađena.' });
    res.json({ message: 'Stavka uspješno ažurirana.' });
  });
});

// DELETE stavka iz košarice
app.delete('/kosarica/:id', (req, res) => {
  const id = req.params.id;
  Kosarica.deleteById(id, (err, changes) => {
    if (err) return res.status(500).json({ error: 'Greška pri brisanju stavke.' });
    if (changes === 0) return res.status(404).json({ error: 'Stavka nije pronađena.' });
    res.json({ message: 'Stavka uspješno obrisana.' });
  });
});

// DELETE sve stavke za korisnika
app.delete('/kosarica/korisnik/:korisnik_id', (req, res) => {
  const korisnik_id = req.params.korisnik_id;
  Kosarica.clearByUserId(korisnik_id, (err, changes) => {
    if (err) return res.status(500).json({ error: 'Greška pri brisanju košarice korisnika.' });
    res.json({ message: 'Košarica uspješno ispražnjena.', obrisano: changes });
  });
});

//Dostava

// GET sve dostave
app.get('/dostava', (req, res) => {
  Dostava.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: 'Greška pri dohvaćanju dostava.' });
    res.json(rows);
  });
});

// GET dostava po ID-u
app.get('/dostava/:id', (req, res) => {
  const id = req.params.id;
  Dostava.getById(id, (err, row) => {
    if (err) return res.status(500).json({ error: 'Greška pri dohvaćanju dostave.' });
    if (!row) return res.status(404).json({ error: 'Dostava nije pronađena.' });
    res.json(row);
  });
});

// GET dostave po narudzba_id
app.get('/dostava/narudzba/:narudzba_id', (req, res) => {
  const narudzba_id = req.params.narudzba_id;
  Dostava.getByNarudzbaId(narudzba_id, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Greška pri dohvaćanju dostava.' });
    res.json(rows);
  });
});

// POST dodaj novu dostavu
app.post('/dostava', (req, res) => {
  const { narudzba_id, adresa, nacin, status, datum_dostave } = req.body;

  if (!narudzba_id || !adresa || !nacin || !status || !datum_dostave) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  Dostava.add(narudzba_id, adresa, nacin, status, datum_dostave, (err, lastID) => {
    if (err) return res.status(500).json({ error: 'Greška pri dodavanju dostave.' });
    res.status(201).json({ message: 'Dostava dodana.', id: lastID });
  });
});

// PUT ažuriraj dostavu
app.put('/dostava/:id', (req, res) => {
  const id = req.params.id;
  const { narudzba_id, adresa, nacin, status, datum_dostave } = req.body;

  if (!narudzba_id || !adresa || !nacin || !status || !datum_dostave) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  Dostava.updateById(id, narudzba_id, adresa, nacin, status, datum_dostave, (err, changes) => {
    if (err) return res.status(500).json({ error: 'Greška pri ažuriranju dostave.' });
    if (changes === 0) return res.status(404).json({ error: 'Dostava nije pronađena.' });
    res.json({ message: 'Dostava ažurirana.' });
  });
});

// DELETE dostava po ID-u
app.delete('/dostava/:id', (req, res) => {
  const id = req.params.id;
  Dostava.deleteById(id, (err, changes) => {
    if (err) return res.status(500).json({ error: 'Greška pri brisanju dostave.' });
    if (changes === 0) return res.status(404).json({ error: 'Dostava nije pronađena.' });
    res.json({ message: 'Dostava obrisana.' });
  });
});
//Stavke kosarice
// 1. GET - Dohvati sve stavke kosarice
app.get('/stavkekosarice', (req, res) => {
  StavkeKosarice.getAll((err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dohvaćanju stavki kosarice.' });
    }
    res.json(rows);
  });
});

// 2. GET - Dohvati stavku kosarice po ID-u
app.get('/stavkekosarice/:id', (req, res) => {
  const id = req.params.id;
  StavkeKosarice.getById(id, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dohvaćanju stavke kosarice.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Stavka kosarice nije pronađena.' });
    }
    res.json(row);
  });
});

// 3. POST - Dodaj novu stavku kosarice
app.post('/stavkekosarice', (req, res) => {
  const { kosarica_id, artikl_id, kolicina } = req.body;

  if (!kosarica_id || !artikl_id || kolicina === undefined) {
    return res.status(400).json({ error: 'Obavezna polja nisu popunjena.' });
  }

  StavkeKosarice.create({ kosarica_id, artikl_id, kolicina }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dodavanju stavke kosarice.' });
    }
    res.status(201).json({
      message: 'Stavka kosarice uspješno dodana.',
      id: result.id,
      stavka: { id: result.id, kosarica_id, artikl_id, kolicina },
    });
  });
});

// 4. PUT - Ažuriraj stavku kosarice po ID-u
app.put('/stavkekosarice/:id', (req, res) => {
  const id = req.params.id;
  const { kosarica_id, artikl_id, kolicina } = req.body;

  if (!kosarica_id || !artikl_id || kolicina === undefined) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  StavkeKosarice.update(id, { kosarica_id, artikl_id, kolicina }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri ažuriranju stavke kosarice.' });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Stavka kosarice nije pronađena.' });
    }
    res.json({ message: 'Stavka kosarice uspješno ažurirana.' });
  });
});

// 5. DELETE - Obriši stavku kosarice po ID-u
app.delete('/stavkekosarice/:id', (req, res) => {
  const id = req.params.id;

  StavkeKosarice.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri brisanju stavke kosarice.' });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Stavka kosarice nije pronađena.' });
    }
    res.json({ message: 'Stavka kosarice uspješno obrisana.' });
  });
});

//StatistikaProdaje


// 1. GET - Dohvati sve statistike prodaje
app.get('/statistikaprodaje', (req, res) => {
  StatistikaProdaje.getAll((err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dohvaćanju statistike prodaje.' });
    }
    res.json(rows);
  });
});

// 2. GET - Dohvati statistiku prodaje po ID-u
app.get('/statistikaprodaje/:id', (req, res) => {
  const id = req.params.id;
  StatistikaProdaje.getById(id, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dohvaćanju statistike prodaje.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Statistika prodaje nije pronađena.' });
    }
    res.json(row);
  });
});

// 3. POST - Dodaj novu statistiku prodaje
app.post('/statistikaprodaje', (req, res) => {
  const { datum, ukupna_prodaja_dan, broj_narudzbi_dan, artikl_id, kolicina_prodata } = req.body;

  if (!datum || ukupna_prodaja_dan === undefined || broj_narudzbi_dan === undefined || !artikl_id || kolicina_prodata === undefined) {
    return res.status(400).json({ error: 'Obavezna polja nisu popunjena.' });
  }

  StatistikaProdaje.create({ datum, ukupna_prodaja_dan, broj_narudzbi_dan, artikl_id, kolicina_prodata }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dodavanju statistike prodaje.' });
    }
    res.status(201).json({
      message: 'Statistika prodaje uspješno dodana.',
      id: result.id,
      statistika: { id: result.id, datum, ukupna_prodaja_dan, broj_narudzbi_dan, artikl_id, kolicina_prodata },
    });
  });
});

// 4. PUT - Ažuriraj statistiku prodaje po ID-u
app.put('/statistikaprodaje/:id', (req, res) => {
  const id = req.params.id;
  const { datum, ukupna_prodaja_dan, broj_narudzbi_dan, artikl_id, kolicina_prodata } = req.body;

  if (!datum || ukupna_prodaja_dan === undefined || broj_narudzbi_dan === undefined || !artikl_id || kolicina_prodata === undefined) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  StatistikaProdaje.update(id, { datum, ukupna_prodaja_dan, broj_narudzbi_dan, artikl_id, kolicina_prodata }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri ažuriranju statistike prodaje.' });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Statistika prodaje nije pronađena.' });
    }
    res.json({ message: 'Statistika prodaje uspješno ažurirana.' });
  });
});

// 5. DELETE - Obriši statistiku prodaje po ID-u
app.delete('/statistikaprodaje/:id', (req, res) => {
  const id = req.params.id;

  StatistikaProdaje.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri brisanju statistike prodaje.' });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Statistika prodaje nije pronađena.' });
    }
    res.json({ message: 'Statistika prodaje uspješno obrisana.' });
  });
});
// StavkeNarudze


// 1. GET - Dohvati sve stavke narudzbe
app.get('/stavkenarudzbe', (req, res) => {
  StavkeNarudzbe.getAll((err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dohvaćanju stavki narudžbe.' });
    }
    res.json(rows);
  });
});

// 2. GET - Dohvati stavku narudzbe po ID-u
app.get('/stavkenarudzbe/:id', (req, res) => {
  const id = req.params.id;
  StavkeNarudzbe.getById(id, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dohvaćanju stavke narudžbe.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Stavka narudžbe nije pronađena.' });
    }
    res.json(row);
  });
});

// 3. POST - Dodaj novu stavku narudzbe
app.post('/stavkenarudzbe', (req, res) => {
  const { narudzba_id, artikl_id, kolicina, cijena_po_komadu } = req.body;

  if (!narudzba_id || !artikl_id || kolicina === undefined || cijena_po_komadu === undefined) {
    return res.status(400).json({ error: 'Obavezna polja nisu popunjena.' });
  }

  StavkeNarudzbe.create({ narudzba_id, artikl_id, kolicina, cijena_po_komadu }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dodavanju stavke narudžbe.' });
    }
    res.status(201).json({
      message: 'Stavka narudžbe uspješno dodana.',
      id: result.id,
      stavka: { id: result.id, narudzba_id, artikl_id, kolicina, cijena_po_komadu },
    });
  });
});

// 4. PUT - Ažuriraj stavku narudzbe po ID-u
app.put('/stavkenarudzbe/:id', (req, res) => {
  const id = req.params.id;
  const { narudzba_id, artikl_id, kolicina, cijena_po_komadu } = req.body;

  if (!narudzba_id || !artikl_id || kolicina === undefined || cijena_po_komadu === undefined) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  StavkeNarudzbe.update(id, { narudzba_id, artikl_id, kolicina, cijena_po_komadu }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri ažuriranju stavke narudžbe.' });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Stavka narudžbe nije pronađena.' });
    }
    res.json({ message: 'Stavka narudžbe uspješno ažurirana.' });
  });
});

// 5. DELETE - Obriši stavku narudzbe po ID-u
app.delete('/stavkenarudzbe/:id', (req, res) => {
  const id = req.params.id;

  StavkeNarudzbe.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri brisanju stavke narudžbe.' });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Stavka narudžbe nije pronađena.' });
    }
    res.json({ message: 'Stavka narudžbe uspješno obrisana.' });
  });
});
//Admini


// 1. GET - Dohvati sve admine (bez lozinke)
app.get('/admini', (req, res) => {
  Admini.getAll((err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dohvaćanju admina.' });
    }
    res.json(rows);
  });
});

// 2. GET - Dohvati admina po ID-u (bez lozinke)
app.get('/admini/:id', (req, res) => {
  const id = req.params.id;
  Admini.getById(id, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dohvaćanju admina.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Admin nije pronađen.' });
    }
    res.json(row);
  });
});

// 3. POST - Dodaj novog admina
app.post('/admini', (req, res) => {
  const { ime, email, lozinka_hash } = req.body;

  if (!ime || !email || !lozinka_hash) {
    return res.status(400).json({ error: 'Obavezna polja nisu popunjena.' });
  }

  Admini.create({ ime, email, lozinka_hash }, (err, result) => {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email već postoji.' });
      }
      return res.status(500).json({ error: 'Greška pri dodavanju admina.' });
    }
    res.status(201).json({
      message: 'Admin uspješno dodan.',
      id: result.id,
      admin: { id: result.id, ime, email },
    });
  });
});

// 4. PUT - Ažuriraj admina po ID-u
app.put('/admini/:id', (req, res) => {
  const id = req.params.id;
  const { ime, email, lozinka_hash } = req.body;

  if (!ime || !email || !lozinka_hash) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  Admini.update(id, { ime, email, lozinka_hash }, (err, result) => {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email već postoji.' });
      }
      return res.status(500).json({ error: 'Greška pri ažuriranju admina.' });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Admin nije pronađen.' });
    }
    res.json({ message: 'Admin uspješno ažuriran.' });
  });
});

// 5. DELETE - Obriši admina po ID-u
app.delete('/admini/:id', (req, res) => {
  const id = req.params.id;

  Admini.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri brisanju admina.' });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Admin nije pronađen.' });
    }
    res.json({ message: 'Admin uspješno obrisan.' });
  });
});


//Korisnici

// 1. GET - Dohvati sve korisnike
app.get('/korisnici', (req, res) => {
  Korisnici.getAll((err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dohvaćanju korisnika.' });
    }
    res.json(rows);
  });
});

// 2. GET - Dohvati korisnika po ID-u
app.get('/korisnici/:id', (req, res) => {
  const id = req.params.id;
  Korisnici.getById(id, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri dohvaćanju korisnika.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Korisnik nije pronađen.' });
    }
    res.json(row);
  });
});

// 3. POST - Dodaj novog korisnika
app.post('/korisnici', (req, res) => {
  const {
    ime,
    prezime,
    email,
    lozinka_hash,
    telefon,
    adresa,
    tip_korisnika,
    naziv_firme,
    pib
  } = req.body;

  if (!ime || !prezime || !email || !lozinka_hash || !tip_korisnika) {
    return res.status(400).json({ error: 'Obavezna polja nisu popunjena.' });
  }

  Korisnici.create(
    {
      ime,
      prezime,
      email,
      lozinka_hash,
      telefon,
      adresa,
      tip_korisnika,
      naziv_firme,
      pib
    },
    (err, result) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email već postoji.' });
        }
        return res.status(500).json({ error: 'Greška pri dodavanju korisnika.' });
      }
      res.status(201).json({
        message: 'Korisnik uspješno dodan.',
        id: result.id,
        korisnik: {
          id: result.id,
          ime,
          prezime,
          email,
          telefon,
          adresa,
          tip_korisnika,
          naziv_firme,
          pib
        }
      });
    }
  );
});

// 4. PUT - Ažuriraj korisnika po ID-u
app.put('/korisnici/:id', (req, res) => {
  const id = req.params.id;
  const {
    ime,
    prezime,
    email,
    lozinka_hash,
    telefon,
    adresa,
    tip_korisnika,
    naziv_firme,
    pib
  } = req.body;

  if (!ime || !prezime || !email || !lozinka_hash || !tip_korisnika) {
    return res.status(400).json({ error: 'Sva obavezna polja moraju biti popunjena.' });
  }

  Korisnici.update(
    id,
    {
      ime,
      prezime,
      email,
      lozinka_hash,
      telefon,
      adresa,
      tip_korisnika,
      naziv_firme,
      pib
    },
    (err, result) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email već postoji.' });
        }
        return res.status(500).json({ error: 'Greška pri ažuriranju korisnika.' });
      }
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Korisnik nije pronađen.' });
      }
      res.json({ message: 'Korisnik uspješno ažuriran.' });
    }
  );
});

// 5. DELETE - Obriši korisnika po ID-u
app.delete('/korisnici/:id', (req, res) => {
  const id = req.params.id;

  Korisnici.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Greška pri brisanju korisnika.' });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Korisnik nije pronađen.' });
    }
    res.json({ message: 'Korisnik uspješno obrisan.' });
  });
});
//Login
app.post('/login', (req, res) => {
  const { email, sifra } = req.body;

  Korisnici.login(email, sifra, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Greška na serveru' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Neispravni kredencijali' });
    }

    // Kreiranje JWT tokena sa korisničkim podacima
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        ime: user.ime,
        prezime: user.prezime,
        tip_korisnika: user.tip_korisnika,
        naziv_firme: user.naziv_firme,
        pib: user.pib
      },
      'tajni_kljuc',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
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
      }
    });
  });
});


app.listen(port, () => {
  console.log(`🌐 Server running at http://${hostname}:${port}/`);
});
