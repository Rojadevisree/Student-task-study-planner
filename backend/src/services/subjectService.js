import Subject from "../models/Subject.js";
import { AppError } from "../utils/AppError.js";

import Task from "../models/Task.js";

export async function createSubject(userId, payload) {
  const subject = await Subject.create({
    user: userId,
    name: payload.name,
    difficulty: payload.difficulty,
    color: payload.color,
  });

  return subject.toSafeObject();
}

async function attachProgress(userId, subjectObj) {
  const totalTasks = await Task.countDocuments({ user: userId, subject: subjectObj.id });
  const completedTasks = await Task.countDocuments({ user: userId, subject: subjectObj.id, status: "Completed" });
  let completionPercentage = 0;
  if (totalTasks > 0) {
    completionPercentage = Math.round((completedTasks / totalTasks) * 100);
  }
  return {
    ...subjectObj,
    totalTasks,
    completedTasks,
    completionPercentage
  };
}

export async function getSubjects(userId) {
  const subjects = await Subject.find({ user: userId }).sort({ createdAt: -1 });
  
  // Attach task progress to all subjects
  const mapped = [];
  for (const sub of subjects) {
    mapped.push(await attachProgress(userId, sub.toSafeObject()));
  }
  return mapped;
}

export async function getSubject(userId, subjectId) {
  const subject = await Subject.findOne({ _id: subjectId, user: userId });

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  return await attachProgress(userId, subject.toSafeObject());
}

export async function updateSubject(userId, subjectId, payload) {
  const subject = await Subject.findOne({ _id: subjectId, user: userId });

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  if (payload.name !== undefined) subject.name = payload.name;
  if (payload.difficulty !== undefined) subject.difficulty = payload.difficulty;
  if (payload.color !== undefined) subject.color = payload.color;

  await subject.save();
  return subject.toSafeObject();
}

export async function deleteSubject(userId, subjectId) {
  const subject = await Subject.findOneAndDelete({ _id: subjectId, user: userId });

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  return true;
}
