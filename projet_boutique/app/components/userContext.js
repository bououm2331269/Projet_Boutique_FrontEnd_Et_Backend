"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Création du contexte utilisateur
export const UserContext = createContext();

// Fournisseur de contexte utilisateur
export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vérifiez si un utilisateur est stocké dans localStorage au chargement
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData); // Mettre à jour l'état utilisateur
    localStorage.setItem("user", JSON.stringify(userData)); // Persist les données
    console.log("Utilisateur connecté :", userData);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}


// Hook personnalisé pour utiliser le contexte utilisateur
export const useUser = () => {
  return useContext(UserContext);
};
