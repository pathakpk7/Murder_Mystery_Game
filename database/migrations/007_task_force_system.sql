-- ============================================
-- TASK FORCE IMMERSION SYSTEM - DATABASE MIGRATION
-- ============================================
-- Adds player progression, ranks, XP, notifications, and team communications
-- ============================================

-- ============================================
-- UPDATE USERS TABLE WITH PROGRESSION FIELDS
-- ============================================

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'Investigation Intern' CHECK (rank IN (
  'Investigation Intern',
  'Junior Analyst',
  'Investigation Officer',
  'Crime Analyst',
  'Senior Investigator',
  'Lead Investigator',
  'Special Operations Lead',
  'Vritra Task Force Commander'
)),
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_stars INTEGER DEFAULT 0;

-- ============================================
-- RANK REQUIREMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS rank_requirements (
  id SERIAL PRIMARY KEY,
  rank TEXT NOT NULL UNIQUE,
  min_cases_completed INTEGER NOT NULL,
  min_xp INTEGER NOT NULL,
  min_level INTEGER NOT NULL,
  description TEXT
);

INSERT INTO rank_requirements (rank, min_cases_completed, min_xp, min_level, description) VALUES
('Investigation Intern', 0, 0, 1, 'New recruit to the Project Vritra Investigation Division'),
('Junior Analyst', 2, 1000, 2, 'Completed initial training cases'),
('Investigation Officer', 5, 3000, 3, 'Proven field investigator'),
('Crime Analyst', 8, 6000, 4, 'Expert in data-driven investigations'),
('Senior Investigator', 11, 10000, 5, 'Lead investigator on complex cases'),
('Lead Investigator', 14, 15000, 6, 'Senior team member handling major operations'),
('Special Operations Lead', 17, 20000, 7, 'Elite investigator for critical missions'),
('Vritra Task Force Commander', 18, 25000, 8, 'Commander of the entire task force');

-- ============================================
-- CASE STARS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS case_stars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  stars INTEGER DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, case_id)
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'promotion_earned',
    'new_intelligence',
    'evidence_updated',
    'case_unlocked',
    'achievement_earned',
    'message_received',
    'rank_up'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TEAM COMMUNICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS team_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender TEXT NOT NULL CHECK (sender IN (
    'Prasoon Pathak',
    'Gowrav Dubey',
    'Harsh Shukla',
    'Tammana Tiwari',
    'Amisha Singh',
    'Professor Vedika Rao',
    'ACP Rudransh Pathak'
  )),
  message TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'case_start',
    'objective_complete',
    'clue_unlocked',
    'evidence_found',
    'case_solved',
    'rank_up',
    'story_milestone'
  )),
  trigger_case_id INTEGER REFERENCES game_cases(id),
  is_unlocked BOOLEAN DEFAULT false,
  unlock_condition TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USER COMMUNICATIONS TABLE (Tracks which messages user has unlocked)
-- ============================================

CREATE TABLE IF NOT EXISTS user_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  communication_id UUID NOT NULL REFERENCES team_communications(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT false,
  UNIQUE(user_id, communication_id)
);

-- ============================================
-- STORY MILESTONES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS story_milestones (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  milestone_title TEXT NOT NULL,
  milestone_description TEXT NOT NULL,
  unlock_communication_ids TEXT[], -- Array of communication IDs to unlock
  is_active BOOLEAN DEFAULT true,
  UNIQUE(case_id)
);

-- Insert story milestones
INSERT INTO story_milestones (case_id, milestone_title, milestone_description) VALUES
(0, 'Welcome Recruit', 'Player joins the Investigation Division'),
(5, 'Project Vritra Mentioned', 'The conspiracy is first named'),
(10, 'Conspiracy Confirmed', 'The Ninth Mandala is revealed'),
(15, 'The Sutradhar Revealed', 'The architect is identified'),
(18, 'Final Briefing', 'The truth behind Project Vritra');

-- ============================================
-- EVIDENCE CATEGORIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS evidence_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT
);

INSERT INTO evidence_categories (name, icon, description) VALUES
('Witness Statements', '👤', 'Testimonies from witnesses'),
('Evidence', '🔍', 'Physical evidence collected'),
('Forensics', '🔬', 'Forensic analysis reports'),
('Timeline', '📅', 'Chronological events'),
('Recovered Documents', '📄', 'Documents and records recovered');

-- ============================================
-- PLAYER EVIDENCE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS player_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES evidence_categories(id) ON DELETE CASCADE,
  evidence_id INTEGER NOT NULL, -- References suspects, witnesses, evidence, forensics, or timeline
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('suspect', 'witness', 'evidence', 'forensic', 'timeline')),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, case_id, evidence_id, evidence_type)
);

-- ============================================
-- DETECTIVE BOARD NODES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS detective_board_nodes (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  node_type TEXT NOT NULL CHECK (node_type IN ('victim', 'witness', 'suspect', 'evidence', 'location')),
  name TEXT NOT NULL,
  description TEXT,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  unlock_condition TEXT,
  is_center_node BOOLEAN DEFAULT false
);

-- ============================================
-- DETECTIVE BOARD CONNECTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS detective_board_connections (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  from_node_id INTEGER NOT NULL REFERENCES detective_board_nodes(id) ON DELETE CASCADE,
  to_node_id INTEGER NOT NULL REFERENCES detective_board_nodes(id) ON DELETE CASCADE,
  connection_type TEXT DEFAULT 'related' CHECK (connection_type IN ('related', 'suspect', 'witness', 'evidence', 'timeline')),
  unlock_condition TEXT
);

-- ============================================
-- PLAYER BOARD PROGRESS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS player_board_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  node_id INTEGER NOT NULL REFERENCES detective_board_nodes(id) ON DELETE CASCADE,
  is_unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, case_id, node_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_team_comms_trigger ON team_communications(trigger_type, trigger_case_id);
CREATE INDEX IF NOT EXISTS idx_user_comms_user ON user_communications(user_id);
CREATE INDEX IF NOT EXISTS idx_case_stars_user ON case_stars(user_id);
CREATE INDEX IF NOT EXISTS idx_player_evidence_user_case ON player_evidence(user_id, case_id);
CREATE INDEX IF NOT EXISTS idx_board_progress_user_case ON player_board_progress(user_id, case_id);

-- ============================================
-- END OF TASK FORCE SYSTEM MIGRATION
-- ============================================
