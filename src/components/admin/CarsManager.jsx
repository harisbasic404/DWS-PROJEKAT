import React, { useEffect, useState } from 'react';

function CarsManager() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ naziv: '', godiste: '', cijena: '', opis: '', slika: '' });

  const fetchCars = () => {
    fetch("http://localhost:3001/automobili")
      .then(res => res.json())
      .then(data => setCars(data));
  };

  useEffect(fetchCars, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/automobili/${id}`, { method: "DELETE" });
    fetchCars();
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    const novi = { ...form, id: Math.random().toString(36).slice(2) };
    await fetch("http://localhost:3001/automobili", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novi)
    });
    fetchCars();
    setForm({ naziv: '', godiste: '', cijena: '', opis: '', slika: '' });
  };

  return (
    <div>
      <h3>Automobili</h3>
      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <input name="naziv" placeholder="Naziv" value={form.naziv} onChange={handleChange} required />
        <input name="godiste" placeholder="Godina" value={form.godiste} onChange={handleChange} required />
        <input name="cijena" placeholder="Cijena" value={form.cijena} onChange={handleChange} required />
        <input name="opis" placeholder="Opis" value={form.opis} onChange={handleChange} required />
        <input name="slika" placeholder="URL slike" value={form.slika} onChange={handleChange} required />
        <button type="submit">Dodaj</button>
      </form>
      <div className="admin-table-wrapper">
        <table className="admin-table" style={{ textAlign: "center", verticalAlign: "middle", width: "100%" }}>
          <thead>
            <tr>
              <th>Naziv</th><th>Godina</th><th>Cijena</th><th>Opis</th><th>Slika</th><th>Akcija</th>
            </tr>
          </thead>
          <tbody>
            {cars.map(c => (
              <tr key={c.id}>
                <td>{c.naziv}</td>
                <td>{c.godiste}</td>
                <td>{c.cijena}</td>
                <td>{c.opis}</td>
                <td><img src={c.slika} alt={c.naziv} style={{ width: 60 }} /></td>
                <td>
                  <button className="admin-delete-btn" onClick={() => handleDelete(c.id)}>
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CarsManager;