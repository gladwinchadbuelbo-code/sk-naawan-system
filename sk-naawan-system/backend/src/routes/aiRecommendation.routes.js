const express = require('express');
const router = express.Router();
const aiRecommendationController = require('../controllers/aiRecommendation.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Protect this route if needed, using verifyToken.
// For now we'll add it, but it might just be a mock token from frontend.
router.get('/activity-planning', aiRecommendationController.getActivityPlanningRecommendations);

module.exports = router;
