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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('users');
  const [toast, setToast] = useState("");

  if (!user || user.role !== "admin") {
    return <p>Pristup odbijen</p>;
  }

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
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default AdminDashboard;
