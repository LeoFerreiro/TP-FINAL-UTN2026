import { Lightning } from "@phosphor-icons/react";

export function Brand({ dark = false }) {
  return <div className={`brand ${dark ? "brand--dark" : ""}`}><span className="brand__mark"><Lightning weight="fill" /></span><strong>Impulso</strong></div>;
}
