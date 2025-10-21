const Otp = require('../models/Otp');
const Profile = require('../models/Profile');
const { sendOtpEmail } = require('../utils/mailer');
const crypto = require('crypto');

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);

exports.sendOtp = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.auth_id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const code = (Math.floor(100000 + Math.random() * 900000)).toString(); // 6-digit
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await Otp.create({ user: req.auth_id, code, expiresAt });

    await sendOtpEmail(profile.email, code);

    res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'code required' });

    const otp = await Otp.findOne({ user: req.auth_id, code });
    if (!otp) return res.status(400).json({ message: 'Invalid OTP' });

    if (otp.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    // set verified to true
    await Profile.findOneAndUpdate({ user: req.auth_id }, { verified: true });

    // remove OTPs for user
    await Otp.deleteMany({ user: req.auth_id });

    res.json({ message: 'Verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP verify failed' });
  }
};
