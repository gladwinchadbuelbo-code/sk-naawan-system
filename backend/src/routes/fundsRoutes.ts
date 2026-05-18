import { Router } from 'express';
import {
  getAllFunds,
  getFund,
  createFund,
  updateFund,
  archiveFund,
  deleteFund,
  getBudgetSummary
} from '../controllers/fundsController';
import { authenticateToken, authorizeTreasurer } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getAllFunds);
router.get('/summary', authenticateToken, getBudgetSummary);
router.get('/:id', authenticateToken, getFund);
router.post('/', authenticateToken, authorizeTreasurer, createFund);
router.put('/:id', authenticateToken, authorizeTreasurer, updateFund);
router.patch('/:id/archive', authenticateToken, authorizeTreasurer, archiveFund);
router.delete('/:id', authenticateToken, authorizeTreasurer, deleteFund);

export default router;
