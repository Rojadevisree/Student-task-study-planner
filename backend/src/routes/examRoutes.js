import { Router } from "express";
import { createExam, getExams, getExam, updateExam, deleteExam } from "../controllers/examController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createExamValidators, updateExamValidators } from "../validators/examValidators.js";

const router = Router();
router.use(requireAuth);

router.post("/", createExamValidators, validateRequest, createExam);
router.get("/", getExams);
router.get("/:id", getExam);
router.put("/:id", updateExamValidators, validateRequest, updateExam);
router.delete("/:id", deleteExam);

export default router;
