# JobFlow AI

An AI-powered job application assistant — parses your resume, matches you to relevant jobs, generates tailored cover letters, and (with your approval) auto-fills job applications.

## Team & Roles

| Name | Role |
| Arnav | Team Lead / Backend Architecture (Express, Auth, Database) |
| Arpan Pandey | AI/ML — Resume Parsing & ATS Scoring |
| Arpan Yadav | AI/ML — Job Matching & Cover Letter Generation |
| Anurag Dev Mishra | Automation — Auto-fill & Submission (Playwright) |
| Anurag Dubey | Frontend (Next.js + Tailwind) |
| Piyush Pandey | Integration, QA & Deployment |

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **Auth:** JWT
- **Frontend:** Next.js, Tailwind CSS
- **AI:** OpenAI / Gemini API
- **Automation:** Playwright
- **File Storage:** Cloudinary
- **Email:** Nodemailer
- **Deployment:** Vercel (frontend), Render (backend)

## Project Structure

```
/backend    → Express API, auth, database logic
/frontend   → Next.js app
/automation → Playwright scripts for auto-filling applications
/docs       → API contract, schema notes, planning docs
```
> Setup instructions for each folder coming soon as the pieces come online.

## Getting Started

Setup instructions will be added here once the backend and frontend scaffolding is in place. For now:

1. Clone the repo
2. Check `/docs` for the current API contract before building against any endpoint
3. Create a feature branch off `main` — see branch naming convention below

## Branch & Contribution Conventions

- Branch names: `feature/short-description` (e.g. `feature/resume-upload`, `feature/jwt-auth`)
- No direct pushes to `main` — all work goes through a pull request
- At least one reviewer approval required before merging
- Keep commit messages short and descriptive

## API Contract

Before building against any endpoint, check `/docs/API-CONTRACT.md` for the current request/response shapes. If a field name needs to change, raise it with the team before implementing.


