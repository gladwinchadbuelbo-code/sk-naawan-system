const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcement.controller');
const { verifyToken, authorize } = require('../middleware/auth.middleware');

// Public-ish routes (still require auth token for user resolution)
router.get('/', verifyToken, getAllAnnouncements);
router.get('/:id', verifyToken, getAnnouncementById);

// Create / Update / Delete (secretary, treasurer, chairperson)
router.post('/', verifyToken, authorize('secretary', 'treasurer', 'chairperson'), createAnnouncement);
router.patch('/:id', verifyToken, authorize('secretary', 'treasurer', 'chairperson'), updateAnnouncement);
router.delete('/:id', verifyToken, authorize('secretary', 'treasurer', 'chairperson'), deleteAnnouncement);

module.exports = router;
