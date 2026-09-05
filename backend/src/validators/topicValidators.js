import { body } from "express-validator";

export const createTopicValidators = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters"),
  body("subject")
    .notEmpty()
    .withMessage("Subject is required")
    .isMongoId()
    .withMessage("Invalid subject ID format"),
  body("status")
    .optional()
    .isIn(["Not Started", "In Progress", "Completed"])
    .withMessage("Invalid status"),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority"),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),
];

export const updateTopicValidators = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters"),
  body("subject")
    .optional()
    .isMongoId()
    .withMessage("Invalid subject ID format"),
  body("status")
    .optional()
    .isIn(["Not Started", "In Progress", "Completed"])
    .withMessage("Invalid status"),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority"),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),
];
