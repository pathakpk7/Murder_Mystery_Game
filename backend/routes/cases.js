/**
 * Case Routes
 * Handles all case-related API endpoints
 */

import express from 'express';
import { getAllCases, getCaseById, getCaseObjectives, getCaseClues } from '../gameEngine.js';

const router = express.Router();

/**
 * GET /api/cases
 * Get all available cases
 */
router.get('/', async (req, res, next) => {
  try {
    const cases = await getAllCases();
    res.json({ success: true, count: cases.length, data: cases });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/cases/:id
 * Get a specific case by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const caseId = parseInt(req.params.id);
    if (isNaN(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid case ID' });
    }
    
    const caseData = await getCaseById(caseId);
    res.json({ success: true, data: caseData });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/cases/:id/objectives
 * Get all objectives for a specific case
 */
router.get('/:id/objectives', async (req, res, next) => {
  try {
    const caseId = parseInt(req.params.id);
    if (isNaN(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid case ID' });
    }
    
    const objectives = await getCaseObjectives(caseId);
    res.json({ success: true, count: objectives.length, data: objectives });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/cases/:id/clues
 * Get all clues for a specific case
 */
router.get('/:id/clues', async (req, res, next) => {
  try {
    const caseId = parseInt(req.params.id);
    if (isNaN(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid case ID' });
    }
    
    const clues = await getCaseClues(caseId);
    res.json({ success: true, count: clues.length, data: clues });
  } catch (error) {
    next(error);
  }
});

export default router;
