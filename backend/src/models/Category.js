import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 40 },
  color: { type: String, required: true, match: /^#[0-9a-fA-F]{6}$/ },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

categorySchema.index({ owner: 1, name: 1 }, { unique: true });
export const Category = mongoose.model("Category", categorySchema);
