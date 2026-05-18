import { Router } from 'express';
import {
  getAllActivityProposals,
  getActivityProposal,
  createActivityProposal,
  reviewActivityProposal,
  deleteActivityProposal
} from '../controllers/activityProposalsController';
import { authenticateToken, authorizeSecretary, authorizeChairperson } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getAllActivityProposals);
router.get('/:id', authenticateToken, getActivityProposal);
router.post('/', authenticateToken, authorizeSecretary, createActivityProposal);
router.patch('/:id/review', authenticateToken, authorizeChairperson, reviewActivityProposal);
router.delete('/:id', authenticateToken, deleteActivityProposal);

export default router;
