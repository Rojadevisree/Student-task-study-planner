import { sendError } from "../utils/apiResponse.js";

export function notFoundHandler(req, res) {
  return sendError(res, {
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function mapError(err) {
  if (err?.code === 11000) {
    return {
      statusCode: 409,
      message: "An account with this email already exists",
      errors: [],
    };
  }

  if (err?.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((item) => ({
      field: item.path,
      message: item.message,
    }));

    return {
      statusCode: 400,
      message: "Validation failed",
      errors,
    };
  }

  return {
    statusCode: err.statusCode || 500,
    message: err.message || "Something went wrong",
    errors: err.errors || [],
  };
}

export function errorHandler(err, _req, res, _next) {
  const mapped = mapError(err);
  const isProduction = process.env.NODE_ENV === "production";
  const message =
    isProduction && mapped.statusCode === 500 ? "Something went wrong" : mapped.message;

  return sendError(res, {
    statusCode: mapped.statusCode,
    message,
    errors: mapped.errors,
  });
}
