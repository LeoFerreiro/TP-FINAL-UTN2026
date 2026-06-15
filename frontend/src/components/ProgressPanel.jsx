import { CalendarBlank, CheckCircle } from "@phosphor-icons/react";

const dayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function localDate(value) {
  return new Date(`${value.slice(0, 10)}T12:00:00`);
}

function startOfWeek(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

function sameDay(first, second) {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}

function deliveryStatus(task) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = localDate(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  const days = Math.ceil((dueDate - today) / 86400000);
  if (days < 0) return { label: "Vencida", tone: "danger" };
  if (days <= 2) return { label: "Urgente", tone: "danger" };
  if (days <= 7) return { label: "Esta semana", tone: "warning" };
  return { label: "Próxima", tone: "info" };
}

export function ProgressPanel({ tasks }) {
  const weekStart = startOfWeek();
  const weekDays = dayLabels.map((label, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const dayTasks = tasks.filter((task) => sameDay(localDate(task.dueDate), date));
    return { label, date, total: dayTasks.length, completed: dayTasks.filter((task) => task.status === "completed").length };
  });
  const weeklyTotal = weekDays.reduce((total, day) => total + day.total, 0);
  const weeklyCompleted = weekDays.reduce((total, day) => total + day.completed, 0);
  const percent = weeklyTotal ? Math.round(weeklyCompleted / weeklyTotal * 100) : 0;
  const maxTasks = Math.max(1, ...weekDays.map((day) => day.total));
  const weekEnd = weekDays[6].date;
  const weekLabel = `${weekStart.toLocaleDateString("es-AR", { day: "numeric", month: weekStart.getMonth() === weekEnd.getMonth() ? undefined : "short" })} – ${weekEnd.toLocaleDateString("es-AR", { day: "numeric", month: "long" })}`;
  const nextTask = tasks.filter((task) => task.status !== "completed").sort((a, b) => localDate(a.dueDate) - localDate(b.dueDate))[0];
  const status = nextTask ? deliveryStatus(nextTask) : null;

  return <section className="progress-panel"><div><p className="section-label">Progreso semanal</p><span className="muted">{weekLabel}</span><div className="progress-summary"><div className="progress-ring" style={{ "--progress": `${percent * 3.6}deg` }}><span>{percent}%</span></div><p><strong>{weeklyCompleted}</strong> de {weeklyTotal} tareas<br /><em>{weeklyTotal ? `${weeklyTotal - weeklyCompleted} por realizar` : "Sin tareas esta semana"}</em></p></div></div><div className={`week-bars ${weeklyTotal ? "" : "week-bars--empty"}`} aria-label="Progreso de tareas por día">{weekDays.map((day) => { const height = day.total ? Math.max(24, day.total / maxTasks * 100) : 0; const completion = day.total ? day.completed / day.total * 100 : 0; return <div key={day.label} title={`${day.label}: ${day.completed} de ${day.total} completadas`}><span className="week-bar-count">{day.total || ""}</span><i style={{ height: `${height}%` }}><b style={{ height: `${completion}%` }} /></i><span>{day.label}</span></div>; })}</div>{nextTask ? <div className="next-delivery"><p>Próxima entrega</p><strong>{nextTask.title}</strong><span><CalendarBlank size={18} />{localDate(nextTask.dueDate).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</span><b className={`delivery-status delivery-status--${status.tone}`}>{status.label}</b></div> : <div className="next-delivery next-delivery--empty"><CheckCircle size={30} weight="fill" /><p>Próxima entrega</p><strong>No tenés tareas pendientes</strong><span>Todo está al día.</span></div>}</section>;
}
