import { Router } from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadCount
} from '../controllers/notificationsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.patch('/:id/read', authenticateToken, markNotificationAsRead);
router.patch('/read-all', authenticateToken, markAllNotificationsAsRead);
router.delete('/:id', authenticateToken, deleteNotification);

export default router;
