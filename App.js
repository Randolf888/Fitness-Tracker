const express = require('express');
const app = express();
const port = 3000;

// Import middlewares
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// 1. Application-level middlewares FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Import modular routes
const authRoutes = require('./modules/auth/routes/auth.routes');
const activityRoutes = require('./modules/activities/routes/activities.routes');
const dashboardRoutes = require('./modules/dashboard/routes/dashboard.routes');
const goalsRoutes = require('./modules/goals/routes/goals.routes');
const profileRoutes = require('./modules/profile/routes/profile.routes');
const progressRoutes = require('./modules/progress/routes/progress.routes');

// 3. Use modular routes SECOND
app.use('/auth', authRoutes);
app.use('/activities', activityRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/goals', goalsRoutes);
app.use('/profile', profileRoutes);
app.use('/progress', progressRoutes);

// 4. Home route THIRD
app.get('/', (req, res) => {
  res.json({ 
    message: 'FitLog Pro API is running!',
    phase: 'Phase 2 - Modular Architecture',
    status: 'All modules loaded successfully',
    endpoints: [
      '/auth',
      '/activities', 
      '/dashboard',
      '/goals',
      '/profile',
      '/progress'
    ]
  });
});

// 5. 404 Not Found middleware FOURTH (AFTER all routes)
app.use(notFound);

// 6. Error handling middleware LAST
app.use(errorHandler);

app.listen(port, () => {
  console.log(` FitLog Pro  server running on http://localhost:${port}`);
});