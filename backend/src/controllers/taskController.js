import { sendSuccess } from "../utils/apiResponse.js";
import * as taskService from "../services/taskService.js";

export async function createTask(req, res, next) {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: "Task created",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTasks(req, res, next) {
  try {
    const tasks = await taskService.getTasks(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Tasks retrieved",
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = await taskService.getTask(req.user.id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Task retrieved",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Task updated",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    await taskService.deleteTask(req.user.id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Task deleted",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}
