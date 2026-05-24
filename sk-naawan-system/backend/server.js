require("dotenv").config();

console.log("DB PASSWORD:", process.env.DB_PASSWORD);
const app = require('./src/app');
const { connectDB, sequelize } = require('./src/config/db.config');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Explicitly import models to register them with Sequelize before sync
  require('./src/models/user.model');
  require('./src/models/activity_proposal.model');
  require('./src/models/budget_proposal.model');
  require('./src/models/event.model');
  require('./src/models/attendance.model');
  require('./src/models/notification.model');
  require('./src/models/transaction.model');
  require('./src/models/transaction_log.model');
  require('./src/models/announcement.model');

  // Sync Models (Only in dev - creates tables if they don't exist)
  // Warning: force: true will drop existing tables. Use alter: true for updates.
  await sequelize.sync({ alter: true });
  console.log('✅ Database Models Synced.');

  // ── FIX: Repair Sequelize FK constraints that reference "Users" instead of "users" ──
  // Sequelize's belongsTo creates FK constraints referencing the model name "Users"
  // but our tableName is "users" (lowercase). PostgreSQL treats quoted identifiers as case-sensitive.
  const fkFixes = [
    {
      table: 'activity_proposals',
      constraint: 'activity_proposals_submitted_by_fkey',
      column: 'submitted_by',
      refTable: 'users',
      refColumn: 'id'
    },
    {
      table: 'activity_proposals',
      constraint: 'activity_proposals_reviewed_by_fkey',
      column: 'reviewed_by',
      refTable: 'users',
      refColumn: 'id'
    },
    {
      table: 'budget_proposals',
      constraint: 'budget_proposals_submitted_by_fkey',
      column: 'submitted_by',
      refTable: 'users',
      refColumn: 'id'
    },
    {
      table: 'budget_proposals',
      constraint: 'budget_proposals_reviewed_by_fkey',
      column: 'reviewed_by',
      refTable: 'users',
      refColumn: 'id'
    },
    {
      table: 'transaction_logs',
      constraint: 'transaction_logs_user_id_fkey',
      column: 'user_id',
      refTable: 'users',
      refColumn: 'id'
    },
    {
      table: 'notifications',
      constraint: 'notifications_user_id_fkey',
      column: 'user_id',
      refTable: 'users',
      refColumn: 'id'
    },
    {
      table: 'announcements',
      constraint: 'announcements_created_by_fkey',
      column: 'created_by',
      refTable: 'users',
      refColumn: 'id'
    }
  ];

  for (const fk of fkFixes) {
    try {
      await sequelize.query(`ALTER TABLE "${fk.table}" DROP CONSTRAINT IF EXISTS "${fk.constraint}";`);
      await sequelize.query(
        `ALTER TABLE "${fk.table}" ADD CONSTRAINT "${fk.constraint}" FOREIGN KEY ("${fk.column}") REFERENCES "${fk.refTable}" ("${fk.refColumn}");`
      );
      console.log(`✅ FK repaired: ${fk.table}.${fk.column} → ${fk.refTable}.${fk.refColumn}`);
    } catch (fkErr) {
      console.warn(`⚠️ FK repair warning for ${fk.table}.${fk.constraint}: ${fkErr.message}`);
    }
  }
  console.log('✅ Foreign key constraints verified.');

  // ── Seed required users on startup ──
  const User = require('./src/models/user.model');
  const seedUsers = [
    { username: 'sk_chairperson', full_name: 'Juan Dela Cruz', role: 'chairperson', email: 'chairperson@sknaawan.gov.ph', password: 'mockpassword' },
    { username: 'sk_secretary',   full_name: 'Pedro Reyes',    role: 'secretary',   email: 'secretary@sknaawan.gov.ph',   password: 'mockpassword' },
    { username: 'sk_treasurer',   full_name: 'Maria Santos',   role: 'treasurer',   email: 'treasurer@sknaawan.gov.ph',   password: 'mockpassword' }
  ];

  for (const seed of seedUsers) {
    try {
      const existing = await User.findOne({ where: { role: seed.role } });
      if (!existing) {
        const created = await User.create(seed);
        console.log(`✅ Seeded user: ${seed.role} → id=${created.id}`);
      } else {
        console.log(`✅ User exists: ${seed.role} → id=${existing.id}`);
      }
    } catch (seedErr) {
      console.warn(`⚠️ Seed warning for ${seed.role}: ${seedErr.message}`);
      // Try to find anyway (collision with existing username/email)
      const found = await User.findOne({ where: { role: seed.role } });
      if (found) console.log(`✅ User found after collision: ${seed.role} → id=${found.id}`);
    }
  }
  console.log('✅ User seeding complete.');

  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
// Trigger nodemon restart
// Trigger nodemon restart 2
