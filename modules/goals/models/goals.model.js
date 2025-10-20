const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../data/goals.json');

const getAllGoals = (userId = 1) => {
  const goals = JSON.parse(fs.readFileSync(dataPath));
  return goals.filter(goal => goal.userId === userId);
};

const getGoalById = (id) => {
  const goals = JSON.parse(fs.readFileSync(dataPath));
  return goals.find(goal => goal.id === parseInt(id));
};

const addNewGoal = (goalData) => {
  const goals = JSON.parse(fs.readFileSync(dataPath));
  const newGoal = {
    id: goals.length + 1,
    userId: 1, // Default user
    status: 'in_progress',
    ...goalData,
    createdAt: new Date().toISOString()
  };
  goals.push(newGoal);
  fs.writeFileSync(dataPath, JSON.stringify(goals, null, 2));
  return newGoal;
};

const updateExistingGoal = (id, updateData) => {
  const goals = JSON.parse(fs.readFileSync(dataPath));
  const index = goals.findIndex(goal => goal.id === parseInt(id));
  if (index === -1) return null;
  
  goals[index] = { ...goals[index], ...updateData, updatedAt: new Date().toISOString() };
  fs.writeFileSync(dataPath, JSON.stringify(goals, null, 2));
  return goals[index];
};

const deleteGoal = (id) => {
  const goals = JSON.parse(fs.readFileSync(dataPath));
  const filteredGoals = goals.filter(goal => goal.id !== parseInt(id));
  fs.writeFileSync(dataPath, JSON.stringify(filteredGoals, null, 2));
  return true;
};

module.exports = {
  getAllGoals,
  getGoalById,
  addNewGoal,
  updateExistingGoal,
  deleteGoal
};
