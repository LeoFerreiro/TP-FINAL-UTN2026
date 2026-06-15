import { CaretLeft, CaretRight, Plus } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function CalendarView({ tasks, onEdit, onCreate }) {
  // cursor indica el mes visible. No cambia la ruta; solo recalcula la grilla.
  const [cursor, setCursor] = useState(() => new Date());
  const month = cursor.getMonth();
  const year = cursor.getFullYear();
  const cells = useMemo(() => {
    // Agrega celdas vacías para alinear el día 1 con su día de la semana.
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    return [...Array(offset).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];
  }, [month, year]);

  function move(delta) { setCursor(new Date(year, month + delta, 1)); }
  return <section className="page-view"><div className="page-heading"><div><p className="eyebrow">Planificación</p><h2>Calendario de tareas</h2><p>Visualizá entregas y vencimientos por día.</p></div><button className="button button--primary" onClick={() => onCreate("pending")}><Plus />Nueva tarea</button></div><div className="calendar-card"><header><button className="icon-button" onClick={() => move(-1)} aria-label="Mes anterior"><CaretLeft /></button><h3>{cursor.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}</h3><button className="icon-button" onClick={() => move(1)} aria-label="Mes siguiente"><CaretRight /></button></header><div className="calendar-grid">{weekDays.map((day) => <strong className="calendar-weekday" key={day}>{day}</strong>)}{cells.map((day, index) => { const dateTasks = day ? tasks.filter((task) => { const date = new Date(task.dueDate); return date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day; }) : []; const today = day && new Date().toDateString() === new Date(year, month, day).toDateString(); return <div className={`calendar-day ${!day ? "calendar-day--empty" : ""}`} key={`${day}-${index}`}><span className={today ? "today" : ""}>{day}</span>{dateTasks.slice(0, 3).map((task) => <button key={task._id} style={{ "--event": task.category.color }} onClick={() => onEdit(task)}>{task.title}</button>)}{dateTasks.length > 3 && <small>+{dateTasks.length - 3} más</small>}</div>; })}</div></div></section>;
}
