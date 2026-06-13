import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, SpinnerGap, WarningCircle } from "@phosphor-icons/react";
import { api } from "../api.js";
import { AuthShell } from "../components/AuthShell.jsx";

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const [state, setState] = useState({ loading: true, error: "" });
  useEffect(() => { api("/auth/verify-email", { method: "POST", body: JSON.stringify({ token: params.get("token") }) }).then(() => setState({ loading: false, error: "" })).catch((err) => setState({ loading: false, error: err.message })); }, [params]);
  return <AuthShell eyebrow="Activación de cuenta" title="Verificación de correo" subtitle="Protegemos tu cuenta antes del primer ingreso.">
    <div className="verify-state">{state.loading ? <><SpinnerGap className="spin" size={42} /><p>Verificando enlace…</p></> : state.error ? <><WarningCircle size={42} /><p>{state.error}</p></> : <><CheckCircle size={42} weight="fill" /><p>Tu correo fue verificado correctamente.</p><Link className="button button--primary" to="/login">Ir al inicio de sesión</Link></>}</div>
  </AuthShell>;
}
