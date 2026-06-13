import { Category } from "../models/Category.js";

export const categoryRepository = {
  create: (data) => Category.create(data),
  findAll: (owner) => Category.find({ owner }).sort({ name: 1 }),
  findOwnedById: (id, owner) => Category.findOne({ _id: id, owner }),
  update: (id, owner, data) => Category.findOneAndUpdate({ _id: id, owner }, data, { new: true, runValidators: true }),
  remove: (id, owner) => Category.findOneAndDelete({ _id: id, owner }),
  count: (owner) => Category.countDocuments({ owner })
};
