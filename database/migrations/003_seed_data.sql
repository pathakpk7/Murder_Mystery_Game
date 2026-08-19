-- ============================================
-- PROJECT VRITRA - SEED DATA (CANONICAL)
-- ============================================
-- Seeds core Project Vritra cases and achievements
-- ============================================

-- Insert Canonical Cases
INSERT INTO game_cases (id, title, description, difficulty, estimated_duration_minutes, mythology_theme, story_background, is_active, chapter, act, unlocks_case, story_arc, primary_villain) VALUES
(0, 'Detective Academy: Missing Evidence', 'Welcome to the Project Vritra Investigation Division. Complete training by solving a missing evidence case to master SQL investigation techniques.', 'easy', 15, 'Training', 'You have joined the Investigation Task Force under Prasoon Pathak. Prove your analytical skills by auditing the evidence locker.', true, 0, 0, 1, 'Training', 'None'),
(1, 'The Nagabhavan Estate Mystery', 'Industrialist Rajveer Rathore is found dead inside his locked study at Nagabhavan Estate. What appears to be suicide reveals signs of targeted murder.', 'easy', 20, 'Naga Symbol', 'Prasoon Pathak is called to Nagabhavan Estate after ACP Rudransh Pathak suspects foul play in a locked-room death.', true, 1, 1, 2, 'The Pattern', 'Unknown'),
(2, 'The Poisoned Soma', 'A prominent researcher dies of poisoning during a cultural heritage summit. The fatal toxin mirrors ancient formulations.', 'easy', 25, 'Soma Mystery', 'The Task Force uncovers deliberate poison tampering connecting back to Nagabhavan Estate.', true, 2, 1, 3, 'The Pattern', 'Unknown'),
(3, 'The Temple Cipher', 'An ancient cipher hidden within the Sun Temple inscriptions is stolen after the curator is silenced.', 'easy', 30, 'Surya Mandala', 'The stolen cipher references early records of the Ninth Mandala.', true, 3, 1, 4, 'The Pattern', 'Unknown')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  mythology_theme = EXCLUDED.mythology_theme,
  story_background = EXCLUDED.story_background,
  is_active = EXCLUDED.is_active,
  story_arc = EXCLUDED.story_arc;

-- Insert Achievements
INSERT INTO achievements (name, description, icon, requirement, points, category, is_active) VALUES
('Academy Graduate', 'Complete the Detective Academy training', '🎓', 'Complete case 0', 100, 'general', true),
('First Breakthrough', 'Solve your first active crime investigation', '🔍', 'Complete case 1', 150, 'general', true),
('Pattern Analyst', 'Complete Act I (The Pattern)', '🧩', 'Complete cases 1-5', 500, 'story', true),
('Conspiracy Unraveler', 'Complete Act II (The Conspiracy)', '🗝️', 'Complete cases 6-10', 750, 'story', true),
('System Infiltrator', 'Complete Act III (The System)', '🏛️', 'Complete cases 11-15', 1000, 'story', true),
('Vritra Mastermind Solved', 'Expose the Sutradhar in Act IV', '👑', 'Complete all 18 cases', 2000, 'story', true),
('SQL Specialist', 'Execute 50 successful queries with zero syntax errors', '⚡', '50 accurate queries', 300, 'accuracy', true),
('Forensic Legend', 'Discover all critical forensic evidence across investigations', '🔬', 'Unlock all forensic reports', 400, 'explorer', true)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  requirement = EXCLUDED.requirement,
  points = EXCLUDED.points;

-- ============================================
-- END OF SEED DATA
-- ============================================
