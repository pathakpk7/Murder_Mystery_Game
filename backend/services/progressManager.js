/**
 * Progress Manager Service
 * Handles player progress tracking and management
 */

import supabase from '../supabaseClient.js';
import { getGameProgress, getAllGameProgress } from '../gameEngine.js';

/**
 * Get user's progress for a specific case
 * @param {string} userId - User UUID
 * @param {number} caseId - Case ID
 * @returns {Promise<Object|null>} Progress data
 */
export async function getUserProgress(userId, caseId) {
  try {
    const progress = await getGameProgress(userId, caseId);
    return progress;
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
}

/**
 * Get all progress for a user
 * @param {string} userId - User UUID
 * @returns {Promise<Array>} Array of progress data
 */
export async function getAllUserProgress(userId) {
  try {
    const allProgress = await getAllGameProgress(userId);
    return allProgress;
  } catch (error) {
    console.error('Error getting all user progress:', error);
    throw error;
  }
}

/**
 * Update user's progress score
 * @param {string} userId - User UUID
 * @param {number} caseId - Case ID
 * @param {number} additionalScore - Points to add
 * @returns {Promise<Object>} Updated progress
 */
export async function updateProgressScore(userId, caseId, additionalScore) {
  try {
    const { data, error } = await supabase
      .from('player_progress')
      .update({
        score: supabase.raw(`score + ${additionalScore}`)
      })
      .eq('user_id', userId)
      .eq('case_id', caseId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating progress score:', error);
    throw error;
  }
}

/**
 * Mark case as completed
 * @param {string} userId - User UUID
 * @param {number} caseId - Case ID
 * @returns {Promise<Object>} Updated progress
 */
export async function completeCase(userId, caseId) {
  try {
    const { data, error } = await supabase
      .from('player_progress')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('case_id', caseId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update user's completed cases count
    await supabase
      .from('users')
      .update({
        cases_completed: supabase.raw('cases_completed + 1')
      })
      .eq('id', userId);
    
    return data;
  } catch (error) {
    console.error('Error completing case:', error);
    throw error;
  }
}

export default {
  getUserProgress,
  getAllUserProgress,
  updateProgressScore,
  completeCase
};
