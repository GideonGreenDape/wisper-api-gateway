const mongoose = require('mongoose');

const EarningSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  transactionType: { type: String, enum: ['job_listing','course_listing','withdrawal'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Earning', EarningSchema);
