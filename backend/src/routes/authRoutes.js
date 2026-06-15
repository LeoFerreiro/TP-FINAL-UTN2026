import { Router } from "express";
import { body } from "express-validator";
import { authController } from "../controllers/authController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

// Las rutas definen URL, método, validaciones y middleware de autenticación.
// El procesamiento final siempre se delega al controller correspondiente.
export const authRoutes = Router();
authRoutes.post("/register", [body("name").trim().isLength({ min: 2, max: 80 }), body("email").isEmail().normalizeEmail(), body("password").isLength({ min: 8 }).matches(/[A-Z]/).matches(/[0-9]/), validate], asyncHandler(authController.register));
authRoutes.post("/verify-email", [body("token").isString().notEmpty(), validate], asyncHandler(authController.verify));
authRoutes.post("/resend-verification", [body("email").isEmail().normalizeEmail(), validate], asyncHandler(authController.resend));
authRoutes.post("/login", [body("email").isEmail().normalizeEmail(), body("password").isString().notEmpty(), validate], asyncHandler(authController.login));
authRoutes.get("/me", authenticate, asyncHandler(authController.me));
authRoutes.patch("/profile/avatar", authenticate, [body("avatarUrl").custom((value) => value === "" || (typeof value === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(value) && value.length <= 500000)).withMessage("La imagen debe ser JPG, PNG o WebP y pesar menos de 350 KB"), validate], asyncHandler(authController.updateAvatar));
