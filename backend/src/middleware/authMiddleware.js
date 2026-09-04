import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendError } from "../utils/apiResponse.js";

function getBearerToken(req) {
  const header = req.headers.authorization;

  if (!header || typeof header !== "string") {
    return null;
  }

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

export async function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return sendError(res, {
        statusCode: 401,
        message: "Authentication required",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return sendError(res, {
        statusCode: 500,
        message: "Authentication is not configured",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return sendError(res, {
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, {
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }

    req.user = {
      id: String(user._id),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
}
