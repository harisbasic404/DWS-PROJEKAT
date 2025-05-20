const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const DB_FILE = 'db.json';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

app.post('/rezervacije', (req, res) => {
  const novaRezervacija = req.body;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const rezervacije = db.rezervacije || [];

  // Provjeri da li već postoji rezervacija za isti dan i isto vrijeme
  const postoji = rezervacije.some(r =>
    r.datum === novaRezervacija.datum && r.vrijeme === novaRezervacija.vrijeme
  );

  if (postoji) {
    return res.status(409).json({ poruka: 'Odabrani termin je već zauzet.' });
  }

  // DODAJ OVO:
  novaRezervacija.id = Math.random().toString(36).slice(2);

  rezervacije.push(novaRezervacija);
  db.rezervacije = rezervacije;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');

  res.status(201).json({ poruka: 'Rezervacija spremljena.' });
});

app.post('/users', (req, res) => {
  const noviKorisnik = req.body;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const users = db.users || [];

  // Provjeri da li već postoji korisnik sa istim emailom
  const postoji = users.some(u => u.email === noviKorisnik.email);
  if (postoji) {
    return res.status(409).json({ poruka: 'Korisnik sa tim emailom već postoji.' });
  }

  users.push(noviKorisnik);
  db.users = users;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.status(201).json({ poruka: 'Korisnik uspješno registrovan.' });
});

// GET /users?username=...&email=...
app.get('/users', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let users = db.users || [];
  const { email, username } = req.query;

  if (email) {
    users = users.filter(u => u.email === email);
  }
  if (username) {
    users = users.filter(u => u.username === username);
  }

  res.json(users);
});

// POST /login
app.post('/login', (req, res) => {
  const { email, username, password } = req.body;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const users = db.users || [];
  // ESLint warning: clarify order with parentheses!
  const user = users.find(u =>
    (
      (email && u.email === email) ||
      (username && u.username === username)
    ) &&
    u.password === password
  );
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(401).json({ poruka: 'Pogrešan email/korisničko ime ili lozinka.' });
  }
});

app.post('/poruke', (req, res) => {
  const novaPoruka = req.body;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const poruke = db.poruke || [];

  // Dodaj ID poruci (npr. timestamp ili random)
  novaPoruka.id = Date.now().toString(36);

  poruke.push(novaPoruka);
  db.poruke = poruke;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');

  res.status(201).json({ poruka: 'Poruka uspješno poslana.' });
});

app.get('/rezervacije', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  res.json(db.rezervacije);
});

app.get('/poruke', (req, res) => {
  const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  res.json(db.poruke || []);
});

app.patch('/users/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const { id } = req.params;
  const users = db.users || [];
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ poruka: 'Korisnik nije pronađen.' });
  }
  const updatedUser = { ...users[userIndex], ...req.body };
  users[userIndex] = updatedUser;
  db.users = users;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json(updatedUser);
});

// Dodaj automobil
app.post('/automobili', (req, res) => {
  const noviAuto = req.body;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const automobili = db.automobili || [];
  automobili.push(noviAuto);
  db.automobili = automobili;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.status(201).json({ poruka: 'Automobil dodat.' });
});

app.get('/automobili', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  res.json(db.automobili || []);
});

// Izmjena automobila
app.patch('/automobili/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const automobili = db.automobili || [];
  const idx = automobili.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ poruka: 'Automobil nije pronađen.' });
  automobili[idx] = { ...automobili[idx], ...req.body };
  db.automobili = automobili;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json(automobili[idx]);
});

// Brisanje automobila
app.delete('/automobili/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let automobili = db.automobili || [];
  const novi = automobili.filter(a => a.id !== id);
  if (novi.length === automobili.length) return res.status(404).json({ poruka: 'Automobil nije pronađen.' });
  db.automobili = novi;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json({ poruka: 'Automobil obrisan.' });
});

// Dodaj uslugu
app.post('/servisneUsluge', (req, res) => {
  const novaUsluga = req.body;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const usluge = db.servisneUsluge || [];
  usluge.push(novaUsluga);
  db.servisneUsluge = usluge;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.status(201).json({ poruka: 'Usluga dodana.' });
});

// Izmjena usluge
app.patch('/servisneUsluge/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const usluge = db.servisneUsluge || [];
  const idx = usluge.findIndex(u => String(u.id) === String(id));
  if (idx === -1) return res.status(404).json({ poruka: 'Usluga nije pronađena.' });
  usluge[idx] = { ...usluge[idx], ...req.body };
  db.servisneUsluge = usluge;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json(usluge[idx]);
});

// Brisanje usluge
app.delete('/servisneUsluge/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let usluge = db.servisneUsluge || [];
  const novi = usluge.filter(u => String(u.id) !== String(id));
  if (novi.length === usluge.length) return res.status(404).json({ poruka: 'Usluga nije pronađena.' });
  db.servisneUsluge = novi;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json({ poruka: 'Usluga obrisana.' });
});

app.get('/servisneUsluge', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  res.json(db.servisneUsluge || []);
});

// Brisanje poruke
app.delete('/poruke/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let poruke = db.poruke || [];
  const novi = poruke.filter(p => String(p.id) !== String(id));
  if (novi.length === poruke.length) return res.status(404).json({ poruka: 'Poruka nije pronađena.' });
  db.poruke = novi;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json({ poruka: 'Poruka obrisana.' });
});

// Brisanje rezervacije
app.delete('/rezervacije/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let rezervacije = db.rezervacije || [];
  const novi = rezervacije.filter(r => String(r.id) !== String(id));
  if (novi.length === rezervacije.length) return res.status(404).json({ poruka: 'Rezervacija nije pronađena.' });
  db.rezervacije = novi;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json({ poruka: 'Rezervacija obrisana.' });
});

// Brisanje korisnika
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let users = db.users || [];
  const novi = users.filter(u => String(u.id) !== String(id));
  if (novi.length === users.length) return res.status(404).json({ poruka: 'Korisnik nije pronađen.' });
  db.users = novi;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  res.json({ poruka: 'Korisnik obrisan.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
