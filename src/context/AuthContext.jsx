// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // Nuevo estado para el rol
  const [loading, setLoading] = useState(true);

    // Función para actualizar el rol del usuario
  const updateUserRole = (role) => {
    setUserRole(role);
    // Opcional: almacenar en sessionStorage para persistencia
    sessionStorage.setItem('userRole', role);
  };

  useEffect(() => {
    // Recuperar rol de sessionStorage si existe
    const savedRole = sessionStorage.getItem('userRole');
      if (savedRole) {
        setUserRole(savedRole);
      }const storedRole = sessionStorage.getItem('userRole');

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

    async function logout() {
      try {
        await signOut(auth);
        setIsDropdownOpen(false);
        window.location.href = "/CentroMonitoreo"; // Redirigir al home con recarga
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    };

  return (
    <AuthContext.Provider value={{ currentUser, userRole, updateUserRole, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}
