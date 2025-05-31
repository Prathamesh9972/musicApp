const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  purchase: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', required: true },
  issuedAt: { type: Date, default: Date.now },
  isClaimed: { type: Boolean, default: false },
  completionPercentage: { type: Number, required: true },
});

module.exports = mongoose.model('Certificate', certificateSchema);
