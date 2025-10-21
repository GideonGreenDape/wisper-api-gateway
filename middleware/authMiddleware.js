const jwt = require('jsonwebtoken');
const InvalidToken = require('../models/InvalidToken');

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authorization header' });
    }
    const token = header.split(' ')[1];

    // check invalidated tokens
    const invalid = await InvalidToken.findOne({ token });
    if (invalid) return res.status(401).json({ message: 'Token is invalidated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // expected payload: { id, role }
    req.auth_id = decoded.id;
    req.role = decoded.role;
    req.token = token;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
