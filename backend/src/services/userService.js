import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export async function getProfile(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user.toSafeObject();
}

export async function updateProfile(userId, payload) {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const { name, timezone, pomodoroSettings } = payload;

  if (name !== undefined) {
    user.name = name;
  }

  if (timezone !== undefined) {
    user.timezone = timezone;
  }

  if (pomodoroSettings) {
    const current = user.pomodoroSettings?.toObject?.() ?? user.pomodoroSettings ?? {};
    const allowed = {};

    if (pomodoroSettings.workMinutes !== undefined) {
      allowed.workMinutes = pomodoroSettings.workMinutes;
    }
    if (pomodoroSettings.shortBreakMinutes !== undefined) {
      allowed.shortBreakMinutes = pomodoroSettings.shortBreakMinutes;
    }
    if (pomodoroSettings.longBreakMinutes !== undefined) {
      allowed.longBreakMinutes = pomodoroSettings.longBreakMinutes;
    }
    if (pomodoroSettings.sessionsUntilLongBreak !== undefined) {
      allowed.sessionsUntilLongBreak = pomodoroSettings.sessionsUntilLongBreak;
    }

    user.pomodoroSettings = {
      ...current,
      ...allowed,
    };
  }

  await user.save();

  return user.toSafeObject();
}
