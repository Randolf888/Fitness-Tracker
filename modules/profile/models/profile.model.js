const mongoose = require('mongoose');

// Note: Profile data is embedded in the User model, so we use the User model directly
const { User } = require('../auth/models/auth.model');

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) return null;

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    profile: user.profile || {},
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

const updateUserProfile = async (userId, updateData) => {
  const allowedUpdates = ['username', 'email', 'profile'];
  const updates = {};

  allowedUpdates.forEach(field => {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true
  }).select('-password');

  if (!user) return null;

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    profile: user.profile || {},
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
