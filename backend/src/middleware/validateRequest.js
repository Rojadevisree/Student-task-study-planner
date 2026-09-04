import { validationResult } from "express-validator";
import { sendError } from "../utils/apiResponse.js";

export function validateRequest(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((item) => ({
    field: item.path,
    message: item.msg,
  }));

  return sendError(res, {
    statusCode: 400,
    message: "Validation failed",
    errors,
  });
}
