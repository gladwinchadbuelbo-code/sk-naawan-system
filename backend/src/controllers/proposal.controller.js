const ActivityProposal = require('../models/activity_proposal.model');
const BudgetProposal = require('../models/budget_proposal.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const { logTransaction } = require('../services/transaction_log.service');

// Helper to notify Chairperson
const notifyChairperson = async (title, message, type) => {
  try {
    const chairperson = await User.findOne({ where: { role: 'chairperson' } });
    if (chairperson) {
      await Notification.create({
        user_id: chairperson.id,
        title,
        message,
        type
      });
      console.log(`Notification sent to Chairperson: "${title}"`);
    } else {
      console.warn('⚠️ No chairperson user found to notify.');
    }
  } catch (err) {
    console.error('Notification Error:', err);
  }
};

/**
 * Validates that req.user exists and has a real PostgreSQL id.
 * Returns the verified user or sends an error response.
 */
const validateAuthenticatedUser = async (req, res) => {
  if (!req.user || !req.user.id) {
    console.error('❌ validateAuthenticatedUser: req.user is missing or has no id');
    res.status(401).json({
      success: false,
      message: 'Authentication required: no valid user session found.'
    });
    return null;
  }

  const existingUser = await User.findByPk(req.user.id);
  if (!existingUser) {
    console.error(`❌ validateAuthenticatedUser: User id=${req.user.id} does NOT exist in database`);
    res.status(401).json({
      success: false,
      message: 'Invalid authenticated user: your user record was not found in the database.'
    });
    return null;
  }

  return existingUser;
};

// @desc    Submit Activity Proposal (Secretary)
exports.submitActivityProposal = async (req, res) => {
  console.log('--- SUBMIT ACTIVITY PROPOSAL START ---');
  console.log('REQ USER:', req.user ? { id: req.user.id, role: req.user.role, full_name: req.user.full_name } : 'MISSING');
  console.log('Request Body:', req.body);

  try {
    // ── Validate authenticated user exists in database ──
    const verifiedUser = await validateAuthenticatedUser(req, res);
    if (!verifiedUser) return; // Response already sent

    console.log('SUBMITTED BY:', verifiedUser.id, `(${verifiedUser.role} — ${verifiedUser.full_name})`);

    const { 
      project_title, project_proponent, barangay, 
      objectives, rationale, target_beneficiaries, budget_requirement,
      duration, venue
    } = req.body;

    // Backend Validation
    if (!project_title || !project_proponent || !barangay || !objectives || !rationale || !target_beneficiaries || !budget_requirement) {
      console.warn('Submit Activity Validation Failure: Missing required fields');
      return res.status(400).json({ success: false, message: 'All required project fields must be filled.' });
    }

    const proposal = await ActivityProposal.create({
      project_title,
      project_proponent,
      barangay,
      objectives,
      rationale,
      target_beneficiaries,
      budget_requirement,
      duration,
      venue,
      submitted_by: verifiedUser.id,
      status: 'pending'
    });

    console.log('✅ Activity Proposal Saved successfully:', proposal.id, '→ submitted_by:', verifiedUser.id);

    // Audit Logging
    await logTransaction({
      user_id: verifiedUser.id,
      action_type: 'ACTIVITY_PROPOSAL_SUBMIT',
      description: `Submitted Activity Proposal "${project_title}" with budget of ₱${budget_requirement}`,
      related_record_id: proposal.id
    });

    await notifyChairperson(
      'New Activity Proposal',
      `New proposal "${project_title}" submitted by ${verifiedUser.full_name}`,
      'proposal'
    );

    res.status(201).json({ success: true, data: proposal });
  } catch (error) {
    console.error('Submit Activity Error details:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ success: false, message: 'Validation error: ' + error.message, errors: error.errors });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      console.error('❌ FOREIGN KEY VIOLATION — submitted_by value does not match any users.id');
      return res.status(500).json({ success: false, message: 'Database integrity error: the submitting user does not exist. Please re-authenticate.' });
    }
    res.status(500).json({ success: false, message: 'Unable to save proposal to database. ' + error.message });
  } finally {
    console.log('--- SUBMIT ACTIVITY PROPOSAL END ---');
  }
};

// @desc    Submit Budget Proposal (Treasurer)
exports.submitBudgetProposal = async (req, res) => {
  console.log('--- SUBMIT BUDGET PROPOSAL START ---');
  console.log('REQ USER:', req.user ? { id: req.user.id, role: req.user.role, full_name: req.user.full_name } : 'MISSING');
  console.log('Request Body:', req.body);

  try {
    // ── Validate authenticated user exists in database ──
    const verifiedUser = await validateAuthenticatedUser(req, res);
    if (!verifiedUser) return; // Response already sent

    console.log('SUBMITTED BY:', verifiedUser.id, `(${verifiedUser.role} — ${verifiedUser.full_name})`);

    const { title, description, total_amount, purpose } = req.body;

    // Backend Validation
    if (!title || !total_amount) {
      console.warn('Submit Budget Validation Failure: Missing title or amount');
      return res.status(400).json({ success: false, message: 'Title and Total Amount are required.' });
    }

    const proposal = await BudgetProposal.create({
      title,
      description,
      total_amount,
      purpose,
      submitted_by: verifiedUser.id,
      status: 'pending'
    });

    console.log('✅ Budget Proposal Saved successfully:', proposal.id, '→ submitted_by:', verifiedUser.id);

    // Audit Logging
    await logTransaction({
      user_id: verifiedUser.id,
      action_type: 'BUDGET_PROPOSAL_SUBMIT',
      description: `Submitted Budget Proposal "${title}" with amount of ₱${total_amount}`,
      related_record_id: proposal.id
    });

    await notifyChairperson(
      'New Budget Request',
      `New budget request "${title}" submitted by ${verifiedUser.full_name}`,
      'budget'
    );

    res.status(201).json({ success: true, data: proposal });
  } catch (error) {
    console.error('Submit Budget Error details:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ success: false, message: 'Validation error: ' + error.message, errors: error.errors });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      console.error('❌ FOREIGN KEY VIOLATION — submitted_by value does not match any users.id');
      return res.status(500).json({ success: false, message: 'Database integrity error: the submitting user does not exist. Please re-authenticate.' });
    }
    res.status(500).json({ success: false, message: 'Unable to save proposal to database. ' + error.message });
  } finally {
    console.log('--- SUBMIT BUDGET PROPOSAL END ---');
  }
};

// @desc    Get Pending Activity Proposals
exports.getPendingActivityProposals = async (req, res) => {
  try {
    const proposals = await ActivityProposal.findAll({
      where: { status: 'pending' },
      include: [{ model: User, as: 'submitter', attributes: ['full_name'] }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(proposals);
  } catch (error) {
    console.error('Get Pending Activity Proposals Error:', error);
    res.status(500).json({ message: 'Error retrieving activity proposals: ' + error.message });
  }
};

// @desc    Get Pending Budget Proposals
exports.getPendingBudgetProposals = async (req, res) => {
  try {
    const proposals = await BudgetProposal.findAll({
      where: { status: 'pending' },
      include: [{ model: User, as: 'submitter', attributes: ['full_name'] }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(proposals);
  } catch (error) {
    console.error('Get Pending Budget Proposals Error:', error);
    res.status(500).json({ message: 'Error retrieving budget proposals: ' + error.message });
  }
};

// @desc    Approve Activity Proposal
exports.approveActivityProposal = async (req, res) => {
  console.log(`Approving activity proposal ID: ${req.params.id} by ${req.user.full_name}`);
  try {
    const verifiedUser = await validateAuthenticatedUser(req, res);
    if (!verifiedUser) return;

    const proposal = await ActivityProposal.findByPk(req.params.id);
    if (!proposal) {
      console.warn(`Proposal not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Proposal not found' });
    }

    proposal.status = 'approved';
    proposal.reviewed_by = verifiedUser.id;
    proposal.reviewed_at = new Date();
    await proposal.save();

    console.log('✅ Activity Proposal approved successfully');

    // Audit Logging
    await logTransaction({
      user_id: verifiedUser.id,
      action_type: 'ACTIVITY_PROPOSAL_APPROVE',
      description: `Approved Activity Proposal "${proposal.project_title}"`,
      related_record_id: proposal.id
    });

    // Notify Submitter
    await Notification.create({
      user_id: proposal.submitted_by,
      title: 'Proposal Approved',
      message: `Your activity proposal "${proposal.project_title}" has been approved.`,
      type: 'proposal'
    });

    res.status(200).json({ success: true, message: 'Proposal approved successfully.' });
  } catch (error) {
    console.error('Approve Activity Proposal Error:', error);
    res.status(500).json({ message: 'Error approving proposal: ' + error.message });
  }
};

// @desc    Return Activity Proposal
exports.returnActivityProposal = async (req, res) => {
  const { feedback } = req.body;
  console.log(`Returning activity proposal ID: ${req.params.id} with feedback: "${feedback}"`);

  try {
    const verifiedUser = await validateAuthenticatedUser(req, res);
    if (!verifiedUser) return;

    const proposal = await ActivityProposal.findByPk(req.params.id);
    if (!proposal) {
      console.warn(`Proposal not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Proposal not found' });
    }

    proposal.status = 'returned';
    proposal.chairperson_comments = feedback;
    proposal.reviewed_by = verifiedUser.id;
    proposal.reviewed_at = new Date();
    await proposal.save();

    console.log('✅ Activity Proposal returned successfully');

    // Audit Logging
    await logTransaction({
      user_id: verifiedUser.id,
      action_type: 'ACTIVITY_PROPOSAL_RETURN',
      description: `Returned Activity Proposal "${proposal.project_title}" for revisions with feedback: "${feedback}"`,
      related_record_id: proposal.id
    });

    // Notify Submitter
    await Notification.create({
      user_id: proposal.submitted_by,
      title: 'Proposal Returned',
      message: `Your activity proposal "${proposal.project_title}" was returned for revision.`,
      type: 'proposal'
    });

    res.status(200).json({ success: true, message: 'Proposal returned for revision.' });
  } catch (error) {
    console.error('Return Activity Proposal Error:', error);
    res.status(500).json({ message: 'Error returning proposal: ' + error.message });
  }
};

// @desc    Approve Budget Proposal
exports.approveBudgetProposal = async (req, res) => {
  console.log(`Approving budget proposal ID: ${req.params.id} by ${req.user.full_name}`);
  try {
    const verifiedUser = await validateAuthenticatedUser(req, res);
    if (!verifiedUser) return;

    const proposal = await BudgetProposal.findByPk(req.params.id);
    if (!proposal) {
      console.warn(`Proposal not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Proposal not found' });
    }

    proposal.status = 'approved';
    proposal.reviewed_by = verifiedUser.id;
    proposal.reviewed_at = new Date();
    await proposal.save();

    console.log('✅ Budget Proposal approved successfully');

    // Audit Logging
    await logTransaction({
      user_id: verifiedUser.id,
      action_type: 'BUDGET_PROPOSAL_APPROVE',
      description: `Approved Budget Proposal "${proposal.title}"`,
      related_record_id: proposal.id
    });

    // Notify Submitter
    await Notification.create({
      user_id: proposal.submitted_by,
      title: 'Budget Approved',
      message: `Your budget request "${proposal.title}" has been approved.`,
      type: 'budget'
    });

    res.status(200).json({ success: true, message: 'Budget approved successfully.' });
  } catch (error) {
    console.error('Approve Budget Proposal Error:', error);
    res.status(500).json({ message: 'Error approving budget proposal: ' + error.message });
  }
};

// @desc    Return Budget Proposal
exports.returnBudgetProposal = async (req, res) => {
  const { feedback } = req.body;
  console.log(`Returning budget proposal ID: ${req.params.id} with feedback: "${feedback}"`);

  try {
    const verifiedUser = await validateAuthenticatedUser(req, res);
    if (!verifiedUser) return;

    const proposal = await BudgetProposal.findByPk(req.params.id);
    if (!proposal) {
      console.warn(`Proposal not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Proposal not found' });
    }

    proposal.status = 'returned';
    proposal.chairperson_feedback = feedback;
    proposal.reviewed_by = verifiedUser.id;
    proposal.reviewed_at = new Date();
    await proposal.save();

    console.log('✅ Budget Proposal returned successfully');

    // Audit Logging
    await logTransaction({
      user_id: verifiedUser.id,
      action_type: 'BUDGET_PROPOSAL_RETURN',
      description: `Returned Budget Proposal "${proposal.title}" for revisions with feedback: "${feedback}"`,
      related_record_id: proposal.id
    });

    // Notify Submitter
    await Notification.create({
      user_id: proposal.submitted_by,
      title: 'Budget Returned',
      message: `Your budget request "${proposal.title}" was returned for revision.`,
      type: 'budget'
    });

    res.status(200).json({ success: true, message: 'Budget returned for revision.' });
  } catch (error) {
    console.error('Return Budget Proposal Error:', error);
    res.status(500).json({ message: 'Error returning budget proposal: ' + error.message });
  }
};

// @desc    Get My Proposals (Secretary/Treasurer)
exports.getMyProposals = async (req, res) => {
  try {
    const verifiedUser = await validateAuthenticatedUser(req, res);
    if (!verifiedUser) return;

    const activities = await ActivityProposal.findAll({
      where: { submitted_by: verifiedUser.id },
      order: [['created_at', 'DESC']]
    });
    const budgets = await BudgetProposal.findAll({
      where: { submitted_by: verifiedUser.id },
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ activities, budgets });
  } catch (error) {
    console.error('Get My Proposals Error:', error);
    res.status(500).json({ message: 'Error retrieving my proposals: ' + error.message });
  }
};

// @desc    Get single proposal by ID (activity or budget)
// @route   GET /api/proposals/:id
exports.getProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // ?type=activity or ?type=budget

    let proposal = null;

    if (type === 'budget') {
      proposal = await BudgetProposal.findByPk(id, {
        include: [{ model: User, as: 'submitter', attributes: ['full_name', 'role'] }]
      });
    } else {
      // Default: try activity first, then budget
      proposal = await ActivityProposal.findByPk(id, {
        include: [{ model: User, as: 'submitter', attributes: ['full_name', 'role'] }]
      });
      if (!proposal) {
        proposal = await BudgetProposal.findByPk(id, {
          include: [{ model: User, as: 'submitter', attributes: ['full_name', 'role'] }]
        });
      }
    }

    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found.' });
    }

    res.status(200).json({ success: true, data: proposal });
  } catch (error) {
    console.error('Get Proposal By ID Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching proposal: ' + error.message });
  }
};
