import { getDatabaseStatus } from "../config/db.js";
import { sendSuccess } from "../utils/apiResponse.js";

export function getHealth(_req, res) {
  const database = getDatabaseStatus();
  const healthy = database.readyState === 1;

  return sendSuccess(res, {
    statusCode: 200,
    message: healthy ? "API is running" : "API is running but the database is not connected",
    data: {
      service: "student-planner-api",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      database,
    },
  });
}
