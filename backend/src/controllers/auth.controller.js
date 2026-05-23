const User = require('../models/user.model');
const { logTransaction } = require('../services/transaction_log.service');

const generateToken = (id) => {
  return `mock_token_${id}`;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  console.log('Register Request Body:', req.body);
  const { full_name, email, password, role } = req.body;

  try {
    if (!full_name || !email || !password || !role) {
      console.warn('Registration Validation Error: Missing fields');
      return res.status(400).json({ message: 'All fields (full_name, email, password, role) are required.' });
    }

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      console.log(`User already exists for email: ${email}`);
      return res.status(200).json({
        id: userExists.id,
        full_name: userExists.full_name,
        email: userExists.email,
        role: userExists.role,
        token: generateToken(userExists.id)
      });
    }

    // Generate unique username since it is NOT NULL in database
    const username = req.body.username || email.split('@')[0] || full_name.toLowerCase().replace(/\s+/g, '_');

    const user = await User.create({
      username,
      full_name,
      email,
      password,
      role
    });

    console.log(`✅ User registered successfully: ID ${user.id}, Username ${user.username}`);

    // Log the transaction
    await logTransaction({
      user_id: user.id,
      action_type: 'USER_REGISTER',
      description: `Registered user "${full_name}" with role "${role}"`,
      related_record_id: user.id
    });

    res.status(201).json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ message: error.message || 'Database error during registration.' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  console.log('Login Request Body:', req.body);
  const { email = 'chairperson@sknaawan.gov.ph' } = req.body;

  try {
    let targetRole = 'chairperson';
    const emailStr = email.toLowerCase();
    if (emailStr.includes('chair')) {
      targetRole = 'chairperson';
    } else if (emailStr.includes('sec')) {
      targetRole = 'secretary';
    } else if (emailStr.includes('treas')) {
      targetRole = 'treasurer';
    } else if (emailStr.includes('public') || emailStr.includes('viewer') || emailStr.includes('guest')) {
      targetRole = 'public_viewer';
    }

    const ROLE_NAMES = {
      chairperson: 'Juan Dela Cruz',
      secretary: 'Pedro Reyes',
      treasurer: 'Maria Santos',
      public_viewer: 'Guest Viewer'
    };

    // Always ensure a real DB user — never return hardcoded IDs
    let user = await User.findOne({ where: { role: targetRole } });
    if (!user) {
      // Create the user in the database so we have a valid ID for FK constraints
      const fullName = ROLE_NAMES[targetRole] || 'SK User';
      try {
        user = await User.create({
          username: `sk_${targetRole}`,
          full_name: fullName,
          role: targetRole,
          email: email || `${targetRole}@sknaawan.gov.ph`,
          password: 'mockpassword'
        });
        console.log(`✅ Login: Created new DB user for role "${targetRole}" with ID ${user.id}`);
      } catch (createErr) {
        // Unique constraint collision — try with timestamp suffix
        const ts = Date.now();
        user = await User.create({
          username: `sk_${targetRole}_${ts}`,
          full_name: fullName,
          role: targetRole,
          email: `${targetRole}_${ts}@sknaawan.gov.ph`,
          password: 'mockpassword'
        });
        console.log(`✅ Login: Created new DB user (retry) for role "${targetRole}" with ID ${user.id}`);
      }
    }

    console.log(`✅ User logged in: ID ${user.id}, Role ${user.role}`);

    // Log login to transaction logs
    await logTransaction({
      user_id: user.id,
      action_type: 'USER_LOGIN',
      description: `Logged in user "${user.full_name}" with role "${user.role}"`,
      related_record_id: user.id
    });

    res.json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      token: `mock_token_${user.role}`
    });
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({
      message: 'Login failed: unable to resolve user in database. ' + error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('❌ Get Profile Error:', error);
    res.status(500).json({ message: error.message });
  }
};
