export function sendSuccess(res, { statusCode = 200, data = null, message = "OK" } = {}) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    errors: [],
  });
}

export function sendError(res, { statusCode = 500, message = "Something went wrong", errors = [] } = {}) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    errors,
  });
}
