-- ============================================
-- CASE 0: DETECTIVE ACADEMY - MISSING EVIDENCE
-- ============================================
-- Tutorial case teaching SQL basics through a mini mystery
-- ============================================

BEGIN;

DELETE FROM game_clues WHERE case_id = 0;
DELETE FROM game_objectives WHERE case_id = 0;
DELETE FROM timeline WHERE case_id = 0;
DELETE FROM forensics WHERE case_id = 0;
DELETE FROM evidence WHERE case_id = 0;
DELETE FROM witnesses WHERE case_id = 0;
DELETE FROM suspects WHERE case_id = 0;
DELETE FROM case_characters WHERE case_id = 0;
DELETE FROM game_cases WHERE id = 0;

-- Insert Case 0 into game_cases
INSERT INTO game_cases (id, title, description, difficulty, estimated_duration_minutes, mythology_theme, story_background, is_active, chapter, act, unlocks_case, story_arc, primary_villain) VALUES
(0, 'Detective Academy: Missing Evidence', 'Welcome to the Project Vritra Investigation Division. As a new recruit, you must complete training by solving a missing evidence case. Learn the basics of SQL investigation through this introductory mission.', 'easy', 15, 'Training', 'You have just joined the Investigation Division under Prasoon Pathak. Before you can work on real cases, you must prove your SQL skills by solving a training mystery involving missing evidence from the evidence locker.', true, 0, 0, 1, 'Training', 'None');

-- ============================================
-- TRAINING DATABASE TABLES
-- ============================================

-- Evidence Locker Table (for training)
CREATE TABLE IF NOT EXISTS evidence_locker (
  id SERIAL PRIMARY KEY,
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL,
  officer_assigned TEXT,
  date_added DATE NOT NULL
);

-- Insert training data
INSERT INTO evidence_locker (item_name, item_type, location, status, officer_assigned, date_added) VALUES
('Fingerprint Report', 'Document', 'Locker A-12', 'Present', 'Officer Sharma', '2024-01-15'),
('Blood Sample Vial', 'Physical', 'Lab 3', 'Present', 'Dr. Patel', '2024-01-15'),
('Weapon Knife', 'Physical', 'Locker B-7', 'Missing', 'Officer Kumar', '2024-01-14'),
('Witness Statement #1', 'Document', 'File Cabinet 2', 'Present', 'Officer Singh', '2024-01-15'),
('CCTV Footage', 'Digital', 'Server Room', 'Present', 'Tech Team', '2024-01-15'),
('Phone Records', 'Document', 'Locker A-15', 'Missing', 'Officer Sharma', '2024-01-14'),
('Crime Scene Photos', 'Physical', 'Locker B-3', 'Present', 'Officer Kumar', '2024-01-15'),
('Toxicology Report', 'Physical', 'Lab 1', 'Present', 'Dr. Mehta', '2024-01-15'),
('Suspect Interview', 'Document', 'File Cabinet 1', 'Present', 'Officer Singh', '2024-01-15'),
('DNA Sample', 'Physical', 'Lab 2', 'Missing', 'Dr. Patel', '2024-01-14');

-- ============================================
-- OBJECTIVES (Tutorial Steps)
-- ============================================

-- Objective 1: SELECT - View all evidence
INSERT INTO game_objectives (case_id, title, description, expected_query, expected_result, hint, hint_threshold, order_index, points, is_optional) VALUES
(0, 'View All Evidence', 'Use SELECT to retrieve all items from the evidence_locker table. This will show you everything in the evidence locker.', 
'SELECT * FROM evidence_locker', 
NULL,
'The SELECT statement retrieves data from a table. Use: SELECT * FROM table_name',
3,
1,
50,
false);

-- Objective 2: WHERE - Find missing items
INSERT INTO game_objectives (case_id, title, description, expected_query, expected_result, hint, hint_threshold, order_index, points, is_optional) VALUES
(0, 'Find Missing Evidence', 'Use WHERE to filter for items with status "Missing". We need to identify what evidence has disappeared.',
'SELECT * FROM evidence_locker WHERE status = ''Missing''',
NULL,
'The WHERE clause filters results. Use: SELECT * FROM table_name WHERE column = ''value''',
3,
2,
50,
false);

-- Objective 3: COUNT - Count evidence types
INSERT INTO game_objectives (case_id, title, description, expected_query, expected_result, hint, hint_threshold, order_index, points, is_optional) VALUES
(0, 'Count Evidence by Type', 'Use COUNT with GROUP BY to count how many items of each type are in the evidence locker.',
'SELECT item_type, COUNT(*) FROM evidence_locker GROUP BY item_type',
NULL,
'COUNT() with GROUP BY aggregates data. Use: SELECT column, COUNT(*) FROM table_name GROUP BY column',
3,
3,
50,
false);

-- Objective 4: LIMIT - Get recent additions
INSERT INTO game_objectives (case_id, title, description, expected_query, expected_result, hint, hint_threshold, order_index, points, is_optional) VALUES
(0, 'View Recent Evidence', 'Use LIMIT to show only the first 5 items in the evidence locker. This helps you focus on the most recent entries.',
'SELECT * FROM evidence_locker LIMIT 5',
NULL,
'LIMIT restricts the number of rows returned. Use: SELECT * FROM table_name LIMIT number',
3,
4,
50,
false);

-- Objective 5: ORDER BY - Sort by date
INSERT INTO game_objectives (case_id, title, description, expected_query, expected_result, hint, hint_threshold, order_index, points, is_optional) VALUES
(0, 'Sort Evidence by Date', 'Use ORDER BY to sort evidence by date_added in descending order (newest first). This helps track when items were added.',
'SELECT * FROM evidence_locker ORDER BY date_added DESC',
NULL,
'ORDER BY sorts results. Use DESC for descending order: SELECT * FROM table_name ORDER BY column DESC',
3,
5,
50,
false);

-- Objective 6: Combined - Find missing physical items
INSERT INTO game_objectives (case_id, title, description, expected_query, expected_result, hint, hint_threshold, order_index, points, is_optional) VALUES
(0, 'Find Missing Physical Evidence', 'Combine what you learned: Find all missing items of type "Physical". This is the critical evidence we need to recover.',
'SELECT * FROM evidence_locker WHERE status = ''Missing'' AND item_type = ''Physical''',
NULL,
'You can combine multiple conditions with AND: SELECT * FROM table_name WHERE condition1 AND condition2',
3,
6,
100,
false);

-- ============================================
-- CLUES (Tutorial Hints)
-- ============================================

INSERT INTO game_clues (case_id, objective_id, title, description, clue_type, icon, order_index) VALUES
(0, 1, 'Basic SELECT', 'The SELECT statement is the foundation of SQL. It retrieves data from database tables.', 'information', '📚', 1),
(0, 2, 'Filtering with WHERE', 'WHERE clauses help you narrow down results to find exactly what you need.', 'information', '🔍', 2),
(0, 3, 'Aggregation with COUNT', 'COUNT() helps you understand the distribution of data in your tables.', 'information', '📊', 3),
(0, 4, 'Limiting Results', 'LIMIT is useful when you only need to see a subset of data, like the top results.', 'information', '📋', 4),
(0, 5, 'Sorting with ORDER BY', 'ORDER BY organizes your data, making patterns easier to spot.', 'information', '📈', 5),
(0, 6, 'Combining Conditions', 'Using AND/OR in WHERE clauses allows for complex, precise queries.', 'information', '🧩', 6);

-- ============================================
-- CASE CHARACTERS (Team Members for Training)
-- ============================================

INSERT INTO case_characters (case_id, character_id, involvement_type, notes) VALUES
(0, 1, 'Lead Investigator', 'Your supervisor and mentor. He will guide you through the training.'),
(0, 2, 'Digital Forensics', 'Handles the technical aspects of evidence analysis.');

-- ============================================
-- END OF CASE 0
-- ============================================

COMMIT;
