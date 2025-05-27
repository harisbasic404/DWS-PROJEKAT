// Uvoz potrebnih modula
const express = require('express'); // Express framework za backend server
const fs = require('fs'); // Modul za rad sa fajlovima
const cors = require('cors'); // Middleware za omogućavanje CORS-a
const path = require('path'); // Modul za rad sa putanjama
const app = express(); // Kreiranje Express aplikacije
const DB_FILE = 'db.json'; // Putanja do baze podataka (JSON fajl)

// Middleware za omogućavanje CORS-a
app.use(cors());
// Middleware za parsiranje JSON tijela zahtjeva
app.use(express.json());
// Middleware za serviranje statičkih fajlova iz 'build' direktorija (frontend)
app.use(express.static(path.join(__dirname, 'build')));

// Ruta za kreiranje nove rezervacije
app.post('/rezervacije', (req, res) => {
  const novaRezervacija = req.body; // Preuzima podatke o novoj rezervaciji iz tijela zahtjeva
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); // Učitava bazu iz fajla
  const rezervacije = db.rezervacije || []; // Dohvata sve rezervacije ili prazan niz

  // Provjerava da li već postoji rezervacija za isti datum i vrijeme
  const postoji = rezervacije.some(r =>
    r.datum === novaRezervacija.datum && r.vrijeme === novaRezervacija.vrijeme
  );

  // Ako postoji, vraća grešku 409 (konflikt)
  if (postoji) {
    return res.status(409).json({ poruka: 'Odabrani termin je već zauzet.' });
  }

  // Dodjeljuje jedinstveni ID novoj rezervaciji
  novaRezervacija.id = Math.random().toString(36).slice(2);

  // Dodaje novu rezervaciju u niz i sprema u bazu
  rezervacije.push(novaRezervacija);
  db.rezervacije = rezervacije;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');

  // Vraća uspješan odgovor
  res.status(201).json({ poruka: 'Rezervacija spremljena.' });
});

// Ruta za registraciju novog korisnika
app.post('/users', (req, res) => {
  const noviKorisnik = req.body; // Preuzima podatke o korisniku iz tijela zahtjeva
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); // Učitava bazu
  const users = db.users || []; // Dohvata sve korisnike ili prazan niz

  // Provjerava da li već postoji korisnik sa istim emailom
  const postoji = users.some(u => u.email === noviKorisnik.email);
  if (postoji) {
    return res.status(409).json({ poruka: 'Korisnik sa tim emailom već postoji.' });
  }

  // Dodaje novog korisnika i sprema u bazu
  users.push(noviKorisnik);
  db.users = users;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.status(201).json({ poruka: 'Korisnik uspješno registrovan.' });
});

// Ruta za dohvatanje korisnika (filtriranje po emailu i/ili username-u)
app.get('/users', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let users = db.users || [];
  const { email, username } = req.query;

  // Filtrira korisnike po emailu ako je proslijeđen
  if (email) {
    users = users.filter(u => u.email === email);
  }
  // Filtrira korisnike po username-u ako je proslijeđen
  if (username) {
    users = users.filter(u => u.username === username);
  }

  // Vraća filtrirane korisnike
  res.json(users);
});

// Ruta za login korisnika
app.post('/login', (req, res) => {
  const { email, username, password } = req.body; // Preuzima podatke za login
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const users = db.users || [];
  // Pronalazi korisnika po emailu ili username-u i provjerava lozinku
  const user = users.find(u =>
    (
      (email && u.email === email) ||
      (username && u.username === username)
    ) &&
    u.password === password
  );
  if (user) {
    // Uspješan login, vraća korisnika bez lozinke
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    // Neuspješan login
    res.status(401).json({ poruka: 'Pogrešan email/korisničko ime ili lozinka.' });
  }
});

// Ruta za slanje nove poruke
app.post('/poruke', (req, res) => {
  const novaPoruka = req.body; // Preuzima podatke o poruci
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const poruke = db.poruke || [];

  // Dodjeljuje jedinstveni ID poruci
  novaPoruka.id = Date.now().toString(36);

  // Dodaje poruku i sprema u bazu
  poruke.push(novaPoruka);
  db.poruke = poruke;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');

  // Vraća uspješan odgovor
  res.status(201).json({ poruka: 'Poruka uspješno poslana.' });
});

// Ruta za dohvatanje svih rezervacija
app.get('/rezervacije', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  res.json(db.rezervacije);
});

// Ruta za dohvatanje svih poruka
app.get('/poruke', (req, res) => {
  const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  res.json(db.poruke || []);
});

// Ruta za izmjenu korisnika po ID-u
app.patch('/users/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const { id } = req.params;
  const users = db.users || [];
  // Pronalazi indeks korisnika po ID-u
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    // Ako korisnik nije pronađen, vraća grešku
    return res.status(404).json({ poruka: 'Korisnik nije pronađen.' });
  }
  // Ažurira podatke korisnika
  const updatedUser = { ...users[userIndex], ...req.body };
  users[userIndex] = updatedUser;
  db.users = users;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json(updatedUser);
});

// Ruta za dodavanje novog automobila
app.post('/automobili', (req, res) => {
  const noviAuto = req.body; // Preuzima podatke o automobilu
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const automobili = db.automobili || [];
  automobili.push(noviAuto); // Dodaje automobil
  db.automobili = automobili;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.status(201).json({ poruka: 'Automobil dodat.' });
});

// Ruta za dohvatanje svih automobila
app.get('/automobili', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  res.json(db.automobili || []);
});

// Ruta za izmjenu automobila po ID-u
app.patch('/automobili/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const automobili = db.automobili || [];
  // Pronalazi indeks automobila po ID-u
  const idx = automobili.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ poruka: 'Automobil nije pronađen.' });
  // Ažurira podatke automobila
  automobili[idx] = { ...automobili[idx], ...req.body };
  db.automobili = automobili;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json(automobili[idx]);
});

// Ruta za brisanje automobila po ID-u
app.delete('/automobili/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let automobili = db.automobili || [];
  // Filtrira automobile i izbacuje onaj sa datim ID-om
  const novi = automobili.filter(a => a.id !== id);
  if (novi.length === automobili.length) return res.status(404).json({ poruka: 'Automobil nije pronađen.' });
  db.automobili = novi;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json({ poruka: 'Automobil obrisan.' });
});

// Ruta za dodavanje nove servisne usluge
app.post('/servisneUsluge', (req, res) => {
  const novaUsluga = req.body; // Preuzima podatke o usluzi
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const usluge = db.servisneUsluge || [];
  usluge.push(novaUsluga); // Dodaje uslugu
  db.servisneUsluge = usluge;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.status(201).json({ poruka: 'Usluga dodana.' });
});

// Ruta za izmjenu servisne usluge po ID-u
app.patch('/servisneUsluge/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const usluge = db.servisneUsluge || [];
  // Pronalazi indeks usluge po ID-u
  const idx = usluge.findIndex(u => String(u.id) === String(id));
  if (idx === -1) return res.status(404).json({ poruka: 'Usluga nije pronađena.' });
  // Ažurira podatke usluge
  usluge[idx] = { ...usluge[idx], ...req.body };
  db.servisneUsluge = usluge;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json(usluge[idx]);
});

// Ruta za brisanje servisne usluge po ID-u
app.delete('/servisneUsluge/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let usluge = db.servisneUsluge || [];
  // Filtrira usluge i izbacuje onu sa datim ID-om
  const novi = usluge.filter(u => String(u.id) !== String(id));
  if (novi.length === usluge.length) return res.status(404).json({ poruka: 'Usluga nije pronađena.' });
  db.servisneUsluge = novi;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json({ poruka: 'Usluga obrisana.' });
});

// Ruta za dohvatanje svih servisnih usluga
app.get('/servisneUsluge', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  res.json(db.servisneUsluge || []);
});

// Ruta za brisanje poruke po ID-u
app.delete('/poruke/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let poruke = db.poruke || [];
  // Filtrira poruke i izbacuje onu sa datim ID-om
  const novi = poruke.filter(p => String(p.id) !== String(id));
  if (novi.length === poruke.length) return res.status(404).json({ poruka: 'Poruka nije pronađena.' });
  db.poruke = novi;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json({ poruka: 'Poruka obrisana.' });
});

// Ruta za brisanje rezervacije po ID-u
app.delete('/rezervacije/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let rezervacije = db.rezervacije || [];
  // Filtrira rezervacije i izbacuje onu sa datim ID-om
  const novi = rezervacije.filter(r => String(r.id) !== String(id));
  if (novi.length === rezervacije.length) return res.status(404).json({ poruka: 'Rezervacija nije pronađena.' });
  db.rezervacije = novi;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json({ poruka: 'Rezervacija obrisana.' });
});

// Ruta za brisanje korisnika po ID-u
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let users = db.users || [];
  // Filtrira korisnike i izbacuje onog sa datim ID-om
  const novi = users.filter(u => String(u.id) !== String(id));
  if (novi.length === users.length) return res.status(404).json({ poruka: 'Korisnik nije pronađen.' });
  db.users = novi;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json({ poruka: 'Korisnik obrisan.' });
});

// Ruta za sve ostale GET zahtjeve - vraća frontend aplikaciju (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Pokretanje servera na portu 3001
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
