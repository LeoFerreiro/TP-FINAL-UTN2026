import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/AuthShell.jsx";
import { FormField } from "../components/FormField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function LoginPage() {
  // Maneja el formulario de login y delega la sesión al AuthContext.
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, enterDemo } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault(); setLoading(true); setError("");
    try { await login(form); navigate("/"); } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  function demo() { enterDemo(); navigate("/"); }

  return <AuthShell eyebrow="Tu espacio de productividad" title="Bienvenido de nuevo" subtitle="Ingresá para continuar organizando tus objetivos.">
    <form onSubmit={submit} className="auth-form">
      <FormField label="Correo electrónico" type="email" placeholder="nombre@correo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <FormField label="Contraseña" type="password" placeholder="Tu contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button--primary button--full" disabled={loading}>{loading ? "Ingresando…" : "Iniciar sesión"}</button>
      <button className="button button--ghost button--full" type="button" onClick={demo}>Explorar modo demo</button>
    </form>
    <p className="auth-switch">¿Todavía no tenés cuenta? <Link to="/registro">Crear cuenta</Link></p>
  </AuthShell>;
}
