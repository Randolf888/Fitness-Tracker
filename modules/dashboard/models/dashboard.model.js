const fs = require('fs');
const path = require('path');
const activitiesPath = path.join(__dirname, '../../data/activities.json');
const progressPath = path.join(__dirname, '../../data/progress.json');
const goalsPath = path.join(__dirname, '../../data/goals.json');

const getDashboardData = (userId = 1) => {
  const activities = JSON.parse(fs.readFileSync(activitiesPath));
  const progress = JSON.parse(fs.readFileSync(progressPath));
  const goals = JSON.parse(fs.readFileSync(goalsPath));

  const userActivities = activities.filter(activity => activity.userId === userId);
  const userProgress = progress.filter(p => p.userId === userId);
  const userGoals = goals.filter(goal => goal.userId === userId);

  // Calculate stats
  const totalSteps = userProgress.reduce((sum, day) => sum + day.metrics.steps, 0);
  const totalCalories = userActivities.reduce((sum, activity) => sum + activity.calories, 0);
  const avgSleep = userProgress.reduce((sum, day) => sum + day.metrics.sleepHours, 0) / userProgress.length;

  return {
    summary: {
      totalActivities: userActivities.length,
      totalSteps,
      totalCaloriesBurned: totalCalories,
      averageSleep: avgSleep.toFixed(1)
    },
    recentActivities: userActivities.slice(-5),
    currentGoals: userGoals.filter(goal => goal.status === 'in_progress'),
    progressTrend: userProgress.slice(-7) // Last 7 days
  };
};

module.exports = {
  getDashboardData
};
