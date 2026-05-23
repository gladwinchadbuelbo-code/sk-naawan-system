const { GoogleGenAI } = require('@google/genai');
const Event = require('../models/event.model');
const Attendance = require('../models/attendance.model');
const BudgetProposal = require('../models/budget_proposal.model');

const aiRecommendationService = {
  async generateActivityPlanningInsights() {
    try {
      // 1. Fetch completed events
      const completedEvents = await Event.findAll({
        where: { status: 'Completed' },
        attributes: ['id', 'title', 'description', 'date', 'location', 'budget_proposal_id']
      });

      // 2. Fetch related attendance and budget
      const eventsData = await Promise.all(completedEvents.map(async (event) => {
        const attendanceCount = await Attendance.count({ where: { event_id: event.id } });
        let budgetUtilized = null;
        
        if (event.budget_proposal_id) {
          const budget = await BudgetProposal.findByPk(event.budget_proposal_id);
          budgetUtilized = budget ? budget.total_amount : null;
        }

        return {
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          attendanceCount,
          budgetUtilized
        };
      }));

      // If no data or too little data, we can provide a default prompt or handle gracefully
      const dataPayload = JSON.stringify(eventsData, null, 2);

      const prompt = `
      You are an AI decision-support system for the Sangguniang Kabataan (Youth Council) of Naawan.
      Analyze the following historical activity data (events, attendance counts, budgets) in JSON format:
      ${dataPayload}

      Based on this data, provide actionable recommendations for future activity planning. 
      Identify any potential low participation activities or inefficient budget use, and suggest optimizations (e.g., schedule changes, budget reallocation, different activity types).

      Return the response STRICTLY as a JSON object with the following structure:
      {
        "insights": [
          {
            "type": "alert" | "success" | "info",
            "title": "Brief title of insight",
            "description": "Detailed explanation of the insight based on the data"
          }
        ],
        "recommendations": [
          {
            "action": "Brief action item",
            "rationale": "Why this is recommended",
            "impact": "Expected impact"
          }
        ]
      }
      `;

      // 3. Call Gemini API
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        console.warn('GEMINI_API_KEY not found in environment variables. Returning mock AI recommendations.');
        return getMockRecommendations(eventsData);
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text;
      
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON', responseText);
        throw new Error('Invalid JSON format from AI');
      }

    } catch (error) {
      console.error('Error in aiRecommendationService:', error);
      throw new Error('Failed to generate AI recommendations');
    }
  }
};

function getMockRecommendations(eventsData) {
  // Fallback mock response if API key is missing
  return {
    "insights": [
      {
        "type": "alert",
        "title": "Low Participation Alert",
        "description": "Historical data shows that events scheduled on weekday mornings have 40% lower attendance compared to weekends."
      },
      {
        "type": "success",
        "title": "High ROI on Sports Events",
        "description": "Sports leagues typically consume only 20% of the budget but account for 60% of total youth engagement."
      }
    ],
    "recommendations": [
      {
        "action": "Adjust Schedule for Environmental Drives",
        "rationale": "Moving clean-up drives from 6:00 AM weekdays to 7:00 AM Saturdays increases student availability.",
        "impact": "Expected 35% increase in volunteer turnout."
      },
      {
        "action": "Reallocate Budget to Skills Training",
        "rationale": "Seminars have high attendance but often lack sufficient budget for quality materials.",
        "impact": "Better participant satisfaction and practical learning outcomes."
      }
    ]
  };
}

module.exports = aiRecommendationService;
