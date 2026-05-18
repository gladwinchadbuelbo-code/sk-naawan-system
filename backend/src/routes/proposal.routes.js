const express = require('express');
const router = express.Router();
const { 
  submitActivityProposal, 
  submitBudgetProposal, 
  getPendingActivityProposals,
  getPendingBudgetProposals,
  approveActivityProposal,
  returnActivityProposal,
  approveBudgetProposal,
  returnBudgetProposal,
  getMyProposals
} = require('../controllers/proposal.controller');
const { verifyToken, authorize } = require('../middleware/auth.middleware');

// User specific
router.get('/my-proposals', verifyToken, getMyProposals);

// Activity Proposals
router.post('/activity-proposals', verifyToken, authorize('secretary', 'treasurer'), submitActivityProposal);
router.get('/activity-proposals/pending', verifyToken, authorize('chairperson'), getPendingActivityProposals);
router.patch('/activity-proposals/:id/approve', verifyToken, authorize('chairperson'), approveActivityProposal);
router.patch('/activity-proposals/:id/return', verifyToken, authorize('chairperson'), returnActivityProposal);

// Budget Proposals
router.post('/budget-proposals', verifyToken, authorize('treasurer'), submitBudgetProposal);
router.get('/budget-proposals/pending', verifyToken, authorize('chairperson'), getPendingBudgetProposals);
router.patch('/budget-proposals/:id/approve', verifyToken, authorize('chairperson'), approveBudgetProposal);
router.patch('/budget-proposals/:id/return', verifyToken, authorize('chairperson'), returnBudgetProposal);

module.exports = router;
