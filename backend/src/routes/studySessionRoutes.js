import { Router } from "express";
import {
  createStudySession,
  getStudySessions,
  getStudySession,
  updateStudySession,
  deleteStudySession,
} from "../controllers/studySessionController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createStudySessionValidators,
  updateStudySessionValidators,
} from "../validators/studySessionValidators.js";

const router = Router();

router.use(requireAuth);

router.post("/", createStudySessionValidators, validateRequest, createStudySession);
router.get("/", getStudySessions);
router.get("/:id", getStudySession);
router.put("/:id", updateStudySessionValidators, validateRequest, updateStudySession);
router.delete("/:id", deleteStudySession);

export default router;
