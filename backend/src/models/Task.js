import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 800, default: "" },
  status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  dueDate: { type: Date, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

taskSchema.index({ owner: 1, status: 1, dueDate: 1 });
export const Task = mongoose.model("Task", taskSchema);
