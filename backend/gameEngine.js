/**
 * Game Engine Module (Supabase Version)
 * 
 * Handles the mission-based game logic including:
 * - Objective progression
 * - Query validation
 * - Clue unlocking
 * - Hint system
 * - Game flow management
 */

import supabase, { supabaseAdmin } from './supabaseClient.js';

// ============================================
// CASE MANAGEMENT
// ============================================

/**
 * Get all available cases
 * @returns {Promise<Array>} Array of cases
 */
export async function getAllCases() {
  const { data, error } = await supabase
    .from('game_cases')
    .select('id, title, description, difficulty, estimated_duration_minutes, mythology_theme, story_background, is_active')
    .eq('is_active', true)
    .order('id');
  
  if (error) throw error;
  return data;
}

/**
 * Get case details by ID
 * @param {number} caseId - Case ID
 * @returns {Promise<Object|null>} Case details
 */
export async function getCaseById(caseId) {
  const { data, error } = await supabase
    .from('game_cases')
    .select('*')
    .eq('id', caseId)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Start a case for a user
 * @param {string} userId - User UUID
 * @param {number} caseId - Case ID
 * @returns {Promise<Object>} Game progress
 */
export async function startCase(userId, caseId) {
  try {
    // Check if progress already exists
    const { data: existingProgress } = await supabase
      .from('player_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('case_id', caseId)
      .single();
    
    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('player_progress')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('case_id', caseId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
    
    // Create new progress
    const { data, error } = await supabase
      .from('player_progress')
      .insert({
        user_id: userId,
        case_id: caseId,
        status: 'in_progress'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error starting case:', error);
    throw error;
  }
}

// ============================================
// OBJECTIVE MANAGEMENT
// ============================================

/**
 * Get current objective for a user in a case
 * @param {string} userId - User UUID
 * @param {number} caseId - Case ID
 * @returns {Promise<Object|null>} Current objective
 */
export async function getCurrentObjective(userId, caseId) {
  const { data: progress } = await supabase
    .from('player_progress')
    .select('current_objective_id')
    .eq('user_id', userId)
    .eq('case_id', caseId)
    .single();
  
  if (!progress || !progress.current_objective_id) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('game_objectives')
    .select('*')
    .eq('id', progress.current_objective_id)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Get all objectives for a case
 * @param {number} caseId - Case ID
 * @returns {Promise<Array>} Array of objectives
 */
export async function getCaseObjectives(caseId) {
  const { data, error } = await supabase
    .from('game_objectives')
    .select('*')
    .eq('case_id', caseId)
    .order('order_index');
  
  if (error) throw error;
  return data;
}

/**
 * Get user's objective progress for a case
 * @param {string} userId - User UUID
 * @param {number} caseId - Case ID
 * @returns {Promise<Array>} Array of objective progress
 */
export async function getObjectiveProgress(userId, caseId) {
  const { data, error } = await supabase
    .from('objective_progress')
    .select(`
      *,
      game_objectives (
        title,
        description,
        points,
        order_index
      )
    `)
    .eq('user_id', userId)
    .eq('game_objectives.case_id', caseId)
    .order('game_objectives.order_index');
  
  if (error) throw error;
  return data;
}

/**
 * Complete an objective
 * @param {string} userId - User UUID
 * @param {number} objectiveId - Objective ID
 * @param {number} timeTakenSeconds - Time taken to complete
 * @returns {Promise<Object>} Updated objective progress
 */
export async function completeObjective(userId, objectiveId, timeTakenSeconds = 0) {
  try {
    // Get objective details
    const { data: objective } = await supabase
      .from('game_objectives')
      .select('case_id, points')
      .eq('id', objectiveId)
      .single();
    
    if (!objective) {
      throw new Error('Objective not found');
    }
    
    // Update objective progress
    const { data: objProgress, error: objError } = await supabase
      .from('objective_progress')
      .upsert({
        user_id: userId,
        objective_id: objectiveId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        time_taken_seconds: timeTakenSeconds
      }, {
        onConflict: 'user_id,objective_id'
      })
      .select()
      .single();
    
    if (objError) throw objError;
    
    // Update player progress score
    const { data: progress, error: progressError } = await supabase
      .from('player_progress')
      .update({
        score: supabase.raw(`score + ${objective.points}`)
      })
      .eq('user_id', userId)
      .eq('case_id', objective.case_id)
      .select()
      .single();
    
    if (progressError) throw progressError;
    
    // Update user total score
    await supabaseAdmin
      .from('users')
      .update({
        total_score: supabase.raw(`total_score + ${objective.points}`)
      })
      .eq('id', userId);
    
    return objProgress;
  } catch (error) {
    console.error('Error completing objective:', error);
    throw error;
  }
}

/**
 * Record a query attempt
 * @param {string} userId - User UUID
 * @param {number} objectiveId - Objective ID
 * @param {string} query - SQL query
 * @param {boolean} wasCorrect - Whether the query was correct
 * @param {number} executionTimeMs - Execution time in milliseconds
 * @returns {Promise<Object>} Query attempt record
 */
export async function recordQueryAttempt(userId, objectiveId, query, wasCorrect, executionTimeMs) {
  const { data, error } = await supabase
    .from('query_logs')
    .insert({
      user_id: userId,
      objective_id: objectiveId,
      query_text: query,
      was_successful: wasCorrect,
      execution_time_ms: executionTimeMs
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Get query attempts for an objective
 * @param {string} userId - User UUID
 * @param {number} objectiveId - Objective ID
 * @returns {Promise<Array>} Array of query attempts
 */
export async function getQueryAttempts(userId, objectiveId) {
  const { data, error } = await supabase
    .from('query_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('objective_id', objectiveId)
    .order('attempted_at', { ascending: false })
    .limit(10);
  
  if (error) throw error;
  return data;
}

// ============================================
// QUERY VALIDATION
// ============================================

/**
 * Validate a user's query against the expected result
 * @param {string} userId - User UUID
 * @param {number} objectiveId - Objective ID
 * @param {string} query - User's SQL query
 * @param {Array} actualResult - Actual query result
 * @returns {Promise<Object>} Validation result
 */
export async function validateQuery(userId, objectiveId, query, actualResult) {
  try {
    // Get objective details
    const { data: objective } = await supabase
      .from('game_objectives')
      .select('expected_query, expected_result')
      .eq('id', objectiveId)
      .single();
    
    if (!objective) {
      throw new Error('Objective not found');
    }
    
    // Normalize both queries for comparison (remove extra whitespace)
    const normalizedUserQuery = query.trim().replace(/\s+/g, ' ').toUpperCase();
    const normalizedExpectedQuery = objective.expected_query.trim().replace(/\s+/g, ' ').toUpperCase();
    
    // Check if queries match
    const queryMatches = normalizedUserQuery === normalizedExpectedQuery;
    
    // Check if results match (if expected result is defined)
    let resultMatches = true;
    if (objective.expected_result) {
      // Compare JSON structures
      const actualJson = JSON.stringify(actualResult);
      const expectedJson = JSON.stringify(objective.expected_result);
      resultMatches = actualJson === expectedJson;
    } else {
      // If no expected result, check if query returned any data
      resultMatches = actualResult && actualResult.length > 0;
    }
    
    // Query is valid if either the query matches OR the result matches
    const isValid = queryMatches || resultMatches;
    
    return {
      isValid,
      queryMatches,
      resultMatches,
      expectedQuery: objective.expected_query,
      expectedResult: objective.expected_result
    };
  } catch (error) {
    console.error('Error validating query:', error);
    throw error;
  }
}

// ============================================
// CLUE MANAGEMENT
// ============================================

/**
 * Get all clues for a case
 * @param {number} caseId - Case ID
 * @returns {Promise<Array>} Array of clues
 */
export async function getCaseClues(caseId) {
  const { data, error } = await supabase
    .from('game_clues')
    .select('*')
    .eq('case_id', caseId)
    .order('order_index');
  
  if (error) throw error;
  return data;
}

/**
 * Get user's unlocked clues for a case
 * @param {string} userId - User UUID
 * @param {number} caseId - Case ID
 * @returns {Promise<Array>} Array of unlocked clues
 */
export async function getUserClues(userId, caseId) {
  const { data, error } = await supabase
    .from('game_clues')
    .select(`
      *,
      user_clues!inner (
        user_id,
        unlocked_at
      )
    `)
    .eq('case_id', caseId)
    .eq('user_clues.user_id', userId)
    .order('order_index');
  
  if (error) throw error;
  return data;
}

// ============================================
// GAME PROGRESS
// ============================================

/**
 * Get user's progress for a case
 * @param {string} userId - User UUID
 * @param {number} caseId - Case ID
 * @returns {Promise<Object|null>} Game progress
 */
export async function getGameProgress(userId, caseId) {
  const { data, error } = await supabase
    .from('player_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('case_id', caseId)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Get all game progress for a user
 * @param {string} userId - User UUID
 * @returns {Promise<Array>} Array of game progress
 */
export async function getAllGameProgress(userId) {
  const { data, error } = await supabase
    .from('player_progress')
    .select(`
      *,
      game_cases (
        title,
        difficulty
      )
    `)
    .eq('user_id', userId)
    .order('started_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

/**
 * Get case summary with progress
 * @param {string} userId - User UUID
 * @param {number} caseId - Case ID
 * @returns {Promise<Object>} Case summary
 */
export async function getCaseSummary(userId, caseId) {
  const caseDetails = await getCaseById(caseId);
  const progress = await getGameProgress(userId, caseId);
  const objectives = await getCaseObjectives(caseId);
  const objectiveProgress = await getObjectiveProgress(userId, caseId);
  const clues = await getUserClues(userId, caseId);
  
  const completedObjectives = objectiveProgress.filter(op => op.status === 'completed').length;
  const totalObjectives = objectives.filter(o => !o.is_optional).length;
  const progressPercentage = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0;
  
  return {
    case: caseDetails,
    progress: progress,
    objectives: objectives,
    objectiveProgress: objectiveProgress,
    clues: clues,
    completedObjectives,
    totalObjectives,
    progressPercentage
  };
}

// ============================================
// GAME FLOW
// ============================================

/**
 * Execute game flow: validate query, update progress, unlock clues
 * @param {string} userId - User UUID
 * @param {number} objectiveId - Objective ID
 * @param {string} query - User's SQL query
 * @param {Array} queryResult - Query execution result
 * @param {number} executionTimeMs - Execution time
 * @returns {Promise<Object>} Game flow result
 */
export async function executeGameFlow(userId, objectiveId, query, queryResult, executionTimeMs) {
  try {
    // Validate query
    const validation = await validateQuery(userId, objectiveId, query, queryResult);
    
    // Record attempt
    await recordQueryAttempt(userId, objectiveId, query, validation.isValid, executionTimeMs);
    
    if (!validation.isValid) {
      return {
        success: false,
        validation,
        message: 'Query does not match expected result. Try again!'
      };
    }
    
    // Complete objective
    const objectiveProgress = await completeObjective(userId, objectiveId, executionTimeMs / 1000);
    
    // Get updated game progress
    const gameProgress = await getGameProgress(userId, objectiveProgress.case_id);
    
    // Get unlocked clues
    const unlockedClues = await getUserClues(userId, objectiveProgress.case_id);
    
    // Check if case is complete
    const isCaseComplete = gameProgress.status === 'completed';
    
    return {
      success: true,
      objectiveCompleted: true,
      objectiveProgress,
      gameProgress,
      unlockedClues,
      isCaseComplete,
      message: 'Objective completed! Clues unlocked.'
    };
  } catch (error) {
    console.error('Error executing game flow:', error);
    throw error;
  }
}

export default {
  getAllCases,
  getCaseById,
  startCase,
  getCurrentObjective,
  getCaseObjectives,
  getObjectiveProgress,
  completeObjective,
  recordQueryAttempt,
  getQueryAttempts,
  validateQuery,
  getCaseClues,
  getUserClues,
  getGameProgress,
  getAllGameProgress,
  getCaseSummary,
  executeGameFlow
};
