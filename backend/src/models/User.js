import mongoose from "mongoose";

// Documento de usuario. La contraseña nunca se guarda en texto plano: el
// servicio almacena únicamente passwordHash generado con bcrypt.
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  // La foto llega optimizada como Data URL para funcionar también en Vercel,
  // cuyo sistema de archivos no es persistente entre ejecuciones.
  avatarUrl: { type: String, maxlength: 500000 },
  isVerified: { type: Boolean, default: false },
  verificationTokenHash: String,
  verificationExpiresAt: Date
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
