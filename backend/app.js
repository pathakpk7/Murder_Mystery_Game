import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, all, get, run } from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5050;

// Initialize database on startup
(async () => {
  try {
    console.log('Initializing database...');
    await get('SELECT 1');
    console.log('✓ Database initialized successfully');
  } catch (err) {
    console.error('✗ Database initialization error:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }
})();

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Levels
app.get('/api/levels/:levelId', async (req, res) => {
  try {
    const levelId = parseInt(req.params.levelId, 10);
    const level = await get('SELECT id, objective, stage_description as stageDescription FROM levels WHERE id = ?', [levelId]);
    if (!level) return res.status(404).json({ error: 'Level not found' });
    const hints = await all('SELECT hint FROM level_hints WHERE level_id = ? ORDER BY id', [levelId]);
    const summaryKeys = await all('SELECT label FROM level_summary WHERE level_id = ? ORDER BY id', [levelId]);
    res.json({ ...level, hints: hints.map(h => h.hint), summaryLabels: summaryKeys.map(s => s.label) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load level', details: e.message });
  }
});

// Static data endpoints
app.get('/api/witnesses', async (req, res) => {
  try { const rows = await all('SELECT * FROM witnesses'); res.json(rows); } 
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/suspects', async (req, res) => {
  try { const rows = await all('SELECT * FROM suspects'); res.json(rows); } 
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/forensics', async (req, res) => {
  try { const rows = await all('SELECT * FROM forensics'); res.json(rows); } 
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/timeline', async (req, res) => {
  try { const rows = await all('SELECT * FROM timeline ORDER BY sort_order'); res.json(rows); } 
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Player state
app.get('/api/player/:playerId/state', async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const row = await get('SELECT player_id as playerId, current_level as currentLevel, progress, wrong_accusations as wrongAccusations FROM player_state WHERE player_id = ?', [playerId]);
    const flags = await all('SELECT key, value FROM player_flags WHERE player_id = ?', [playerId]);
    res.json({ ...(row || { playerId, currentLevel: 1, progress: 0, wrongAccusations: 0 }), flags: Object.fromEntries(flags.map(f => [f.key, f.value])) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/player/:playerId/state', async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const { currentLevel, progress, flags } = req.body;
    await run('INSERT INTO player_state (player_id, current_level, progress) VALUES (?, ?, ?) ON CONFLICT(player_id) DO UPDATE SET current_level = excluded.current_level, progress = excluded.progress', [playerId, currentLevel, progress]);
    if (flags && typeof flags === 'object') {
      const entries = Object.entries(flags);
      for (const [k, v] of entries) {
        await run('INSERT INTO player_flags (player_id, key, value) VALUES (?, ?, ?) ON CONFLICT(player_id, key) DO UPDATE SET value = excluded.value', [playerId, k, String(v)]);
      }
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Choices
app.post('/api/player/:playerId/choice', async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const { kind, payload } = req.body;
    await run('INSERT INTO player_choices (player_id, kind, payload) VALUES (?, ?, ?)', [playerId, kind, JSON.stringify(payload || {})]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Accusation & plot twist
app.post('/api/accuse', async (req, res) => {
  try {
    const { playerId, suspect } = req.body;
    const correct = await get('SELECT value FROM settings WHERE key = "correct_murderer"');
    const isCorrect = correct && correct.value && correct.value.toLowerCase() === String(suspect).toLowerCase();
    if (isCorrect) {
      return res.json({ correct: true });
    }
    await run('UPDATE player_state SET wrong_accusations = COALESCE(wrong_accusations,0) + 1 WHERE player_id = ?', [playerId]);
    const state = await get('SELECT wrong_accusations as count FROM player_state WHERE player_id = ?', [playerId]);
    let twist = null;
    if (state && state.count >= 2) {
      twist = await get('SELECT id, title, content FROM plot_twists ORDER BY RANDOM() LIMIT 1');
    }
    res.json({ correct: false, twist });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`✓ Backend server started successfully!`);
  console.log(`✓ Server listening on http://localhost:${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}/api`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
});

// ----------------------
// Phase 1: New APIs
// ----------------------

// Create player profile
app.post('/api/players', async (req, res) => {
  try {
    const { username } = req.body || {};
    const playerId = (Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 16);
    await run('INSERT INTO players (id, username) VALUES (?, ?)', [playerId, username || null]);
    // Initialize progress row
    await run('INSERT INTO progress (player_id, current_case_id, current_stage, score, time_spent_seconds, wrong_accusations, flags) VALUES (?, ?, ?, ?, ?, ?, ?)', [playerId, 1, 1, 0, 0, 0, JSON.stringify({ clues_found: [] })]);
    res.json({ playerId });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create player', details: e.message });
  }
});

// Get extended state (players + progress)
app.get('/api/player/:playerId/profile', async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const player = await get('SELECT id as playerId, username, created_at as createdAt FROM players WHERE id = ?', [playerId]);
    const prog = await get('SELECT player_id as playerId, current_case_id as caseId, current_stage as stage, score, time_spent_seconds as timeSpentSeconds, wrong_accusations as wrongAccusations, flags FROM progress WHERE player_id = ?', [playerId]);
    res.json({ player, progress: { ...prog, flags: prog && prog.flags ? JSON.parse(prog.flags) : {} } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update extended state
app.post('/api/player/:playerId/profile', async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const { currentCaseId, currentStage, score, timeSpentSeconds, wrongAccusations, flags } = req.body || {};
    const existing = await get('SELECT player_id FROM progress WHERE player_id = ?', [playerId]);
    if (!existing) {
      await run('INSERT INTO progress (player_id, current_case_id, current_stage, score, time_spent_seconds, wrong_accusations, flags) VALUES (?, ?, ?, ?, ?, ?, ?)', [playerId, currentCaseId || 1, currentStage || 1, score || 0, timeSpentSeconds || 0, wrongAccusations || 0, JSON.stringify(flags || {})]);
    } else {
      await run('UPDATE progress SET current_case_id = COALESCE(?, current_case_id), current_stage = COALESCE(?, current_stage), score = COALESCE(?, score), time_spent_seconds = COALESCE(?, time_spent_seconds), wrong_accusations = COALESCE(?, wrong_accusations), flags = COALESCE(?, flags) WHERE player_id = ?', [currentCaseId, currentStage, score, timeSpentSeconds, wrongAccusations, flags ? JSON.stringify(flags) : null, playerId]);
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create or randomize a case config
app.post('/api/case', async (req, res) => {
  try {
    const { caseId = 1, seed } = req.body || {};
    // Simple randomization using suspects table
    const suspects = await all('SELECT name FROM suspects');
    if (!suspects || suspects.length === 0) return res.status(400).json({ error: 'No suspects available to randomize' });
    const idx = Math.floor((seed ? Number(seed) : Math.random()) * 9973) % suspects.length;
    const murderer = suspects[idx].name;
    const weapons = ['Letter Opener', 'Candlestick', 'Revolver'];
    const locations = ['Study', 'Library', 'Ballroom'];
    const weapon = weapons[Math.floor(Math.random() * weapons.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    await run('INSERT INTO case_config (case_id, murderer, weapon, location, seed) VALUES (?, ?, ?, ?, ?) ON CONFLICT(case_id) DO UPDATE SET murderer = excluded.murderer, weapon = excluded.weapon, location = excluded.location, seed = excluded.seed, generated_at = CURRENT_TIMESTAMP', [caseId, murderer, weapon, location, seed || Math.floor(Math.random() * 1e9)]);
    const cfg = await get('SELECT * FROM case_config WHERE case_id = ?', [caseId]);
    res.json(cfg);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Case file API
app.get('/api/case/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const meta = await get('SELECT * FROM cases WHERE id = ?', [id]);
    const cfg = await get('SELECT * FROM case_config WHERE case_id = ?', [id]);
    res.json({ ...meta, config: cfg || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/case/:id/suspects', async (req, res) => {
  try {
    // For now, return global suspects; later link by case_id if you add the column
    const rows = await all('SELECT * FROM suspects');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/case/:id/clues', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const rows = await all('SELECT id, slug, title, content, type FROM clues WHERE case_id = ?', [id]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/case/:id/story/:stage', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const stage = Number(req.params.stage);
    const nodes = await all('SELECT node_key as nodeKey, dialogue, next_options as nextOptions, requires, effects FROM story_nodes WHERE case_id = ? AND stage = ?', [id, stage]);
    // parse JSON fields
    const parsed = nodes.map(n => ({
      ...n,
      nextOptions: n.nextOptions ? JSON.parse(n.nextOptions) : [],
      requires: n.requires ? JSON.parse(n.requires) : null,
      effects: n.effects ? JSON.parse(n.effects) : null
    }));
    res.json({ stage, nodes: parsed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Accusation with case context (does not expose murderer)
app.post('/api/case/:id/accuse', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { playerId, suspect } = req.body || {};
    const cfg = await get('SELECT murderer FROM case_config WHERE case_id = ?', [id]);
    const fallback = await get('SELECT value FROM settings WHERE key = "correct_murderer"');
    const murderer = (cfg && cfg.murderer) || (fallback && fallback.value) || '';
    const isCorrect = murderer.toLowerCase() === String(suspect || '').toLowerCase();
    if (!isCorrect) {
      await run('UPDATE progress SET wrong_accusations = COALESCE(wrong_accusations,0) + 1 WHERE player_id = ?', [playerId]);
    }
    res.json({ correct: isCorrect, endingKey: isCorrect ? 'true_culprit' : 'false_accusation' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const caseId = Number(req.query.caseId || 1);
    const rows = await all('SELECT player_id as playerId, case_id as caseId, score, completion_time_seconds as time, mistakes, created_at as createdAt FROM leaderboard WHERE case_id = ? ORDER BY score DESC, time ASC LIMIT 50', [caseId]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/leaderboard', async (req, res) => {
  try {
    const { playerId, caseId = 1, score = 0, completion_time_seconds = 0, mistakes = 0 } = req.body || {};
    await run('INSERT INTO leaderboard (player_id, case_id, score, completion_time_seconds, mistakes) VALUES (?, ?, ?, ?, ?)', [playerId, caseId, score, completion_time_seconds, mistakes]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ----------------------
// Game State Management APIs
// ----------------------

// Get player's full game state
app.get('/api/player/:playerId/game-state', async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const player = await get('SELECT id, username FROM players WHERE id = ?', [playerId]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    const progress = await get('SELECT * FROM progress WHERE player_id = ?', [playerId]);
    const flags = await all('SELECT key, value FROM player_flags WHERE player_id = ?', [playerId]);
    
    const gameState = {
      playerId: player.id,
      detectiveName: player.username || '',
      progress: progress?.score || 0,
      currentLevel: progress?.current_stage || 1,
      currentCaseId: progress?.current_case_id || 1,
      storyStage: progress?.current_stage || 1,
      flagsByLevel: {},
      completedLevels: {},
      discoveredClues: [],
      queryHistory: [],
      inventory: []
    };
    
    // Parse flags to reconstruct flagsByLevel and completedLevels
    flags.forEach(f => {
      if (f.key.startsWith('level_')) {
        const levelNum = parseInt(f.key.replace('level_', ''));
        if (f.key.includes('_completed')) {
          gameState.completedLevels[levelNum] = f.value === 'true';
        } else if (f.key.includes('_flags')) {
          try {
            gameState.flagsByLevel[levelNum] = JSON.parse(f.value);
          } catch (e) {
            gameState.flagsByLevel[levelNum] = {};
          }
        }
      }
    });
    
    // Parse clues from flags
    if (progress?.flags) {
      try {
        const flagsObj = JSON.parse(progress.flags);
        gameState.discoveredClues = flagsObj.clues_found || [];
        gameState.queryHistory = flagsObj.query_history || [];
        gameState.inventory = flagsObj.inventory || [];
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    res.json(gameState);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Save player's game state
app.post('/api/player/:playerId/game-state', async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const {
      progress,
      currentLevel,
      flagsByLevel,
      completedLevels,
      discoveredClues,
      queryHistory,
      inventory
    } = req.body;
    
    // Update progress table
    const existingProgress = await get('SELECT player_id FROM progress WHERE player_id = ?', [playerId]);
    const flagsData = JSON.stringify({
      clues_found: discoveredClues || [],
      query_history: queryHistory || [],
      inventory: inventory || []
    });
    
    if (existingProgress) {
      await run(
        'UPDATE progress SET current_stage = ?, score = ?, flags = ? WHERE player_id = ?',
        [currentLevel || 1, progress || 0, flagsData, playerId]
      );
    } else {
      await run(
        'INSERT INTO progress (player_id, current_case_id, current_stage, score, flags) VALUES (?, ?, ?, ?, ?)',
        [playerId, 1, currentLevel || 1, progress || 0, flagsData]
      );
    }
    
    // Save level flags and completion status
    if (flagsByLevel && typeof flagsByLevel === 'object') {
      for (const [level, data] of Object.entries(flagsByLevel)) {
        const levelNum = parseInt(level);
        if (data.flags) {
          await run(
            'INSERT INTO player_flags (player_id, key, value) VALUES (?, ?, ?) ON CONFLICT(player_id, key) DO UPDATE SET value = excluded.value',
            [playerId, `level_${levelNum}_flags`, JSON.stringify(data.flags)]
          );
        }
        if (data.completed !== undefined) {
          await run(
            'INSERT INTO player_flags (player_id, key, value) VALUES (?, ?, ?) ON CONFLICT(player_id, key) DO UPDATE SET value = excluded.value',
            [playerId, `level_${levelNum}_completed`, String(data.completed)]
          );
        }
      }
    }
    
    if (completedLevels && typeof completedLevels === 'object') {
      for (const [level, completed] of Object.entries(completedLevels)) {
        await run(
          'INSERT INTO player_flags (player_id, key, value) VALUES (?, ?, ?) ON CONFLICT(player_id, key) DO UPDATE SET value = excluded.value',
          [playerId, `level_${level}_completed`, String(completed)]
        );
      }
    }
    
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Save discovered clue
app.post('/api/player/:playerId/clues', async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const { title, description, icon } = req.body;
    
    const progress = await get('SELECT flags FROM progress WHERE player_id = ?', [playerId]);
    let flagsObj = { clues_found: [] };
    
    if (progress?.flags) {
      try {
        flagsObj = JSON.parse(progress.flags);
      } catch (e) {
        flagsObj = { clues_found: [] };
      }
    }
    
    // Add clue if not exists
    const existingIndex = flagsObj.clues_found.findIndex(c => c.title === title);
    if (existingIndex === -1) {
      flagsObj.clues_found.push({ title, description, icon, timestamp: new Date().toISOString() });
    } else {
      flagsObj.clues_found[existingIndex] = { title, description, icon, timestamp: new Date().toISOString() };
    }
    
    await run(
      'UPDATE progress SET flags = ? WHERE player_id = ?',
      [JSON.stringify(flagsObj), playerId]
    );
    
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
