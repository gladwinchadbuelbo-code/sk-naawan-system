const app = require('./src/app');
const { connectDB, sequelize } = require('./src/config/db.config');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Sync Models (Only in dev - creates tables if they don't exist)
  // Warning: force: true will drop existing tables. Use alter: true for updates.
  await sequelize.sync({ alter: true });
  console.log('✅ Database Models Synced.');

  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
// Trigger nodemon restart
// Trigger nodemon restart 2
