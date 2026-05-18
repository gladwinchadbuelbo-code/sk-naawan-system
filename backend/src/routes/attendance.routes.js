const express = require('express');
const router = express.Router();
const { 
  recordAttendance, 
  getEventAttendance, 
  removeAttendance 
} = require('../controllers/attendance.controller');
const { verifyToken, authorize } = require('../middleware/auth.middleware');

// All attendance routes require authentication
router.use(verifyToken);

// Record attendance (Secretary only usually)
router.post('/', authorize('secretary'), recordAttendance);

// Get event attendance (Secretary, Chairperson, Treasurer)
router.get('/event/:id', authorize('secretary', 'chairperson', 'treasurer'), getEventAttendance);

// Remove record (Secretary only)
router.delete('/:id', authorize('secretary'), removeAttendance);

module.exports = router;
