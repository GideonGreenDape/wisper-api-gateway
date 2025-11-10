const Profile = require('../models/Profile');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

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
 try {
    const profile = await Profile.findOne({ user: req.auth_id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      industry: profile.industry,
      businessName: profile.businessName,
      profilePhoto: profile.profilePhoto
    });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  } 
};


exports.deletePhoto = async (req, res) => {
  console.log('here got  hit! ')
  try {
   
    const profile = await Profile.findOne({ user: req.auth_id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (!profile.profilePhoto) {
      return res.status(400).json({ message: 'No profile photo to delete' });
    }

    
    const filePath = path.join(__dirname, `../..${profile.profilePhoto}`);

    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(' Deleted local profile photo:', filePath);
    } else {
      console.log(' File not found locally:', filePath);
    }

  
    profile.profilePhoto = null;
    profile.updatedAt = new Date();
    await profile.save();

    res.json({
      success: true,
      message: 'Profile photo deleted successfully',
      profile,
    });
  } catch (err) {
    console.error(' Error deleting profile photo:', err);
    res.status(500).json({ message: 'Error deleting profile photo' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { businessName, firstName, lastName, industry } = req.body;

    
    const updateData = {
      businessName,
      firstName,
      lastName,
      industry,
      updatedAt: new Date(),
    };

    
    if (req.file) {
      const photoUrl = `/uploads/profilePhotos/${req.file.filename}`;
      updateData.profilePhoto = photoUrl;
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.auth_id },
      updateData,
      { new: true, omitUndefined: true }
    );

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    });
  } catch (err) {
    console.error(err);
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

