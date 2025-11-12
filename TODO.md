# TODO: Integrate MongoDB Atlas with Mongoose

## Step 1: Install Mongoose
- [x] Add mongoose to package.json dependencies
- [x] Run npm install to install mongoose

## Step 2: Create Database Connection Middleware
- [x] Create shared/middlewares/connect-db.js
- [x] Implement Mongoose connection to MongoDB Atlas using provided URL

## Step 3: Integrate Middleware in App.js
- [x] Import connect-db middleware in App.js
- [x] Use the middleware in the app setup

## Step 4: Update Models with Mongoose Schemas
- [x] Update modules/activities/models/activities.model.js
- [x] Update modules/auth/models/auth.model.js
- [x] Update modules/goals/models/goals.model.js
- [x] Update modules/progress/models/progress.model.js
- [x] Update modules/profile/models/profile.model.js
- [x] Update modules/dashboard/models/dashboard.model.js

## Step 5: Enhance Routes with Searching, Sorting, Pagination
- [ ] Update modules/activities/routes/activities.routes.js
- [ ] Update modules/auth/routes/auth.routes.js
- [ ] Update modules/goals/routes/goals.routes.js
- [ ] Update modules/progress/routes/progress.routes.js
- [ ] Update modules/profile/routes/profile.routes.js
- [ ] Update modules/dashboard/routes/dashboard.routes.js

