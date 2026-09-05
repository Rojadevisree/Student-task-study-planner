import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import studySessionRoutes from "./routes/studySessionRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

export function createApp() {
  const app = express();
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  app.use(helmet());
  app.use(
    cors({
      origin: clientUrl,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/", (_req, res) => {
    res.json({
      success: true,
      message: "Student Task & Study Planner API",
      data: { health: "/api/health" },
      errors: [],
    });
  });

  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/subjects", subjectRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/study-sessions", studySessionRoutes);
  app.use("/api/exams", examRoutes);
  app.use("/api/topics", topicRoutes);
  app.use("/api/notifications", notificationRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
