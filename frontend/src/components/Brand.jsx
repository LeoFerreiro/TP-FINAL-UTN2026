import { Lightning } from "@phosphor-icons/react";

// Marca visual de la app. El modo dark se usa sobre fondos azules.
export function Brand({ dark = false }) {
  return <div className={`brand ${dark ? "brand--dark" : ""}`}><span className="brand__mark"><Lightning weight="fill" /></span><strong>Impulso</strong></div>;
}
