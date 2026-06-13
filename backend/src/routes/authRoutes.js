import { Router } from "express";
import { body } from "express-validator";
import { authController } from "../controllers/authController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const authRoutes = Router();
authRoutes.post("/register", [body("name").trim().isLength({ min: 2, max: 80 }), body("email").isEmail().normalizeEmail(), body("password").isLength({ min: 8 }).matches(/[A-Z]/).matches(/[0-9]/), validate], asyncHandler(authController.register));
authRoutes.post("/verify-email", [body("token").isString().notEmpty(), validate], asyncHandler(authController.verify));
authRoutes.post("/login", [body("email").isEmail().normalizeEmail(), body("password").isString().notEmpty(), validate], asyncHandler(authController.login));
authRoutes.get("/me", authenticate, asyncHandler(authController.me));
