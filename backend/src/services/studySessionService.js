import StudySession from "../models/StudySession.js";
import Subject from "../models/Subject.js";
import Task from "../models/Task.js";
import { AppError } from "../utils/AppError.js";

async function verifySubjectOwnership(userId, subjectId) {
  const subject = await Subject.findOne({ _id: subjectId, user: userId });
  if (!subject) {
    throw new AppError("Subject not found or does not belong to you", 404);
  }
}

async function verifyTaskOwnership(userId, taskId, subjectId) {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) {
    throw new AppError("Task not found or does not belong to you", 404);
  }
  if (subjectId && String(task.subject) !== String(subjectId)) {
    throw new AppError("Task does not belong to the selected subject", 400);
  }
}

export async function createStudySession(userId, payload) {
  await verifySubjectOwnership(userId, payload.subject);
  
  if (payload.task) {
    await verifyTaskOwnership(userId, payload.task, payload.subject);
  }

  const session = await StudySession.create({
    user: userId,
    subject: payload.subject,
    task: payload.task || null,
    date: payload.date,
    startTime: payload.startTime,
    endTime: payload.endTime || null,
    durationMinutes: payload.durationMinutes,
    notes: payload.notes,
  });

  await session.populate(["subject", "task"]);
  return session.toSafeObject();
}

export async function getStudySessions(userId) {
  const sessions = await StudySession.find({ user: userId })
    .populate(["subject", "task"])
    .sort({ startTime: -1 });
  
  return sessions.map((s) => s.toSafeObject());
}

export async function getStudySession(userId, sessionId) {
  const session = await StudySession.findOne({ _id: sessionId, user: userId }).populate(["subject", "task"]);

  if (!session) {
    throw new AppError("Study session not found", 404);
  }

  return session.toSafeObject();
}

export async function updateStudySession(userId, sessionId, payload) {
  const session = await StudySession.findOne({ _id: sessionId, user: userId });

  if (!session) {
    throw new AppError("Study session not found", 404);
  }

  if (payload.subject && String(payload.subject) !== String(session.subject)) {
    await verifySubjectOwnership(userId, payload.subject);
    session.subject = payload.subject;
  }
  
  // If task changes, or subject changes and we have a task, verify ownership
  if (payload.task !== undefined) {
    if (payload.task) {
      await verifyTaskOwnership(userId, payload.task, session.subject);
      session.task = payload.task;
    } else {
      session.task = null;
    }
  } else if (payload.subject && session.task) {
    // Subject changed, but task didn't. Verify the old task belongs to new subject
    await verifyTaskOwnership(userId, session.task, session.subject);
  }

  if (payload.date !== undefined) session.date = payload.date;
  if (payload.startTime !== undefined) session.startTime = payload.startTime;
  if (payload.endTime !== undefined) session.endTime = payload.endTime;
  if (payload.durationMinutes !== undefined) session.durationMinutes = payload.durationMinutes;
  if (payload.notes !== undefined) session.notes = payload.notes;

  await session.save();
  await session.populate(["subject", "task"]);
  return session.toSafeObject();
}

export async function deleteStudySession(userId, sessionId) {
  const session = await StudySession.findOneAndDelete({ _id: sessionId, user: userId });

  if (!session) {
    throw new AppError("Study session not found", 404);
  }

  return true;
}
