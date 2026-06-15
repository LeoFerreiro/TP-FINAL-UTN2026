// Campo reutilizable para formularios de auth. Centraliza label, input y error.
export function FormField({ label, error, ...props }) {
  return <label className="field"><span>{label}</span><input {...props} />{error && <small>{error}</small>}</label>;
}
