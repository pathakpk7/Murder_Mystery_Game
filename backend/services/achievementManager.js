/**
 * Achievement Manager Service
 * Handles achievement tracking and unlocking
 */

import supabase from '../supabaseClient.js';
import { supabaseAdmin } from '../supabaseClient.js';

/**
 * Get all available achievements
 * @returns {Promise<Array>} Array of achievements
 */
export async function getAllAchievements() {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('points', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting achievements:', error);
    throw error;
  }
}

/**
 * Get user's achievements
 * @param {string} userId - User UUID
 * @returns {Promise<Array>} Array of user's achievements
 */
export async function getUserAchievements(userId) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (
          name,
          description,
          icon,
          points,
          category
        )
      `)
      .eq('user_id', userId)
      .order('achieved_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user achievements:', error);
    throw error;
  }
}

/**
 * Unlock an achievement for a user
 * @param {string} userId - User UUID
 * @param {number} achievementId - Achievement ID
 * @returns {Promise<Object>} Unlocked achievement
 */
export async function unlockAchievement(userId, achievementId) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId
      })
      .select(`
        *,
        achievements (
          name,
          description,
          icon,
          points
        )
      `)
      .single();
    
    if (error) throw error;
    
    // Update user total score with achievement points
    const { data: achievement } = await supabase
      .from('achievements')
      .select('points')
      .eq('id', achievementId)
      .single();
    
    if (achievement) {
      await supabaseAdmin
        .from('users')
        .update({
          total_score: supabase.raw(`total_score + ${achievement.points}`)
        })
        .eq('id', userId);
    }
    
    return data;
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    throw error;
  }
}

/**
 * Check if user has an achievement
 * @param {string} userId - User UUID
 * @param {number} achievementId - Achievement ID
 * @returns {Promise<boolean>} True if user has achievement
 */
export async function hasAchievement(userId, achievementId) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      return false; // Not found
    }
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error checking achievement:', error);
    throw error;
  }
}

/**
 * Check and unlock achievements based on user progress
 * @param {string} userId - User UUID
 * @returns {Promise<Array>} Newly unlocked achievements
 */
export async function checkAndUnlockAchievements(userId) {
  try {
    const newlyUnlocked = [];
    
    // Get user's progress
    const { data: progress } = await supabase
      .from('player_progress')
      .select('status, score, started_at, completed_at')
      .eq('user_id', userId);
    
    // Get all achievements
    const achievements = await getAllAchievements();
    
    for (const achievement of achievements) {
      // Check if user already has this achievement
      const hasIt = await hasAchievement(userId, achievement.id);
      if (hasIt) continue;
      
      // Check achievement requirements
      let shouldUnlock = false;
      
      // Example achievement checks (would be expanded based on actual requirements)
      if (achievement.name === 'First Blood') {
        const completedCases = progress.filter(p => p.status === 'completed').length;
        shouldUnlock = completedCases >= 1;
      } else if (achievement.name === 'Speed Demon') {
        const fastCompletions = progress.filter(p => {
          if (!p.completed_at || !p.started_at) return false;
          const duration = (new Date(p.completed_at) - new Date(p.started_at)) / 1000;
          return duration < 600; // Less than 10 minutes
        }).length;
        shouldUnlock = fastCompletions >= 1;
      }
      
      if (shouldUnlock) {
        const unlocked = await unlockAchievement(userId, achievement.id);
        newlyUnlocked.push(unlocked);
      }
    }
    
    return newlyUnlocked;
  } catch (error) {
    console.error('Error checking achievements:', error);
    throw error;
  }
}

export default {
  getAllAchievements,
  getUserAchievements,
  unlockAchievement,
  hasAchievement,
  checkAndUnlockAchievements
};
