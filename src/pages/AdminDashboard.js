// Uvoz React hook-ova, AuthContext-a i admin komponenti
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import Sidebar from "../components/admin/Sidebar";
import UsersManager from "../components/admin/UsersManager";
import ReservationsManager from "../components/admin/ReservationsManager";
import MessagesManager from "../components/admin/MessagesManager";
import CarsManager from "../components/admin/CarsManager";
import ServicesManager from "../components/admin/ServicesManager";
import StatsPanel from "../components/admin/StatsPanel";
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  // Scroll na vrh pri otvaranju dashboarda
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Dohvatanje korisnika iz AuthContext-a
  const { user } = useContext(AuthContext);

  // Stanje za trenutno aktivnu admin sekciju (tab)
  const [activeTab, setActiveTab] = useState('users');
  // Stanje za prikaz kratke poruke (toast)
  const [toast, setToast] = useState("");

  // Provjera da li je korisnik admin, ako nije prikazuje poruku o zabrani pristupa
  if (!user || user.role !== "admin") {
    return <p>Pristup odbijen</p>;
  }

  // Prikaz admin dashboarda sa sidebarom i odgovarajućim menadžerom na osnovu izabranog taba
  return (
    <div className="admin-dashboard-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="admin-content">
        {activeTab === 'users' && <UsersManager setToast={setToast} />}
        {activeTab === 'reservations' && <ReservationsManager setToast={setToast} />}
        {activeTab === 'messages' && <MessagesManager setToast={setToast} />}
        {activeTab === 'cars' && <CarsManager setToast={setToast} />}
        {activeTab === 'services' && <ServicesManager setToast={setToast} />}
        {activeTab === 'stats' && <StatsPanel />}
      </div>
      {/* Prikaz toast poruke ako postoji */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default AdminDashboard;
