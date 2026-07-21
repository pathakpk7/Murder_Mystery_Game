/**
 * Progress Routes
 * Handles all progress-related API endpoints
 */

import express from 'express';
import { startCase, getCaseSummary, executeGameFlow } from '../gameEngine.js';
import { getUserProgress, getAllUserProgress, completeCase } from '../services/progressManager.js';
import { checkAndUnlockAchievements } from '../services/achievementManager.js';

const router = express.Router();

/**
 * GET /api/progress/:userId
 * Get all progress for a specific user
 */
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const progress = await getAllUserProgress(userId);
    res.json({ success: true, count: progress.length, data: progress });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/progress/:userId/:caseId
 * Get progress for a specific user and case
 */
router.get('/:userId/:caseId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const caseId = parseInt(req.params.caseId);
    
    if (isNaN(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid case ID' });
    }
    
    const summary = await getCaseSummary(userId, caseId);
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/progress/start
 * Start a case for a user
 */
router.post('/start', async (req, res, next) => {
  try {
    const { userId, caseId } = req.body;
    
    if (!userId || !caseId) {
      return res.status(400).json({ success: false, error: 'userId and caseId are required' });
    }
    
    const progress = await startCase(userId, caseId);
    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/progress/complete
 * Mark a case as completed
 */
router.post('/complete', async (req, res, next) => {
  try {
    const { userId, caseId } = req.body;
    
    if (!userId || !caseId) {
      return res.status(400).json({ success: false, error: 'userId and caseId are required' });
    }
    
    const progress = await completeCase(userId, caseId);
    
    // Check for achievements
    const newAchievements = await checkAndUnlockAchievements(userId);
    
    res.json({ 
      success: true, 
      data: progress,
      newAchievements 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/progress/submit-query
 * Submit a SQL query for validation
 */
router.post('/submit-query', async (req, res, next) => {
  try {
    const { userId, objectiveId, query, queryResult, executionTimeMs } = req.body;
    
    if (!userId || !objectiveId || !query) {
      return res.status(400).json({ success: false, error: 'userId, objectiveId, and query are required' });
    }
    
    const result = await executeGameFlow(userId, objectiveId, query, queryResult, executionTimeMs);
    
    // Check for achievements on successful completion
    if (result.success && result.objectiveCompleted) {
      const newAchievements = await checkAndUnlockAchievements(userId);
      result.newAchievements = newAchievements;
    }
    
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
