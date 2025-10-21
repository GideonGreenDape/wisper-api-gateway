const mongoose = require('mongoose');

const InvalidTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
});

InvalidTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('InvalidToken', InvalidTokenSchema);
