const ActivityProposal = require('../models/activity_proposal.model');
const BudgetProposal = require('../models/budget_proposal.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

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
    }
  } catch (err) {
    console.error('Notification Error:', err);
  }
};

// @desc    Submit Activity Proposal (Secretary)
exports.submitActivityProposal = async (req, res) => {
  const { 
    project_title, project_proponent, barangay, 
    objectives, rationale, target_beneficiaries, budget_requirement,
    duration, venue
  } = req.body;

  try {
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
      submitted_by: req.user.id,
      status: 'pending'
    });

    await notifyChairperson(
      'New Activity Proposal',
      `New proposal "${project_title}" submitted by ${req.user.full_name}`,
      'proposal'
    );

    res.status(201).json({ success: true, data: proposal });
  } catch (error) {
    console.error('Submit Activity Error:', error);
    res.status(500).json({ success: false, message: 'Unable to save proposal to database.' });
  }
};

// @desc    Submit Budget Proposal (Treasurer)
exports.submitBudgetProposal = async (req, res) => {
  const { title, description, total_amount, purpose } = req.body;

  try {
    const proposal = await BudgetProposal.create({
      title,
      description,
      total_amount,
      purpose,
      submitted_by: req.user.id,
      status: 'pending'
    });

    await notifyChairperson(
      'New Budget Request',
      `New budget request "${title}" submitted by ${req.user.full_name}`,
      'budget'
    );

    res.status(201).json({ success: true, data: proposal });
  } catch (error) {
    console.error('Submit Budget Error:', error);
    res.status(500).json({ success: false, message: 'Unable to save proposal to database.' });
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
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve Activity Proposal
exports.approveActivityProposal = async (req, res) => {
  try {
    const proposal = await ActivityProposal.findByPk(req.params.id);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    proposal.status = 'approved';
    proposal.reviewed_by = req.user.id;
    proposal.reviewed_at = new Date();
    await proposal.save();

    // Notify Submitter
    await Notification.create({
      user_id: proposal.submitted_by,
      title: 'Proposal Approved',
      message: `Your activity proposal "${proposal.project_title}" has been approved.`,
      type: 'proposal'
    });

    res.json({ success: true, message: 'Proposal approved successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return Activity Proposal
exports.returnActivityProposal = async (req, res) => {
  const { feedback } = req.body;
  try {
    const proposal = await ActivityProposal.findByPk(req.params.id);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    proposal.status = 'returned';
    proposal.chairperson_comments = feedback; // Using the column name from schema
    proposal.reviewed_by = req.user.id;
    proposal.reviewed_at = new Date();
    await proposal.save();

    // Notify Submitter
    await Notification.create({
      user_id: proposal.submitted_by,
      title: 'Proposal Returned',
      message: `Your activity proposal "${proposal.project_title}" was returned for revision.`,
      type: 'proposal'
    });

    res.json({ success: true, message: 'Proposal returned for revision.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve Budget Proposal
exports.approveBudgetProposal = async (req, res) => {
  try {
    const proposal = await BudgetProposal.findByPk(req.params.id);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    proposal.status = 'approved';
    proposal.reviewed_by = req.user.id;
    proposal.reviewed_at = new Date();
    await proposal.save();

    // Notify Submitter
    await Notification.create({
      user_id: proposal.submitted_by,
      title: 'Budget Approved',
      message: `Your budget request "${proposal.title}" has been approved.`,
      type: 'budget'
    });

    res.json({ success: true, message: 'Budget approved successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return Budget Proposal
exports.returnBudgetProposal = async (req, res) => {
  const { feedback } = req.body;
  try {
    const proposal = await BudgetProposal.findByPk(req.params.id);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    proposal.status = 'returned';
    proposal.chairperson_feedback = feedback; // Matches schema for budget
    proposal.reviewed_by = req.user.id;
    proposal.reviewed_at = new Date();
    await proposal.save();

    // Notify Submitter
    await Notification.create({
      user_id: proposal.submitted_by,
      title: 'Budget Returned',
      message: `Your budget request "${proposal.title}" was returned for revision.`,
      type: 'budget'
    });

    res.json({ success: true, message: 'Budget returned for revision.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get My Proposals (Secretary/Treasurer)
exports.getMyProposals = async (req, res) => {
  try {
    const activities = await ActivityProposal.findAll({
      where: { submitted_by: req.user.id },
      order: [['created_at', 'DESC']]
    });
    const budgets = await BudgetProposal.findAll({
      where: { submitted_by: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json({ activities, budgets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
