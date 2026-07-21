-- ============================================
-- MURDER MYSTERY GAME - INITIAL DATABASE SCHEMA
-- ============================================
-- Run this in Supabase SQL Editor to create all tables
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER TABLE (for game profiles, separate from Supabase Auth)
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  avatar_url TEXT,
  total_score INTEGER DEFAULT 0,
  cases_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- GAME STRUCTURE TABLES
-- ============================================

-- Cases (game scenarios/mysteries)
CREATE TABLE IF NOT EXISTS game_cases (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  estimated_duration_minutes INTEGER DEFAULT 30,
  mythology_theme TEXT,
  story_background TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Objectives (missions within a case)
CREATE TABLE IF NOT EXISTS game_objectives (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  expected_query TEXT NOT NULL,
  expected_result JSONB,
  hint TEXT,
  hint_threshold INTEGER DEFAULT 3,
  order_index INTEGER NOT NULL,
  points INTEGER DEFAULT 100,
  is_optional BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(case_id, title)
);

-- Clues (hints/evidence that unlock as user progresses)
CREATE TABLE IF NOT EXISTS game_clues (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  objective_id INTEGER REFERENCES game_objectives(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  clue_type TEXT DEFAULT 'information' CHECK (clue_type IN ('information', 'evidence', 'hint')),
  icon TEXT DEFAULT '💡',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(case_id, title)
);

-- ============================================
-- CASE DATA TABLES
-- ============================================

-- Suspects (people suspected of the crime)
CREATE TABLE IF NOT EXISTS suspects (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  occupation TEXT,
  motive TEXT,
  alibi TEXT,
  contradiction TEXT,
  connection_to_monastery TEXT,
  UNIQUE(case_id, name)
);

-- Witnesses (people who saw something)
CREATE TABLE IF NOT EXISTS witnesses (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  occupation TEXT,
  statement TEXT,
  reliability TEXT CHECK (reliability IN ('High', 'Medium', 'Low')),
  UNIQUE(case_id, name)
);

-- Evidence (physical evidence found at the scene)
CREATE TABLE IF NOT EXISTS evidence (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  type TEXT CHECK (type IN ('Physical', 'Document', 'Digital')),
  UNIQUE(case_id, name)
);

-- Forensics (forensic analysis reports)
CREATE TABLE IF NOT EXISTS forensics (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  analysis_result TEXT,
  type TEXT CHECK (type IN ('Chemical', 'Physical', 'Temporal', 'Documentary')),
  UNIQUE(case_id, name)
);

-- Timeline (chronological events)
CREATE TABLE IF NOT EXISTS timeline (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  time TEXT NOT NULL,
  event TEXT NOT NULL,
  description TEXT,
  UNIQUE(case_id, time, event)
);

-- ============================================
-- PLAYER PROGRESS TABLES
-- ============================================

-- Player Progress (tracks user's progress through a case)
CREATE TABLE IF NOT EXISTS player_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  current_objective_id INTEGER REFERENCES game_objectives(id),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  score INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, case_id)
);

-- Objective Progress (tracks completion of individual objectives)
CREATE TABLE IF NOT EXISTS objective_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  objective_id INTEGER NOT NULL REFERENCES game_objectives(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_taken_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, objective_id)
);

-- Query Logs (tracks SQL queries submitted by user)
CREATE TABLE IF NOT EXISTS query_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  objective_id INTEGER NOT NULL REFERENCES game_objectives(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  was_successful BOOLEAN DEFAULT false,
  execution_time_ms INTEGER,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- LEADERBOARD & ACHIEVEMENTS
-- ============================================

-- Leaderboard
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_id INTEGER REFERENCES game_cases(id) ON DELETE SET NULL,
  score INTEGER NOT NULL,
  completion_time_seconds INTEGER,
  rank INTEGER,
  period TEXT DEFAULT 'all_time' CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, case_id, period)
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT DEFAULT '🏆',
  requirement TEXT NOT NULL,
  points INTEGER DEFAULT 50,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'speed', 'accuracy', 'explorer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Achievements (tracks achievements earned by users)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- END OF INITIAL SCHEMA
-- ============================================
