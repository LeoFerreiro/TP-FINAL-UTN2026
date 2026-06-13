import { Funnel, Kanban, ListBullets, Plus } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { CategoryManager } from "../components/CategoryManager.jsx";
import { KanbanBoard } from "../components/KanbanBoard.jsx";
import { ProgressPanel } from "../components/ProgressPanel.jsx";
import { Sidebar } from "../components/Sidebar.jsx";
import { TaskList } from "../components/TaskList.jsx";
import { TaskModal } from "../components/TaskModal.jsx";
import { Topbar } from "../components/Topbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { demoCategories, demoTasks } from "../data/demoData.js";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [view, setView] = useState("board");
  const [active, setActive] = useState("Resumen");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user.demo) { setTasks(demoTasks); setCategories(demoCategories); return; }
    Promise.all([api("/tasks"), api("/categories")]).then(([taskData, categoryData]) => { setTasks(taskData); setCategories(categoryData); }).catch((err) => setError(err.message));
  }, [user.demo]);

  const filtered = useMemo(() => tasks.filter((task) => (!search || `${task.title} ${task.description}`.toLowerCase().includes(search.toLowerCase())) && (!category || task.category._id === category) && (!priority || task.priority === priority)), [tasks, search, category, priority]);
  const counts = useMemo(() => Object.fromEntries(categories.map((cat) => [cat._id, tasks.filter((task) => task.category._id === cat._id).length])), [categories, tasks]);

  async function saveTask(data) {
    const categoryObject = categories.find((cat) => cat._id === data.category);
    if (user.demo) { setTasks((current) => data._id ? current.map((task) => task._id === data._id ? { ...data, category: categoryObject } : task) : [...current, { ...data, _id: crypto.randomUUID(), category: categoryObject }]); }
    else { const saved = await api(data._id ? `/tasks/${data._id}` : "/tasks", { method: data._id ? "PUT" : "POST", body: JSON.stringify(data) }); setTasks((current) => data._id ? current.map((task) => task._id === data._id ? saved : task) : [...current, saved]); }
    setModal(null);
  }

  async function deleteTask(task) { if (!confirm(`¿Eliminar "${task.title}"?`)) return; if (!user.demo) await api(`/tasks/${task._id}`, { method: "DELETE" }); setTasks((current) => current.filter((item) => item._id !== task._id)); setModal(null); }
  async function moveTask(task) { const next = task.status === "pending" ? "in_progress" : "completed"; await saveTask({ ...task, category: task.category._id, dueDate: task.dueDate.slice(0, 10), status: next }); }
  async function saveCategory(data) { if (user.demo) { setCategories((current) => data._id ? current.map((cat) => cat._id === data._id ? data : cat) : [...current, { ...data, _id: crypto.randomUUID() }]); } else { const saved = await api(data._id ? `/categories/${data._id}` : "/categories", { method: data._id ? "PUT" : "POST", body: JSON.stringify(data) }); setCategories((current) => data._id ? current.map((cat) => cat._id === data._id ? saved : cat) : [...current, saved]); } }
  async function deleteCategory(cat) { if (counts[cat._id]) return; if (!user.demo) await api(`/categories/${cat._id}`, { method: "DELETE" }); setCategories((current) => current.filter((item) => item._id !== cat._id)); }
  function navigate(label) { setActive(label); setSidebarOpen(false); if (label === "Categorías") setCategoriesOpen(true); }

  return <div className="app-shell"><div className={sidebarOpen ? "sidebar-wrap open" : "sidebar-wrap"}><Sidebar active={active} onNavigate={navigate} onLogout={logout} /></div>{sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Cerrar navegación" />}<main className="workspace"><Topbar user={user} search={search} onSearch={setSearch} onMenu={() => setSidebarOpen(true)} /><div className="workspace__content">{error && <div className="alert">{error}</div>}<ProgressPanel tasks={tasks} /><section className="toolbar"><button className="button button--primary" onClick={() => setModal({ status: "pending" })}><Plus size={19} />Nueva tarea</button><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Todas las categorías</option>{categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}</select><select value={priority} onChange={(e) => setPriority(e.target.value)}><option value="">Prioridad: Todas</option><option value="high">Alta</option><option value="medium">Media</option><option value="low">Baja</option></select><button className="button button--ghost"><Funnel />Más filtros</button><div className="view-toggle"><button className={view === "board" ? "active" : ""} onClick={() => setView("board")}><Kanban />Tablero</button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")}><ListBullets />Lista</button></div></section><section className="category-strip">{categories.map((cat) => <button key={cat._id} onClick={() => setCategory(category === cat._id ? "" : cat._id)} className={category === cat._id ? "active" : ""}><i style={{ background: cat.color }} /><span><strong>{cat.name}</strong><small>{counts[cat._id] || 0} tareas</small></span></button>)}</section>{view === "board" ? <KanbanBoard tasks={filtered} onEdit={(task) => setModal({ task })} onCreate={(status) => setModal({ status })} onMove={moveTask} /> : <TaskList tasks={filtered} onEdit={(task) => setModal({ task })} />}</div></main>{modal && <TaskModal task={modal.task} initialStatus={modal.status} categories={categories} onClose={() => setModal(null)} onSave={saveTask} onDelete={deleteTask} />}{categoriesOpen && <CategoryManager categories={categories} counts={counts} onClose={() => { setCategoriesOpen(false); setActive("Resumen"); }} onSave={saveCategory} onDelete={deleteCategory} />}</div>;
}
