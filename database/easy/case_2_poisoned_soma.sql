BEGIN;

-- ============================================
-- CASE 2
-- THE POISONED SOMA
-- ACT 1 : THE PATTERN
-- ============================================

DELETE FROM game_clues WHERE case_id = 2;
DELETE FROM game_objectives WHERE case_id = 2;
DELETE FROM timeline WHERE case_id = 2;
DELETE FROM forensics WHERE case_id = 2;
DELETE FROM evidence WHERE case_id = 2;
DELETE FROM witnesses WHERE case_id = 2;
DELETE FROM suspects WHERE case_id = 2;
DELETE FROM case_characters WHERE case_id = 2;
DELETE FROM game_cases WHERE id = 2;

INSERT INTO game_cases (
id,
title,
description,
difficulty,
estimated_duration_minutes,
mythology_theme,
story_background,
is_active,
chapter,
act,
unlocks_case,
story_arc,
primary_villain
)
VALUES
(
2,
'The Poisoned Soma',
'Scholar and Ayurvedic researcher Acharya Devendra Mishra collapses during a private symposium after consuming a ceremonial Soma preparation.',
'easy',
25,
'Soma Ritual',
'Ancient mythology appears connected to a modern murder.',
true,
2,
1,
3,
'The Pattern',
'Unknown'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(2,1,'Lead Investigator','Tracks pattern from Blackwood Manor'),
(2,2,'Digital Forensics','Examines communications'),
(2,3,'Field Investigator','Interviews participants'),
(2,4,'Psychologist','Profiles suspects'),
(2,5,'Journalist','Researches victim'),
(2,6,'Police Liaison','Coordinates investigation'),
(2,7,'Expert Consultant','Translates Sanskrit references');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
2,
'Ritesh Vashisht',
47,
'Ayurvedic Manufacturer',
'Victim planned to expose fraudulent products',
'Claims he left before ceremony',
'Phone location places him nearby',
'Business Rival'
),

(
2,
'Mahima Trivedi',
39,
'Research Associate',
'Professional jealousy',
'Working in archive room',
'Witnesses place her near preparation area',
'Research Partner'
),

(
2,
'Arvind Kulkarni',
52,
'Temple Trustee',
'Financial dispute over donations',
'Attending ceremony',
'Statement changes repeatedly',
'Funding Connection'
),

(
2,
'Sameer Bhat',
34,
'Laboratory Assistant',
'Fear of being exposed',
'Claims equipment maintenance',
'Lab records inconsistent',
'Research Team'
),

(
2,
'Yogesh Chaturvedi',
58,
'Spiritual Speaker',
'Victim discovered forged credentials',
'Public lecture',
'Timeline conflict',
'Professional Association'
);

-- ============================================
-- WITNESSES
-- ============================================

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(
2,
'Sunita Dwivedi',
44,
'Archivist',
'Victim was studying a palm manuscript hours before his death.',
'High'
),

(
2,
'Manoj Tiwari',
50,
'Temple Caretaker',
'Saw Sameer entering the preparation room alone.',
'Medium'
),

(
2,
'Priyanshu Joshi',
29,
'Research Scholar',
'Victim appeared worried after receiving a letter.',
'High'
),

(
2,
'Kavita Sharma',
41,
'Event Coordinator',
'Observed an argument between victim and Ritesh.',
'Medium'
),

(
2,
'Narayan Acharya',
61,
'Priest',
'The Soma vessel was unattended briefly.',
'High'
),

(
2,
'Vivek Soni',
37,
'Security Officer',
'Recorded unusual movement near archive storage.',
'Medium'
);

-- ============================================
-- EVIDENCE
-- ============================================

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
2,
'Soma Vessel',
'Ceremonial vessel used during ritual.',
'Ceremony Hall',
'Physical'
),

(
2,
'Ancient Palm Manuscript',
'Ancient text containing references to Ninth Mandala.',
'Archive Room',
'Document'
),

(
2,
'Research Notes',
'Victim notes regarding manipulated findings.',
'Victim Office',
'Document'
),

(
2,
'Chemical Sample',
'Residue collected from Soma preparation.',
'Laboratory',
'Physical'
),

(
2,
'Participant Register',
'List of ceremony attendees.',
'Reception Desk',
'Document'
),

(
2,
'Victim Mobile Phone',
'Contains encrypted messages.',
'Victim Office',
'Digital'
),

(
2,
'Email Archive',
'Communication between victim and suspects.',
'Server Backup',
'Digital'
),

(
2,
'Temple Donation Ledger',
'Financial records involving trustee accounts.',
'Temple Office',
'Document'
),

(
2,
'Sanskrit Letter',
'Anonymous warning sent to victim.',
'Victim Desk',
'Document'
),

(
2,
'Laboratory Access Logs',
'Entry records for restricted areas.',
'Research Facility',
'Digital'
),

(
2,
'Security Footage',
'Video recordings from symposium day.',
'Security Office',
'Digital'
),

(
2,
'Encrypted Temple Inventory',
'Contains coded reference TC-108.',
'Archive Storage',
'Document'
);

-- ============================================
-- FORENSICS
-- ============================================

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
2,
'Toxicology Analysis',
'Victim blood examination.',
'Rare neurotoxin detected.',
'Chemical'
),

(
2,
'Soma Compound Test',
'Chemical breakdown of Soma.',
'Neurotoxin mixed before ceremony.',
'Chemical'
),

(
2,
'Fingerprint Analysis',
'Fingerprints recovered from preparation vessel.',
'Matches Sameer Bhat.',
'Physical'
),

(
2,
'Laboratory Audit',
'Review of laboratory access.',
'Unauthorized entry recorded.',
'Documentary'
),

(
2,
'Document Authentication',
'Palm manuscript dating.',
'Approximately 300 years old.',
'Documentary'
),

(
2,
'Phone Recovery',
'Deleted messages restored.',
'Victim investigating secret organization.',
'Documentary'
),

(
2,
'Timeline Reconstruction',
'Sequence of symposium events.',
'Poison introduced before ceremony began.',
'Temporal'
),

(
2,
'Video Analysis',
'Review of security footage.',
'Sameer appears near preparation area.',
'Temporal'
);

-- ============================================
-- TIMELINE
-- ============================================

INSERT INTO timeline
(case_id,time,event,description)
VALUES

(
2,
'14:00',
'Archive Visit',
'Victim studies palm manuscript.'
),

(
2,
'15:30',
'Research Meeting',
'Discussion with assistants.'
),

(
2,
'17:00',
'Anonymous Warning',
'Victim receives Sanskrit letter.'
),

(
2,
'18:30',
'Symposium Begins',
'Guests arrive.'
),

(
2,
'19:10',
'Soma Preparation',
'Ceremonial drink prepared.'
),

(
2,
'19:20',
'Restricted Access',
'Preparation area briefly unattended.'
),

(
2,
'19:45',
'Soma Consumed',
'Victim drinks ceremonial mixture.'
),

(
2,
'20:05',
'Collapse',
'Victim collapses during speech.'
),

(
2,
'20:20',
'Death Confirmed',
'Medical team declares death.'
);

-- ============================================
-- OBJECTIVES
-- ============================================

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(
2,
'Review Symposium Attendees',
'Identify all people connected to the event.',
'SELECT * FROM suspects WHERE case_id = 2;',
'Start with suspects.',
3,
1,
100,
false
),

(
2,
'Analyze Witness Statements',
'Compare witness accounts.',
'SELECT * FROM witnesses WHERE case_id = 2;',
'Look for contradictions.',
3,
2,
100,
false
),

(
2,
'Inspect Physical Evidence',
'Review evidence collected from the scene.',
'SELECT * FROM evidence WHERE case_id = 2;',
'Focus on the Soma vessel.',
3,
3,
150,
false
),

(
2,
'Study Forensic Findings',
'Review toxicology and lab reports.',
'SELECT * FROM forensics WHERE case_id = 2;',
'Toxicology reveals the method.',
3,
4,
150,
false
),

(
2,
'Reconstruct Events',
'Analyze the timeline.',
'SELECT * FROM timeline WHERE case_id = 2;',
'Pay attention to preparation stage.',
3,
5,
200,
false
),

(
2,
'Investigate Manuscript',
'Find clues hidden within historical texts.',
'SELECT * FROM evidence WHERE case_id = 2;',
'Review documentary evidence.',
2,
6,
200,
false
),

(
2,
'Identify The Poison Source',
'Determine where contamination occurred.',
'SELECT * FROM forensics WHERE case_id = 2;',
'Check laboratory findings.',
2,
7,
250,
false
),

(
2,
'Identify The Killer',
'Solve the case.',
'SELECT * FROM suspects WHERE case_id = 2;',
'Combine motive and forensics.',
1,
8,
500,
false
);

-- ============================================
-- CLUES
-- ============================================

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(2,NULL,'Ceremonial Drink','The poison entered through the Soma preparation.','information','🍶',1),

(2,NULL,'Palm Manuscript','Ancient text contains unusual symbols.','evidence','📜',2),

(2,NULL,'Hidden Sanskrit Reference','Text references the Ninth Mandala.','evidence','📖',3),

(2,NULL,'Neurotoxin Detected','Death was not natural.','evidence','☠️',4),

(2,NULL,'Laboratory Access','Restricted area was accessed illegally.','information','🧪',5),

(2,NULL,'Recovered Messages','Victim was investigating something dangerous.','hint','📱',6),

(2,NULL,'Naga Symbol','The same serpent symbol appears in a 300-year-old manuscript.','special','🐍',7),

(2,NULL,'Anonymous Warning','Victim was warned to stop research.','information','✉️',8),

(2,NULL,'TC-108 Reference','Encrypted archive code discovered.','special','🔐',9),

(2,NULL,'Ninth Mandala','First historical mention of the organization.','special','⚜️',10);

COMMIT;