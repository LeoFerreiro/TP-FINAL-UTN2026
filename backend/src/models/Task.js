import mongoose from "mongoose";

// Configuración de una serie recurrente. Los días siguen getUTCDay:
// domingo = 0, lunes = 1, ... sábado = 6.
const recurrenceSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  weekdays: [{ type: Number, min: 0, max: 6 }],
  endDate: Date,
  seriesId: String
}, { _id: false });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 800, default: "" },
  status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  dueDate: { type: Date, required: true },
  recurrence: { type: recurrenceSchema, default: () => ({ enabled: false, weekdays: [] }) },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

// Estos índices aceleran el tablero y evitan búsquedas costosas al localizar
// ocurrencias de una misma serie recurrente.
taskSchema.index({ owner: 1, status: 1, dueDate: 1 });
taskSchema.index({ owner: 1, "recurrence.seriesId": 1, dueDate: 1 });
export const Task = mongoose.model("Task", taskSchema);
