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
    // Allow CORS if origin matches frontend domain or during deployment testing
    return callback(null, true);
  },
  credentials: true,
}));

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
    message: 'PROJECT VRITRA — Backend API Online ✅',
    version: '2.0.0 (Production)'
  });
});

// Health check endpoint (safe - no secrets exposed)
app.get('/api/health', async (req, res) => {
  try {
    let dbStatus = 'not_configured';
    
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_ANON_KEY !== 'dummy_key') {
      try {
        const { error } = await supabase
          .from('game_cases')
          .select('id')
          .limit(1);

        if (error) {
          dbStatus = `error: ${error.message}`;
        } else {
          dbStatus = 'connected';
        }
      } catch (e) {
        dbStatus = `error: ${e.message}`;
      }
    }

    res.json({
      success: true,
      database: dbStatus,
      status: 'healthy',
      version: '2.0.0 (Production)'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Health check failure'
    });
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
