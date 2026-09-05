import { Router } from "express";
import { createTopic, getTopics, getTopic, updateTopic, deleteTopic } from "../controllers/topicController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createTopicValidators, updateTopicValidators } from "../validators/topicValidators.js";

const router = Router();
router.use(requireAuth);

router.post("/", createTopicValidators, validateRequest, createTopic);
router.get("/", getTopics);
router.get("/:id", getTopic);
router.put("/:id", updateTopicValidators, validateRequest, updateTopic);
router.delete("/:id", deleteTopic);

export default router;
