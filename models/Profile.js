const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true }, // mirror of User.email
  phone: { type: String, required: true }, // mirror of User.phone
  verified: { type: Boolean, default: false },
  profilePhoto: { type: String }, // store URL or base64
  industry: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);
