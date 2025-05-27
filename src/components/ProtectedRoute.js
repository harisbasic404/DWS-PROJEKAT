import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

// Komponenta za zaštitu ruta - dozvoljava pristup samo prijavljenim korisnicima (i po potrebi određenoj ulozi)
function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  // Ako korisnik nije prijavljen, preusmjeri na login
  if (!user) return <Navigate to="/login" />;
  // Ako je proslijeđena uloga i korisnik nema tu ulogu, preusmjeri na početnu
  if (role && user.role !== role) return <Navigate to="/" />;

  // Inače prikaži child komponentu (dozvoljen pristup)
  return children;
}

export default ProtectedRoute;
