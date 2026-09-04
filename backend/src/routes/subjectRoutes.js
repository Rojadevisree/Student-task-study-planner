import { Router } from "express";
import {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createSubjectValidators,
  updateSubjectValidators,
} from "../validators/subjectValidators.js";

const router = Router();

router.use(requireAuth);

router.post("/", createSubjectValidators, validateRequest, createSubject);
router.get("/", getSubjects);
router.get("/:id", getSubject);
router.put("/:id", updateSubjectValidators, validateRequest, updateSubject);
router.delete("/:id", deleteSubject);

export default router;
