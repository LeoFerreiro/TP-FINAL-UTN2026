import { CheckSquare, Plus, Trash, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { TaskCard } from "./TaskCard.jsx";

const columns = [{ id: "pending", title: "Pendientes" }, { id: "in_progress", title: "En progreso" }, { id: "completed", title: "Completadas" }];

export function KanbanBoard({ tasks, onEdit, onCreate, onMove, onCleanup }) {
  // cleanupMode activa checkboxes solo en Completadas para limpiar historial
  // sin interferir con la edición normal de tarjetas.
  const [cleanupMode, setCleanupMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [cleaning, setCleaning] = useState(false);

  useEffect(() => setSelected((current) => current.filter((id) => tasks.some((task) => task._id === id && task.status === "completed"))), [tasks]);

  function toggleTask(id) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function cleanup(all) {
    // La confirmación evita borrar historial por accidente. onCleanup decide si
    // opera contra el backend real o contra los datos demo locales.
    const amount = all ? tasks.filter((task) => task.status === "completed").length : selected.length;
    if (!amount) return;
    const message = all ? "¿Limpiar todas las tareas completadas? Las series recurrentes relacionadas también se detendrán." : `¿Limpiar ${amount} tarea${amount === 1 ? "" : "s"} seleccionada${amount === 1 ? "" : "s"}? Las recurrencias relacionadas se detendrán.`;
    if (!confirm(message)) return;
    setCleaning(true);
    try {
      await onCleanup(all ? [] : selected, all);
      setSelected([]);
      setCleanupMode(false);
    } finally {
      setCleaning(false);
    }
  }

  return <section className="kanban">{columns.map((column) => { const columnTasks = tasks.filter((task) => task.status === column.id); const completed = column.id === "completed"; return <div className={`kanban-column ${completed && cleanupMode ? "kanban-column--cleanup" : ""}`} key={column.id}><header><h2>{column.title}</h2><span>{columnTasks.length}</span>{completed && columnTasks.length > 0 && <div className="completed-actions">{cleanupMode ? <><button className="column-action" onClick={() => { setCleanupMode(false); setSelected([]); }} disabled={cleaning}><X />Cancelar</button><button className="column-action column-action--danger" onClick={() => cleanup(false)} disabled={!selected.length || cleaning}><Trash />Limpiar ({selected.length})</button><button className="column-action column-action--danger" onClick={() => cleanup(true)} disabled={cleaning}>Todas</button></> : <button className="column-action" onClick={() => setCleanupMode(true)}><CheckSquare />Limpiar tareas</button>}</div>}</header><div className="kanban-column__tasks">{columnTasks.map((task) => <TaskCard key={task._id} task={task} onEdit={onEdit} onMove={onMove} selectable={completed && cleanupMode} selected={selected.includes(task._id)} onSelect={() => toggleTask(task._id)} />)}{columnTasks.length === 0 && <p className="empty-column">No hay tareas en esta columna.</p>}</div>{!completed && <button className="add-inline" onClick={() => onCreate(column.id)}><Plus />Añadir tarea</button>}</div>; })}</section>;
}
