const Profile = require('../models/Profile');
const User = require('../models/User');

exports.getEmailPhone = async (req, res) => {
  // GET returns email and phone of logged-in user
  try {
    const profile = await Profile.findOne({ user: req.auth_id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ email: profile.email, phone: profile.phone });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};

exports.getBasicInfo = async (req, res) => {
  // GET returns firstname, lastname, email, phone
  try {
    const profile = await Profile.findOne({ user: req.auth_id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone
    });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};

exports.updateProfile = async (req, res) => {
  // PATCH update profile fields including businessName, firstName, lastName, industry
  try {
    const { businessName, firstName, lastName, industry } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { user: req.auth_id },
      { businessName, firstName, lastName, industry, updatedAt: new Date() },
      { new: true, omitUndefined: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

exports.uploadPhoto = async (req, res) => {
  // POST profile photo (accepts image url/base64 in body.photo)
  try {
    const { photo } = req.body;
    if (!photo) return res.status(400).json({ message: 'photo required' });
    const profile = await Profile.findOneAndUpdate(
      { user: req.auth_id },
      { profilePhoto: photo },
      { new: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Error uploading photo' });
  }
};
