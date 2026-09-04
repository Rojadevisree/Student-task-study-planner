import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";

export function generateToken(userId) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET is not configured", 500);
  }

  return jwt.sign({ id: String(userId) }, secret, { expiresIn: "7d" });
}
