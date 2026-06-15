import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { userRepository } from "../repositories/userRepository.js";
import { AppError } from "../utils/AppError.js";
import { sendVerificationEmail } from "../utils/email.js";
import { signAccessToken } from "../utils/jwt.js";

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
// Limita los campos enviados al frontend para nunca exponer passwordHash ni
// tokens internos almacenados en el documento de MongoDB.
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl || "" });

async function issueVerificationEmail(user) {
  // Se envía el token original por correo, pero en la base solo queda su hash.
  // Así, una filtración de MongoDB no permite activar cuentas ajenas.
  const token = crypto.randomBytes(32).toString("hex");
  user.verificationTokenHash = hashToken(token);
  user.verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await userRepository.save(user);
  await sendVerificationEmail({ email: user.email, name: user.name, token });
}

export const authService = {
  // Registro seguro: verifica duplicados, aplica bcrypt y envía activación.
  async register({ name, email, password }) {
    if (await userRepository.findByEmail(email)) throw new AppError("El correo ya está registrado", 409);
    const user = await userRepository.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
    await issueVerificationEmail(user);
    return { id: user.id, email: user.email, message: "Revisá tu correo para activar la cuenta" };
  },
  async resendVerification(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) return { message: "Si el correo está registrado, enviaremos un nuevo enlace" };
    if (user.isVerified) throw new AppError("La cuenta ya está verificada", 409);
    await issueVerificationEmail(user);
    return { message: "Enviamos un nuevo enlace de verificación" };
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
    // bcrypt.compare valida la contraseña contra el hash sin descifrarlo.
    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError("Credenciales inválidas", 401);
    if (!user.isVerified) throw new AppError("Verificá tu correo antes de ingresar", 403);
    return { token: signAccessToken(user.id), user: publicUser(user) };
  },
  async profile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("Usuario no encontrado", 404);
    return publicUser(user);
  },
  async updateAvatar(userId, avatarUrl) {
    // Una cadena vacía elimina la foto y hace que vuelva a mostrarse la inicial.
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("Usuario no encontrado", 404);
    user.avatarUrl = avatarUrl || undefined;
    await userRepository.save(user);
    return publicUser(user);
  }
};
