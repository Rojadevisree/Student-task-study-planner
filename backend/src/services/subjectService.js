import Subject from "../models/Subject.js";
import { AppError } from "../utils/AppError.js";

export async function createSubject(userId, payload) {
  const subject = await Subject.create({
    user: userId,
    name: payload.name,
    code: payload.code,
    description: payload.description,
    color: payload.color,
  });

  return subject.toSafeObject();
}

export async function getSubjects(userId) {
  const subjects = await Subject.find({ user: userId }).sort({ createdAt: -1 });
  return subjects.map((sub) => sub.toSafeObject());
}

export async function getSubject(userId, subjectId) {
  const subject = await Subject.findOne({ _id: subjectId, user: userId });

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  return subject.toSafeObject();
}

export async function updateSubject(userId, subjectId, payload) {
  const subject = await Subject.findOne({ _id: subjectId, user: userId });

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  if (payload.name !== undefined) subject.name = payload.name;
  if (payload.code !== undefined) subject.code = payload.code;
  if (payload.description !== undefined) subject.description = payload.description;
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
