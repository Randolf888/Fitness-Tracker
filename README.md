# FitTracker Pro

## Project & Team
- **Project Title:** FitLog Pro – Fitness Activity Tracker  
- **Team Members:** Randolf, Abdulbasit

## Project Snapshot
- **Dataset:** [Fitness Tracker Dataset (Kaggle)](https://www.kaggle.com/datasets/nadeemajeedch/fitness-tracker-dataset) – activity, exercise metrics, and progress data.
- **Core Features:** Authentication, activity dashboard, activity CRUD, progress tracking, goal management.
- **UI Structure:** Login/Register, Dashboard, Activity Log, Add/Edit Activity, User Profile.
- **Repo Layout:**  
  ```
  Fitness-Tracker/
  ├── backend/   # Express + MongoDB API (App.js, modules, middlewares)
  └── frontend/  # React + Vite app (Auth, Activities UI)
  ```

## Phase Timeline (1 → 5)
- **Current Phase:** Phase 5 – Security, RBAC, and email MFA (JWT + OTP + role-guarded routes)
- **Completed:** Phase 1 (setup), Phase 2 (modular Express API), Phase 3 (MongoDB/Mongoose), Phase 4 (React frontend)

---

## Phase 1 – Project Setup & Planning
- Defined scope, dataset, and target features (auth, activities, goals, progress, dashboard).
- Initialized repo structure for backend (`App.js`, feature modules) and frontend (Vite + React scaffold).
- Added base tooling: npm scripts, environment configs, and shared middleware placeholders (error/404 handling).

## Phase 2 – Modular Express API
- Converted backend to a feature-based layout: `auth`, `activities`, `dashboard`, `goals`, `profile`, `progress`.
- Implemented RESTful CRUD for activities/goals/progress; basic auth (register/login/logout) and profile endpoints.
- Added dashboard summary endpoint plus JSON parsing, URL encoding, 404, and centralized error handling.
- Validation via Mongoose schemas/lightweight middleware.

## Phase 3 – MongoDB Atlas & Mongoose
- Wired `dotenv`, MongoDB Atlas connection (`shared/middlewares/connect-db.js`), and `.env` hygiene.
- Built Mongoose schemas/models for Users, Activities, Goals, Progress, Profile, Dashboard widgets with indexes and validation.
- Replaced file-based data with Mongoose CRUD helpers; advanced querying (search/sort/pagination, ranges, filters) across modules.
- Postman-tested CRUD, validation errors, and query params (`limit/page/sortBy/sortOrder` + filters).

## Phase 4 – React Frontend Integration
- Added React Router layout (Home, Auth, Activities, Admin), shared Axios client with env-driven base URL, and CORS pairing.
- Built Auth UI with client-side validation and stateful banners; Activity CRUD UI with filters and optimistic feedback.
- Implemented `AuthContext` for session persistence; responsive visual styling (Space Grotesk + Manrope, gradients, cards).
- Frontend structure: `src/api`, `components` (Layout, ActivityForm, ActivityList), `context/AuthContext.jsx`, `pages` (Home, Auth, Activities, Admin).

## Phase 5 – Security, RBAC, and Email MFA
- **MFA flow:** email + password login generates 6-digit OTP (Nodemailer); OTP verification issues JWT.
- **JWT middleware & storage:** backend guards decode/validate tokens; frontend interceptor injects `Authorization: Bearer <token>`; logout clears session.
- **RBAC:** `authorize('admin', 'customer')` applied to protected routes; admin-only APIs cover user listing/stats and moderation features.
- **Protected UI:** signed-in users skip auth screen; admin nav/routes hidden for non-admins.
- **Testing:** valid/invalid logins, OTP failures/expiry, missing tokens, role-mismatch denials, and UI visibility for restricted features.

---

## API Routes (High-Level)
- **Auth:** `POST /auth/register`, `POST /auth/login` (sends OTP), `POST /auth/verify-login` (issues JWT), `POST /auth/logout`; admin-only: `GET /auth/users`, `GET /auth/stats`, `PUT/DELETE /auth/:id`.
- **Activities:** `GET/POST /activities`, `GET/PUT/DELETE /activities/:id` (filters/search/sort/paginate; owner or admin access).
- **Dashboard:** `GET /dashboard` (widgets), `GET /dashboard/summary/:userId` (aggregated data), `GET/PUT/POST/DELETE /dashboard/:id`.
- **Goals:** `GET/POST /goals`, `GET/PUT/DELETE /goals/:id` with filters.
- **Progress:** `GET/POST /progress`, `GET/PUT/DELETE /progress/:id` with filters.
- **Profile:** `GET /profile/:userId`, `POST /profile`, `PUT /profile/:userId`, `DELETE /profile/:userId`.

---

## Task Division & Contributions
- **Abdulbasit**
  1. Auth module (register/login/profile retrieval).
  2. Goal management CRUD + validation.
  3. Profile update feature and validation.
  4. App-level middleware setup and feature-based structure.
  5. Phase 4: React auth screen, user context/localStorage, client-side validation, frontend docs.
  6. Phase 5: Auth hardening—email+password + OTP, JWT issuance, frontend session/redirect handling, README security updates.

- **Randolf**
  1. Activity module CRUD + validation.
  2. Progress module CRUD and retrieval logic.
  3. Dashboard module with summaries and endpoints.
  4. Phase 3: MongoDB Atlas integration, Mongoose schemas/models, search/sort/pagination.
  5. Phase 4: React activity CRUD UI, filters, API wiring, styling/layout.
  6. Phase 5: RBAC checks/admin protections on API routes, JWT guardrails, multi-role access validation.

---

## Setup Instructions

### Backend (Express + MongoDB)
```bash
# from project root
cd backend
npm install

# .env in backend/
MONGO_URI=your-mongodb-atlas-uri
PORT=3000
CLIENT_URL=http://localhost:5173  # allowed origin for the React app

# start the API
npm start
```

### Frontend (React + Vite)
```bash
cd frontend
npm install

# point to the running backend (defaults to 3000 if omitted)
VITE_API_BASE_URL=http://localhost:3000 npm run dev

# production build
npm run build
```
