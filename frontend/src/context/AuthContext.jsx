import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Se inicializa desde localStorage para mantener la sesión al recargar.
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("impulso_user") || "null"));

  async function login(credentials) {
    // Login guarda token y datos públicos del usuario. El token viaja luego en
    // Authorization: Bearer desde api.js.
    const data = await api("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
    localStorage.setItem("impulso_token", data.token);
    localStorage.setItem("impulso_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function enterDemo() {
    // Modo demo: permite probar la interfaz sin backend ni base de datos.
    const demoUser = { id: "demo", name: "Carlos Mendoza", email: "demo@impulso.app", demo: true };
    localStorage.setItem("impulso_user", JSON.stringify(demoUser));
    setUser(demoUser);
  }

  function logout() {
    localStorage.removeItem("impulso_token");
    localStorage.removeItem("impulso_user");
    setUser(null);
  }

  function updateUser(changes) {
    // Actualiza datos locales del perfil, por ejemplo la foto, sin cerrar sesión.
    const nextUser = { ...user, ...changes };
    localStorage.setItem("impulso_user", JSON.stringify(nextUser));
    setUser(nextUser);
  }

  const value = useMemo(() => ({ user, login, enterDemo, logout, updateUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
