import { CalendarBlank } from "@phosphor-icons/react";
export function ProgressPanel({ tasks }) {
  const completed = tasks.filter((task) => task.status === "completed").length;
  const percent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  return <section className="progress-panel"><div><p className="section-label">Progreso semanal</p><span className="muted">8 – 14 de junio</span><div className="progress-summary"><div className="progress-ring" style={{ "--progress": `${percent * 3.6}deg` }}><span>{percent}%</span></div><p><strong>{completed}</strong> de {tasks.length} tareas<br /><em>+8% vs. semana pasada</em></p></div></div><div className="week-bars" aria-label="Actividad semanal">{[35, 62, 20, 48, 18, 86, 30].map((value, index) => <div key={index}><i style={{ height: `${value}%` }} /><span>{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][index]}</span></div>)}</div><div className="next-delivery"><p>Próxima entrega</p><strong>Trabajo integrador final</strong><span><CalendarBlank size={18} /> Sábado, 20 de junio</span><b>Urgente</b></div></section>;
}
