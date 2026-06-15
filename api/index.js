import { app } from "../backend/src/app.js";
import { connectDatabase } from "../backend/src/config/db.js";

let databasePromise;

// Traduce errores técnicos de MongoDB a mensajes útiles para el usuario sin
// exponer credenciales, hosts ni datos internos.
function databaseErrorMessage(error) {
  const message = String(error?.message || error);
  if (/authentication failed|bad auth/i.test(message)) return "MongoDB rechazó el usuario o la contraseña";
  if (/querySrv|ENOTFOUND|URI malformed|Invalid scheme/i.test(message)) return "La URI de MongoDB no tiene un formato válido";
  if (/IP|whitelist|timed out|ETIMEDOUT|ECONNREFUSED|Server selection/i.test(message)) return "MongoDB Atlas bloqueó la conexión de red";
  return "No se pudo conectar con la base de datos";
}

export default async function handler(req, res) {
  if (!process.env.MONGODB_URI) {
    return res.status(503).json({ message: "La base de datos del servidor todavía no está configurada" });
  }

  // Reutiliza la conexión en invocaciones calientes de Vercel para evitar abrir
  // una conexión nueva a MongoDB en cada request.
  databasePromise ||= connectDatabase(process.env.MONGODB_URI);
  try {
    await databasePromise;
    return app(req, res);
  } catch (error) {
    databasePromise = undefined;
    console.error("[api] No se pudo conectar con MongoDB", { name: error?.name, message: error?.message, code: error?.code });
    return res.status(503).json({ message: databaseErrorMessage(error) });
  }
}
