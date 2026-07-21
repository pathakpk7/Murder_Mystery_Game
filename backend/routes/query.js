/**
 * Query Routes
 * Handles SQL query validation and execution
 */

import express from 'express';
import { validateQuery as validateSQL } from '../queryValidator.js';
import { recordQueryAttempt, getQueryAttempts } from '../gameEngine.js';

const router = express.Router();

/**
 * POST /api/query/validate
 * Validate a SQL query for safety
 */
router.post('/validate', async (req, res, next) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }
    
    const validation = validateSQL(query);
    res.json({ success: true, data: validation });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/query/attempt
 * Record a query attempt
 */
router.post('/attempt', async (req, res, next) => {
  try {
    const { userId, objectiveId, query, wasCorrect, executionTimeMs } = req.body;
    
    if (!userId || !objectiveId || !query) {
      return res.status(400).json({ success: false, error: 'userId, objectiveId, and query are required' });
    }
    
    const attempt = await recordQueryAttempt(userId, objectiveId, query, wasCorrect, executionTimeMs);
    res.json({ success: true, data: attempt });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/query/attempts/:userId/:objectiveId
 * Get query attempts for an objective
 */
router.get('/attempts/:userId/:objectiveId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const objectiveId = parseInt(req.params.objectiveId);
    
    if (isNaN(objectiveId)) {
      return res.status(400).json({ success: false, error: 'Invalid objective ID' });
    }
    
    const attempts = await getQueryAttempts(userId, objectiveId);
    res.json({ success: true, count: attempts.length, data: attempts });
  } catch (error) {
    next(error);
  }
});

export default router;
