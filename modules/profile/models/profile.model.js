const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname, '../../../data/users.json');

const getUserProfile = (userId = 1) => {
  const users = JSON.parse(fs.readFileSync(usersPath));
  const user = users.find(u => u.id === userId);

  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profile: user.profile || {},
    preferences: user.preferences || {},
    createdAt: user.createdAt
  };
};

const updateUserProfile = (userId, updateData) => {
  const users = JSON.parse(fs.readFileSync(usersPath));
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) return null;

  users[userIndex] = {
    ...users[userIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  return users[userIndex];
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
