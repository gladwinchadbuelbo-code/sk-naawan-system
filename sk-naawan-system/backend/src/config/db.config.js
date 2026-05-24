const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Set to true if you want to see SQL queries
    define: {
      freezeTableName: true  // Prevent Sequelize from pluralizing/capitalizing table names in FK references
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected Successfully.');
    
    // Ensure CHECK constraint on events status accepts the full set of statuses
    try {
      await sequelize.query(`
        ALTER TABLE events 
        DROP CONSTRAINT IF EXISTS events_status_check;
      `);
      await sequelize.query(`
        ALTER TABLE events 
        ADD CONSTRAINT events_status_check 
        CHECK (status IN ('Planning', 'Upcoming', 'Completed', 'Cancelled', 'Approved', 'Pending'));
      `);
      console.log('✅ Events Table Status CHECK Constraint Verified.');
    } catch (err) {
      console.warn('⚠️ Warning verifying Events status check constraint:', err.message);
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
