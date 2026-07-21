/**
 * Profile Routes
 * Handles user profile-related API endpoints
 */

import express from 'express';
import supabase from '../supabaseClient.js';
import { getAllGameProgress } from '../gameEngine.js';
import { getUserAchievements } from '../services/achievementManager.js';

const router = express.Router();

/**
 * GET /api/profile/:userId
 * Get user profile with progress and achievements
 */
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    
    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    // Get user's progress
    const progress = await getAllGameProgress(userId);
    
    // Get user's achievements
    const achievements = await getUserAchievements(userId);
    
    res.json({ 
      success: true, 
      data: {
        user,
        progress,
        achievements
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/profile/:userId
 * Update user profile
 */
router.put('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { username, avatar_url } = req.body;
    
    const { data, error } = await supabase
      .from('users')
      .update({
        username,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
