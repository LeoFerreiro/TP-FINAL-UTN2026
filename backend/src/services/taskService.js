import { taskRepository } from "../repositories/taskRepository.js";
import { categoryRepository } from "../repositories/categoryRepository.js";
import { AppError } from "../utils/AppError.js";

async function validateCategory(owner, categoryId) {
  if (!(await categoryRepository.findOwnedById(categoryId, owner))) throw new AppError("Categoría inválida", 400);
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
    return (await taskRepository.create({ ...data, owner })).populate("category");
  },
  async update(owner, id, data) {
    if (data.category) await validateCategory(owner, data.category);
    const task = await taskRepository.update(id, owner, data);
    if (!task) throw new AppError("Tarea no encontrada", 404);
    return task;
  },
  async remove(owner, id) {
    if (!(await taskRepository.remove(id, owner))) throw new AppError("Tarea no encontrada", 404);
  }
};
