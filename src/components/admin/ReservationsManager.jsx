import React, { useEffect, useState } from 'react';

function ReservationsManager() {
  const [rezervacije, setRezervacije] = useState([]);

  const fetchRezervacije = () => {
    fetch("http://localhost:3001/rezervacije")
      .then(res => res.json())
      .then(data => setRezervacije(data));
  };

  useEffect(fetchRezervacije, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/rezervacije/${id}`, { method: "DELETE" });
    fetchRezervacije();
  };

  const atributi = [
    { label: "Korisnik", key: "korisnik" },
    { label: "Ime", key: "ime" },
    { label: "Prezime", key: "prezime" },
    { label: "Email", key: "email" },
    { label: "Telefon", key: "telefon" },
    { label: "Usluge", key: "odabraneUsluge" },
    { label: "Datum", key: "datum" },
    { label: "Vrijeme", key: "vrijeme" },
    { label: "Ukupna cijena", key: "ukupna_cijena" },
    { label: "Akcija", key: "akcija" }
  ];

  return (
    <div>
      <h3>Rezervacije</h3>
      <div className="admin-table-wrapper" style={{ overflowX: "auto" }}>
        <table className="admin-table" style={{ minWidth: 600 }}>
          <tbody>
            {atributi.map(attr => (
              <tr key={attr.key}>
                <th style={{ textAlign: "left", background: "#f8eaea", minWidth: 120 }}>{attr.label}</th>
                {rezervacije.map(r => (
                  <td key={r.id + attr.key}>
                    {attr.key === "odabraneUsluge"
                      ? (Array.isArray(r.odabraneUsluge) && r.odabraneUsluge.length > 0
                          ? r.odabraneUsluge.map((u, i) => <div key={i}>{u.naziv}</div>)
                          : "-")
                      : attr.key === "akcija"
                        ? <button className="admin-delete-btn" onClick={() => handleDelete(r.id)}>
                            🗑
                          </button>
                        : r[attr.key]}
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

export default ReservationsManager;