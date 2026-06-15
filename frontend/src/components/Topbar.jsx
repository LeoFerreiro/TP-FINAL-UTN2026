import { Bell, Check, List, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

export function Topbar({ title, user, search, onSearch, onMenu, notifications, onOpenTask, onOpenProfile }) {
  // Mantiene estado local de notificaciones leídas. El origen de la lista se
  // calcula en DashboardPage según tareas próximas o vencidas.
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState([]);
  const wrapper = useRef(null);
  const unread = notifications.filter((item) => !read.includes(item.id));

  useEffect(() => {
    // Cierra el menú al hacer click fuera del contenedor.
    function close(event) { if (!wrapper.current?.contains(event.target)) setOpen(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function openNotification(item) {
    // Al abrir una notificación de tarea también abre el modal de edición.
    setRead((current) => current.includes(item.id) ? current : [...current, item.id]);
    setOpen(false);
    if (item.task) onOpenTask(item.task);
  }

  return <header className="topbar"><button className="mobile-menu" onClick={onMenu} aria-label="Abrir navegación"><List size={24} /></button><h1>{title}</h1><label className="search"><MagnifyingGlass size={20} /><input aria-label="Buscar tareas o categorías" value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Buscar tareas, categorías…" /></label><div className="notifications" ref={wrapper}><button className="icon-button" aria-label="Notificaciones" aria-expanded={open} onClick={() => setOpen((value) => !value)}><Bell size={22} />{unread.length > 0 && <i>{unread.length}</i>}</button>{open && <section className="notification-menu"><header><div><strong>Notificaciones</strong><span>{unread.length} sin leer</span></div><button className="icon-button" onClick={() => setOpen(false)} aria-label="Cerrar notificaciones"><X /></button></header>{notifications.length ? <div className="notification-list">{notifications.map((item) => <button key={item.id} className={read.includes(item.id) ? "read" : ""} onClick={() => openNotification(item)}><span className={`notification-dot notification-dot--${item.tone}`} /><div><strong>{item.title}</strong><small>{item.message}</small></div>{read.includes(item.id) && <Check />}</button>)}</div> : <p className="notification-empty">No tenés novedades.</p>}<footer><button onClick={() => setRead(notifications.map((item) => item.id))}>Marcar todas como leídas</button></footer></section>}</div><button className="profile-chip profile-chip--button" onClick={onOpenProfile}>{user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <span>{user.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>}<strong>{user.name}</strong></button></header>;
}
