import { Router } from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createTaskValidators,
  updateTaskValidators,
} from "../validators/taskValidators.js";

const router = Router();

router.use(requireAuth);

router.post("/", createTaskValidators, validateRequest, createTask);
router.get("/", getTasks);
router.get("/:id", getTask);
router.put("/:id", updateTaskValidators, validateRequest, updateTask);
router.delete("/:id", deleteTask);

export default router;
