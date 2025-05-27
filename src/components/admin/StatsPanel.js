import React, { useEffect, useState } from 'react';

function StatsPanel() {
  // Stanje za sve statistike (broj korisnika, rezervacija, poruka, automobila, usluga)
  const [stats, setStats] = useState({
    users: 0, rezervacije: 0, poruke: 0, automobili: 0, usluge: 0
  });

  // Dohvatanje svih statistika sa servera pri prvom renderu
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/users').then(r => r.json()),
      fetch('http://localhost:3001/rezervacije').then(r => r.json()),
      fetch('http://localhost:3001/poruke').then(r => r.json()),
      fetch('http://localhost:3001/automobili').then(r => r.json()),
      fetch('http://localhost:3001/servisneUsluge').then(r => r.json()),
    ]).then(([users, rezervacije, poruke, automobili, usluge]) => {
      setStats({
        users: users.length,
        rezervacije: rezervacije.length,
        poruke: poruke.length,
        automobili: automobili.length,
        usluge: usluge.length
      });
    });
  }, []);

  // Prikaz tabele sa statistikom
  return (
    <div className="stats-table-wrapper">
      <h2>Statistika</h2>
      <table className="admin-table stats-table">
        <tbody>
          <tr>
            <th>Korisnika</th>
            <td>{stats.users}</td>
          </tr>
          <tr>
            <th>Rezervacija</th>
            <td>{stats.rezervacije}</td>
          </tr>
          <tr>
            <th>Poruka</th>
            <td>{stats.poruke}</td>
          </tr>
          <tr>
            <th>Automobila</th>
            <td>{stats.automobili}</td>
          </tr>
          <tr>
            <th>Usluga</th>
            <td>{stats.usluge}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StatsPanel;