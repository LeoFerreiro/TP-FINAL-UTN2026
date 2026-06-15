import { taskService } from "../services/taskService.js";

// Controlador HTTP de tareas. req.userId proviene del middleware JWT, por lo
// que cada operación queda limitada al usuario autenticado.
export const taskController = {
  async list(req, res) { res.json(await taskService.list(req.userId, req.query)); },
  async get(req, res) { res.json(await taskService.get(req.userId, req.params.id)); },
  async create(req, res) { res.status(201).json(await taskService.create(req.userId, req.body)); },
  async update(req, res) { res.json(await taskService.update(req.userId, req.params.id, req.body)); },
  async remove(req, res) { await taskService.remove(req.userId, req.params.id); res.status(204).end(); },
  async cleanupCompleted(req, res) { res.json(await taskService.cleanupCompleted(req.userId, req.body)); }
};
