BEGIN;

-- ============================================
-- CASE 3
-- THE TEMPLE CIPHER
-- ACT 1 : THE PATTERN
-- ============================================

DELETE FROM game_clues WHERE case_id = 3;
DELETE FROM game_objectives WHERE case_id = 3;
DELETE FROM timeline WHERE case_id = 3;
DELETE FROM forensics WHERE case_id = 3;
DELETE FROM evidence WHERE case_id = 3;
DELETE FROM witnesses WHERE case_id = 3;
DELETE FROM suspects WHERE case_id = 3;
DELETE FROM case_characters WHERE case_id = 3;
DELETE FROM game_cases WHERE id = 3;

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
3,
'The Temple Cipher',
'A temple archivist is murdered after uncovering an encrypted Sanskrit message hidden within ancient records.',
'easy',
30,
'Ancient Temple Records',
'The investigation leads Prasoon Pathak and his team into centuries-old secrets connected to the Ninth Mandala.',
true,
3,
1,
4,
'The Pattern',
'Unknown'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(3,1,'Lead Investigator','Follows TC-108 lead'),
(3,2,'Digital Forensics','Analyzes encrypted records'),
(3,3,'Field Investigator','Temple interviews'),
(3,4,'Psychologist','Profiles suspects'),
(3,5,'Journalist','Researches historical links'),
(3,6,'Police Liaison','Coordinates investigation'),
(3,7,'Expert Consultant','Decodes Sanskrit cipher');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
3,
'Mahesh Tripathi',
54,
'Temple Trustee',
'Victim discovered missing temple funds',
'Claims he attended evening prayer',
'Witnesses place him near archive',
'Temple Administration'
),

(
3,
'Suraj Kulshreshtha',
41,
'Historian',
'Wanted exclusive access to manuscripts',
'Claims he was at home',
'Phone records contradict statement',
'Research Community'
),

(
3,
'Anand Mishra',
35,
'Archivist Assistant',
'Victim planned disciplinary action',
'Working in records room',
'Access logs inconsistent',
'Archive Staff'
),

(
3,
'Vikrant Dwivedi',
49,
'Artifact Collector',
'Interested in acquiring manuscript',
'Traveling outside city',
'Hotel records inconsistent',
'Private Collector'
),

(
3,
'Rohini Pathak',
38,
'Sanskrit Researcher',
'Academic rivalry',
'Claims conference attendance',
'Timeline discrepancy',
'Research Associate'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(
3,
'Omkar Shastri',
63,
'Temple Priest',
'Victim appeared frightened before death.',
'High'
),

(
3,
'Ritu Sharma',
29,
'Research Intern',
'Observed arguments regarding a manuscript.',
'Medium'
),

(
3,
'Deepak Verma',
46,
'Security Guard',
'Saw someone enter archive after closing.',
'Medium'
),

(
3,
'Sanjay Joshi',
52,
'Temple Accountant',
'Victim requested financial records.',
'High'
),

(
3,
'Anjali Tiwari',
33,
'Historian',
'Victim mentioned Ninth Mandala.',
'High'
),

(
3,
'Prakash Menon',
58,
'Museum Curator',
'Victim planned public disclosure.',
'Medium'
);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(3,'TC-108 Manuscript','Encrypted Sanskrit manuscript.','Temple Archive','Document'),

(3,'Archive Key','Access key to restricted records.','Victim Pocket','Physical'),

(3,'Temple Ledger','Historical financial records.','Temple Office','Document'),

(3,'Sanskrit Cipher Sheet','Encrypted message page.','Archive Vault','Document'),

(3,'Victim Notebook','Research notes.','Victim Desk','Document'),

(3,'Temple Access Logs','Archive entry records.','Security Office','Digital'),

(3,'Artifact Catalogue','Inventory list.','Storage Room','Document'),

(3,'Encrypted Flash Drive','Contains scanned manuscripts.','Victim Locker','Digital'),

(3,'Blood-Stained Scroll','Recovered near body.','Archive Vault','Physical'),

(3,'Anonymous Warning Letter','Threat against victim.','Victim Desk','Document'),

(3,'CCTV Footage','Temple surveillance.','Security Room','Digital'),

(3,'Hidden Compartment Map','Map of secret archive chamber.','Vault Shelf','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
3,
'Cause Of Death',
'Examination of victim',
'Blunt force trauma',
'Physical'
),

(
3,
'Fingerprint Recovery',
'Archive fingerprints',
'Matches Anand Mishra',
'Physical'
),

(
3,
'Document Dating',
'Age of manuscript',
'Approximately 250 years old',
'Documentary'
),

(
3,
'Cipher Analysis',
'Sanskrit encryption study',
'Contains hidden message',
'Documentary'
),

(
3,
'Blood Pattern Analysis',
'Scene reconstruction',
'Attack occurred inside archive',
'Physical'
),

(
3,
'Flash Drive Recovery',
'Deleted files restored',
'References Ninth Mandala',
'Documentary'
),

(
3,
'Timeline Reconstruction',
'Victim movements',
'Victim accessed hidden chamber',
'Temporal'
),

(
3,
'CCTV Review',
'Archive surveillance',
'Footage partially deleted',
'Temporal'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('3','10:00','Archive Research','Victim studies TC-108'),

('3','13:00','Meeting','Victim meets Vedika Rao'),

('3','15:30','Discovery','Hidden cipher identified'),

('3','17:00','Threat Received','Victim receives warning'),

('3','18:45','Archive Access','Victim enters restricted vault'),

('3','19:10','Unknown Visitor','Someone enters archive'),

('3','19:35','Attack','Victim assaulted'),

('3','20:00','Body Found','Temple staff discover body'),

('3','20:45','Police Investigation Begins','ACP Rudransh arrives');

-- ============================================
-- OBJECTIVES
-- ============================================

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(
3,
'Review All Suspects',
'Identify everyone with access to the archive.',
'SELECT * FROM suspects WHERE case_id = 3;',
'Start with suspect backgrounds.',
3,
1,
100,
false
),

(
3,
'Analyze Witness Statements',
'Compare witness accounts.',
'SELECT * FROM witnesses WHERE case_id = 3;',
'Look for timeline inconsistencies.',
3,
2,
100,
false
),

(
3,
'Inspect Temple Evidence',
'Review physical and documentary evidence.',
'SELECT * FROM evidence WHERE case_id = 3;',
'Focus on TC-108.',
3,
3,
150,
false
),

(
3,
'Study Forensic Reports',
'Review forensic findings.',
'SELECT * FROM forensics WHERE case_id = 3;',
'Fingerprint analysis is important.',
3,
4,
150,
false
),

(
3,
'Reconstruct The Timeline',
'Determine what happened before the murder.',
'SELECT * FROM timeline WHERE case_id = 3;',
'Focus on events after 18:00.',
3,
5,
200,
false
),

(
3,
'Decode The Cipher',
'Investigate the Sanskrit message.',
'SELECT * FROM evidence WHERE case_id = 3;',
'The manuscript contains hidden instructions.',
2,
6,
250,
false
),

(
3,
'Identify Archive Intruder',
'Determine who entered the restricted vault.',
'SELECT * FROM forensics WHERE case_id = 3;',
'Access logs reveal the answer.',
2,
7,
250,
false
),

(
3,
'Solve The Murder',
'Identify the killer and motive.',
'SELECT * FROM suspects WHERE case_id = 3;',
'Combine motive, access and forensics.',
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

(
3,
NULL,
'Encrypted Manuscript',
'The TC-108 manuscript contains hidden text.',
'information',
'📜',
1
),

(
3,
NULL,
'Destroyed Records',
'Someone attempted to erase archive records.',
'evidence',
'📚',
2
),

(
3,
NULL,
'Vault Access',
'The restricted chamber was opened before the murder.',
'information',
'🔑',
3
),

(
3,
NULL,
'Fingerprint Match',
'Recovered fingerprints belong to a suspect.',
'hint',
'🔍',
4
),

(
3,
NULL,
'Anonymous Threat',
'The victim was warned to stop investigating.',
'information',
'✉️',
5
),

(
3,
NULL,
'Ninth Mandala Reference',
'The manuscript references a hidden organization.',
'special',
'⚜️',
6
),

(
3,
NULL,
'Ancient Serpent Symbol',
'The Naga symbol appears repeatedly throughout the manuscript.',
'special',
'🐍',
7
),

(
3,
NULL,
'Hidden Chamber',
'The victim discovered a secret archive room.',
'evidence',
'🏛️',
8
),

(
3,
NULL,
'Political Reference',
'The decoded text references advisors to kings and rulers.',
'special',
'👑',
9
),

(
3,
NULL,
'The Path Of The Serpent',
'The final decoded line hints that the serpent symbol is guiding investigators somewhere.',
'special',
'🐍',
10
);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES
(
3,
'Decoded Sanskrit Message',
'Translation: "The Ninth Mandala does not hide in temples. It hides among those who guide kingdoms."',
'Professor Vedika Rao Research Notes',
'Document'
);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES
(
3,
NULL,
'Rudra Peeth Lead',
'A hidden archive entry references Rudra Peeth Monastery and a missing monk.',
'special',
'🕉️',
11
);

COMMIT;