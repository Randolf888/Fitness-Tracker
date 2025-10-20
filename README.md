# FitTracker Pro

## 📌 Project Title & Team Members

- **Project Title:** FitLog Pro - Fitness Activity Tracker
- **Team Members:** Randolf, Abdulbasit

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

## 🔗 API Routes Implemented

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

- `Randolf`:

1. Implemented the activity module, providing full CRUD operations and validation for activity data.
2. Developed the progress tracking module, including endpoints to fetch progress by ID or date and update progress records.
3. Built the dashboard module and summarised user activities, goals and progress for the dashboard endpoint.
4. Set up application‑level middleware (JSON parsing, URL encoding, 404 and error handling) and structured the project using feature‑based modules.

## ⚡ Setup Instructions

```bash
# Install dependencies
npm install

# Start the server
node App.js

# Server runs on http://localhost:3000
```
