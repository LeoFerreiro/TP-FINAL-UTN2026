import { validationResult } from "express-validator";
import { AppError } from "../utils/AppError.js";

export function validate(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new AppError("Datos inválidos", 422, errors.array()));
  next();
}
