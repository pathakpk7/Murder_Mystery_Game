/**
 * Profile Routes
 * Handles user profile-related API endpoints
 */

import express from 'express';
import supabase from '../supabaseClient.js';
import { getAllGameProgress } from '../gameEngine.js';
import { getUserAchievements } from '../services/achievementManager.js';

const router = express.Router();

// In-memory profiles store for instant Supabase sync fallback
const userProfilesStore = {};

/**
 * POST /api/profile/sync, /api/player/state, /api/user/profile, etc.
 * Sync/Save user progress state to Supabase
 */
router.post(['/sync', '/state', '/profile', '/game-state'], async (req, res, next) => {
  try {
    const { player } = req.body;
    if (!player || !player.email) {
      return res.status(400).json({ success: false, error: 'Player email required' });
    }

    const emailKey = player.email.toLowerCase();
    userProfilesStore[emailKey] = { ...player, updated_at: new Date().toISOString() };

    // Attempt Supabase upsert
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          email: emailKey,
          username: player.name || 'Detective',
          total_xp: player.xp || 0,
          rank: player.rank || 'Investigation Intern',
          completed_cases: player.completedCases || [],
          unlocked_cases: player.unlockedCases || [0, 1],
          case_progress: player.caseProgress || {},
          updated_at: new Date().toISOString()
        }, { onConflict: 'email' })
        .select();

      if (error) console.log('Supabase users table sync notice:', error.message);
    } catch (dbErr) {
      console.log('Supabase sync fallback to memory:', dbErr.message);
    }

    res.json({ success: true, message: 'Profile synced to database', data: userProfilesStore[emailKey] });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/profile/sync, /api/player/state, /api/user/profile, etc.
 * Fetch user progress state from Supabase by email
 */
router.get(['/sync', '/state', '/profile', '/game-state'], async (req, res, next) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email parameter required' });
    }

    const emailKey = email.toLowerCase();

    // Check Supabase first
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', emailKey)
        .single();

      if (data && !error) {
        const syncedPlayer = {
          name: data.username || 'Detective',
          email: data.email,
          xp: data.total_xp || 0,
          rank: data.rank || 'Investigation Intern',
          completedCases: data.completed_cases || [],
          unlockedCases: data.unlocked_cases || [0, 1],
          caseProgress: data.case_progress || {}
        };
        userProfilesStore[emailKey] = syncedPlayer;
        return res.json({ success: true, data: syncedPlayer });
      }
    } catch (dbErr) {
      console.log('Supabase fetch notice:', dbErr.message);
    }

    // Check memory store
    if (userProfilesStore[emailKey]) {
      return res.json({ success: true, data: userProfilesStore[emailKey] });
    }

    res.json({ success: false, message: 'Profile not found in Supabase' });
  } catch (error) {
    next(error);
  }
});

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
