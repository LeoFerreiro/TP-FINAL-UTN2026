import { categoryRepository } from "../repositories/categoryRepository.js";
import { taskRepository } from "../repositories/taskRepository.js";
import { AppError } from "../utils/AppError.js";

// Service: contiene reglas de negocio y coordina repositories. En particular,
// no permite eliminar categorías que todavía tengan tareas relacionadas.
export const categoryService = {
  list: (owner) => categoryRepository.findAll(owner),
  create: (owner, data) => categoryRepository.create({ ...data, owner }),
  async update(owner, id, data) {
    const category = await categoryRepository.update(id, owner, data);
    if (!category) throw new AppError("Categoría no encontrada", 404);
    return category;
  },
  async remove(owner, id) {
    if (await taskRepository.countByCategory(id, owner)) throw new AppError("No podés eliminar una categoría con tareas", 409);
    const category = await categoryRepository.remove(id, owner);
    if (!category) throw new AppError("Categoría no encontrada", 404);
  }
};
