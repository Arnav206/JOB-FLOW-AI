// routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const {
  getJobs,
  createJob,
  getMatchesForResume,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getJobs);
router.post("/", createJob);
router.get("/matches/:resumeId", getMatchesForResume);

module.exports = router;
