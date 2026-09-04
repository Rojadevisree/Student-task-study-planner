import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";

function isDuplicateEmailError(error) {
  return error?.code === 11000 && (error.keyPattern?.email || error.keyValue?.email);
}

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });

  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  try {
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return { user: user.toSafeObject(), token };
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      throw new AppError("An account with this email already exists", 409);
    }
    throw error;
  }
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const matches = await user.comparePassword(password);

  if (!matches) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);

  return { user: user.toSafeObject(), token };
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 401);
  }

  return user.toSafeObject();
}
