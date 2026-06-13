import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { AuthShell } from "../components/AuthShell.jsx";
import { FormField } from "../components/FormField.jsx";

export function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await api("/auth/register", { method: "POST", body: JSON.stringify(form) });
      setRegisteredEmail(form.email);
      setMessage(data.message);
    } catch (err) { setError(err.message); }
  }

  async function resend() {
    setError("");
    try {
      const data = await api("/auth/resend-verification", { method: "POST", body: JSON.stringify({ email: registeredEmail }) });
      setMessage(data.message);
    } catch (err) { setError(err.message); }
  }

  return <AuthShell eyebrow="Empezá hoy" title="Creá tu cuenta" subtitle="Registrate y validá tu correo para comenzar.">
    {message ? <div className="success-box"><strong>¡Cuenta creada!</strong><p>{message}</p><button className="button button--ghost button--full" type="button" onClick={resend}>Reenviar correo</button>{error && <p className="form-error" role="alert">{error}</p>}</div> : <form onSubmit={submit} className="auth-form">
      <FormField label="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <FormField label="Correo electrónico" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <FormField label="Contraseña" type="password" placeholder="8+ caracteres, mayúscula y número" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button--primary button--full">Crear cuenta</button>
    </form>}
    <p className="auth-switch">¿Ya tenés una cuenta? <Link to="/login">Iniciar sesión</Link></p>
  </AuthShell>;
}
