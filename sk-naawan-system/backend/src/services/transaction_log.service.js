const TransactionLog = require('../models/transaction_log.model');

/**
 * Logs an action to the database transaction_logs table
 * @param {Object} logData
 * @param {number} logData.user_id
 * @param {string} logData.action_type
 * @param {string} logData.description
 * @param {number} [logData.related_record_id]
 */
const logTransaction = async ({ user_id, action_type, description, related_record_id = null }) => {
  try {
    if (!user_id) {
      console.warn('⚠️ TransactionLog Warning: Attempted to log transaction without a user_id');
      return null;
    }
    const log = await TransactionLog.create({
      user_id,
      action_type,
      description,
      related_record_id,
      timestamp: new Date()
    });
    console.log(`📝 [Audit Trail] Logged: ${action_type} - ${description}`);
    return log;
  } catch (err) {
    console.error('❌ TransactionLog Error failed to write log:', err);
    return null;
  }
};

module.exports = { logTransaction };
