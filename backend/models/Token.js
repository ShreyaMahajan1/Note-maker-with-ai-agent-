const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    unique: true,
    default: 'google_calendar'
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Number,
    required: true,
  },
  scope: {
    type: String,
  },
  tokenType: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
tokenSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Token', tokenSchema);
