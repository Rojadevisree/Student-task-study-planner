import { body } from "express-validator";

export const updateProfileValidators = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters"),
  body("timezone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Timezone cannot be empty")
    .isLength({ max: 80 })
    .withMessage("Timezone must be at most 80 characters"),
  body("pomodoroSettings").optional().isObject().withMessage("Pomodoro settings must be an object"),
  body("pomodoroSettings.workMinutes").optional().isInt({ min: 1, max: 120 }).withMessage("Work minutes must be between 1 and 120"),
  body("pomodoroSettings.shortBreakMinutes")
    .optional()
    .isInt({ min: 1, max: 60 })
    .withMessage("Short break minutes must be between 1 and 60"),
  body("pomodoroSettings.longBreakMinutes")
    .optional()
    .isInt({ min: 1, max: 60 })
    .withMessage("Long break minutes must be between 1 and 60"),
  body("pomodoroSettings.sessionsUntilLongBreak")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Sessions until long break must be between 1 and 12"),
];
