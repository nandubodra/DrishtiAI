const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: String,
  language: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en'
  },
  profileImage: String,
  emergencyContacts: [{
    name: String,
    phone: String,
    relation: String
  }],
  settings: {
    voiceSpeed: { type: Number, default: 1 },
    volumeLevel: { type: Number, default: 1 },
    notifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(passwordToCheck) {
  return await bcrypt.compare(passwordToCheck, this.password);
};

module.exports = mongoose.model('User', userSchema);
