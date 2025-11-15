const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const InvalidToken = require('../models/Invalid'); 
const {sendSignupEmail} = require('../utils/mailer');

const JWT_EXP = process.env.JWT_EXP || '7d';

function genToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: JWT_EXP });
}

exports.signup = async (req, res) => {
  try {
    const { email, password, phone, role } = req.body;
    if (!email || !password || !phone || !role)
      return res.status(400).json({ message: 'Missing fields' });
    if (!['recruiter', 'trainer'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });

    let user = await User.findOne({ $or: [{ email }, { phone }] });
    let message = '';

    const trimmedPassword = password.trim();

    if (user) {
      message = 'Email or phone already in use';
    } else {
      
      user = new User({ email, password:trimmedPassword, phone, role });
      await user.save();

      
      const profile = new Profile({ user: user._id, email, phone, verified: false });
      await profile.save();

      message = 'Signup successful';
    }

    
    const token = genToken(user);

    
    if (!user._wasExisting) {
     const emailResponse = await sendSignupEmail(email);
  console.log(emailResponse);
    }

    res.status(200).json({
      token,
      message,
      user: { id: user._id, email: user.email, phone: user.phone, role: user.role }
    });
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
    if (!user) {
      console.warn('Login failed: email not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
     console.log('User found:', user.password,password);
    const match = await user.comparePassword(password.trim());
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // check profile verified flag
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) return res.status(400).json({ message: 'Profile missing' });
    if (!profile.verified) {
      const token = genToken(user);
      return res.status(403).json({ message: 'Profile not verified. Please verify OTP.', token: token });
    }

    const token = genToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signin failed' });
  }
};

exports.googleCallbackHandler = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Google auth failed" });

    const token = genToken(user);
    res.status(200).json({
      token,
      message: "Google sign-in successful",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google login failed" });
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
