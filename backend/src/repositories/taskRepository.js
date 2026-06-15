import { Task } from "../models/Task.js";

export const taskRepository = {
  create: (data) => Task.create(data),
  findAll: (owner, filters = {}) => Task.find({ owner, ...filters }).populate("category").sort({ dueDate: 1 }),
  findOwnedById: (id, owner) => Task.findOne({ _id: id, owner }).populate("category"),
  findSeriesOccurrence: (owner, seriesId, dueDate) => Task.findOne({ owner, "recurrence.seriesId": seriesId, dueDate }),
  findCompleted: (owner, ids) => Task.find({ owner, status: "completed", ...(ids?.length ? { _id: { $in: ids } } : {}) }),
  update: (id, owner, data) => Task.findOneAndUpdate({ _id: id, owner }, data, { new: true, runValidators: true }).populate("category"),
  remove: (id, owner) => Task.findOneAndDelete({ _id: id, owner }),
  removeCompletedAndSeries: (owner, taskIds, seriesIds) => Task.deleteMany({ owner, $or: [{ _id: { $in: taskIds } }, ...(seriesIds.length ? [{ "recurrence.seriesId": { $in: seriesIds } }] : [])] }),
  countByCategory: (category, owner) => Task.countDocuments({ category, owner })
};
