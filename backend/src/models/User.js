import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationTokenHash: String,
  verificationExpiresAt: Date
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
