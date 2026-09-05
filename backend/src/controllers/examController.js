import { sendSuccess } from "../utils/apiResponse.js";
import * as examService from "../services/examService.js";

export async function createExam(req, res, next) {
  try {
    const exam = await examService.createExam(req.user.id, req.body);
    return sendSuccess(res, { statusCode: 201, message: "Exam created", data: { exam } });
  } catch (error) { next(error); }
}

export async function getExams(req, res, next) {
  try {
    const exams = await examService.getExams(req.user.id);
    return sendSuccess(res, { statusCode: 200, message: "Exams retrieved", data: { exams } });
  } catch (error) { next(error); }
}

export async function getExam(req, res, next) {
  try {
    const exam = await examService.getExam(req.user.id, req.params.id);
    return sendSuccess(res, { statusCode: 200, message: "Exam retrieved", data: { exam } });
  } catch (error) { next(error); }
}

export async function updateExam(req, res, next) {
  try {
    const exam = await examService.updateExam(req.user.id, req.params.id, req.body);
    return sendSuccess(res, { statusCode: 200, message: "Exam updated", data: { exam } });
  } catch (error) { next(error); }
}

export async function deleteExam(req, res, next) {
  try {
    await examService.deleteExam(req.user.id, req.params.id);
    return sendSuccess(res, { statusCode: 200, message: "Exam deleted", data: null });
  } catch (error) { next(error); }
}
