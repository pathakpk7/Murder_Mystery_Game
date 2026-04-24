-- Schema for Murder Mystery Game
PRAGMA foreign_keys = ON;

-- Levels and content
CREATE TABLE IF NOT EXISTS levels (
  id INTEGER PRIMARY KEY,
  objective TEXT NOT NULL,
  stage_description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS level_hints (
  id INTEGER PRIMARY KEY,
  level_id INTEGER NOT NULL,
  hint TEXT NOT NULL,
  FOREIGN KEY(level_id) REFERENCES levels(id)
);

CREATE TABLE IF NOT EXISTS level_summary (
  id INTEGER PRIMARY KEY,
  level_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  FOREIGN KEY(level_id) REFERENCES levels(id)
);

-- Static data
CREATE TABLE IF NOT EXISTS witnesses (
  id INTEGER PRIMARY KEY,
  name TEXT,
  relationship TEXT,
  alibi_verified TEXT,
  statement TEXT
);

CREATE TABLE IF NOT EXISTS suspects (
  id INTEGER PRIMARY KEY,
  name TEXT,
  motive TEXT,
  alibi TEXT,
  suspicious_behavior TEXT,
  suspicion_level INTEGER
);

CREATE TABLE IF NOT EXISTS forensics (
  id INTEGER PRIMARY KEY,
  evidence_type TEXT,
  location TEXT,
  match TEXT,
  description TEXT,
  significance TEXT
);

CREATE TABLE IF NOT EXISTS timeline (
  id INTEGER PRIMARY KEY,
  sort_order INTEGER,
  time TEXT,
  event TEXT,
  witness TEXT
);

-- Game settings and dynamic content
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS plot_twists (
  id INTEGER PRIMARY KEY,
  title TEXT,
  content TEXT
);

-- Player persistence
CREATE TABLE IF NOT EXISTS player_state (
  player_id TEXT PRIMARY KEY,
  current_level INTEGER DEFAULT 1,
  progress INTEGER DEFAULT 0,
  wrong_accusations INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS player_flags (
  player_id TEXT,
  key TEXT,
  value TEXT,
  PRIMARY KEY(player_id, key)
);

CREATE TABLE IF NOT EXISTS player_choices (
  id INTEGER PRIMARY KEY,
  player_id TEXT,
  kind TEXT,
  payload TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- New: Players and Progress for Phase 1 APIs
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  username TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progress (
  player_id TEXT PRIMARY KEY,
  current_case_id INTEGER DEFAULT 1,
  current_stage INTEGER DEFAULT 1,
  score INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  wrong_accusations INTEGER DEFAULT 0,
  flags TEXT
);

-- New: Cases, Case config, Clues, Story nodes
CREATE TABLE IF NOT EXISTS cases (
  id INTEGER PRIMARY KEY,
  title TEXT,
  description TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS case_config (
  case_id INTEGER PRIMARY KEY,
  murderer TEXT,
  weapon TEXT,
  location TEXT,
  seed INTEGER,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clues (
  id INTEGER PRIMARY KEY,
  case_id INTEGER,
  slug TEXT,
  title TEXT,
  content TEXT,
  type TEXT
);

CREATE TABLE IF NOT EXISTS story_nodes (
  id INTEGER PRIMARY KEY,
  case_id INTEGER,
  stage INTEGER,
  node_key TEXT,
  dialogue TEXT,
  next_options TEXT,
  requires TEXT,
  effects TEXT
);

-- New: Leaderboard
CREATE TABLE IF NOT EXISTS leaderboard (
  id INTEGER PRIMARY KEY,
  player_id TEXT,
  case_id INTEGER,
  score INTEGER,
  completion_time_seconds INTEGER,
  mistakes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Levels
INSERT OR REPLACE INTO levels (id, objective, stage_description) VALUES
  (1, 'Identify all witnesses with unverified alibis and rank suspects by suspicion.', 'Initial triage: separate verified vs unverified alibis and see who looks most suspicious.'),
  (2, 'Investigate each unverified person by name and corroborate with critical forensics.', 'Focused questioning: review statements of unverified witnesses and compare with critical lab findings.'),
  (3, 'Align timeline of events with witness claims.', 'Reconstruction: compare claimed movements with the timeline of noises, sightings and discovery.'),
  (4, 'Narrow suspects using high suspicion threshold and forensic matches.', 'Filtering: isolate top suspects and ensure evidence corroboration exists.'),
  (5, 'Name the main culprit based on DNA and behavior evidence.', 'Conclusion: confirm the individual with both critical DNA evidence and top suspicion.');

-- Seed Hints (3 per level)
DELETE FROM level_hints;
INSERT INTO level_hints (level_id, hint) VALUES
  (1, 'Filter witnesses by alibi status.'),
  (1, 'Order suspects by their suspicion score descending.'),
  (1, 'Look for any cluster of high suspicion.'),
  (2, 'Search witnesses by exact full name.'),
  (2, 'Cross-check forensics marked \"Critical\".'),
  (2, 'Correlate names appearing in both datasets.'),
  (3, 'Retrieve the full timeline.'),
  (3, 'Look at timestamps around 10:00–11:30 PM.'),
  (3, 'Match witness names between timeline and interviews.'),
  (4, 'Filter suspects above a suspicion threshold.'),
  (4, 'Search for forensic matches by person name.'),
  (4, 'Focus on names that appear in both filters.'),
  (5, 'Inspect the suspect with highest suspicion.'),
  (5, 'Check for a DNA match in forensics.'),
  (5, 'Confirm their alibi conflicts with the timeline.');

-- Seed Summary labels
DELETE FROM level_summary;
INSERT INTO level_summary (level_id, label) VALUES
  (1, 'Unverified alibi witnesses'), (1, 'Suspects ranked'),
  (2, 'Interviewed Eleanor'), (2, 'Interviewed Sarah'), (2, 'Interviewed Thomas'), (2, 'Critical forensics reviewed'),
  (3, 'Timeline loaded'), (3, 'Cross-checked Sarah'), (3, 'Cross-checked Thomas'),
  (4, 'High suspicion filtered'), (4, 'Forensic matches checked'),
  (5, 'Thomas profile reviewed'), (5, 'DNA match confirmed');

-- Seed static data matching the frontend mock
DELETE FROM witnesses;
INSERT INTO witnesses (id, name, relationship, alibi_verified, statement) VALUES
  (1, 'Mrs. Eleanor Blackwood', 'Wife', 'false', 'I was in my room reading when I heard the commotion.'),
  (2, 'James Blackwood', 'Son', 'true', 'I was at the library studying until 11 PM.'),
  (3, 'Sarah Mitchell', 'Maid', 'false', 'I was cleaning the kitchen when I heard screams.'),
  (4, 'Dr. Robert Chen', 'Family Doctor', 'true', 'I was at the hospital until midnight.'),
  (5, 'Thomas Blackwood', 'Brother', 'false', 'I was in the garden smoking when it happened.');

DELETE FROM suspects;
INSERT INTO suspects (id, name, motive, alibi, suspicious_behavior, suspicion_level) VALUES
  (1, 'Mrs. Eleanor Blackwood', 'Inheritance', 'Unverified', 'Found with victim''s will', 85),
  (2, 'James Blackwood', 'Financial debt', 'Verified', 'None reported', 30),
  (3, 'Sarah Mitchell', 'Blackmail', 'Unverified', 'Overheard arguing with victim', 70),
  (4, 'Dr. Robert Chen', 'Medical malpractice cover-up', 'Verified', 'None reported', 25),
  (5, 'Thomas Blackwood', 'Business rivalry', 'Unverified', 'Last seen with victim', 90);

DELETE FROM forensics;
INSERT INTO forensics (id, evidence_type, location, match, description, significance) VALUES
  (1, 'Fingerprint', 'Study door handle', 'Sarah Mitchell', NULL, 'High'),
  (2, 'DNA', 'Victim''s clothing', 'Thomas Blackwood', NULL, 'Critical'),
  (3, 'Weapon', 'Study floor', NULL, 'Letter opener with blood', 'Critical'),
  (4, 'Fiber', 'Victim''s hand', 'Mrs. Eleanor Blackwood''s dress', NULL, 'Medium');

DELETE FROM timeline;
INSERT INTO timeline (sort_order, time, event, witness) VALUES
  (1, '9:30 PM', 'Victim last seen alive in study', 'Sarah Mitchell'),
  (2, '10:00 PM', 'Heard arguing in study', 'Mrs. Eleanor Blackwood'),
  (3, '10:15 PM', 'Study door slammed', 'Thomas Blackwood'),
  (4, '11:30 PM', 'Body discovered', 'Sarah Mitchell'),
  (5, '11:45 PM', 'Police called', 'Mrs. Eleanor Blackwood');

-- Settings
INSERT OR REPLACE INTO settings (key, value) VALUES ('correct_murderer', 'Thomas Blackwood');

-- Plot twists (revealed after 2 wrong accusations)
DELETE FROM plot_twists;
INSERT INTO plot_twists (title, content) VALUES
  ('An Ominous Letter', 'A newly discovered letter hints the killer tried to frame a family member.'),
  ('Secret Passage', 'A hidden passage behind the study bookshelf suggests someone knew the manor intimately.');

-- Minimal seeds for a sample case
INSERT OR IGNORE INTO cases (id, title, description, status) VALUES
  (1, 'Blackwood Manor Case', 'A high-profile murder at Blackwood Manor.', 'active');

INSERT OR IGNORE INTO case_config (case_id, murderer, weapon, location, seed) VALUES
  (1, 'Thomas Blackwood', 'Letter Opener', 'Study', 12345);

INSERT OR IGNORE INTO clues (id, case_id, slug, title, content, type) VALUES
  (1, 1, 'weapon_blood', 'Bloody Letter Opener', 'The letter opener has the victim\'s blood.', 'weapon'),
  (2, 1, 'dna_on_clothing', 'DNA on Clothing', 'DNA traces linking to Thomas Blackwood.', 'forensic');

INSERT OR IGNORE INTO story_nodes (id, case_id, stage, node_key, dialogue, next_options) VALUES
  (1, 1, 1, 'intro', 'You arrive at Blackwood Manor. Where do you begin?', '[{"label":"Interview Maid","goto":"maid_interview"},{"label":"Inspect Study","goto":"inspect_study"}]');
