-- ============================================
-- MURDER MYSTERY GAME - SEED DATA
-- ============================================
-- Run this in Supabase SQL Editor after RLS policies
-- ============================================

-- Insert sample cases
INSERT INTO game_cases (id, title, description, difficulty, estimated_duration_minutes, mythology_theme, story_background, is_active) VALUES
(1, 'The Midnight Murder', 'A wealthy businessman was found dead in his study at midnight. The door was locked from the inside, and no signs of forced entry. Was it suicide, or was there a hidden killer?', 'easy', 20, 'Modern Mystery', 'A classic whodunit set in modern Mumbai', true),
(2, 'The Poisoned Chalice', 'During a royal banquet, the king suddenly collapses after drinking from his golden chalice. Multiple nobles had access to the wine. Who poisoned the king?', 'medium', 30, 'Ancient India', 'Inspired by the Mahabharata', true),
(3, 'The Vanishing Heir', 'The sole heir to a vast fortune disappeared on the eve of their 21st birthday. Three suspects were seen near the estate that night. Solve the mystery before the inheritance is lost.', 'hard', 45, 'Colonial Era', 'Set during British Raj', true)
ON CONFLICT (id) DO NOTHING;

-- Insert objectives for case 1
INSERT INTO game_objectives (case_id, title, description, expected_query, hint, hint_threshold, order_index, points, is_optional) VALUES
(1, 'Identify the Victim', 'Query the witnesses table to find out who was found dead.', 'SELECT * FROM witnesses WHERE case_id = 1', 'Look for witnesses with no verified alibi', 3, 1, 100, false),
(1, 'Find the Murder Weapon', 'Search the forensics table for the weapon used in the crime.', 'SELECT * FROM forensics WHERE case_id = 1 AND type = ''Weapon''', 'Check for weapons in the study', 3, 2, 150, false),
(1, 'Identify the Killer', 'Cross-reference suspects with forensics to find the murderer.', 'SELECT s.* FROM suspects s JOIN forensics f ON s.case_id = f.case_id WHERE s.case_id = 1 AND f.match = s.name', 'Look for suspects whose DNA matches the evidence', 2, 3, 200, false)
ON CONFLICT DO NOTHING;

-- Insert clues for case 1
INSERT INTO game_clues (case_id, objective_id, title, description, clue_type, icon, order_index) VALUES
(1, NULL, 'Locked Door', 'The study door was locked from the inside. This suggests the killer knew how to lock it from outside or had a key.', 'information', '🚪', 1),
(1, NULL, 'Broken Window', 'A small window in the study was slightly ajar. Could this be the entry point?', 'evidence', '🪟', 2),
(1, 2, 'Fingerprint Match', 'The weapon has partial fingerprints. They match one of the suspects.', 'hint', '🔍', 3)
ON CONFLICT DO NOTHING;

-- Insert sample achievements
INSERT INTO achievements (name, description, icon, requirement, points, category, is_active) VALUES
('First Blood', 'Complete your first case', '🩸', 'Complete 1 case', 100, 'general', true),
('Speed Demon', 'Complete a case in under 10 minutes', '⚡', 'Complete case in < 600 seconds', 150, 'speed', true),
('Perfect Detective', 'Complete a case with zero failed queries', '🎯', 'Complete case with 0 failed attempts', 200, 'accuracy', true),
('Mythology Expert', 'Complete all mythology-themed cases', '📚', 'Complete all cases with mythology_theme', 300, 'explorer', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- END OF SEED DATA
-- ============================================
