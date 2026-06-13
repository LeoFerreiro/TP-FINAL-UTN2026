import { Router } from "express";
import { body, param, query } from "express-validator";
import { taskController } from "../controllers/taskController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const taskRules = [
  body("title").trim().isLength({ min: 2, max: 120 }),
  body("description").optional().trim().isLength({ max: 800 }),
  body("status").isIn(["pending", "in_progress", "completed"]),
  body("priority").isIn(["low", "medium", "high"]),
  body("dueDate").isISO8601(),
  body("category").isMongoId()
];

export const taskRoutes = Router();
taskRoutes.use(authenticate);
taskRoutes.get("/", [query("status").optional().isIn(["pending", "in_progress", "completed"]), query("priority").optional().isIn(["low", "medium", "high"]), query("category").optional().isMongoId(), validate], asyncHandler(taskController.list));
taskRoutes.get("/:id", [param("id").isMongoId(), validate], asyncHandler(taskController.get));
taskRoutes.post("/", [...taskRules, validate], asyncHandler(taskController.create));
taskRoutes.put("/:id", [param("id").isMongoId(), ...taskRules, validate], asyncHandler(taskController.update));
taskRoutes.delete("/:id", [param("id").isMongoId(), validate], asyncHandler(taskController.remove));
