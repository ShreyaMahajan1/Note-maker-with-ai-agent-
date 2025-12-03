const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#ffffff',
  },
  link: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    default: 'General',
  },
  calendarEventId: {
    type: String,
    default: null,
  },
  calendarEventUrl: {
    type: String,
    default: null,
  },
  isDuplicate: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
noteSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Note', noteSchema);
