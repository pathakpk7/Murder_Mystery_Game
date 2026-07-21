/**
 * Achievements Routes
 * Handles achievement-related API endpoints
 */

import express from 'express';
import { getAllAchievements } from '../services/achievementManager.js';
import { getUserAchievements } from '../services/achievementManager.js';

const router = express.Router();

/**
 * GET /api/achievements
 * Get all available achievements
 */
router.get('/', async (req, res, next) => {
  try {
    const achievements = await getAllAchievements();
    res.json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/achievements/:userId
 * Get user's achievements
 */
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const achievements = await getUserAchievements(userId);
    res.json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    next(error);
  }
});

export default router;
