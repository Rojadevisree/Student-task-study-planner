import { sendSuccess } from "../utils/apiResponse.js";
import * as dashboardService from "../services/dashboardService.js";

export async function getDashboardSummary(req, res, next) {
  try {
    const data = await dashboardService.getDashboardData(req.user.id);
    return sendSuccess(res, { statusCode: 200, message: "Dashboard retrieved", data });
  } catch (error) { next(error); }
}

export async function getAnalyticsSummary(req, res, next) {
  try {
    const data = await dashboardService.getAnalyticsData(req.user.id);
    return sendSuccess(res, { statusCode: 200, message: "Analytics retrieved", data });
  } catch (error) { next(error); }
}
