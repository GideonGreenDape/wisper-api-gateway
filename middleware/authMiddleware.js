const jwt = require('jsonwebtoken');
const InvalidToken = require('../models/Invalid');

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    console.log('Authorization Header:', header);

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    const token = header.split(' ')[1];

    // Check invalidated tokens
    const invalid = await InvalidToken.findOne({ token });
    if (invalid) return res.status(401).json({ message: 'Token is invalidated' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.auth_id = decoded.id;
    req.role = decoded.role;
    req.token = token;

    console.log('Decoded Auth ID:', req.auth_id);

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
