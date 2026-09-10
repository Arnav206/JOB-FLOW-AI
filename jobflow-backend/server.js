// server.js — the entry point of the whole backend.
// Run with: npm run dev  (or) npm start

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");

// Route files
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

// ---------- Global middleware ----------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Anurag Dubey's Next.js app will call from here
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" })); // parses JSON bodies
app.use(morgan("dev")); // logs each request to the console — helpful while building

// ---------- Health check ----------
app.get("/", (req, res) => {
  res.json({ message: "✅ JobFlow AI backend is running" });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ---------- Feature routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ---------- Global error handler (always last) ----------
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
