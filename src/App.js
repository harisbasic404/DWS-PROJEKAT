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

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <Header korisnik={user} onLogout={logout} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/services" element={<Services />} />
          <Route path="/automobili" element={<Automobili />} />

          {/* Admin */}
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <p>Pristup odbijen</p>} />

          {/* Gost */}
          <Route path="/reservation" element={<Reservation />} />
        </Routes>
      </main>
      <ScrollToTop />
      <Footer />
    </Router>
  );
}

export default App;
