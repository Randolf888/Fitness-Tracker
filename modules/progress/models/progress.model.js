const fs = require('fs');
const path = require('path');
const progressPath = path.join(__dirname, '../../../data/progress.json');

const getAllProgress = (userId = 1) => {
  const progress = JSON.parse(fs.readFileSync(progressPath));
  return progress.filter(p => p.userId === userId);
};

const getProgressByDate = (date, userId = 1) => {
  const progress = JSON.parse(fs.readFileSync(progressPath));
  return progress.find(p => p.userId === userId && p.date === date);
};

const getProgressById = (id) => {
  const progress = JSON.parse(fs.readFileSync(progressPath));
  return progress.find(p => p.id === parseInt(id));
};

const addProgress = (progressData) => {
  const progress = JSON.parse(fs.readFileSync(progressPath));
  const newProgress = {
    id: progress.length + 1,
    userId: 1,
    ...progressData,
    createdAt: new Date().toISOString()
  };
  progress.push(newProgress);
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
  return newProgress;
};

const updateProgress = (id, updateData) => {
  const progress = JSON.parse(fs.readFileSync(progressPath));
  const index = progress.findIndex(p => p.id === parseInt(id));
  if (index === -1) return null;

  progress[index] = { ...progress[index], ...updateData, updatedAt: new Date().toISOString() };
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
  return progress[index];
};

module.exports = {
  getAllProgress,
  getProgressByDate,
  getProgressById,
  addProgress,
  updateProgress
};
