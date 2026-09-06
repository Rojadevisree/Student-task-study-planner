import { body } from "express-validator";

export const createSubjectValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Subject name is required")
    .isLength({ max: 100 })
    .withMessage("Subject name must be at most 100 characters"),
  body("difficulty")
    .notEmpty()
    .withMessage("Difficulty is required")
    .isIn(["Easy", "Medium", "Hard"])
    .withMessage("Difficulty must be Easy, Medium, or Hard"),
  body("color")
    .trim()
    .notEmpty()
    .withMessage("Color is required")
    .isLength({ max: 30 })
    .withMessage("Color must be at most 30 characters"),
];

export const updateSubjectValidators = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Subject name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Subject name must be at most 100 characters"),
  body("difficulty")
    .optional()
    .isIn(["Easy", "Medium", "Hard"])
    .withMessage("Difficulty must be Easy, Medium, or Hard"),
  body("color")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Color cannot be empty")
    .isLength({ max: 30 })
    .withMessage("Color must be at most 30 characters"),
];
