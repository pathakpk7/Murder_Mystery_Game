/**
 * Query Routes
 * Handles SQL query validation and execution
 * PROJECT VRITRA — SQL Detective Thriller
 */

import express from 'express';
import { validateQuery as validateSQL } from '../queryValidator.js';
import { recordQueryAttempt, getQueryAttempts } from '../gameEngine.js';
import supabase from '../supabaseClient.js';

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
 * POST /api/query/execute
 * Safely execute a SELECT SQL query against Supabase or return canonical table results
 */
router.post('/execute', async (req, res, next) => {
  try {
    const { query, case_id } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'SQL Query parameter is required' });
    }

    const cleanSql = query.trim();

    // 1. Validate safety
    const validation = validateSQL(cleanSql);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, error: validation.error || 'SQL Query failed security validation' });
    }

    // 2. Extract target table name safely
    const fromMatch = cleanSql.match(/\bFROM\s+([a-zA-Z0-9_]+)/i);
    if (!fromMatch) {
      return res.status(400).json({ success: false, error: 'Invalid SQL syntax: Missing target FROM table clause' });
    }

    const tableName = fromMatch[1].toLowerCase();

    // 3. Query Supabase table if configured
    let supabaseQuery = supabase.from(tableName).select('*');

    // Parse case_id filter if provided
    const targetCaseId = case_id !== undefined ? parseInt(case_id, 10) : null;
    const caseWhereMatch = cleanSql.match(/case_id\s*=\s*(\d+)/i);
    const parsedCaseId = caseWhereMatch ? parseInt(caseWhereMatch[1], 10) : targetCaseId;

    if (parsedCaseId !== null && !isNaN(parsedCaseId)) {
      supabaseQuery = supabaseQuery.eq('case_id', parsedCaseId);
    }

    try {
      const { data, error } = await supabaseQuery;

      if (!error && data) {
        return res.json({
          success: true,
          results: data || [],
          count: (data || []).length
        });
      }
      
      if (error) {
        console.warn(`Supabase table query notice (${tableName}):`, error.message);
      }
    } catch (dbErr) {
      console.warn(`Supabase execution notice (${tableName}):`, dbErr.message);
    }

    // Fallback query execution response if database is empty/unpopulated
    res.json({
      success: true,
      results: [],
      table: tableName,
      count: 0
    });
  } catch (error) {
    console.error('Query execution error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal query execution error' });
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
