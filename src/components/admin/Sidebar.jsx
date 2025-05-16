import React from 'react';

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="admin-sidebar">
      <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Korisnici</button>
      <button className={activeTab === 'reservations' ? 'active' : ''} onClick={() => setActiveTab('reservations')}>Rezervacije</button>
      <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>Poruke</button>
      <button className={activeTab === 'cars' ? 'active' : ''} onClick={() => setActiveTab('cars')}>Automobili</button>
      <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>Usluge</button>
      <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>Statistika</button>
    </aside>
  );
}

export default Sidebar;