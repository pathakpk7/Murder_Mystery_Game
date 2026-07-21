import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './supabaseClient.js';
import { errorHandler } from './errorMiddleware.js';
import { rateLimiter, queryRateLimiter, writeRateLimiter } from './rateLimitMiddleware.js';
import { requestLogger } from './logger.js';

// Route imports
import caseRoutes from './routes/cases.js';
import progressRoutes from './routes/progress.js';
import queryRoutes from './routes/query.js';
import leaderboardRoutes from './routes/leaderboard.js';
import profileRoutes from './routes/profile.js';
import achievementRoutes from './routes/achievements.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(requestLogger);

// Routes
app.use('/api/cases', caseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/achievements', achievementRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Murder Mystery Backend Running ✅',
    version: '2.0.0 (Supabase-Only Architecture)'
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('game_cases')
      .select('id')
      .limit(1);

    if (error) throw error;

    res.json({
      success: true,
      database: 'connected',
      architecture: 'supabase-only'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5433;

app.listen(PORT, () => {
  console.log(`
====================================
🕵️ Murder Mystery Backend Running
🌐 Port: ${PORT}
✅ Supabase Connected
📦 Architecture: Supabase-Only
====================================
  `);
});

export default app;
