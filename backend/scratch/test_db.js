const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' });

console.log('DB Host:', process.env.DB_HOST);
console.log('DB Name:', process.env.DB_NAME);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log
  }
);

const runTest = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');

    // Import models
    const User = require('../src/models/user.model');
    const TransactionLog = require('../src/models/transaction_log.model');

    console.log('Syncing User model...');
    await User.sync({ alter: true });
    console.log('✅ User model synced.');

    console.log('Syncing TransactionLog model...');
    await TransactionLog.sync({ alter: true });
    console.log('✅ TransactionLog model synced.');

    const usersCount = await User.count();
    console.log('Users Count in DB:', usersCount);

    const logsCount = await TransactionLog.count();
    console.log('TransactionLogs Count in DB:', logsCount);

    console.log('All tests succeeded!');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    await sequelize.close();
  }
};

runTest();
