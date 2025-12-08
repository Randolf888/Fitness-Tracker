const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const OTP = mongoose.model('OTP', otpSchema);

const saveOTP = async (email, code, expiresAt) => {
  return OTP.findOneAndUpdate(
    { email },
    { email, code, expiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const findOTPByEmail = async (email) => OTP.findOne({ email });
const deleteOTPById = async (id) => OTP.findByIdAndDelete(id);

module.exports = {
  OTP,
  saveOTP,
  findOTPByEmail,
  deleteOTPById
};
