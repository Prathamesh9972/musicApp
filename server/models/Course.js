const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  order: { type: Number, required: true },
  videoUrl: { type: String }, // New field
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPaid: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  courseImage: { type: String }, // New field
  modules: [ModuleSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', CourseSchema);
