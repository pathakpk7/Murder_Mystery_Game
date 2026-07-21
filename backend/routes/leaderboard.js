/**
 * Leaderboard Routes
 * Handles leaderboard-related API endpoints
 */

import express from 'express';
import { getLeaderboard, getUserRank } from '../services/leaderboardManager.js';

const router = express.Router();

/**
 * GET /api/leaderboard
 * Get leaderboard for a specific period
 */
router.get('/', async (req, res, next) => {
  try {
    const period = req.query.period || 'all_time';
    const limit = parseInt(req.query.limit) || 100;
    
    const leaderboard = await getLeaderboard(period, limit);
    res.json({ success: true, count: leaderboard.length, data: leaderboard });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/leaderboard/:userId
 * Get user's rank on leaderboard
 */
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const period = req.query.period || 'all_time';
    
    const rank = await getUserRank(userId, period);
    res.json({ success: true, data: rank });
  } catch (error) {
    next(error);
  }
});

export default router;
