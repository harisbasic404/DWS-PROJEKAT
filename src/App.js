import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Reservation from './pages/Reservation';
import AdminDashboard from './pages/AdminDashboard';
import RegisterForm from './components/RegisterForm';
import Profil from './pages/Profil';
import Services from './pages/Services';
import { AuthContext } from './AuthContext';
import Automobili from './pages/Automobili';
import ScrollToTop from './components/ScrollToTop';

// Glavna funkcionalna komponenta aplikacije
function App() {
  // Dohvatanje korisnika i logout funkcije iz AuthContext-a
  const { user, logout } = useContext(AuthContext);

  return (
    // Omotavanje cijele aplikacije u React Router za navigaciju
    <Router>
      {/* Header prikazuje informacije o korisniku i omogućava logout */}
      <Header korisnik={user} onLogout={logout} />
      <main>
        {/* Definisanje svih ruta aplikacije */}
        <Routes>
          {/* Početna stranica */}
          <Route path="/" element={<Home />} />
          {/* Stranica O nama */}
          <Route path="/about" element={<About />} />
          {/* Kontakt stranica */}
          <Route path="/contact" element={<Contact />} />
          {/* Login stranica */}
          <Route path="/login" element={<Login />} />
          {/* Registracija korisnika */}
          <Route path="/register" element={<RegisterForm />} />
          {/* Profil korisnika */}
          <Route path="/profil" element={<Profil />} />
          {/* Servisne usluge */}
          <Route path="/services" element={<Services />} />
          {/* Prikaz automobila */}
          <Route path="/automobili" element={<Automobili />} />

          {/* Admin dashboard - dostupno samo admin korisnicima */}
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <p>Pristup odbijen</p>} />

          {/* Stranica za rezervaciju - dostupna gostima */}
          <Route path="/reservation" element={<Reservation />} />
        </Routes>
      </main>
      {/* Automatski scroll na vrh stranice pri promjeni rute */}
      <ScrollToTop />
      {/* Footer prikazuje informacije na dnu stranice */}
      <Footer />
    </Router>
  );
}

// Izvoz glavne App komponente
export default App;
