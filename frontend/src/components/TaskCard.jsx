import { ArrowsClockwise, CalendarBlank, CheckCircle, DotsSixVertical, Flag } from "@phosphor-icons/react";

const priorityLabels = { low: "Baja", medium: "Media", high: "Alta" };

export function TaskCard({ task, onEdit, onMove, selectable = false, selected = false, onSelect }) {
  // selectable se usa únicamente durante la limpieza de completadas; en ese
  // modo hacer click selecciona en vez de abrir el modal.
  const complete = task.status === "completed";
  function openWithKeyboard(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (selectable) onSelect(); else onEdit(task);
    }
  }
  return <article className={`task-card ${complete ? "task-card--complete" : ""} ${selected ? "task-card--selected" : ""}`} onClick={() => selectable ? onSelect() : onEdit(task)} onKeyDown={openWithKeyboard} role="button" tabIndex="0" aria-pressed={selectable ? selected : undefined}>{selectable && <input className="task-select" type="checkbox" checked={selected} onChange={onSelect} onClick={(event) => event.stopPropagation()} aria-label={`Seleccionar ${task.title}`} />}<div className="task-card__title"><DotsSixVertical size={20} /><div><h3>{task.title}</h3><p>{task.description}</p></div>{complete && <CheckCircle className="complete-icon" weight="fill" size={22} />}</div><div className="task-card__meta"><span className="tag" style={{ "--tag": task.category.color }}>{task.category.name}</span><span className={`priority priority--${task.priority}`}><Flag size={15} weight="fill" />{priorityLabels[task.priority]}</span><span><CalendarBlank size={15} />{new Date(`${task.dueDate.slice(0, 10)}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}</span>{task.recurrence?.enabled && <span className="recurrence-badge"><ArrowsClockwise />Recurrente</span>}</div>{!complete && <button className="task-card__advance" onClick={(event) => { event.stopPropagation(); onMove(task); }}>{task.status === "pending" ? "Comenzar" : "Completar"}</button>}</article>;
}
