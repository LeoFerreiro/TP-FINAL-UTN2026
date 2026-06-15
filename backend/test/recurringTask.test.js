import assert from "node:assert/strict";
import test from "node:test";
import { categoryRepository } from "../src/repositories/categoryRepository.js";
import { taskRepository } from "../src/repositories/taskRepository.js";
import { taskService } from "../src/services/taskService.js";

test("al completar una tarea recurrente crea la siguiente fecha seleccionada", async () => {
  const originals = { category: categoryRepository.findOwnedById, find: taskRepository.findOwnedById, update: taskRepository.update, occurrence: taskRepository.findSeriesOccurrence, create: taskRepository.create };
  const created = [];
  const recurrence = { enabled: true, weekdays: [1, 3], endDate: "2026-06-30", seriesId: "series-1" };
  const current = { _id: "task-1", title: "Entrenar", description: "Rutina", status: "in_progress", priority: "medium", dueDate: new Date("2026-06-15T00:00:00.000Z"), category: { _id: "category-1" }, recurrence };

  categoryRepository.findOwnedById = async () => ({ _id: "category-1" });
  taskRepository.findOwnedById = async () => current;
  taskRepository.update = async (_id, _owner, data) => ({ ...current, ...data, dueDate: new Date(data.dueDate), category: current.category });
  taskRepository.findSeriesOccurrence = async () => null;
  taskRepository.create = async (data) => { created.push(data); return data; };

  try {
    await taskService.update("owner-1", "task-1", { ...current, category: "category-1", dueDate: "2026-06-15", status: "completed", recurrence });
    assert.equal(created.length, 1);
    assert.equal(created[0].status, "pending");
    assert.equal(created[0].dueDate.toISOString().slice(0, 10), "2026-06-17");
  } finally {
    categoryRepository.findOwnedById = originals.category;
    taskRepository.findOwnedById = originals.find;
    taskRepository.update = originals.update;
    taskRepository.findSeriesOccurrence = originals.occurrence;
    taskRepository.create = originals.create;
  }
});

test("limpiar una completada recurrente detiene y elimina toda su serie", async () => {
  const originals = { findCompleted: taskRepository.findCompleted, removeCompletedAndSeries: taskRepository.removeCompletedAndSeries };
  let received;
  taskRepository.findCompleted = async () => [{ _id: "completed-1", recurrence: { seriesId: "series-1" } }];
  taskRepository.removeCompletedAndSeries = async (owner, taskIds, seriesIds) => {
    received = { owner, taskIds, seriesIds };
    return { deletedCount: 2 };
  };

  try {
    const result = await taskService.cleanupCompleted("owner-1", { ids: ["completed-1"], all: false });
    assert.deepEqual(received, { owner: "owner-1", taskIds: ["completed-1"], seriesIds: ["series-1"] });
    assert.deepEqual(result, { deletedCount: 2, stoppedSeries: 1 });
  } finally {
    taskRepository.findCompleted = originals.findCompleted;
    taskRepository.removeCompletedAndSeries = originals.removeCompletedAndSeries;
  }
});
