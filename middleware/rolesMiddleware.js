function recruiterOnly(req, res, next) {
  if (req.role !== 'recruiter') return res.status(403).json({ message: 'Recruiter only' });
  next();
}

function trainerOnly(req, res, next) {
  if (req.role !== 'trainer') return res.status(403).json({ message: 'Trainer only' });
  next();
}

module.exports = { recruiterOnly, trainerOnly };
