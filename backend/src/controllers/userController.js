import { sendSuccess } from "../utils/apiResponse.js";
import * as userService from "../services/userService.js";

export async function getProfile(req, res, next) {
  try {
    const user = await userService.getProfile(req.user.id);

    return sendSuccess(res, {
      statusCode: 200,
      message: "Profile retrieved",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const user = await userService.updateProfile(req.user.id, {
      name: req.body.name,
      timezone: req.body.timezone,
      pomodoroSettings: req.body.pomodoroSettings,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: "Profile updated",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}
