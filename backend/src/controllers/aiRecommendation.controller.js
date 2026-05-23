const aiRecommendationService = require('../services/aiRecommendationService');

const getActivityPlanningRecommendations = async (req, res) => {
  try {
    const recommendations = await aiRecommendationService.generateActivityPlanningInsights();
    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Error in getActivityPlanningRecommendations controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI recommendations',
      error: error.message
    });
  }
};

module.exports = {
  getActivityPlanningRecommendations
};
