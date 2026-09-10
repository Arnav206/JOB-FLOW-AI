// controllers/resumeController.js
// This is the API SKELETON for resumes. Arpan Pandey will fill in the real
// parsing/AI logic inside these handlers later — the routes, auth checks,
// and DB read/write pattern are already wired up for him.

const supabase = require("../config/supabaseClient");

// @route  POST /api/resumes
// @desc   Save a parsed resume for the logged-in user
// @access Private
// Expected body (agree on this shape with Arpan Pandey):
// { file_url, parsed_data: { skills: [], education: [], experience: [] }, ats_score }
async function createResume(req, res, next) {
  try {
    const { file_url, parsed_data, ats_score } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("resumes")
      .insert([{ user_id: userId, file_url, parsed_data, ats_score }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ resume: data });
  } catch (err) {
    next(err);
  }
}

// @route  GET /api/resumes
// @desc   Get all resumes belonging to the logged-in user
// @access Private
async function getMyResumes(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json({ resumes: data });
  } catch (err) {
    next(err);
  }
}

// @route  GET /api/resumes/:id
// @desc   Get a single resume by id (only if it belongs to the user)
// @access Private
async function getResumeById(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.status(200).json({ resume: data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createResume, getMyResumes, getResumeById };
