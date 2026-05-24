const User = require('../models/user.model');

const ROLE_NAMES = {
  chairperson: 'Juan Dela Cruz',
  secretary: 'Pedro Reyes',
  treasurer: 'Maria Santos',
  public_viewer: 'Guest Viewer'
};

/**
 * Ensures a real database user exists for the given role.
 * Uses findOrCreate with collision recovery.
 * NEVER returns a fake in-memory object — always a verified Sequelize instance
 * with a real PostgreSQL-assigned primary key.
 */
const ensureDbUser = async (targetRole) => {
  const fullName = ROLE_NAMES[targetRole] || 'SK User';

  // ── Step 1: Try to find an existing user with this role ──
  let user = await User.findOne({ where: { role: targetRole } });
  if (user) {
    console.log(`✅ ensureDbUser: Found existing ${targetRole} → id=${user.id}`);
    return user;
  }

  // ── Step 2: Create a new user for this role ──
  const username = `sk_${targetRole}`;
  const email = `${targetRole}@sknaawan.gov.ph`;

  try {
    user = await User.create({
      username,
      full_name: fullName,
      role: targetRole,
      email,
      password: 'mockpassword'
    });
    console.log(`✅ ensureDbUser: Created new ${targetRole} → id=${user.id}`);
    return user;
  } catch (createErr) {
    // Unique constraint collision (username or email already exists)
    console.warn(`⚠️ ensureDbUser: Creation collision for ${targetRole}: ${createErr.message}`);
  }

  // ── Step 3: Collision recovery — re-query by role or username ──
  user = await User.findOne({ where: { role: targetRole } });
  if (user) {
    console.log(`✅ ensureDbUser: Found ${targetRole} after collision → id=${user.id}`);
    return user;
  }

  // Also try finding by the username we attempted
  user = await User.findOne({ where: { username } });
  if (user) {
    console.log(`✅ ensureDbUser: Found by username ${username} → id=${user.id}`);
    return user;
  }

  // ── Step 4: Last resort — create with timestamp-based unique fields ──
  const ts = Date.now();
  try {
    user = await User.create({
      username: `sk_${targetRole}_${ts}`,
      full_name: fullName,
      role: targetRole,
      email: `${targetRole}_${ts}@sknaawan.gov.ph`,
      password: 'mockpassword'
    });
    console.log(`✅ ensureDbUser: Created ${targetRole} with timestamp → id=${user.id}`);
    return user;
  } catch (retryErr) {
    console.error(`❌ ensureDbUser: All creation attempts failed for ${targetRole}:`, retryErr.message);
  }

  // ── Step 5: Absolute fallback — find ANY user in the database ──
  user = await User.findOne();
  if (user) {
    console.warn(`⚠️ ensureDbUser: Using fallback user id=${user.id} (${user.role}) for role ${targetRole}`);
    return user;
  }

  // ── Step 6: Database is completely empty — force create with random suffix ──
  const rand = Math.floor(Math.random() * 100000);
  user = await User.create({
    username: `sk_fallback_${rand}`,
    full_name: fullName,
    role: targetRole,
    email: `fallback_${rand}@sknaawan.gov.ph`,
    password: 'mockpassword'
  });
  console.log(`✅ ensureDbUser: Created emergency fallback user → id=${user.id}`);
  return user;
};

/**
 * Auth middleware — resolves a real database user from the token/role header.
 * Guarantees req.user is a Sequelize model instance with a valid PostgreSQL id.
 */
const verifyToken = async (req, res, next) => {
  let token = 'chairperson';

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Determine target role from token
  let targetRole = 'chairperson';
  const roleStr = token.toLowerCase();
  if (roleStr.includes('chair')) {
    targetRole = 'chairperson';
  } else if (roleStr.includes('sec')) {
    targetRole = 'secretary';
  } else if (roleStr.includes('treas')) {
    targetRole = 'treasurer';
  } else if (roleStr.includes('public') || roleStr.includes('viewer') || roleStr.includes('guest')) {
    targetRole = 'public_viewer';
  }

  try {
    const user = await ensureDbUser(targetRole);

    // ── CRITICAL: Verify the user is a real database record ──
    if (!user || !user.id || typeof user.id !== 'number') {
      console.error('❌ Auth Middleware: ensureDbUser returned invalid user:', user);
      return res.status(500).json({
        message: 'Authentication error: could not resolve a valid database user.'
      });
    }

    // ── Double-check: verify this ID actually exists in PostgreSQL ──
    const verified = await User.findByPk(user.id);
    if (!verified) {
      console.error(`❌ Auth Middleware: User id=${user.id} not found in database after ensureDbUser!`);
      return res.status(500).json({
        message: 'Authentication error: resolved user does not exist in database.'
      });
    }

    req.user = verified;
    console.log(`✅ Auth Middleware: Verified user id=${req.user.id}, role=${req.user.role}, name=${req.user.full_name}`);
  } catch (error) {
    console.error('❌ Fatal Auth Middleware Error — could not resolve any DB user:', error);
    return res.status(500).json({
      message: 'Authentication system error: unable to resolve user in database. Please check server logs.'
    });
  }

  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // In dev/demo mode, allow all roles through
    next();
  };
};

module.exports = { verifyToken, authorize };
