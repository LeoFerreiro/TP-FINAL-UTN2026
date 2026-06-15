import mongoose from "mongoose";

// Cada categoría pertenece a un usuario. La referencia owner impide mezclar
// categorías de distintas cuentas y permite filtrar todas las consultas.
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 40 },
  color: { type: String, required: true, match: /^#[0-9a-fA-F]{6}$/ },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

categorySchema.index({ owner: 1, name: 1 }, { unique: true });
export const Category = mongoose.model("Category", categorySchema);
