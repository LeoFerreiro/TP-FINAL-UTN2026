import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

// Valida el encabezado Authorization: Bearer <token>. Si el JWT es válido,
// expone el id del usuario en req.userId para las capas siguientes.
export function authenticate(req, _res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) return next(new AppError("Token requerido", 401));
  try {
    req.userId = verifyAccessToken(token).sub;
    next();
  } catch {
    next(new AppError("Token inválido o vencido", 401));
  }
}
