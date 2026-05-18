import { Router } from 'express';
import {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  archiveEvent,
  deleteEvent
} from '../controllers/eventsController';
import { authenticateToken, authorizeSecretary } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getAllEvents);
router.get('/:id', authenticateToken, getEvent);
router.post('/', authenticateToken, authorizeSecretary, createEvent);
router.put('/:id', authenticateToken, authorizeSecretary, updateEvent);
router.patch('/:id/archive', authenticateToken, authorizeSecretary, archiveEvent);
router.delete('/:id', authenticateToken, authorizeSecretary, deleteEvent);

export default router;
