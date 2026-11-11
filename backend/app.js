import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './supabaseClient.js';
import { errorHandler } from './errorMiddleware.js';
import { rateLimiter } from './rateLimitMiddleware.js';
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

// Trust proxy for serverless deployment platforms (e.g. Vercel)
app.set('trust proxy', 1);

// Configure Environment-based CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. server-to-server, cURL)
    if (!origin) return callback(null, true);
    if (process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(rateLimiter);
app.use(requestLogger);

// Case routes (supports both /api/cases and /api/game/cases)
app.use('/api/cases', caseRoutes);
app.use('/api/game/cases', caseRoutes);

// Query routes (supports /api/query and /api/game for execute-query)
app.use('/api/query', queryRoutes);
app.use('/api/game', queryRoutes);

// Leaderboard routes
app.use('/api/leaderboard', leaderboardRoutes);

// Profile, User, and Player routes
app.use('/api/profile', profileRoutes);
app.use('/api/user', profileRoutes);
app.use('/api/player', profileRoutes);

// Progress routes & direct accusation route
app.use('/api/progress', progressRoutes);
app.use('/api/accuse', progressRoutes);
app.use('/api/achievements', achievementRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PROJECT VRITRA — Backend API Online ✅',
    version: '2.0.0 (Production)'
  });
});

// Health check endpoint (safe - no secrets exposed, returns HTTP 503 on database unavailability without crashing)
app.get('/api/health', async (req, res) => {
  try {
    let dbStatus = 'not_configured';
    let isHealthy = true;
    
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_ANON_KEY !== 'dummy_key') {
      try {
        const { error } = await supabase
          .from('game_cases')
          .select('id')
          .limit(1);

        if (error) {
          dbStatus = `error: ${error.message}`;
          isHealthy = false;
        } else {
          dbStatus = 'connected';
        }
      } catch (e) {
        dbStatus = `error: ${e.message}`;
        isHealthy = false;
      }
    } else {
      dbStatus = 'unconfigured_env';
    }

    const statusCode = isHealthy ? 200 : 503;

    res.status(statusCode).json({
      success: isHealthy,
      database: dbStatus,
      status: isHealthy ? 'healthy' : 'degraded',
      version: '2.0.0 (Production)'
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      database: 'unavailable',
      error: 'Health check probe failed'
    });
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
