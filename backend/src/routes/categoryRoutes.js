import { Router } from "express";
import { body, param } from "express-validator";
import { categoryController } from "../controllers/categoryController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const categoryRoutes = Router();
categoryRoutes.use(authenticate);
categoryRoutes.get("/", asyncHandler(categoryController.list));
categoryRoutes.post("/", [body("name").trim().isLength({ min: 2, max: 40 }), body("color").matches(/^#[0-9a-fA-F]{6}$/), validate], asyncHandler(categoryController.create));
categoryRoutes.put("/:id", [param("id").isMongoId(), body("name").optional().trim().isLength({ min: 2, max: 40 }), body("color").optional().matches(/^#[0-9a-fA-F]{6}$/), validate], asyncHandler(categoryController.update));
categoryRoutes.delete("/:id", [param("id").isMongoId(), validate], asyncHandler(categoryController.remove));
