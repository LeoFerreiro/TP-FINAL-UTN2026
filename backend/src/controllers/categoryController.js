import { categoryService } from "../services/categoryService.js";

export const categoryController = {
  async list(req, res) { res.json(await categoryService.list(req.userId)); },
  async create(req, res) { res.status(201).json(await categoryService.create(req.userId, req.body)); },
  async update(req, res) { res.json(await categoryService.update(req.userId, req.params.id, req.body)); },
  async remove(req, res) { await categoryService.remove(req.userId, req.params.id); res.status(204).end(); }
};
