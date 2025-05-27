import React, { useEffect, useState } from 'react';

function MessagesManager() {
  // Stanje za sve poruke
  const [poruke, setPoruke] = useState([]);

  // Dohvatanje svih poruka sa servera
  const fetchPoruke = () => {
    fetch("http://localhost:3001/poruke")
      .then(res => res.json())
      .then(data => setPoruke(data));
  };

  // Učitavanje poruka pri prvom renderu
  useEffect(fetchPoruke, []);

  // Brisanje poruke po ID-u
  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/poruke/${id}`, { method: "DELETE" });
    fetchPoruke();
  };

  // Definicija atributa za prikaz u tabeli
  const atributi = [
    { label: "Korisnik", key: "korisnik" },
    { label: "Ime", key: "ime" },
    { label: "Prezime", key: "prezime" },
    { label: "Email", key: "email" },
    { label: "Poruka", key: "poruka" },
    { label: "Datum", key: "datum" },
    { label: "Akcija", key: "akcija" }
  ];

  return (
    <div>
      <h3>Poruke</h3>
      {/* Tabela sa svim porukama i opcijom brisanja */}
      <div className="admin-table-wrapper">
        <table className="admin-table" style={{ minWidth: 1200 }}>
          <tbody>
            {atributi.map(attr => (
              <tr key={attr.key}>
                <th style={{ textAlign: "left", background: "#f8eaea" }}>{attr.label}</th>
                {poruke.map(p => (
                  <td key={p.id + attr.key}>
                    {attr.key === "akcija"
                      ? <button className="admin-delete-btn" onClick={() => handleDelete(p.id)}>
                          🗑
                        </button>
                      : attr.key === "datum"
                        ? new Date(p.datum).toLocaleString()
                        : p[attr.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MessagesManager;