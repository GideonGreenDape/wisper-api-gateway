const Earning = require('../models/Earning');

// create a withdrawal record (transaction type withdrawal)
exports.recordWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: 'amount required' });
    await Earning.create({ user: req.auth_id, amount: -Math.abs(Number(amount)), transactionType: 'withdrawal' });
    res.json({ message: 'Withdrawal recorded' });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};

// get earnings list for user
exports.getEarnings = async (req, res) => {
  const earnings = await Earning.find({ user: req.auth_id }).sort({ createdAt: -1 });
  res.json(earnings);
};

// aggregated totals endpoint
exports.totals = async (req, res) => {
  try {
    const aggr = await Earning.aggregate([
      { $match: { user: require('mongoose').Types.ObjectId(req.auth_id) } },
      { $group: { _id: null, total: { $sum: '$amount' }, totalWithdrawals: {
          $sum: { $cond: [{ $eq: ['$transactionType', 'withdrawal'] }, '$amount', 0] }
        } } }
    ]);
    const result = aggr[0] || { total: 0, totalWithdrawals: 0 };
    res.json({ totalEarning: result.total, totalWithdrawal: result.totalWithdrawals });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};
