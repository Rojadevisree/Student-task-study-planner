import { sendSuccess } from "../utils/apiResponse.js";
import * as studySessionService from "../services/studySessionService.js";

export async function createStudySession(req, res, next) {
  try {
    const studySession = await studySessionService.createStudySession(req.user.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: "Study session created",
      data: { studySession },
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudySessions(req, res, next) {
  try {
    const studySessions = await studySessionService.getStudySessions(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Study sessions retrieved",
      data: { studySessions },
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudySession(req, res, next) {
  try {
    const studySession = await studySessionService.getStudySession(req.user.id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Study session retrieved",
      data: { studySession },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStudySession(req, res, next) {
  try {
    const studySession = await studySessionService.updateStudySession(req.user.id, req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Study session updated",
      data: { studySession },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteStudySession(req, res, next) {
  try {
    await studySessionService.deleteStudySession(req.user.id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Study session deleted",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}
