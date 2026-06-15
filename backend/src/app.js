import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/authRoutes.js";
import { categoryRoutes } from "./routes/categoryRoutes.js";
import { taskRoutes } from "./routes/taskRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL?.split(",") || true }));
app.use(express.json({ limit: "600kb" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "impulso-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);
