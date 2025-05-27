import React, { useEffect, useState } from 'react';

function UsersManager() {
  // Stanja za listu korisnika i formu za dodavanje novog korisnika
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', ime: '', prezime: '', email: '', telefon: '', password: '', role: 'guest' });

  // Dohvatanje svih korisnika sa servera (osim admina)
  const fetchUsers = () => {
    fetch("http://localhost:3001/users")
      .then(res => res.json())
      .then(data => setUsers(data.filter(u => u.username !== "admin")));
  };

  // Prvo učitavanje korisnika
  useEffect(fetchUsers, []);

  // Brisanje korisnika po ID-u
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Obrisati korisnika?")) return;
    await fetch(`http://localhost:3001/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  // Ažuriranje forme pri promjeni inputa
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Dodavanje novog korisnika
  const handleAdd = async e => {
    e.preventDefault();
    const novi = { ...form, id: Math.random().toString(36).slice(2) };
    await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novi)
    });
    fetchUsers();
    setForm({ username: '', ime: '', prezime: '', email: '', telefon: '', password: '', role: 'guest' });
  };

  // Definicija atributa za prikaz u tabeli
  const atributi = [
    { label: "Username", key: "username" },
    { label: "Ime", key: "ime" },
    { label: "Prezime", key: "prezime" },
    { label: "Email", key: "email" },
    { label: "Telefon", key: "telefon" },
    { label: "Uloga", key: "role" },
    { label: "Akcija", key: "akcija" }
  ];

  return (
    <div>
      <h3>Korisnici</h3>
      {/* Forma za dodavanje novog korisnika */}
      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="ime" placeholder="Ime" value={form.ime} onChange={handleChange} required />
        <input name="prezime" placeholder="Prezime" value={form.prezime} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="telefon" placeholder="Telefon" value={form.telefon} onChange={handleChange} required />
        <input name="password" placeholder="Lozinka" value={form.password} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="guest">Gost</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Dodaj</button>
      </form>
      {/* Tabela sa svim korisnicima i opcijom brisanja */}
      <div className="admin-table-wrapper">
        <table className="admin-table" style={{ minWidth: 1200 }}>
          <tbody>
            {atributi.map(attr => (
              <tr key={attr.key}>
                <th style={{ textAlign: "left", background: "#f8eaea" }}>{attr.label}</th>
                {users.map((u, idx) => (
                  <td key={attr.key + '-' + (u.id ?? idx)}>
                    {attr.key === "akcija"
                      ? <button className="admin-delete-btn" onClick={() => handleDeleteUser(u.id)}>
                          🗑
                        </button>
                      : u[attr.key]}
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

export default UsersManager;