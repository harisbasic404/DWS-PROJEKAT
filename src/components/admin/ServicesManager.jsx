import React, { useEffect, useState } from 'react';

function ServicesManager() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ naziv: '', cijena: '', kategorija: '', opis: '' });

  const fetchServices = () => {
    fetch("http://localhost:3001/servisneUsluge")
      .then(res => res.json())
      .then(data => setServices(data));
  };

  useEffect(fetchServices, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/servisneUsluge/${id}`, { method: "DELETE" });
    fetchServices();
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    const novi = { ...form, id: Math.random().toString(36).slice(2) };
    await fetch("http://localhost:3001/servisneUsluge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novi)
    });
    fetchServices();
    setForm({ naziv: '', cijena: '', kategorija: '', opis: '' });
  };

  return (
    <div>
      <h3>Usluge</h3>
      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <input name="naziv" placeholder="Naziv" value={form.naziv} onChange={handleChange} required />
        <input name="cijena" placeholder="Cijena" value={form.cijena} onChange={handleChange} required />
        <select
          name="kategorija"
          value={form.kategorija}
          onChange={handleChange}
          required
          style={{ minWidth: 120 }}
        >
          <option value="">Odaberi kategoriju</option>
          <option value="mehanika">Mehanika</option>
          <option value="detailing">Detailing</option>
        </select>
        <input name="opis" placeholder="Opis" value={form.opis} onChange={handleChange} required />
        <button type="submit">Dodaj</button>
      </form>
      <table className="admin-table services-table">
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Cijena</th>
            <th>Kategorija</th>
            <th>Opis</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id}>
              <td>{s.naziv}</td>
              <td>{s.cijena}</td>
              <td>{s.kategorija}</td>
              <td>{s.opis}</td>
              <td>
                <button className="admin-delete-btn" onClick={() => handleDelete(s.id)}>
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServicesManager;