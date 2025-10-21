const BankAccount = require('../models/BankAccount');

exports.addAccount = async (req, res) => {
  try {
    const { bankName, accountHolderName, accountNumber } = req.body;
    if (!bankName || !accountHolderName || !accountNumber) return res.status(400).json({ message: 'Missing fields' });

    const count = await BankAccount.countDocuments({ user: req.auth_id });
    if (count >= 4) return res.status(400).json({ message: 'Maximum 4 accounts allowed' });

    const account = await BankAccount.create({ user: req.auth_id, bankName, accountHolderName, accountNumber });
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};

exports.getAccounts = async (req, res) => {
  const accounts = await BankAccount.find({ user: req.auth_id });
  res.json(accounts);
};

exports.updateAccount = async (req, res) => {
  try {
    const account = await BankAccount.findOneAndUpdate({ _id: req.params.id, user: req.auth_id }, req.body, { new: true });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await BankAccount.deleteOne({ _id: req.params.id, user: req.auth_id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};
