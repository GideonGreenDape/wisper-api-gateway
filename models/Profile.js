const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: String,
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  phone: { type: String, required: true },
  verified: { type: Boolean, default: false },
  profilePhoto: String,
  industry: String
}, { timestamps: true });


module.exports = mongoose.model('Profile', ProfileSchema);
