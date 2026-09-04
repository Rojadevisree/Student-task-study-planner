import { sendSuccess } from "../utils/apiResponse.js";
import * as authService from "../services/authService.js";

export async function register(req, res, next) {
  try {
    const result = await authService.registerUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.loginUser({
      email: req.body.email,
      password: req.body.password,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: "Logged in successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id);

    return sendSuccess(res, {
      statusCode: 200,
      message: "Current user",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(_req, res) {
  return sendSuccess(res, {
    statusCode: 200,
    message: "Logged out successfully. Remove the token on the client.",
    data: null,
  });
}
