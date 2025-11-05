const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  company: { type: String },
  description: { type: String },
  jobType: { type: String },
  pricePerHour: { type: Number },
  qualification: { type: String },
  experienceLevel: { type: String },
  applicationMethod: { type: String }, // e.g. "url" or "email"
  applicationUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('Job', JobSchema);
