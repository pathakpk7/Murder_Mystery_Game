BEGIN;

-- ============================================
-- CASE 15
-- THE HIDDEN MANUSCRIPT
-- ACT 3 FINALE : THE SYSTEM
-- ============================================

DELETE FROM game_clues WHERE case_id = 15;
DELETE FROM game_objectives WHERE case_id = 15;
DELETE FROM timeline WHERE case_id = 15;
DELETE FROM forensics WHERE case_id = 15;
DELETE FROM evidence WHERE case_id = 15;
DELETE FROM witnesses WHERE case_id = 15;
DELETE FROM suspects WHERE case_id = 15;
DELETE FROM case_characters WHERE case_id = 15;
DELETE FROM game_cases WHERE id = 15;

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
15,
'The Hidden Manuscript',
'A historian is murdered while decoding a manuscript that predates Project Vritra and reveals the origins of its ideology.',
'hard',
80,
'Mahabharata - Sutradhar',
'Prasoon discovers the true philosophical origin of Project Vritra.',
true,
15,
3,
16,
'The System',
'The Sutradhar'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(15,1,'Lead Investigator','Investigates manuscript origin'),
(15,2,'Digital Forensics','Restores damaged archives'),
(15,3,'Field Investigator','Tracks manuscript history'),
(15,4,'Psychologist','Studies ideological doctrine'),
(15,5,'Journalist','Investigates founders'),
(15,6,'Police Liaison','Coordinates investigation'),
(15,7,'Expert Consultant','Decodes manuscript');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
15,
'Professor Raghav Bedi',
61,
'Historian',
'Wanted manuscript suppressed',
'University conference',
'Attendance logs altered',
'Historical Archive'
),

(
15,
'Devansh Kapoor',
54,
'Archivist',
'Protected founder identities',
'Archive restoration',
'Security footage conflict',
'Founders Collection'
),

(
15,
'Amitesh Narayanan',
49,
'Research Director',
'Prevented publication',
'Research meeting',
'Witness contradiction',
'Oracle Research'
),

(
15,
'Shivendra Rao',
58,
'Political Scholar',
'Protected ideological origins',
'Academic seminar',
'Travel records inconsistent',
'Historical Network'
),

(
15,
'Nakul Vashisht',
45,
'Document Recovery Specialist',
'Destroyed evidence',
'Archive inspection',
'Access logs conflict',
'Manuscript Division'
);


INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(15,'Vedika Rao',52,'Professor','The manuscript changes everything.','High'),

(15,'Aarav Mishra',38,'Research Assistant','Victim decoded critical sections.','High'),

(15,'Tanya Sharma',41,'Archivist','Several pages disappeared.','Medium'),

(15,'Rahul Dubey',44,'Historian','The manuscript predates Vritra.','High'),

(15,'Sonal Pathak',35,'Data Researcher','References to founders were removed.','Medium'),

(15,'Neeraj Verma',57,'Retired Scholar','A hidden author exists.','High');

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(15,'Hidden Manuscript','Original recovered document.','National Archive','Document'),

(15,'Founder Notes','Annotations by unknown author.','Archive Vault','Document'),

(15,'Decoded Pages','Translated sections.','Research Lab','Document'),

(15,'Victim Notebook','Investigation notes.','Victim Office','Document'),

(15,'Correspondence Collection','Letters between founders.','Archive Storage','Document'),

(15,'Suppressed Research Papers','Removed historical studies.','University Server','Digital'),

(15,'Oracle Archive Reference','Links manuscript to Oracle.','Recovered Database','Digital'),

(15,'Shadow Briefing','Leadership summary.','Encrypted Drive','Document'),

(15,'Historical Funding Records','Early project financing.','Finance Archive','Document'),

(15,'Identity Registry','Founder identities.','Secure Archive','Document'),

(15,'Recovered Audio Interview','Founder testimony fragment.','Archive Storage','Digital'),

(15,'Naga Founder Seal','Original serpent emblem.','Vault','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
15,
'Document Dating',
'Age verification',
'Manuscript created over 70 years ago',
'Documentary'
),

(
15,
'Ink Analysis',
'Historical examination',
'Multiple authors contributed',
'Documentary'
),

(
15,
'Translation Review',
'Decoded manuscript sections',
'Doctrine focuses on societal predictability',
'Documentary'
),

(
15,
'Archive Recovery',
'Deleted records restored',
'Founder names intentionally removed',
'Documentary'
),

(
15,
'Communication Analysis',
'Letters examined',
'Founders discussed long-term civilization models',
'Documentary'
),

(
15,
'Timeline Reconstruction',
'Historical development',
'Project evolved over decades',
'Temporal'
),

(
15,
'Voice Authentication',
'Recovered interview analysis',
'Unknown founder identified indirectly',
'Documentary'
),

(
15,
'Network Mapping',
'Historical relationships',
'Seven Shadows inherited existing doctrine',
'Documentary'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('15','1952','Manuscript Written','Foundational doctrine created'),

('15','1958','First Circle Forms','Early network established'),

('15','1975','Expansion Begins','Influence operations grow'),

('15','1990','Oracle Concepts Appear','Prediction theories emerge'),

('15','2000','Project Vritra Established','Modern structure created'),

('15','6 Months Ago','Manuscript Found','Historian begins study'),

('15','2 Weeks Ago','Critical Discovery','Founder references uncovered'),

('15','22:00','Murder','Historian killed'),

('15','23:30','Evidence Secured','Manuscript recovered');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(15,'Review Suspects','Identify possible conspirators.','SELECT * FROM suspects WHERE case_id=15;',3,1,100,false),

(15,'Analyze Witnesses','Review testimony.','SELECT * FROM witnesses WHERE case_id=15;',3,2,100,false),

(15,'Review Evidence','Study manuscript evidence.','SELECT * FROM evidence WHERE case_id=15;',3,3,150,false),

(15,'Analyze Forensics','Review historical findings.','SELECT * FROM forensics WHERE case_id=15;',3,4,150,false),

(15,'Reconstruct Timeline','Follow doctrine development.','SELECT * FROM timeline WHERE case_id=15;',3,5,200,false),

(15,'Discover The Founders','Identify project origins.','SELECT * FROM evidence WHERE case_id=15;',2,6,250,false),

(15,'Understand The Doctrine','Decode the manuscript.','SELECT * FROM forensics WHERE case_id=15;',2,7,250,false),

(15,'Solve The Murder','Identify the killer.','SELECT * FROM suspects WHERE case_id=15;',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(15,NULL,'Ancient Doctrine','The philosophy predates Vritra.','special','📜',1),

(15,NULL,'Missing Founder','Someone erased the creator.','special','👤',2),

(15,NULL,'Civilization Model','Society can be predicted.','special','📈',3),

(15,NULL,'Removed Pages','Critical sections disappeared.','evidence','📚',4),

(15,NULL,'Inherited System','Seven Shadows inherited power.','special','👥',5),

(15,NULL,'Oracle Origins','Prediction theory began decades earlier.','special','🖥️',6),

(15,NULL,'Project Vritra Doctrine','The true ideology emerges.','special','📂',7),

(15,NULL,'Ninth Mandala Legacy','The organization evolved over generations.','special','⚜️',8),

(15,NULL,'Original Naga Seal','The serpent symbol predates all cases.','special','🐍',9),

(15,NULL,'The Sutradhar','A hidden architect guided everything.','special','🎭',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
15,
'Sutradhar Reference',
'Recovered manuscript passage states: "The architect shall remain unseen, for the storyteller must never become the story."',
'Decoded Manuscript',
'Document'
);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
15,
NULL,
'The Vritra Cycle',
'Recovered records suggest every previous case was part of a single interconnected structure spanning decades.',
'special',
'♾️',
11
);

COMMIT;
