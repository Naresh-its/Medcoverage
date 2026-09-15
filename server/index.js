// server/index.js
// Minimal Express server for MedCoverage API (Supabase‑ready placeholder)

import "dotenv/config";
import express from "express";
import coverageRouter from "./routes/coverageRoutes.js";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use('/api', coverageRouter);
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "MedCoverage API"
  });
});

// Export the app for potential testing or external start scripts
export default app;

const PORT = process.env.PORT || 3005;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`MedCoverage API running on port ${PORT}`);
});