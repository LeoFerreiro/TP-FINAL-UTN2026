import { Router } from "express";
import { body, param, query } from "express-validator";
import { taskController } from "../controllers/taskController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

// Reglas reutilizadas por POST y PUT para que crear y editar mantengan el
// mismo contrato de datos, incluida la configuración de recurrencia.
const taskRules = [
  body("title").trim().isLength({ min: 2, max: 120 }),
  body("description").optional().trim().isLength({ max: 800 }),
  body("status").isIn(["pending", "in_progress", "completed"]),
  body("priority").isIn(["low", "medium", "high"]),
  body("dueDate").isISO8601(),
  body("recurrence.enabled").optional().isBoolean(),
  body("recurrence.weekdays").optional().isArray({ max: 7 }),
  body("recurrence.weekdays.*").optional().isInt({ min: 0, max: 6 }),
  body("recurrence.endDate").optional({ values: "falsy" }).isISO8601(),
  body("category").isMongoId()
];

export const taskRoutes = Router();
// Desde este punto todas las rutas requieren un JWT válido.
taskRoutes.use(authenticate);
taskRoutes.get("/", [query("status").optional().isIn(["pending", "in_progress", "completed"]), query("priority").optional().isIn(["low", "medium", "high"]), query("category").optional().isMongoId(), validate], asyncHandler(taskController.list));
taskRoutes.post("/cleanup-completed", [body("all").optional().isBoolean(), body("ids").optional().isArray(), body("ids.*").optional().isMongoId(), validate], asyncHandler(taskController.cleanupCompleted));
taskRoutes.get("/:id", [param("id").isMongoId(), validate], asyncHandler(taskController.get));
taskRoutes.post("/", [...taskRules, validate], asyncHandler(taskController.create));
taskRoutes.put("/:id", [param("id").isMongoId(), ...taskRules, validate], asyncHandler(taskController.update));
taskRoutes.delete("/:id", [param("id").isMongoId(), validate], asyncHandler(taskController.remove));
