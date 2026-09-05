import { sendSuccess } from "../utils/apiResponse.js";
import * as topicService from "../services/topicService.js";

export async function createTopic(req, res, next) {
  try {
    const topic = await topicService.createTopic(req.user.id, req.body);
    return sendSuccess(res, { statusCode: 201, message: "Topic created", data: { topic } });
  } catch (error) { next(error); }
}

export async function getTopics(req, res, next) {
  try {
    const topics = await topicService.getTopics(req.user.id);
    return sendSuccess(res, { statusCode: 200, message: "Topics retrieved", data: { topics } });
  } catch (error) { next(error); }
}

export async function getTopic(req, res, next) {
  try {
    const topic = await topicService.getTopic(req.user.id, req.params.id);
    return sendSuccess(res, { statusCode: 200, message: "Topic retrieved", data: { topic } });
  } catch (error) { next(error); }
}

export async function updateTopic(req, res, next) {
  try {
    const topic = await topicService.updateTopic(req.user.id, req.params.id, req.body);
    return sendSuccess(res, { statusCode: 200, message: "Topic updated", data: { topic } });
  } catch (error) { next(error); }
}

export async function deleteTopic(req, res, next) {
  try {
    await topicService.deleteTopic(req.user.id, req.params.id);
    return sendSuccess(res, { statusCode: 200, message: "Topic deleted", data: null });
  } catch (error) { next(error); }
}
