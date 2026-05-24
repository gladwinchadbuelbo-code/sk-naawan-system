const Transaction = require('../models/transaction.model');
const TransactionLog = require('../models/transaction_log.model');
const User = require('../models/user.model');
const { logTransaction } = require('../services/transaction_log.service');

// @desc    Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [['date', 'DESC'], ['created_at', 'DESC']]
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('❌ Get Transactions Error:', error);
    res.status(500).json({ message: 'Error retrieving transactions: ' + error.message });
  }
};

// @desc    Add new transaction
exports.addTransaction = async (req, res) => {
  console.log('--- ADD TRANSACTION START ---');
  console.log('Request User:', req.user);
  console.log('Request Body:', req.body);

  const { date, category, description, amount, type, or_number, supplier, receipt_url } = req.body;
  try {
    if (!date || !category || !description || !amount || !type) {
      console.warn('Add Transaction Validation Failure: Missing fields');
      return res.status(400).json({ message: 'Date, category, description, amount, and type are required.' });
    }

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

    console.log('✅ Financial transaction created successfully: Ref', ref_no);

    // Audit Logging
    await logTransaction({
      user_id: req.user.id,
      action_type: 'TRANSACTION_RECORD',
      description: `Recorded ${type} transaction "${description}" in category "${category}" for ₱${amount}`,
      related_record_id: transaction.id
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('❌ Add Transaction Error details:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + error.message, errors: error.errors });
    }
    res.status(500).json({ message: 'Error saving transaction to database: ' + error.message });
  } finally {
    console.log('--- ADD TRANSACTION END ---');
  }
};

// @desc    Get all audit transaction logs
exports.getTransactionLogs = async (req, res) => {
  try {
    const logs = await TransactionLog.findAll({
      include: [{ model: User, as: 'user', attributes: ['full_name', 'role'] }],
      order: [['timestamp', 'DESC']]
    });
    res.status(200).json(logs);
  } catch (error) {
    console.error('❌ Get Transaction Logs Error:', error);
    res.status(500).json({ message: 'Error fetching audit logs: ' + error.message });
  }
};
