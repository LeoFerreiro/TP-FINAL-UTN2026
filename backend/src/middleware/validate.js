import { validationResult } from "express-validator";
import { AppError } from "../utils/AppError.js";

// Reúne los resultados producidos por express-validator en las rutas y corta
// la petición con HTTP 422 cuando algún campo no cumple las reglas.
export function validate(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new AppError("Datos inválidos", 422, errors.array()));
  next();
}
