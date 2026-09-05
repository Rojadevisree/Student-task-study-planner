import { Router } from "express";
import { getDashboardSummary, getAnalyticsSummary } from "../controllers/dashboardController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();
router.use(requireAuth);

router.get("/summary", getDashboardSummary);
router.get("/analytics", getAnalyticsSummary);

export default router;
