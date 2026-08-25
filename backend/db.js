/**
 * Safe Database Client Module (Vercel Serverless Ready)
 * PROJECT VRITRA — SQL Detective Thriller
 * 
 * Provides a reusable, serverless-safe interface over Supabase PostgreSQL.
 * Does not terminate process on connection failure.
 */

import supabase, { supabaseAdmin } from './supabaseClient.js';

/**
 * Test database connectivity
 * @returns {Promise<Object>} Connection test result
 */
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('game_cases')
      .select('id')
      .limit(1);

    if (error) {
      return { success: false, connected: false, error: error.message };
    }
    return { success: true, connected: true, data };
  } catch (err) {
    return { success: false, connected: false, error: err.message };
  }
}

/**
 * Get a single record matching conditions
 */
export async function getOne(tableName, conditions = {}) {
  try {
    let query = supabase.from(tableName).select('*');
    for (const [key, val] of Object.entries(conditions)) {
      query = query.eq(key, val);
    }
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn(`db.getOne error on ${tableName}:`, err.message);
    return null;
  }
}

/**
 * Get all records matching conditions
 */
export async function getAll(tableName, conditions = {}, options = {}) {
  try {
    let query = supabase.from(tableName).select('*');
    for (const [key, val] of Object.entries(conditions)) {
      query = query.eq(key, val);
    }
    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? true });
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn(`db.getAll error on ${tableName}:`, err.message);
    return [];
  }
}

/**
 * Execute a safe query or table fetch
 */
export async function execute(tableName, queryOptions = {}) {
  return getAll(tableName, queryOptions.conditions || {}, queryOptions);
}

/**
 * Get user profile by ID
 */
export async function getUserById(userId) {
  return getOne('users', { id: userId });
}

/**
 * Create or update user profile
 */
export async function createUserProfile(userData) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('db.createUserProfile error:', err.message);
    throw err;
  }
}

/**
 * Execute a simulated transaction or batch operation
 */
export async function transaction(callback) {
  try {
    return await callback(supabase);
  } catch (err) {
    console.error('db.transaction error:', err.message);
    throw err;
  }
}

/**
 * Fetch record with row identification lock simulation
 */
export async function getWithLock(tableName, recordId) {
  return getOne(tableName, { id: recordId });
}

/**
 * Update record with optimistic locking checks
 */
export async function updateWithOptimisticLock(tableName, recordId, updateData, expectedVersion = null) {
  try {
    let query = supabase.from(tableName).update(updateData).eq('id', recordId);
    if (expectedVersion !== null) {
      query = query.eq('version', expectedVersion);
    }
    const { data, error } = await query.select().single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`db.updateWithOptimisticLock error on ${tableName}:`, err.message);
    throw err;
  }
}

/**
 * Retry helper for asynchronous operations
 */
export async function retry(fn, retries = 3, delayMs = 500) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise(res => setTimeout(res, delayMs * attempt));
      }
    }
  }
  throw lastError;
}

/**
 * Log user SQL query attempt
 */
export async function logQuery(userId, queryText, wasSuccessful = true, executionTimeMs = 0) {
  try {
    const { data, error } = await supabase
      .from('query_logs')
      .insert({
        user_id: userId,
        query_text: queryText,
        was_successful: wasSuccessful,
        execution_time_ms: executionTimeMs,
        attempted_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();

    if (error) console.warn('db.logQuery notice:', error.message);
    return data;
  } catch (err) {
    console.warn('db.logQuery error:', err.message);
    return null;
  }
}

/**
 * Retrieve recent user query attempts
 */
export async function getUserQueryLogs(userId, limit = 20) {
  return getAll('query_logs', { user_id: userId }, { orderBy: 'attempted_at', ascending: false, limit });
}

export default {
  testConnection,
  getOne,
  getAll,
  execute,
  getUserById,
  createUserProfile,
  transaction,
  getWithLock,
  updateWithOptimisticLock,
  retry,
  logQuery,
  getUserQueryLogs
};
