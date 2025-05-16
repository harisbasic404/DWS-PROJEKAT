# Budući Klasici

Web aplikacija za auto servis i detailing.

---

## Tehnologije

- React
- React Router
- Material UI (MUI)
- Express (Node.js backend)
- CSS

---

## Prerequisites

- [Node.js](https://nodejs.org/) (preporučena LTS verzija)
- [Git](https://git-scm.com/)

---

## Pokretanje projekta

### 1. Kloniraj repozitorij

```bash
git clone https://github.com/korisnickoime/ime-repozitorija.git
cd ime-repozitorija
```

### 2. Instaliraj zavisnosti

```bash
npm install
```

### 3. Pokreni backend server

U root folderu pokreni:

```bash
node server.js
```

- Backend koristi `Express` i čita/piše podatke iz `db.json`.
- Server će raditi na [http://localhost:3001](http://localhost:3001).

### 4. Pokreni React aplikaciju (frontend)

U drugom terminalu (takođe u root folderu):

```bash
npm start
```

- Frontend će biti dostupan na [http://localhost:3000](http://localhost:3000).

---

## Funkcionalnosti

- Prikaz i rezervacija usluga (mehanika i detailing)
- Prikaz tima i kontakt forma
- Admin panel (za admin korisnike)
- Upravljanje automobilima i korisnicima (admin)
- Responsive dizajn

---

## Napomene

- **node_modules** i **build** folderi se automatski generišu i nisu dio repozitorija.
- Svi podaci (korisnici, rezervacije, automobili, usluge) čuvaju se u `db.json` fajlu.
- Ako želiš resetovati podatke, možeš ručno urediti ili obrisati sadržaj `db.json`.

---

## Prijava kao admin ili gost

- **Admin**
  - Email: `admin@gmail.com`
  - Lozinka: `Admin1234`
- **Gost**
  - Email: `gost@gmail.com`
  - Lozinka: `Gost1234`

---

## Autor

Haris Bašić

---

Ako imaš pitanja ili naiđeš na problem, slobodno otvori issue na GitHub-u!
