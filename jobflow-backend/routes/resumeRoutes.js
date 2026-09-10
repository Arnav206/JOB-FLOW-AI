// routes/resumeRoutes.js
const express = require("express");
const router = express.Router();
const {
  createResume,
  getMyResumes,
  getResumeById,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");

// Every resume route requires a logged-in user
router.use(protect);

router.post("/", createResume);
router.get("/", getMyResumes);
router.get("/:id", getResumeById);

module.exports = router;
