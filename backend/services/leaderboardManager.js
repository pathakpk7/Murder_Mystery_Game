/**
 * Leaderboard Manager Service
 * Handles leaderboard operations and rankings
 */

import supabaseAdmin from '../supabaseClient.js';

/**
 * Get leaderboard for a specific period
 * @param {string} period - 'daily', 'weekly', 'monthly', or 'all_time'
 * @param {number} limit - Number of entries to return
 * @returns {Promise<Array>} Leaderboard entries
 */
export async function getLeaderboard(period = 'all_time', limit = 100) {
  try {
    const { data, error } = await supabaseAdmin
      .from('leaderboard')
      .select(`
        *,
        users (
          username,
          avatar_url
        ),
        game_cases (
          title,
          difficulty
        )
      `)
      .eq('period', period)
      .order('score', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
}

/**
 * Update leaderboard with new score
 * @param {string} userId - User UUID
 * @param {number} caseId - Case ID
 * @param {number} score - Score achieved
 * @param {number} completionTimeSeconds - Time taken to complete
 * @returns {Promise<Object>} Updated leaderboard entry
 */
export async function updateLeaderboard(userId, caseId, score, completionTimeSeconds) {
  try {
    const periods = ['all_time', 'daily', 'weekly', 'monthly'];
    
    for (const period of periods) {
      await supabaseAdmin
        .from('leaderboard')
        .upsert({
          user_id: userId,
          case_id: caseId,
          score: score,
          completion_time_seconds: completionTimeSeconds,
          period: period
        }, {
          onConflict: 'user_id,case_id,period'
        });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    throw error;
  }
}

/**
 * Get user's rank on leaderboard
 * @param {string} userId - User UUID
 * @param {string} period - 'daily', 'weekly', 'monthly', or 'all_time'
 * @returns {Promise<Object>} User's rank and score
 */
export async function getUserRank(userId, period = 'all_time') {
  try {
    const { data, error } = await supabaseAdmin
      .from('leaderboard')
      .select('rank, score')
      .eq('user_id', userId)
      .eq('period', period)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user rank:', error);
    throw error;
  }
}

/**
 * Recalculate leaderboard rankings
 * @param {string} period - 'daily', 'weekly', 'monthly', or 'all_time'
 * @returns {Promise<Object>} Result of recalculation
 */
export async function recalculateLeaderboard(period = 'all_time') {
  try {
    // This would typically be done via a database function or cron job
    // For now, we'll use a simple update query
    const { data, error } = await supabaseAdmin.rpc('recalculate_leaderboard', {
      p_period: period
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error recalculating leaderboard:', error);
    throw error;
  }
}

export default {
  getLeaderboard,
  updateLeaderboard,
  getUserRank,
  recalculateLeaderboard
};
