import { PencilSimple, Plus, Trash, X } from "@phosphor-icons/react";
import { useState } from "react";

// Modal para CRUD de categorías. Bloquea eliminar una categoría con tareas
// asociadas usando el contador calculado en DashboardPage.
export function CategoryManager({ categories, counts, onClose, onSave, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", color: "#1677ff" });
  function edit(category) { setEditing(category); setForm({ name: category.name, color: category.color }); }
  function submit(event) { event.preventDefault(); onSave({ ...form, _id: editing?._id }); setEditing(null); setForm({ name: "", color: "#1677ff" }); }
  return <div className="modal-backdrop"><section className="modal modal--categories" role="dialog" aria-modal="true"><header><div><p className="eyebrow">Organización</p><h2>Gestionar categorías</h2></div><button className="icon-button" onClick={onClose}><X /></button></header><div className="category-list">{categories.map((cat) => <div key={cat._id}><i style={{ background: cat.color }} /><strong>{cat.name}</strong><span>{counts[cat._id] || 0} tareas</span><button className="icon-button" onClick={() => edit(cat)}><PencilSimple /></button><button className="icon-button icon-button--danger" disabled={counts[cat._id] > 0} onClick={() => onDelete(cat)}><Trash /></button></div>)}</div><form className="category-form" onSubmit={submit}><input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} aria-label="Color" /><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre de categoría" required /><button className="button button--primary"><Plus />{editing ? "Actualizar" : "Agregar"}</button></form></section></div>;
}
