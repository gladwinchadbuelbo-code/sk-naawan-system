import { Router } from 'express';
import {
  getAllBudgetProposals,
  getBudgetProposal,
  createBudgetProposal,
  reviewBudgetProposal,
  deleteBudgetProposal
} from '../controllers/budgetProposalsController';
import { authenticateToken, authorizeTreasurer, authorizeChairperson } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getAllBudgetProposals);
router.get('/:id', authenticateToken, getBudgetProposal);
router.post('/', authenticateToken, authorizeTreasurer, createBudgetProposal);
router.patch('/:id/review', authenticateToken, authorizeChairperson, reviewBudgetProposal);
router.delete('/:id', authenticateToken, deleteBudgetProposal);

export default router;
