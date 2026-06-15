import { CalendarBlank, ChartPieSlice, Folder, SignOut, Target, UserCircle } from "@phosphor-icons/react";
import { Brand } from "./Brand.jsx";

const items = [[ChartPieSlice, "Resumen"], [Target, "Tareas"], [Folder, "Categorías"], [CalendarBlank, "Calendario"], [UserCircle, "Perfil"]];

export function Sidebar({ active, onNavigate, onLogout }) {
  return <aside className="sidebar"><Brand dark /><nav aria-label="Navegación principal">{items.map(([Icon, label]) => <button key={label} className={active === label ? "active" : ""} onClick={() => onNavigate(label)}><Icon size={22} /><span>{label}</span></button>)}</nav><div className="sidebar__motivation"><Target size={26} /><div><strong>Mantené el impulso</strong><span>¡Vos podés lograrlo!</span></div></div><button className="sidebar__logout" onClick={onLogout}><SignOut size={21} /><span>Cerrar sesión</span></button></aside>;
}
