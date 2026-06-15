import jwt from "jsonwebtoken";

// El JWT guarda el id de usuario en "sub". El secreto y la expiración vienen
// de variables de entorno para no hardcodear credenciales.
export const signAccessToken = (userId) => jwt.sign(
  { sub: userId },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
);

export const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
