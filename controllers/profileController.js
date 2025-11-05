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
    const profile = await Profile.findOne({ user: req.user_id });
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
    console.log(req.body);
    const { businessName, firstName, lastName, industry } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { user: req.user_id },
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
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: 'Photo file required' });
    }

    
    const photoUrl = `/uploads/profilePhotos/${req.file.filename}`;

    
    const profile = await Profile.findOneAndUpdate(
      { user: req.auth_id },
      { profilePhoto: photoUrl, updatedAt: new Date() },
      { new: true }
    );

    console.log('here got hit first')

    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    console.log('then here second')
   res.json({
  success: true,
  message: 'Photo uploaded successfully',
  profile
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading photo' });
  }
};


exports.setupProfile = async (req, res) => {
  try {
    const { businessName, firstName, lastName, industry } = req.body;
    const userId = req.auth_id; 

    
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          businessName,
          firstName,
          lastName,
          industry,
          updatedAt: new Date(),
        },
      },
      { new: true, upsert: false } 
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found for this user' });
    }
    console.log('upload got hit here')
    res.status(200).json({
      message: 'Profile updated successfully',
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

