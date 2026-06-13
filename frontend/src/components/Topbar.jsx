import { Bell, List, MagnifyingGlass } from "@phosphor-icons/react";

export function Topbar({ user, search, onSearch, onMenu }) {
  return <header className="topbar"><button className="mobile-menu" onClick={onMenu} aria-label="Abrir navegación"><List size={24} /></button><h1>Resumen</h1><label className="search"><MagnifyingGlass size={20} /><input aria-label="Buscar tareas o categorías" value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Buscar tareas, categorías…" /></label><button className="icon-button" aria-label="Notificaciones"><Bell size={22} /><i>3</i></button><div className="profile-chip"><span>{user.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><strong>{user.name}</strong></div></header>;
}
