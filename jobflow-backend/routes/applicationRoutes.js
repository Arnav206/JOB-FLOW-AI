// routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  approveApplication,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createApplication);
router.get("/", getMyApplications);
router.patch("/:id/approve", approveApplication);
router.patch("/:id/status", updateApplicationStatus);

module.exports = router;
