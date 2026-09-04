import dotenv from "dotenv";
import { createApp } from "./src/app.js";
import { connectDatabase } from "./src/config/db.js";

dotenv.config();

const port = Number(process.env.PORT) || 5000;
const app = createApp();

async function start() {
  try {
    await connectDatabase();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("The API will still start. GET /api/health will report the database status.");
  }

  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

start();
