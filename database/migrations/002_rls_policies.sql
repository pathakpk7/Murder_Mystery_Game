-- ============================================
-- MURDER MYSTERY GAME - ROW LEVEL SECURITY POLICIES
-- ============================================
-- Run this in Supabase SQL Editor after initial schema
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_clues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objective_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.query_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;

-- Users can read their own data
CREATE POLICY "Users can read own data"
ON public.users
FOR SELECT
TO authenticated
USING ( (SELECT auth.uid()) = id );

-- Users can update their own data
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
TO authenticated
USING ( (SELECT auth.uid()) = id )
WITH CHECK ( (SELECT auth.uid()) = id );

-- Service role can insert users
CREATE POLICY "Service role can insert users"
ON public.users
FOR INSERT
TO service_role
WITH CHECK (true);

-- ============================================
-- GAME_CASES TABLE POLICIES (AUTHENTICATED READ)
-- ============================================

DROP POLICY IF EXISTS "Public read access for game_cases" ON public.game_cases;
DROP POLICY IF EXISTS "Service role can manage game_cases" ON public.game_cases;

-- Authenticated users can read active cases
CREATE POLICY "Public read access for game_cases"
ON public.game_cases
FOR SELECT
TO authenticated
USING (is_active = true);

-- Service role can manage cases
CREATE POLICY "Service role can manage game_cases"
ON public.game_cases
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- GAME_OBJECTIVES TABLE POLICIES (AUTHENTICATED READ)
-- ============================================

DROP POLICY IF EXISTS "Public read access for game_objectives" ON public.game_objectives;
DROP POLICY IF EXISTS "Service role can manage game_objectives" ON public.game_objectives;

-- Authenticated users can read objectives
CREATE POLICY "Public read access for game_objectives"
ON public.game_objectives
FOR SELECT
TO authenticated
USING (true);

-- Service role can manage objectives
CREATE POLICY "Service role can manage game_objectives"
ON public.game_objectives
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- GAME_CLUES TABLE POLICIES (AUTHENTICATED READ)
-- ============================================

DROP POLICY IF EXISTS "Public read access for game_clues" ON public.game_clues;
DROP POLICY IF EXISTS "Service role can manage game_clues" ON public.game_clues;

-- Authenticated users can read clues
CREATE POLICY "Public read access for game_clues"
ON public.game_clues
FOR SELECT
TO authenticated
USING (true);

-- Service role can manage clues
CREATE POLICY "Service role can manage game_clues"
ON public.game_clues
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- PLAYER_PROGRESS TABLE POLICIES (USER ISOLATION)
-- ============================================

DROP POLICY IF EXISTS "Users can read own progress" ON public.player_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.player_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.player_progress;
DROP POLICY IF EXISTS "Service role can manage player_progress" ON public.player_progress;

-- Users can read their own progress
CREATE POLICY "Users can read own progress"
ON public.player_progress
FOR SELECT
TO authenticated
USING ( (SELECT auth.uid()) = user_id );

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
ON public.player_progress
FOR INSERT
TO authenticated
WITH CHECK ( (SELECT auth.uid()) = user_id );

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
ON public.player_progress
FOR UPDATE
TO authenticated
USING ( (SELECT auth.uid()) = user_id )
WITH CHECK ( (SELECT auth.uid()) = user_id );

-- Service role can manage all progress
CREATE POLICY "Service role can manage player_progress"
ON public.player_progress
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- OBJECTIVE_PROGRESS TABLE POLICIES (USER ISOLATION)
-- ============================================

DROP POLICY IF EXISTS "Users can read own objective progress" ON public.objective_progress;
DROP POLICY IF EXISTS "Users can insert own objective progress" ON public.objective_progress;
DROP POLICY IF EXISTS "Users can update own objective progress" ON public.objective_progress;
DROP POLICY IF EXISTS "Service role can manage objective_progress" ON public.objective_progress;

-- Users can read their own objective progress
CREATE POLICY "Users can read own objective progress"
ON public.objective_progress
FOR SELECT
TO authenticated
USING ( (SELECT auth.uid()) = user_id );

-- Users can insert their own objective progress
CREATE POLICY "Users can insert own objective progress"
ON public.objective_progress
FOR INSERT
TO authenticated
WITH CHECK ( (SELECT auth.uid()) = user_id );

-- Users can update their own objective progress
CREATE POLICY "Users can update own objective progress"
ON public.objective_progress
FOR UPDATE
TO authenticated
USING ( (SELECT auth.uid()) = user_id )
WITH CHECK ( (SELECT auth.uid()) = user_id );

-- Service role can manage all objective progress
CREATE POLICY "Service role can manage objective_progress"
ON public.objective_progress
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- QUERY_LOGS TABLE POLICIES (USER ISOLATION)
-- ============================================

DROP POLICY IF EXISTS "Users can read own query logs" ON public.query_logs;
DROP POLICY IF EXISTS "Users can insert own query logs" ON public.query_logs;
DROP POLICY IF EXISTS "Service role can manage query_logs" ON public.query_logs;

-- Users can read their own query logs
CREATE POLICY "Users can read own query logs"
ON public.query_logs
FOR SELECT
TO authenticated
USING ( (SELECT auth.uid()) = user_id );

-- Users can insert their own query logs
CREATE POLICY "Users can insert own query logs"
ON public.query_logs
FOR INSERT
TO authenticated
WITH CHECK ( (SELECT auth.uid()) = user_id );

-- Service role can manage all query logs
CREATE POLICY "Service role can manage query_logs"
ON public.query_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- LEADERBOARD TABLE POLICIES (AUTHENTICATED READ)
-- ============================================

DROP POLICY IF EXISTS "Public read access for leaderboard" ON public.leaderboard;
DROP POLICY IF EXISTS "Service role can manage leaderboard" ON public.leaderboard;

-- Authenticated users can read leaderboard
CREATE POLICY "Public read access for leaderboard"
ON public.leaderboard
FOR SELECT
TO authenticated
USING (true);

-- Service role can manage leaderboard
CREATE POLICY "Service role can manage leaderboard"
ON public.leaderboard
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- ACHIEVEMENTS TABLE POLICIES (AUTHENTICATED READ)
-- ============================================

DROP POLICY IF EXISTS "Public read access for achievements" ON public.achievements;
DROP POLICY IF EXISTS "Service role can manage achievements" ON public.achievements;

-- Authenticated users can read active achievements
CREATE POLICY "Public read access for achievements"
ON public.achievements
FOR SELECT
TO authenticated
USING (is_active = true);

-- Service role can manage achievements
CREATE POLICY "Service role can manage achievements"
ON public.achievements
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- USER_ACHIEVEMENTS TABLE POLICIES (USER ISOLATION)
-- ============================================

DROP POLICY IF EXISTS "Users can read own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Service role can manage user_achievements" ON public.user_achievements;

-- Users can read their own achievements
CREATE POLICY "Users can read own achievements"
ON public.user_achievements
FOR SELECT
TO authenticated
USING ( (SELECT auth.uid()) = user_id );

-- Users can insert their own achievements
CREATE POLICY "Users can insert own achievements"
ON public.user_achievements
FOR INSERT
TO authenticated
WITH CHECK ( (SELECT auth.uid()) = user_id );

-- Service role can manage all user achievements
CREATE POLICY "Service role can manage user_achievements"
ON public.user_achievements
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- END OF RLS POLICIES
-- ============================================