# JobFlow AI — Backend (Arnav's part)

This is the Express.js + Supabase backend skeleton: JWT auth, database schema,
and the core REST API structure everyone else's feature will plug into.

## 1. Tools to install first

| Tool | Why | Link |
|---|---|---|
| Node.js (LTS, v18+) | Runs the server | https://nodejs.org |
| VS Code | Code editor | https://code.visualstudio.com |
| Git | Version control | https://git-scm.com |
| Postman | Test API endpoints without a frontend | https://www.postman.com/downloads |
| Supabase account (free) | Hosted PostgreSQL database | https://supabase.com |

Check installs worked:
```bash
node -v
npm -v
git --version
```

## 2. Create your Supabase project

1. Go to supabase.com → New project.
2. Once it's created, go to **Project Settings → API**. Copy:
   - `Project URL` → this is `SUPABASE_URL`
   - `service_role` secret key → this is `SUPABASE_SERVICE_ROLE_KEY`
   (Never share the service_role key publicly or commit it to GitHub.)
3. Go to **SQL Editor → New query**, paste the entire contents of
   `schema.sql` from this folder, and click **Run**. This creates all
   the tables: `users`, `resumes`, `jobs`, `applications`,
   `application_status_history`.

## 3. Project setup

```bash
# 1. Unzip this project, then inside the folder:
npm install

# 2. Copy the env template and fill in your real values
cp .env.example .env
```

Open `.env` and fill in:
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (from step 2 above)
- `JWT_SECRET` — any long random string, e.g. generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

## 4. Run the server

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
```

Visit `http://localhost:5000/api/health` in your browser — you should get
`{"status":"ok", ...}`.

## 5. Test the auth flow in Postman

**Signup**
- POST `http://localhost:5000/api/auth/signup`
- Body (JSON):
```json
{ "name": "Arnav", "email": "arnav@test.com", "password": "test1234" }
```
- Response includes a `token` — copy it.

**Login**
- POST `http://localhost:5000/api/auth/login`
- Body: `{ "email": "arnav@test.com", "password": "test1234" }`

**Get profile (protected route)**
- GET `http://localhost:5000/api/auth/me`
- In Postman: Authorization tab → Type: **Bearer Token** → paste the token.

If that returns your user info, auth is fully working end-to-end.

## 6. Folder structure

```
jobflow-backend/
├── server.js                  # entry point — wires everything together
├── schema.sql                 # run this in Supabase SQL editor
├── config/
│   └── supabaseClient.js      # single shared DB connection
├── controllers/
│   ├── authController.js      # signup / login / getMe
│   ├── resumeController.js    # skeleton for Arpan Pandey
│   ├── jobController.js       # skeleton for Arpan Yadav
│   └── applicationController.js  # tracker + automation handoff
├── routes/
│   ├── authRoutes.js
│   ├── resumeRoutes.js
│   ├── jobRoutes.js
│   └── applicationRoutes.js
├── middleware/
│   ├── authMiddleware.js      # protects routes with JWT
│   └── errorHandler.js
├── utils/
│   └── generateToken.js
├── .env.example
└── package.json
```

## 7. API contract to share with the team

Give this list to Arpan Pandey, Arpan Yadav, Anurag Dev Mishra, and Anurag
Dubey early — it's exactly what the roadmap says will "prevent last-minute
chaos":

| Method | Route | Auth? | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/login` | No | Log in, get JWT |
| GET | `/api/auth/me` | Yes | Current user profile |
| POST | `/api/resumes` | Yes | Save a parsed resume |
| GET | `/api/resumes` | Yes | List my resumes |
| GET | `/api/resumes/:id` | Yes | Get one resume |
| GET | `/api/jobs` | Yes | List jobs |
| POST | `/api/jobs` | Yes | Add a job listing |
| GET | `/api/jobs/matches/:resumeId` | Yes | Get matched jobs for a resume |
| POST | `/api/applications` | Yes | Create an application record |
| GET | `/api/applications` | Yes | My application tracker |
| PATCH | `/api/applications/:id/approve` | Yes | User approves auto-submit |
| PATCH | `/api/applications/:id/status` | Yes | Update status after submission |

All protected routes need this header:
```
Authorization: Bearer <token from login/signup>
```

## 8. What's next for you (Arnav)

- [ ] Push this to GitHub, set up branch protection + a `dev` branch
- [ ] Share `.env.example` (not `.env`!) and the Supabase project with teammates
- [ ] Walk Anurag Dubey through the API contract table above
- [ ] Once Arpan Pandey/Yadav have real logic, replace the TODOs in
      `resumeController.js` and `jobController.js` — the routes and auth
      already work, they just need the real AI/matching code inside
- [ ] Add input validation (e.g. `express-validator`) once the basic flow is stable
- [ ] Later: switch `SUPABASE_SERVICE_ROLE_KEY` usage to Row Level Security
      policies if you want extra safety before the real demo
