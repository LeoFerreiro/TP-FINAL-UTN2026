import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

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
