const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    required: true,
    default: 'customer'
  },
  profile: {
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
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

const findUserByEmail = async (email, options = {}) => {
  const query = User.findOne({ email });
  if (options.includePassword) {
    query.select('+password');
  }
  return query;
};

const findUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

const updateUser = async (id, updateData) => {
  const changes = { ...updateData };

  if (changes.password) {
    changes.password = await bcrypt.hash(changes.password, 10);
  }

  return await User.findByIdAndUpdate(id, changes, { new: true, runValidators: true });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  User,
  findUserByEmail,
  findUserById,
  createUser,
  findUserByUsername,
  updateUser,
  deleteUser
};
