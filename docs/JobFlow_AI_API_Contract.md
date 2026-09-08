# JobFlow AI — API Contract (Draft v0.1)

**Owner:** Arnav (Backend)
**Status:** Draft — share with team, lock field names before anyone builds against this
**Base URL (local dev):** `http://localhost:5000/api`

## Purpose

This doc is the single source of truth for what every endpoint expects and returns.
Everyone should build against this — even before the real backend exists — using mocked
responses that match this shape. If a field name needs to change, edit this doc first,
then ping the team, then change the code.

---

## Conventions

- All requests/responses are JSON.
- All timestamps are ISO 8601 strings (`"2026-08-25T14:30:00Z"`).
- All IDs are strings (UUIDs).
- Authenticated routes require header: `Authorization: Bearer <token>`
- Field names are `camelCase` everywhere — frontend, backend, and AI output must match this.

### Standard error shape (every error, every endpoint)

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Human-readable explanation"
  }
}
```

### Standard success wrapper (optional but recommended)

```json
{
  "data": { }
}
```

---

## 1. Auth (Arnav)

### POST `/auth/signup`
**Request**
```json
{ "name": "Arnav Sharma", "email": "arnav@example.com", "password": "min8chars" }
```
**Response 201**
```json
{ "data": { "userId": "uuid", "token": "jwt-token" } }
```

### POST `/auth/login`
**Request**
```json
{ "email": "arnav@example.com", "password": "min8chars" }
```
**Response 200**
```json
{ "data": { "userId": "uuid", "token": "jwt-token" } }
```

### GET `/auth/me` *(auth required)*
**Response 200**
```json
{ "data": { "userId": "uuid", "name": "Arnav Sharma", "email": "arnav@example.com" } }
```

---

## 2. Resumes (Arpan Pandey — parsing/scoring)

### POST `/resumes/upload` *(auth required, multipart/form-data)*
Uploads a raw PDF/DOCX file. Returns the parsed structured data.

**Request:** form-data field `file`

**Response 201**
```json
{
  "data": {
    "resumeId": "uuid",
    "rawFileUrl": "https://cloudinary.../resume.pdf",
    "parsed": {
      "name": "string",
      "email": "string",
      "skills": ["React", "Node.js", "SQL"],
      "education": [
        { "degree": "B.Tech CSE", "institution": "string", "year": 2026 }
      ],
      "experience": [
        { "title": "string", "company": "string", "durationMonths": 6, "description": "string" }
      ]
    },
    "atsScore": {
      "score": 78,
      "issues": ["Missing 'Skills' section header", "Contact info not found in first 3 lines"]
    }
  }
}
```
> **Field name lock:** `skills`, `education`, `experience`, `atsScore` — Arpan Pandey, please confirm these exact keys before building the AI prompt output. Arpan Yadav's matching engine reads directly from this shape.

### GET `/resumes/:resumeId` *(auth required)*
**Response 200** — same `parsed` + `atsScore` shape as above.

### GET `/resumes` *(auth required)*
Returns all resumes uploaded by the current user (array of the above).

---

## 3. Jobs & Matching (Arpan Yadav)

### GET `/jobs`
Returns the curated/scraped job listing pool.
**Response 200**
```json
{
  "data": [
    {
      "jobId": "uuid",
      "title": "Frontend Developer",
      "company": "string",
      "requiredSkills": ["React", "Tailwind", "Next.js"],
      "location": "string",
      "applyUrl": "https://..."
    }
  ]
}
```

### GET `/jobs/matches?resumeId=uuid` *(auth required)*
Returns ranked job matches for a given resume.
**Response 200**
```json
{
  "data": [
    {
      "jobId": "uuid",
      "title": "Frontend Developer",
      "company": "string",
      "matchScore": 82,
      "matchedSkills": ["React", "Tailwind"],
      "missingSkills": ["Next.js"]
    }
  ]
}
```
> **Field name lock:** `matchScore` (0–100 integer), `matchedSkills`, `missingSkills`. Anurag Dubey renders these directly on the frontend cards.

### POST `/jobs/:jobId/cover-letter` *(auth required)*
**Request**
```json
{ "resumeId": "uuid" }
```
**Response 200**
```json
{ "data": { "coverLetter": "string (plain text, ready to display/edit)" } }
```

---

## 4. Applications & Automation (Anurag Dev Mishra)

### POST `/applications` *(auth required)*
Creates an application record in "pending approval" state — does NOT submit anything yet.
**Request**
```json
{ "jobId": "uuid", "resumeId": "uuid", "coverLetter": "string" }
```
**Response 201**
```json
{ "data": { "applicationId": "uuid", "status": "pending_approval" } }
```

### POST `/applications/:applicationId/approve` *(auth required)*
User confirms — this is the signal Anurag Dev Mishra's automation script waits for before filling/submitting the real form.
**Response 200**
```json
{ "data": { "applicationId": "uuid", "status": "approved" } }
```

### PATCH `/applications/:applicationId/status` *(internal — called by the automation script)*
Automation reports back what happened.
**Request**
```json
{ "status": "submitted" }
```
Valid `status` values: `pending_approval | approved | submitting | submitted | failed`

### GET `/applications` *(auth required)*
Returns all applications for the current user, with current status — this is what Piyush's tracker/notifications and Anurag Dubey's dashboard both read from.
**Response 200**
```json
{
  "data": [
    {
      "applicationId": "uuid",
      "jobTitle": "string",
      "company": "string",
      "status": "submitted",
      "updatedAt": "2026-08-25T14:30:00Z"
    }
  ]
}
```

---

## Status codes to use consistently

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PATCH) |
| 201 | Resource created (POST) |
| 400 | Bad input / validation error |
| 401 | Missing/invalid auth token |
| 403 | Authenticated but not allowed |
| 404 | Resource not found |
| 500 | Server error |

---

## Open questions to resolve as a team

- [ ] Do we need pagination on `/jobs` and `/applications`? (Probably not for the demo, but flag if job list gets large.)
- [ ] Where does `atsScore.issues` get consumed — frontend display, or just internal logging?
- [ ] Confirm `matchScore` calculation is 0–100 integer, not a 0–1 float — Yadav & Dubey to confirm together.
- [ ] File size/type limits for resume upload — Piyush to define based on Cloudinary setup.

**Change process:** if you need a field renamed or a new endpoint, edit this doc, tag the team in the group chat, get a thumbs-up from whoever consumes that data, then implement.
