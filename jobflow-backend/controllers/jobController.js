// controllers/jobController.js
// Skeleton for job listings + match scores. Arpan Yadav will build the real
// matching algorithm; these handlers already give him a place to plug it in.

const supabase = require("../config/supabaseClient");

// @route  GET /api/jobs
// @desc   List all jobs (optionally add query filters later)
// @access Private
async function getJobs(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json({ jobs: data });
  } catch (err) {
    next(err);
  }
}

// @route  POST /api/jobs
// @desc   Add a job listing (manual entry or from a scraper script)
// @access Private
// Expected body: { title, company, description, requirements: [], source_url }
async function createJob(req, res, next) {
  try {
    const { title, company, description, requirements, source_url } = req.body;

    const { data, error } = await supabase
      .from("jobs")
      .insert([{ title, company, description, requirements, source_url }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ job: data });
  } catch (err) {
    next(err);
  }
}

// @route  GET /api/jobs/matches/:resumeId
// @desc   Placeholder endpoint for Arpan Yadav's match engine.
//         For now it just returns all jobs; he will replace the body
//         of this function with real scoring logic against the resume.
// @access Private
async function getMatchesForResume(req, res, next) {
  try {
    const { resumeId } = req.params;

    // TODO (Arpan Yadav): fetch resume by resumeId, compare skills against
    // jobs.requirements, and return jobs sorted by match_score.
    const { data: jobs, error } = await supabase.from("jobs").select("*");
    if (error) throw error;

    res.status(200).json({
      resume_id: resumeId,
      matches: jobs.map((job) => ({ ...job, match_score: null })), // placeholder
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getJobs, createJob, getMatchesForResume };
