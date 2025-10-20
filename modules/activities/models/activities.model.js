const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../../data/activities.json');

const getAllActivities = () => {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
};

const getActivityById = (id) => {
  const activities = getAllActivities();
  return activities.find(activity => activity.id === parseInt(id));
};

const addNewActivity = (activityData) => {
  const activities = getAllActivities();
  const newActivity = {
    id: activities.length + 1,
    ...activityData,
    createdAt: new Date().toISOString()
  };
  activities.push(newActivity);
  fs.writeFileSync(dataPath, JSON.stringify(activities, null, 2));
  return newActivity;
};

const updateExistingActivity = (id, updateData) => {
  const activities = getAllActivities();
  const index = activities.findIndex(activity => activity.id === parseInt(id));
  if (index === -1) return null;

  activities[index] = { ...activities[index], ...updateData, updatedAt: new Date().toISOString() };
  fs.writeFileSync(dataPath, JSON.stringify(activities, null, 2));
  return activities[index];
};

const deleteActivity = (id) => {
  const activities = getAllActivities();
  const filteredActivities = activities.filter(activity => activity.id !== parseInt(id));
  fs.writeFileSync(dataPath, JSON.stringify(filteredActivities, null, 2));
  return true;
};

module.exports = {
  getAllActivities,
  getActivityById,
  addNewActivity,
  updateExistingActivity,
  deleteActivity
};
