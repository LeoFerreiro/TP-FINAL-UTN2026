import { app } from "../backend/src/app.js";
import { connectDatabase } from "../backend/src/config/db.js";

let databasePromise;

export default async function handler(req, res) {
  if (!process.env.MONGODB_URI) {
    return res.status(503).json({ message: "La base de datos del servidor todavía no está configurada" });
  }

  databasePromise ||= connectDatabase(process.env.MONGODB_URI);
  try {
    await databasePromise;
    return app(req, res);
  } catch (error) {
    databasePromise = undefined;
    console.error("[api] No se pudo conectar con MongoDB", error);
    return res.status(503).json({ message: "No se pudo conectar con la base de datos" });
  }
}
