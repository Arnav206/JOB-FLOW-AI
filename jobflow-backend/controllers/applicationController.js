// controllers/applicationController.js
// Skeleton for the application-tracking table. This is the handoff point
// with Anurag Dev Mishra's automation agent: he flips `approved` to true,
// then his script does the actual form-filling and updates `status`.

const supabase = require("../config/supabaseClient");

// @route  POST /api/applications
// @desc   Create a new application record (before auto-submission)
// @access Private
// Expected body: { job_id, resume_id, match_score, cover_letter }
async function createApplication(req, res, next) {
  try {
    const { job_id, resume_id, match_score, cover_letter } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("applications")
      .insert([
        {
          user_id: userId,
          job_id,
          resume_id,
          match_score,
          cover_letter,
          status: "pending_approval",
          approved: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ application: data });
  } catch (err) {
    next(err);
  }
}

// @route  GET /api/applications
// @desc   Get all applications for the logged-in user (the tracker screen)
// @access Private
async function getMyApplications(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*, jobs(title, company)")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json({ applications: data });
  } catch (err) {
    next(err);
  }
}

// @route  PATCH /api/applications/:id/approve
// @desc   User clicks "confirm" — this is the gate before Anurag Dev
//         Mishra's automation is allowed to actually submit the form.
// @access Private
async function approveApplication(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("applications")
      .update({ approved: true, status: "approved" })
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json({ application: data });
  } catch (err) {
    next(err);
  }
}

// @route  PATCH /api/applications/:id/status
// @desc   Automation agent (or Piyush's tests) update status after submitting
// @access Private
// Expected body: { status: "submitted" | "rejected" | "interview" | ... }
async function updateApplicationStatus(req, res, next) {
  try {
    const { status } = req.body;

    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json({ application: data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createApplication,
  getMyApplications,
  approveApplication,
  updateApplicationStatus,
};
