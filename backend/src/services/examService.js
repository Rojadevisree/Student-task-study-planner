import Exam from "../models/Exam.js";
import Subject from "../models/Subject.js";
import { AppError } from "../utils/AppError.js";

async function verifySubjectOwnership(userId, subjectId) {
  const subject = await Subject.findOne({ _id: subjectId, user: userId });
  if (!subject) {
    throw new AppError("Subject not found or does not belong to you", 404);
  }
}

export async function createExam(userId, payload) {
  await verifySubjectOwnership(userId, payload.subject);

  const exam = await Exam.create({
    user: userId,
    subject: payload.subject,
    title: payload.title,
    examDate: payload.examDate,
    examType: payload.examType,
    status: payload.status,
    description: payload.description,
  });

  await exam.populate("subject");
  return exam.toSafeObject();
}

export async function getExams(userId) {
  const exams = await Exam.find({ user: userId })
    .populate("subject")
    .sort({ examDate: 1 });
  return exams.map((e) => e.toSafeObject());
}

export async function getExam(userId, examId) {
  const exam = await Exam.findOne({ _id: examId, user: userId }).populate("subject");
  if (!exam) {
    throw new AppError("Exam not found", 404);
  }
  return exam.toSafeObject();
}

export async function updateExam(userId, examId, payload) {
  const exam = await Exam.findOne({ _id: examId, user: userId });
  if (!exam) {
    throw new AppError("Exam not found", 404);
  }

  if (payload.subject && String(payload.subject) !== String(exam.subject)) {
    await verifySubjectOwnership(userId, payload.subject);
    exam.subject = payload.subject;
  }

  if (payload.title !== undefined) exam.title = payload.title;
  if (payload.examDate !== undefined) exam.examDate = payload.examDate;
  if (payload.examType !== undefined) exam.examType = payload.examType;
  if (payload.status !== undefined) exam.status = payload.status;
  if (payload.description !== undefined) exam.description = payload.description;

  await exam.save();
  await exam.populate("subject");
  return exam.toSafeObject();
}

export async function deleteExam(userId, examId) {
  const exam = await Exam.findOneAndDelete({ _id: examId, user: userId });
  if (!exam) {
    throw new AppError("Exam not found", 404);
  }
  return true;
}
