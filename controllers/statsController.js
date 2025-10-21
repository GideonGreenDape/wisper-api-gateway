const Earning = require('../models/Earning');
const mongoose = require('mongoose');

function startOfPeriod(period) {
  const now = new Date();
  if (period === 'week') {
    const d = new Date(now);
    const day = d.getDay(); // 0..6
    d.setDate(d.getDate() - day); // start of week (Sunday)
    d.setHours(0,0,0,0);
    return d;
  }
  if (period === 'month') {
    const d = new Date(now.getFullYear(), now.getMonth(), 1);
    return d;
  }
  if (period === 'year') {
    const d = new Date(now.getFullYear(), 0, 1);
    return d;
  }
  return null;
}

exports.totalsPeriod = async (req, res) => {
  try {
    const { period } = req.params; // 'week'|'month'|'year'
    if (!['week','month','year'].includes(period)) return res.status(400).json({ message: 'invalid period' });

    const start = startOfPeriod(period);
    const aggr = await Earning.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.auth_id), createdAt: { $gte: start } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const total = (aggr[0] && aggr[0].total) || 0;
    res.json({ period, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
};
