const API_URL = import.meta.env.VITE_API_URL || "/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("impulso_token");
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }
    });
  } catch {
    throw new Error("No se pudo conectar con la API. Intentá nuevamente en unos segundos.");
  }
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "No se pudo completar la solicitud");
  return data;
}
