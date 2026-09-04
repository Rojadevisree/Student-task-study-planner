import { body } from "express-validator";

export const createSubjectValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Subject name is required")
    .isLength({ max: 100 })
    .withMessage("Subject name must be at most 100 characters"),
  body("code")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage("Subject code must be at most 20 characters"),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters"),
  body("color")
    .optional({ checkFalsy: true })
    .trim()
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
  body("code")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage("Subject code must be at most 20 characters"),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters"),
  body("color")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 30 })
    .withMessage("Color must be at most 30 characters"),
];
