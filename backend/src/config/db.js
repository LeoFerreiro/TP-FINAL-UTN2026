import mongoose from "mongoose";

// Abre la conexión de Mongoose utilizando la URI recibida desde las variables
// de entorno. La conexión se inicia antes de atender solicitudes a la API.
export async function connectDatabase(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
}
