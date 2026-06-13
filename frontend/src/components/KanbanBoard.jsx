import { Plus } from "@phosphor-icons/react";
import { TaskCard } from "./TaskCard.jsx";
const columns = [{ id: "pending", title: "Pendientes" }, { id: "in_progress", title: "En progreso" }, { id: "completed", title: "Completadas" }];
export function KanbanBoard({ tasks, onEdit, onCreate, onMove }) {
  return <section className="kanban">{columns.map((column) => { const columnTasks = tasks.filter((task) => task.status === column.id); return <div className="kanban-column" key={column.id}><header><h2>{column.title}</h2><span>{columnTasks.length}</span></header><div className="kanban-column__tasks">{columnTasks.map((task) => <TaskCard key={task._id} task={task} onEdit={onEdit} onMove={onMove} />)}{columnTasks.length === 0 && <p className="empty-column">No hay tareas en esta columna.</p>}</div><button className="add-inline" onClick={() => onCreate(column.id)}><Plus />Añadir tarea</button></div>; })}</section>;
}
