import { Router } from 'express';
import { getActivityLogs, createActivityLog } from '../controllers/activityLogsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getActivityLogs);
router.post('/', authenticateToken, createActivityLog);

export default router;
