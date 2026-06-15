import { Funnel, Kanban, ListBullets, Plus } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { CalendarView } from "../components/CalendarView.jsx";
import { CategoryManager } from "../components/CategoryManager.jsx";
import { KanbanBoard } from "../components/KanbanBoard.jsx";
import { ProfileView } from "../components/ProfileView.jsx";
import { ProgressPanel } from "../components/ProgressPanel.jsx";
import { Sidebar } from "../components/Sidebar.jsx";
import { TaskList } from "../components/TaskList.jsx";
import { TaskModal } from "../components/TaskModal.jsx";
import { Topbar } from "../components/Topbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { demoCategories, demoTasks } from "../data/demoData.js";

function getNextOccurrence(task) {
  if (!task.recurrence?.enabled) return null;
  const candidate = new Date(`${task.dueDate.slice(0, 10)}T12:00:00`);
  const endDate = new Date(`${task.recurrence.endDate.slice(0, 10)}T23:59:59`);
  for (let offset = 1; offset <= 7; offset += 1) {
    candidate.setDate(candidate.getDate() + 1);
    if (candidate > endDate) return null;
    if (task.recurrence.weekdays.includes(candidate.getDay())) return candidate.toISOString().slice(0, 10);
  }
  return null;
}

function TaskWorkspace({ tasks, categories, counts, category, priority, view, onCategory, onPriority, onView, onCreate, onEdit, onMove, showHeading = false }) {
  return <>{showHeading && <div className="page-heading"><div><p className="eyebrow">Organización</p><h2>Mis tareas</h2><p>Creá, priorizá y avanzá cada tarea desde un solo lugar.</p></div></div>}<section className="toolbar"><button className="button button--primary" onClick={() => onCreate("pending")}><Plus size={19} />Nueva tarea</button><select value={category} onChange={(event) => onCategory(event.target.value)}><option value="">Todas las categorías</option>{categories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select><select value={priority} onChange={(event) => onPriority(event.target.value)}><option value="">Prioridad: Todas</option><option value="high">Alta</option><option value="medium">Media</option><option value="low">Baja</option></select><button className="button button--ghost"><Funnel />Más filtros</button><div className="view-toggle"><button className={view === "board" ? "active" : ""} onClick={() => onView("board")}><Kanban />Tablero</button><button className={view === "list" ? "active" : ""} onClick={() => onView("list")}><ListBullets />Lista</button></div></section><section className="category-strip">{categories.map((item) => <button key={item._id} onClick={() => onCategory(category === item._id ? "" : item._id)} className={category === item._id ? "active" : ""}><i style={{ background: item.color }} /><span><strong>{item.name}</strong><small>{counts[item._id] || 0} tareas</small></span></button>)}</section>{view === "board" ? <KanbanBoard tasks={tasks} onEdit={onEdit} onCreate={onCreate} onMove={onMove} /> : <TaskList tasks={tasks} onEdit={onEdit} />}</>;
}

export function DashboardPage() {
  const { user, logout, updateUser } = useAuth();
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
  const counts = useMemo(() => Object.fromEntries(categories.map((item) => [item._id, tasks.filter((task) => task.category._id === item._id).length])), [categories, tasks]);
  const notifications = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 36 * 60 * 60 * 1000);
    return tasks.filter((task) => task.status !== "completed" && new Date(task.dueDate) <= tomorrow).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5).map((task) => { const overdue = new Date(task.dueDate) < now; return { id: task._id, task, tone: overdue ? "danger" : "warning", title: overdue ? "Tarea vencida" : "Próximo vencimiento", message: `${task.title} · ${new Date(task.dueDate).toLocaleDateString("es-AR")}` }; });
  }, [tasks]);

  async function saveTask(data) {
    const categoryObject = categories.find((item) => item._id === data.category);
    if (user.demo) setTasks((current) => {
      const previous = current.find((task) => task._id === data._id);
      const saved = { ...data, _id: data._id || crypto.randomUUID(), category: categoryObject };
      const updated = data._id ? current.map((task) => task._id === data._id ? saved : task) : [...current, saved];
      const nextDate = previous?.status !== "completed" && saved.status === "completed" ? getNextOccurrence(saved) : null;
      return nextDate ? [...updated, { ...saved, _id: crypto.randomUUID(), status: "pending", dueDate: nextDate }] : updated;
    });
    else {
      await api(data._id ? `/tasks/${data._id}` : "/tasks", { method: data._id ? "PUT" : "POST", body: JSON.stringify(data) });
      setTasks(await api("/tasks"));
    }
    setModal(null);
  }
  async function deleteTask(task) { if (!confirm(`¿Eliminar "${task.title}"?`)) return; if (!user.demo) await api(`/tasks/${task._id}`, { method: "DELETE" }); setTasks((current) => current.filter((item) => item._id !== task._id)); setModal(null); }
  async function moveTask(task) { await saveTask({ ...task, category: task.category._id, dueDate: task.dueDate.slice(0, 10), status: task.status === "pending" ? "in_progress" : "completed" }); }
  async function saveCategory(data) { if (user.demo) setCategories((current) => data._id ? current.map((item) => item._id === data._id ? data : item) : [...current, { ...data, _id: crypto.randomUUID() }]); else { const saved = await api(data._id ? `/categories/${data._id}` : "/categories", { method: data._id ? "PUT" : "POST", body: JSON.stringify(data) }); setCategories((current) => data._id ? current.map((item) => item._id === data._id ? saved : item) : [...current, saved]); } }
  async function deleteCategory(item) { if (counts[item._id]) return; if (!user.demo) await api(`/categories/${item._id}`, { method: "DELETE" }); setCategories((current) => current.filter((categoryItem) => categoryItem._id !== item._id)); }
  function navigate(label) { setSidebarOpen(false); if (label === "Categorías") { setCategoriesOpen(true); return; } setActive(label); }
  function createTask(status) { setModal({ status }); }
  function editTask(task) { setModal({ task }); }

  return <div className="app-shell"><div className={sidebarOpen ? "sidebar-wrap open" : "sidebar-wrap"}><Sidebar active={active} onNavigate={navigate} onLogout={logout} /></div>{sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Cerrar navegación" />}<main className="workspace"><Topbar title={active} user={user} search={search} onSearch={setSearch} onMenu={() => setSidebarOpen(true)} notifications={notifications} onOpenTask={editTask} onOpenProfile={() => setActive("Perfil")} /><div className="workspace__content">{error && <div className="alert">{error}</div>}{active === "Resumen" && <><ProgressPanel tasks={tasks} /><TaskWorkspace tasks={filtered} categories={categories} counts={counts} category={category} priority={priority} view={view} onCategory={setCategory} onPriority={setPriority} onView={setView} onCreate={createTask} onEdit={editTask} onMove={moveTask} /></>}{active === "Tareas" && <TaskWorkspace showHeading tasks={filtered} categories={categories} counts={counts} category={category} priority={priority} view={view} onCategory={setCategory} onPriority={setPriority} onView={setView} onCreate={createTask} onEdit={editTask} onMove={moveTask} />}{active === "Calendario" && <CalendarView tasks={filtered} onEdit={editTask} onCreate={createTask} />}{active === "Perfil" && <ProfileView user={user} tasks={tasks} categories={categories} onLogout={logout} onUserChange={updateUser} />}</div></main>{modal && <TaskModal task={modal.task} initialStatus={modal.status} categories={categories} onClose={() => setModal(null)} onSave={saveTask} onDelete={deleteTask} />}{categoriesOpen && <CategoryManager categories={categories} counts={counts} onClose={() => setCategoriesOpen(false)} onSave={saveCategory} onDelete={deleteCategory} />}</div>;
}
