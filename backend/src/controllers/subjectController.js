import { sendSuccess } from "../utils/apiResponse.js";
import * as subjectService from "../services/subjectService.js";

export async function createSubject(req, res, next) {
  try {
    const subject = await subjectService.createSubject(req.user.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: "Subject created",
      data: { subject },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSubjects(req, res, next) {
  try {
    const subjects = await subjectService.getSubjects(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Subjects retrieved",
      data: { subjects },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSubject(req, res, next) {
  try {
    const subject = await subjectService.getSubject(req.user.id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Subject retrieved",
      data: { subject },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSubject(req, res, next) {
  try {
    const subject = await subjectService.updateSubject(req.user.id, req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Subject updated",
      data: { subject },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSubject(req, res, next) {
  try {
    await subjectService.deleteSubject(req.user.id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Subject deleted",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}
