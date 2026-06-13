import "dotenv/config";
import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = Number(process.env.PORT || 4000);
await connectDatabase(process.env.MONGODB_URI);
app.listen(port, () => console.info(`Impulso API disponible en http://localhost:${port}`));
