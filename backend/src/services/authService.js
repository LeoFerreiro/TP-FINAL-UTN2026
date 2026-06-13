import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { userRepository } from "../repositories/userRepository.js";
import { AppError } from "../utils/AppError.js";
import { sendVerificationEmail } from "../utils/email.js";
import { signAccessToken } from "../utils/jwt.js";

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

export const authService = {
  async register({ name, email, password }) {
    if (await userRepository.findByEmail(email)) throw new AppError("El correo ya está registrado", 409);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = await userRepository.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      verificationTokenHash: hashToken(verificationToken),
      verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    await sendVerificationEmail({ email: user.email, name: user.name, token: verificationToken });
    return { id: user.id, email: user.email, message: "Revisá tu correo para activar la cuenta" };
  },
  async verifyEmail(token) {
    const user = await userRepository.findByVerificationHash(hashToken(token));
    if (!user || user.verificationExpiresAt < new Date()) throw new AppError("El enlace es inválido o venció", 400);
    user.isVerified = true;
    user.verificationTokenHash = undefined;
    user.verificationExpiresAt = undefined;
    await userRepository.save(user);
    return { message: "Correo verificado correctamente" };
  },
  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError("Credenciales inválidas", 401);
    if (!user.isVerified) throw new AppError("Verificá tu correo antes de ingresar", 403);
    return { token: signAccessToken(user.id), user: { id: user.id, name: user.name, email: user.email } };
  },
  async profile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("Usuario no encontrado", 404);
    return { id: user.id, name: user.name, email: user.email };
  }
};
