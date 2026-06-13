import jwt from "jsonwebtoken";

export const signAccessToken = (userId) => jwt.sign(
  { sub: userId },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
);

export const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
