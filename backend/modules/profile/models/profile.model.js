const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  age: {
    type: Number,
    min: 13,
    max: 120
  },
  weight: {
    type: Number,
    min: 30,
    max: 500
  },
  height: {
    type: Number,
    min: 50,
    max: 250
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    workoutTypes: {
      type: [String],
      default: []
    }
  }
}, {
  timestamps: true
});

profileSchema.index({ userId: 1 });

const Profile = mongoose.model('Profile', profileSchema);

const getProfileByUserId = async (userId) => {
  return Profile.findOne({ userId }).populate('userId', 'username email');
};

const createProfile = async (profileData) => {
  const profile = new Profile(profileData);
  return profile.save();
};

const updateProfile = async (userId, updateData) => {
  return Profile.findOneAndUpdate(
    { userId },
    updateData,
    { new: true, runValidators: true }
  ).populate('userId', 'username email');
};

const upsertProfile = async (userId, updateData) => {
  return Profile.findOneAndUpdate(
    { userId },
    updateData,
    { new: true, runValidators: true, upsert: true }
  ).populate('userId', 'username email');
};

const deleteProfile = async (userId) => {
  return Profile.findOneAndDelete({ userId });
};

module.exports = {
  Profile,
  getProfileByUserId,
  createProfile,
  updateProfile,
  upsertProfile,
  deleteProfile
};
