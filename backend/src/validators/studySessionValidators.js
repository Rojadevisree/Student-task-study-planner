import { body } from "express-validator";

export const createStudySessionValidators = [
  body("subject")
    .notEmpty()
    .withMessage("Subject is required")
    .isMongoId()
    .withMessage("Invalid subject ID format"),
  body("task")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid task ID format"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be valid ISO8601"),
  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Start time must be valid ISO8601"),
  body("endTime")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("End time must be valid ISO8601"),
  body("durationMinutes")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1 })
    .withMessage("Duration must be at least 1 minute"),
  body("notes")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes must be at most 1000 characters"),
];

export const updateStudySessionValidators = [
  body("subject")
    .optional()
    .isMongoId()
    .withMessage("Invalid subject ID format"),
  body("task")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid task ID format"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be valid ISO8601"),
  body("startTime")
    .optional()
    .isISO8601()
    .withMessage("Start time must be valid ISO8601"),
  body("endTime")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("End time must be valid ISO8601"),
  body("durationMinutes")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be at least 1 minute"),
  body("notes")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes must be at most 1000 characters"),
];
