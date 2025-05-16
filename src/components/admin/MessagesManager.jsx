import React, { useEffect, useState } from 'react';

function MessagesManager() {
  const [poruke, setPoruke] = useState([]);

  const fetchPoruke = () => {
    fetch("http://localhost:3001/poruke")
      .then(res => res.json())
      .then(data => setPoruke(data));
  };

  useEffect(fetchPoruke, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/poruke/${id}`, { method: "DELETE" });
    fetchPoruke();
  };

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
      <div className="admin-table-wrapper" style={{ overflowX: "auto" }}>
        <table className="admin-table" style={{ minWidth: 600 }}>
          <tbody>
            {atributi.map(attr => (
              <tr key={attr.key}>
                <th style={{ textAlign: "left", background: "#f8eaea", minWidth: 120 }}>{attr.label}</th>
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