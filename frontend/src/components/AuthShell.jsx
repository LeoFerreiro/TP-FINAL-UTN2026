import { Brand } from "./Brand.jsx";

export function AuthShell({ eyebrow, title, subtitle, children }) {
  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Brand dark />
        <div className="auth-visual__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>Organizá tu semana.<br />Avanzá con claridad.</h1>
          <p>Todo lo que necesitás para transformar pendientes en progreso visible.</p>
        </div>
        <div className="auth-progress"><span>Progreso semanal</span><strong>72%</strong><div><i /></div></div>
      </section>
      <section className="auth-form-wrap"><div className="auth-card"><Brand /><h2>{title}</h2><p className="auth-subtitle">{subtitle}</p>{children}</div></section>
    </main>
  );
}
