# Student Task & Study Planner

Plan Better. Study Smarter. Stay on Track.

A MERN stack academic productivity app for managing subjects, tasks, study sessions, exams, and progress.

This README covers **Phase 1 (setup)** and **Phase 2 (authentication and user profile)**.

## Current status

Phase 2 is complete when:

- students can register, log in, and log out
- JWT access tokens protect `/api/auth/me` and `/api/users/profile`
- the React app has a landing page, login, register, dashboard shell, and profile page
- `GET /api/health` from Phase 1 still works

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router, Lucide React
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, express-validator

## Folder structure

```
backend/     Express API
frontend/    React + Vite client
```

## Prerequisites

- Node.js 18 or later
- MongoDB running locally, or a MongoDB Atlas connection string

On Windows, this folder name contains `&`. The npm scripts call Node directly so they still work. If you move the project, prefer a path without `&`.

## Environment variables

Copy the example file:

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify access tokens |
| `CLIENT_URL` | Frontend origin for CORS |
| `NODE_ENV` | `development` or `production` |

Never commit `backend/.env`. Change `JWT_SECRET` from the example value before sharing or deploying the app.

## Run locally

Install dependencies (from the project root):

```bash
cd backend && npm install
cd ../frontend && npm install
```

Start the API:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Open http://localhost:5173.

Direct API check: http://localhost:5000/api/health

## Phase 2 APIs

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Phase 1 health check |
| POST | `/api/auth/register` | No | Creates a user and returns `{ user, token }` |
| POST | `/api/auth/login` | No | Returns `{ user, token }` |
| GET | `/api/auth/me` | Bearer JWT | Current user |
| POST | `/api/auth/logout` | Bearer JWT | Client still must delete the stored token |
| GET | `/api/users/profile` | Bearer JWT | Safe profile |
| PUT | `/api/users/profile` | Bearer JWT | Update name, timezone, pomodoroSettings |

Passwords are hashed with bcrypt and are never returned in API responses.

## Manual authentication checks

1. Register at `/register` with name, email, password, and confirm password.
2. Confirm you land on `/dashboard` and a token is stored in localStorage (`studentPlannerToken`).
3. Open `/profile`, change timezone or Pomodoro minutes, and save.
4. Log out and confirm you are sent to `/login`. Visiting `/dashboard` without a token should redirect to `/login`.
5. Log in again. Visiting `/login` while authenticated should redirect to `/dashboard`.
6. Call `GET /api/health` and confirm it still succeeds.

API examples (PowerShell):

```powershell
$body = '{"name":"Test Student","email":"test@example.com","password":"password1","confirmPassword":"password1"}'
$register = Invoke-RestMethod -Uri http://localhost:5000/api/auth/register -Method POST -ContentType "application/json" -Body $body
$token = $register.data.token
Invoke-RestMethod -Uri http://localhost:5000/api/auth/me -Headers @{ Authorization = "Bearer $token" }
```

## Dates and timezones

Academic dates will be stored in UTC and displayed in the user's local timezone. Profile timezone is stored now so later modules can use it.

## Decisions and limitations

- Access tokens are stored in `localStorage` and last 7 days. There are no refresh tokens, OAuth, 2FA, or email verification in this phase.
- Logout is stateless: the server does not blacklist tokens; the client removes the stored token.
- The dashboard is a placeholder. Subjects, tasks, calendar, Pomodoro timer, exams, and analytics are later phases.

## Next phase

Wait for instruction before starting Phase 3.
