-- ============================================================
-- JobFlow AI — Database Schema
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================

-- Needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- ---------- USERS ----------
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

-- ---------- RESUMES ----------
-- Arpan Pandey writes to this table after parsing a resume file.
create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  file_url text,                 -- Cloudinary URL (Piyush sets this up)
  parsed_data jsonb,              -- { skills: [], education: [], experience: [] }
  ats_score numeric,               -- e.g. 0-100
  created_at timestamptz default now()
);

-- ---------- JOBS ----------
-- Arpan Yadav (or a scraper script) inserts job listings here.
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text,
  description text,
  requirements jsonb,             -- e.g. ["React", "Node.js", "SQL"]
  source_url text,
  created_at timestamptz default now()
);

-- ---------- APPLICATIONS ----------
-- One row = one user applying to one job. This is the central table that
-- ties the AI/ML matching output, the automation agent, and the frontend
-- tracker screen all together.
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  resume_id uuid references resumes(id) on delete set null,
  match_score numeric,
  cover_letter text,
  status text default 'pending_approval',
    -- expected values: pending_approval | approved | submitted | interview | rejected | offer
  approved boolean default false,  -- flips to true only when the USER confirms
  submitted_at timestamptz,
  created_at timestamptz default now()
);

-- ---------- APPLICATION STATUS HISTORY (tracking log) ----------
-- Optional but useful: every time `applications.status` changes, log it here
-- so the frontend tracker can show a timeline, not just the latest state.
create table if not exists application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz default now()
);

-- ---------- Helpful indexes ----------
create index if not exists idx_resumes_user_id on resumes(user_id);
create index if not exists idx_applications_user_id on applications(user_id);
create index if not exists idx_applications_job_id on applications(job_id);
create index if not exists idx_status_history_app_id on application_status_history(application_id);
