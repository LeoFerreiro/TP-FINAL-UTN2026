import { CalendarBlank, CheckCircle } from "@phosphor-icons/react";

function localDate(value) {
  return new Date(`${value.slice(0, 10)}T12:00:00`);
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
  const completed = tasks.filter((task) => task.status === "completed").length;
  const percent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const nextTask = tasks.filter((task) => task.status !== "completed").sort((a, b) => localDate(a.dueDate) - localDate(b.dueDate))[0];
  const status = nextTask ? deliveryStatus(nextTask) : null;

  return <section className="progress-panel"><div><p className="section-label">Progreso semanal</p><span className="muted">8 – 14 de junio</span><div className="progress-summary"><div className="progress-ring" style={{ "--progress": `${percent * 3.6}deg` }}><span>{percent}%</span></div><p><strong>{completed}</strong> de {tasks.length} tareas<br /><em>+8% vs. semana pasada</em></p></div></div><div className="week-bars" aria-label="Actividad semanal">{[35, 62, 20, 48, 18, 86, 30].map((value, index) => <div key={index}><i style={{ height: `${value}%` }} /><span>{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][index]}</span></div>)}</div>{nextTask ? <div className="next-delivery"><p>Próxima entrega</p><strong>{nextTask.title}</strong><span><CalendarBlank size={18} />{localDate(nextTask.dueDate).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</span><b className={`delivery-status delivery-status--${status.tone}`}>{status.label}</b></div> : <div className="next-delivery next-delivery--empty"><CheckCircle size={30} weight="fill" /><p>Próxima entrega</p><strong>No tenés tareas pendientes</strong><span>Todo está al día.</span></div>}</section>;
}
