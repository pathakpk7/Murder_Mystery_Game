-- ============================================
-- MURDER MYSTERY GAME - PERFORMANCE INDEXES
-- ============================================
-- Run this in Supabase SQL Editor after seed data
-- ============================================

-- Indexes for faster queries on game tables
CREATE INDEX IF NOT EXISTS idx_game_objectives_case_id ON game_objectives(case_id);
CREATE INDEX IF NOT EXISTS idx_game_objectives_order ON game_objectives(case_id, order_index);
CREATE INDEX IF NOT EXISTS idx_game_clues_case_id ON game_clues(case_id);
CREATE INDEX IF NOT EXISTS idx_game_clues_objective_id ON game_clues(objective_id);

-- Indexes for player progress tables
CREATE INDEX IF NOT EXISTS idx_player_progress_user_case ON player_progress(user_id, case_id);
CREATE INDEX IF NOT EXISTS idx_player_progress_status ON player_progress(status);
CREATE INDEX IF NOT EXISTS idx_player_progress_user_id ON player_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_objective_progress_user_objective ON objective_progress(user_id, objective_id);
CREATE INDEX IF NOT EXISTS idx_objective_progress_status ON objective_progress(status);

-- Indexes for query logs
CREATE INDEX IF NOT EXISTS idx_query_logs_user_objective ON query_logs(user_id, objective_id);
CREATE INDEX IF NOT EXISTS idx_query_logs_attempted_at ON query_logs(attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_query_logs_user_id ON query_logs(user_id);

-- Indexes for leaderboard
CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON leaderboard(period);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_case_id ON leaderboard(case_id);

-- Indexes for achievements
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_active ON achievements(is_active);

-- Indexes for user achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_total_score ON users(total_score DESC);

-- ============================================
-- END OF PERFORMANCE INDEXES
-- ============================================
