const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bankName: { type: String, required: true },
  accountHolderName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

BankAccountSchema.index({ user: 1 });

module.exports = mongoose.model('BankAccount', BankAccountSchema);
