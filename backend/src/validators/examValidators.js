import { body } from "express-validator";

export const createExamValidators = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters"),
  body("subject")
    .notEmpty()
    .withMessage("Subject is required")
    .isMongoId()
    .withMessage("Invalid subject ID format"),
  body("examDate")
    .notEmpty()
    .withMessage("Exam date is required")
    .isISO8601()
    .withMessage("Exam date must be valid ISO8601"),
  body("examType")
    .optional()
    .isIn(["Internal", "Mid", "Semester", "Practical", "Viva", "Other"])
    .withMessage("Invalid exam type"),
  body("status")
    .optional()
    .isIn(["Upcoming", "Completed"])
    .withMessage("Invalid status"),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),
];

export const updateExamValidators = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters"),
  body("subject")
    .optional()
    .isMongoId()
    .withMessage("Invalid subject ID format"),
  body("examDate")
    .optional()
    .isISO8601()
    .withMessage("Exam date must be valid ISO8601"),
  body("examType")
    .optional()
    .isIn(["Internal", "Mid", "Semester", "Practical", "Viva", "Other"])
    .withMessage("Invalid exam type"),
  body("status")
    .optional()
    .isIn(["Upcoming", "Completed"])
    .withMessage("Invalid status"),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),
];
