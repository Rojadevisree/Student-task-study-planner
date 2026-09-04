import Task from "../models/Task.js";
import Subject from "../models/Subject.js";
import { AppError } from "../utils/AppError.js";

async function verifySubjectOwnership(userId, subjectId) {
  const subject = await Subject.findOne({ _id: subjectId, user: userId });
  if (!subject) {
    throw new AppError("Subject not found or does not belong to you", 404);
  }
}

export async function createTask(userId, payload) {
  await verifySubjectOwnership(userId, payload.subject);

  const task = await Task.create({
    user: userId,
    subject: payload.subject,
    title: payload.title,
    description: payload.description,
    dueDate: payload.dueDate,
    priority: payload.priority || "Medium",
    status: payload.status || "Pending",
  });

  await task.populate("subject");
  return task.toSafeObject();
}

export async function getTasks(userId) {
  const tasks = await Task.find({ user: userId })
    .populate("subject")
    .sort({ dueDate: 1, createdAt: 1 });
  
  return tasks.map((task) => task.toSafeObject());
}

export async function getTask(userId, taskId) {
  const task = await Task.findOne({ _id: taskId, user: userId }).populate("subject");

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task.toSafeObject();
}

export async function updateTask(userId, taskId, payload) {
  const task = await Task.findOne({ _id: taskId, user: userId });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (payload.subject && String(payload.subject) !== String(task.subject)) {
    await verifySubjectOwnership(userId, payload.subject);
    task.subject = payload.subject;
  }

  if (payload.title !== undefined) task.title = payload.title;
  if (payload.description !== undefined) task.description = payload.description;
  if (payload.dueDate !== undefined) task.dueDate = payload.dueDate;
  if (payload.priority !== undefined) task.priority = payload.priority;
  if (payload.status !== undefined) task.status = payload.status;

  await task.save();
  await task.populate("subject");
  return task.toSafeObject();
}

export async function deleteTask(userId, taskId) {
  const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return true;
}
