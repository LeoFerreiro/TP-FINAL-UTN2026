import { ArrowsClockwise, Trash, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const weekdays = [[1, "Lun"], [2, "Mar"], [3, "Mié"], [4, "Jue"], [5, "Vie"], [6, "Sáb"], [0, "Dom"]];
const empty = { title: "", description: "", status: "pending", priority: "medium", dueDate: new Date().toISOString().slice(0, 10), category: "", recurrence: { enabled: false, weekdays: [], endDate: "" } };

export function TaskModal({ task, initialStatus, categories, onClose, onSave, onDelete }) {
  // Un mismo modal sirve para crear y editar. Si recibe task, carga sus datos;
  // si no, inicializa un formulario vacío con la categoría disponible.
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  useEffect(() => setForm(task ? { ...task, category: task.category._id, dueDate: task.dueDate.slice(0, 10), recurrence: { enabled: Boolean(task.recurrence?.enabled), weekdays: task.recurrence?.weekdays || [], endDate: task.recurrence?.endDate?.slice(0, 10) || "" } } : { ...empty, recurrence: { ...empty.recurrence }, status: initialStatus || "pending", category: categories[0]?._id || "" }), [task, initialStatus, categories]);

  function toggleDay(day) {
    // Agrega o quita un día de repetición semanal.
    const selected = form.recurrence.weekdays.includes(day);
    setForm({ ...form, recurrence: { ...form.recurrence, weekdays: selected ? form.recurrence.weekdays.filter((item) => item !== day) : [...form.recurrence.weekdays, day] } });
  }

  function submit(event) {
    // Validaciones de UI para dar feedback inmediato antes de enviar al backend.
    event.preventDefault();
    if (form.recurrence.enabled && !form.recurrence.weekdays.length) return setError("Seleccioná al menos un día de repetición");
    if (form.recurrence.enabled && (!form.recurrence.endDate || form.recurrence.endDate < form.dueDate)) return setError("La fecha final debe ser igual o posterior al primer vencimiento");
    const dueWeekday = new Date(`${form.dueDate}T12:00:00`).getDay();
    if (form.recurrence.enabled && !form.recurrence.weekdays.includes(dueWeekday)) return setError("La primera fecha debe coincidir con uno de los días seleccionados");
    setError("");
    onSave({ ...form, recurrence: form.recurrence.enabled ? form.recurrence : { enabled: false, weekdays: [], endDate: "" }, _id: task?._id });
  }

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title"><header><div><p className="eyebrow">{task ? "Editar tarea" : "Nueva tarea"}</p><h2 id="task-modal-title">{task ? task.title : "Sumá un nuevo objetivo"}</h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={22} /></button></header><form onSubmit={submit} className="modal-form"><label className="field field--wide"><span>Título</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required maxLength="120" /></label><label className="field field--wide"><span>Descripción</span><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} maxLength="800" /></label><label className="field"><span>Estado</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="pending">Pendiente</option><option value="in_progress">En progreso</option><option value="completed">Completada</option></select></label><label className="field"><span>Prioridad</span><select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}><option value="low">Baja</option><option value="medium">Media</option><option value="high">Alta</option></select></label><label className="field"><span>Categoría</span><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></label><label className="field"><span>{form.recurrence.enabled ? "Primera fecha" : "Fecha límite"}</span><input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required /></label><section className="recurrence-field field--wide"><label className="recurrence-toggle"><input type="checkbox" checked={form.recurrence.enabled} onChange={(event) => setForm({ ...form, recurrence: { ...form.recurrence, enabled: event.target.checked } })} /><span><ArrowsClockwise />Repetir esta tarea</span></label>{form.recurrence.enabled && <div className="recurrence-options"><p>Al completarla, se creará automáticamente la siguiente ocurrencia.</p><strong>Días de repetición</strong><div className="weekday-picker">{weekdays.map(([day, label]) => <button type="button" key={day} className={form.recurrence.weekdays.includes(day) ? "active" : ""} onClick={() => toggleDay(day)} aria-pressed={form.recurrence.weekdays.includes(day)}>{label}</button>)}</div><label className="field"><span>Repetir hasta</span><input type="date" min={form.dueDate} value={form.recurrence.endDate} onChange={(event) => setForm({ ...form, recurrence: { ...form.recurrence, endDate: event.target.value } })} required /></label></div>}</section>{error && <p className="form-error field--wide">{error}</p>}<footer>{task && <button type="button" className="button button--danger" onClick={() => onDelete(task)}><Trash />Eliminar</button>}<span /><button type="button" className="button button--ghost" onClick={onClose}>Cancelar</button><button className="button button--primary">Guardar tarea</button></footer></form></section></div>;
}
