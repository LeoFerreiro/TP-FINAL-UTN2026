import { Camera, CheckCircle, Envelope, ShieldCheck, SpinnerGap, Target, Trash } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { api } from "../api.js";

function initials(name) {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("");
}

function optimizeImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      const size = Math.min(image.width, image.height);
      const canvas = document.createElement("canvas");
      canvas.width = 360;
      canvas.height = 360;
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, (image.width - size) / 2, (image.height - size) / 2, size, size, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo leer la imagen seleccionada"));
    };
    image.src = objectUrl;
  });
}

export function ProfileView({ user, tasks, categories, onLogout, onUserChange }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const completed = tasks.filter((task) => task.status === "completed").length;

  async function saveAvatar(avatarUrl) {
    setSaving(true);
    setError("");
    try {
      const updated = user.demo ? { ...user, avatarUrl } : await api("/auth/profile/avatar", { method: "PATCH", body: JSON.stringify({ avatarUrl }) });
      onUserChange(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function selectImage(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Seleccioná un archivo de imagen");
    if (file.size > 10 * 1024 * 1024) return setError("La imagen original no puede superar los 10 MB");
    try {
      await saveAvatar(await optimizeImage(file));
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return <section className="page-view profile-view"><div className="page-heading"><div><p className="eyebrow">Tu cuenta</p><h2>Perfil</h2><p>Información de acceso y resumen de actividad.</p></div></div><div className="profile-layout"><section className="profile-card profile-card--identity"><div className="profile-avatar-wrap"><div className="profile-avatar">{user.avatarUrl ? <img src={user.avatarUrl} alt={`Foto de perfil de ${user.name}`} /> : initials(user.name)}</div><button className="profile-avatar-edit" onClick={() => inputRef.current?.click()} disabled={saving} aria-label="Cambiar foto de perfil">{saving ? <SpinnerGap className="spin" /> : <Camera />}</button><input ref={inputRef} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectImage} /></div><h3>{user.name}</h3><p><Envelope />{user.email}</p><span><ShieldCheck />Correo verificado</span><div className="profile-photo-actions"><button className="button button--primary button--full" onClick={() => inputRef.current?.click()} disabled={saving}><Camera />{user.avatarUrl ? "Cambiar foto" : "Subir foto"}</button>{user.avatarUrl && <button className="button button--danger button--full" onClick={() => saveAvatar("")} disabled={saving}><Trash />Eliminar foto</button>}</div>{error && <p className="profile-photo-error">{error}</p>}<small className="profile-photo-help">JPG, PNG o WebP. La imagen se recorta automáticamente.</small><button className="button button--ghost button--full" onClick={onLogout}>Cerrar sesión</button></section><section className="profile-card"><h3>Tu actividad</h3><div className="profile-stats"><article><Target /><strong>{tasks.length}</strong><span>Tareas totales</span></article><article><CheckCircle /><strong>{completed}</strong><span>Completadas</span></article><article><span className="category-symbol" /><strong>{categories.length}</strong><span>Categorías</span></article></div><div className="profile-progress"><div><strong>Progreso general</strong><span>{tasks.length ? Math.round(completed / tasks.length * 100) : 0}%</span></div><i><b style={{ width: `${tasks.length ? completed / tasks.length * 100 : 0}%` }} /></i></div></section></div></section>;
}
