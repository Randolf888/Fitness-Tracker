# FitTracker Pro

## 📌 Project Title & Team Members

- **Project Title:** FitLog Pro - Fitness Activity Tracker
- **Team Members:** Randolf, Abdulbasit

---

## 🧩 Phase Overview

- **Current Phase:** Phase 4 – React Frontend Integration + API wiring
- **Previous Phase:** Phase 3 – Database Integration with MongoDB Atlas (after Phase 2’s modular Express API)

### Folder Layout (Phase 4)

```
Fitness-Tracker/
├── backend/   # Express + MongoDB API (App.js, modules, middlewares)
└── frontend/  # React + Vite app (Auth, Activities UI)
```

---

## 📊 Dataset Chosen

- **Dataset:** Fitness Tracker Dataset (Kaggle)
- **Source:** [Fitness Tracker Dataset](https://www.kaggle.com/datasets/nadeemajeedch/fitness-tracker-dataset)
- **Description:** Contains user activity data, , exercise metrics, and progress tracking information.

---

## ⚙️ List of Features

1. **User Authentication** – Registration, login, and profile management
2. **Activity Dashboard** – Daily summary with steps, calories, and active minutes
3. **Activity CRUD Operations** – Create, read, update, and delete activity records
4. **Progress Tracking** – Charts and analytics for fitness progress
5. **Goal Management** – Set and track personal fitness goals

---

## 🖥️ UI Structure

- **Login/Register Page** – Simple authentication forms
- **Dashboard** – Activity summary cards with progress charts
- **Activity Log** – Table view with filtering and search
- **Add/Edit Activity** – Forms for logging new activities
- **User Profile** – Settings and goal management

---

## 🔁 Phase 2 – Tasks Implemented (Summary)

During Phase 2, the focus was on structuring the backend into clear, modular Express.js feature modules and exposing RESTful JSON APIs.

- Converted the app to a **feature-based folder structure**: `auth`, `activities`, `dashboard`, `goals`, `profile`, `progress`.
- Implemented **RESTful CRUD APIs** for activities, goals, and progress.
- Added **authentication flows** (login, register, logout) and basic profile endpoints.
- Built a **dashboard endpoint** to expose activity and progress summaries.
- Wired up **application-level middleware** for JSON parsing, URL encoding, 404 handling, and centralized error handling.
- Defined **validation rules** for incoming payloads using `express-validator` and custom middleware.

---

## 🗄️ Phase 3 – MongoDB Atlas & Mongoose Integration

In Phase 3, the app was upgraded from JSON-based data to a real MongoDB Atlas database using Mongoose.

### 1. Environment & Database Setup

- Added **dotenv** as a dev dependency and loaded it in `App.js`:
  - `require('dotenv').config();`
- Configured **MongoDB Atlas connection string** via `.env`:
  - `MONGO_URI=mongodb-atlas-connection-string`
- Ensured `.env` is **ignored in Git** using `.gitignore` so credentials are never pushed.

### 2. Database Connection Middleware

- Created reusable **DB connection middleware**: `shared/middlewares/connect-db.js`
  - Uses `mongoose.connect(process.env.MONGO_URI, { useNewUrlParser, useUnifiedTopology })`.
  - Logs successful connections and exits on fatal connection errors.
- Integrated the middleware in `App.js`:
  - `const connectDB = require('./shared/middlewares/connect-db');`
  - `connectDB();` is called before routes are registered.

### 3. Mongoose Schemas & Models per Module

Each module was given its own Mongoose schema and model that mirror the Phase 2 JSON structure, with proper types and validation:

- **Auth / Users** – `modules/auth/models/auth.model.js`
  - `User` schema with `username`, `email`, `password`, and embedded `profile` (age, weight, height, fitnessLevel).
  - Unique constraints on `email` and `username`, regex validation for email, and min/max constraints for numeric fields.
- **Activities** – `modules/activities/models/activities.model.js`
  - `Activity` schema includes `userId` (ref `User`), `type`, `duration`, `calories`, `distance`, `intensity`, `date`, `notes`.
  - Enums for `type` and `intensity`, min/max checks, and a compound index on `{ userId, date }`.
- **Goals** – `modules/goals/models/goals.model.js`
  - `Goal` schema with `userId`, `type`, `target`, `current`, `deadline`, `status`, `description`.
  - Enums for goal `type` and `status`, numeric validation, and index on `{ userId, deadline }`.
- **Progress** – `modules/progress/models/progress.model.js`
  - `Progress` schema with metrics (`steps`, `caloriesBurned`, `activeMinutes`, `distance`, `sleepHours`, `waterIntake`), daily/weekly goals, and achievement percentages, plus embedded `workouts`.
  - Unique compound index `{ userId, date }` to keep one progress record per user per day.
- **Profile** – `modules/profile/models/profile.model.js`
  - `Profile` schema with `userId` (unique ref to `User`), `age`, `weight`, `height`, `fitnessLevel`, `bio`, and `preferences`.
  - Index on `userId` and validation for numeric ranges and enum fields.
- **Dashboard Widgets** – `modules/dashboard/models/dashboard.model.js`
  - `DashboardWidget` schema with `userId`, `title`, `type`, `description`, and flexible `config` for data source and visualization.
  - Index on `{ userId, type }`.

### 4. CRUD Operations Using Mongoose

JSON-file based logic from Phase 2 was replaced with Mongoose CRUD operations:

- Each model exposes **service functions** that wrap Mongoose:
  - Examples: `getAllActivities`, `getActivityById`, `addNewActivity`, `updateExistingActivity`, `deleteActivity`, etc.
  - Similar CRUD helpers exist for **Goals**, **Progress**, **Profiles**, **Users**, and **Dashboard Widgets**.
- Routes in `modules/*/routes/*.routes.js` now call these functions and return MongoDB documents as JSON.

### 5. Searching, Sorting & Pagination

GET routes were enhanced to support advanced querying using Mongoose filters:

- **Activities** (`GET /activities`)
  - Filtering by `userId`, `type`, `intensity`, date range (`startDate`, `endDate`), and duration range (`minDuration`, `maxDuration`).
  - Text-like search via `search` on `notes` and `type` (case-insensitive regex).
  - Sorting using `sortBy` (e.g., `date`) and `sortOrder` (`asc` / `desc`).
  - Pagination using `limit` and `page` with total count and total pages returned.
- **Goals** (`GET /goals`)
  - Filtering by `userId`, `type`, `status`, deadline range (`dueAfter`, `dueBefore`), and current progress range (`minCurrent`, `maxCurrent`).
  - Search on `description` and `type`.
  - Sorting and pagination pattern identical to activities.
- **Progress** (`GET /progress`)
  - Filtering by `userId`, date range (`startDate`, `endDate`), steps range (`minSteps`, `maxSteps`), calories burned range (`minCaloriesBurned`, `maxCaloriesBurned`), and `workoutType`.
  - Sorting and pagination for large progress histories.
- **Dashboard Widgets** (`GET /dashboard/widgets` – via `dashboard.model.js`)
  - Filtering by `userId` and widget `type`, with search on `title` and `description`.
  - Sorting and pagination to manage many widgets.

These features fulfill the **search, sort, and pagination** requirements for Phase 3.

### 6. Testing with Postman (How to)

You can manually test CRUD and query behavior for each module using Postman:

- Create a **user** via `/auth/register`, then reuse the `userId` in activities, goals, and progress payloads.
- Exercise **full CRUD** on:
  - `/activities`, `/goals`, `/progress`, `/profile`, and any dashboard widget endpoints.
- Test **query parameters** like `limit`, `page`, `sortBy`, `sortOrder`, and filters (`search`, date ranges, numeric ranges) on listing endpoints.
- Verify that **validation errors** are returned with appropriate status codes (e.g., 400 for invalid data, 404 for not found).

---

## 🖥️ Phase 4 – React Frontend Integration

- Built a new React app under `frontend/` with **React Router** layout and navigation (Home, Auth, Activities).
- Added a shared **Axios client** with environment-driven base URL (`VITE_API_BASE_URL`) and enabled backend **CORS** via `CLIENT_URL`.
- Implemented **Auth page** (login/register) with client-side validation (email pattern, password length, username length) and inline success/error banners.
- Implemented **Activity CRUD UI**: create, edit, delete, and list activities filtered by the logged-in user; supports search and intensity filters.
- Added **client-side validation** for activity forms (required fields, numeric constraints, date required) and user-friendly success/error feedback after each operation.
- Responsive, non-default visual style (Space Grotesk + Manrope fonts, gradients, cards) that works on desktop and mobile.

### Frontend structure

```
frontend/
├── src/
│   ├── api/ (axios client, auth + activity endpoints)
│   ├── components/ (layout, activity form/list)
│   ├── context/AuthContext.jsx (user state + localStorage)
│   ├── pages/ (Home, Auth, Activities)
│   └── App.jsx, main.jsx, styles
└── package.json
```

---

## 🔗 API Routes Implemented (High-Level)

### Authentication Routes

- `GET /auth/login` – Login page
- `POST /auth/login` – Process login
- `GET /auth/register` – Registration page
- `POST /auth/register` – Process registration
- `POST /auth/logout` – Process logout

### Activity Routes (CRUD)

- `GET /activities` – Get all activities
- `GET /activities/:id` – Get specific activity
- `POST /activities` – Create new activity
- `PUT /activities/:id` – Update activity
- `DELETE /activities/:id` – Delete activity

### Dashboard & Analytics

- `GET /dashboard` – Activity summary and analytics
- `GET /progress` – Progress tracking data

### User Management

- `GET /profile` – Get user profile
- `PUT /profile` – Update user profile
- `GET /goals` – Get all goals
- `GET /goals/:id` – Get specific goal
- `POST /goals` – Create new goal
- `PUT /goals/:id` – Update goal
- `DELETE /goals/:id` – Delete goal

---

### Task division and contributions

To ensure clear responsibilities during development, the tasks have been divided between Abdulbasit and Randolf as follows:

- `Abdulbasit`:

1. Developed the user authentication module (registration, login and profile retrieval).
2. Created and validated the goal management module, including setting, updating and deleting goals.
3. Implemented the profile update feature along with validation rules for profile fields.
4. Set up application‑level middleware (JSON parsing, URL encoding, 404 and error handling) and structured the project using feature‑based modules.
5. Phase 4: Built the React auth screen, user context/localStorage, client-side validation, and updated documentation for the frontend stack.

- `Randolf`:

1. Implemented the activity module, providing full CRUD operations and validation for activity data.
2. Developed the progress tracking module, including endpoints to fetch progress by ID or date and update progress records.
3. Built the dashboard module and summarised user activities, goals and progress for the dashboard endpoint.
4. Led the Phase 3 database integration work, including MongoDB Atlas connection, Mongoose schemas/models, and search/sort/pagination logic across modules.
5. Phase 4: Implemented the React activity CRUD UI (listing, filters, create/edit/delete wiring to the API) and frontend styling/layout.

## ⚡ Setup Instructions

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
