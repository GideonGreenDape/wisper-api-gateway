const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const InvalidToken = require('../models/InvalidToken');

const JWT_EXP = process.env.JWT_EXP || '7d';

function genToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: JWT_EXP });
}

exports.signup = async (req, res) => {
  try {
    const { email, password, phone, role } = req.body;
    if (!email || !password || !phone || !role) return res.status(400).json({ message: 'Missing fields' });
    if (!['recruiter','trainer'].includes(role)) return res.status(400).json({ message: 'Invalid role' });

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ message: 'Email or phone already in use' });

    const user = new User({ email, password, phone, role });
    await user.save();

    // create empty profile with mirrored email/phone
    const profile = new Profile({ user: user._id, email, phone, verified: false });
    await profile.save();

    const token = genToken(user);
    res.status(201).json({ token, user: { id: user._id, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Provide email and password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // check profile verified flag
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) return res.status(400).json({ message: 'Profile missing' });
    if (!profile.verified) {
      return res.status(403).json({ message: 'Profile not verified. Please verify OTP.' });
    }

    const token = genToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signin failed' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.token;
    if (!token) return res.status(400).json({ message: 'Already logged out' });

    const decoded = jwt.decode(token);
    const exp = decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 24*3600*1000);
    await InvalidToken.create({ token, expiresAt: exp });
    res.json({ message: 'Logged out' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Logout failed' });
  }
};
