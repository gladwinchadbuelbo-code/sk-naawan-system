const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, getTransactionLogs } = require('../controllers/transaction.controller');
const { verifyToken, authorize } = require('../middleware/auth.middleware');

router.get('/', verifyToken, getTransactions);
router.post('/', verifyToken, authorize('treasurer'), addTransaction);
router.get('/logs', verifyToken, getTransactionLogs);

module.exports = router;
