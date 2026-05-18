const Transaction = require('../models/transaction.model');

// @desc    Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [['date', 'DESC'], ['created_at', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new transaction
exports.addTransaction = async (req, res) => {
  const { date, category, description, amount, type, or_number, supplier, receipt_url } = req.body;
  try {
    // Generate simple ref no: TX-random
    const ref_no = 'TX-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    
    const transaction = await Transaction.create({
      ref_no,
      date,
      category,
      description,
      amount,
      type,
      or_number,
      supplier,
      receipt_url,
      verified: true // Default to true for official recordings
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
