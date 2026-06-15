import { taskRepository } from "../repositories/taskRepository.js";
import { categoryRepository } from "../repositories/categoryRepository.js";
import { AppError } from "../utils/AppError.js";
import crypto from "node:crypto";

async function validateCategory(owner, categoryId) {
  if (!(await categoryRepository.findOwnedById(categoryId, owner))) throw new AppError("Categoría inválida", 400);
}

function prepareRecurrence(data, currentSeriesId) {
  if (!data.recurrence?.enabled) return { enabled: false, weekdays: [] };
  const weekdays = [...new Set(data.recurrence.weekdays || [])].sort();
  const dueDate = new Date(data.dueDate);
  const endDate = new Date(data.recurrence.endDate);
  if (!weekdays.length) throw new AppError("Seleccioná al menos un día para repetir la tarea", 400);
  if (Number.isNaN(endDate.getTime()) || endDate < dueDate) throw new AppError("La fecha final debe ser igual o posterior al primer vencimiento", 400);
  if (!weekdays.includes(dueDate.getUTCDay())) throw new AppError("El primer vencimiento debe coincidir con uno de los días seleccionados", 400);
  return { enabled: true, weekdays, endDate, seriesId: currentSeriesId || data.recurrence.seriesId || crypto.randomUUID() };
}

function nextOccurrence(task) {
  if (!task.recurrence?.enabled) return null;
  const candidate = new Date(task.dueDate);
  const endDate = new Date(task.recurrence.endDate);
  for (let offset = 1; offset <= 7; offset += 1) {
    candidate.setUTCDate(candidate.getUTCDate() + 1);
    if (candidate > endDate) return null;
    if (task.recurrence.weekdays.includes(candidate.getUTCDay())) return new Date(candidate);
  }
  return null;
}

export const taskService = {
  list(owner, query) {
    const filters = {};
    if (query.status) filters.status = query.status;
    if (query.priority) filters.priority = query.priority;
    if (query.category) filters.category = query.category;
    if (query.search) filters.title = { $regex: query.search, $options: "i" };
    return taskRepository.findAll(owner, filters);
  },
  async get(owner, id) {
    const task = await taskRepository.findOwnedById(id, owner);
    if (!task) throw new AppError("Tarea no encontrada", 404);
    return task;
  },
  async create(owner, data) {
    await validateCategory(owner, data.category);
    const recurrence = prepareRecurrence(data);
    return (await taskRepository.create({ ...data, recurrence, owner })).populate("category");
  },
  async update(owner, id, data) {
    if (data.category) await validateCategory(owner, data.category);
    const current = await taskRepository.findOwnedById(id, owner);
    if (!current) throw new AppError("Tarea no encontrada", 404);
    const recurrence = prepareRecurrence(data, current.recurrence?.seriesId);
    const task = await taskRepository.update(id, owner, { ...data, recurrence });
    if (!task) throw new AppError("Tarea no encontrada", 404);
    if (current.status !== "completed" && task.status === "completed") {
      const nextDate = nextOccurrence(task);
      if (nextDate && !(await taskRepository.findSeriesOccurrence(owner, recurrence.seriesId, nextDate))) {
        await taskRepository.create({ title: task.title, description: task.description, status: "pending", priority: task.priority, dueDate: nextDate, category: task.category._id, recurrence, owner });
      }
    }
    return task;
  },
  async remove(owner, id) {
    if (!(await taskRepository.remove(id, owner))) throw new AppError("Tarea no encontrada", 404);
  }
};
