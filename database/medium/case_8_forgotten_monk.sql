BEGIN;

-- ============================================
-- CASE 8
-- THE FORGOTTEN MONK
-- ACT 2 : THE CONSPIRACY
-- ============================================

DELETE FROM game_clues WHERE case_id = 8;
DELETE FROM game_objectives WHERE case_id = 8;
DELETE FROM timeline WHERE case_id = 8;
DELETE FROM forensics WHERE case_id = 8;
DELETE FROM evidence WHERE case_id = 8;
DELETE FROM witnesses WHERE case_id = 8;
DELETE FROM suspects WHERE case_id = 8;
DELETE FROM case_characters WHERE case_id = 8;
DELETE FROM game_cases WHERE id = 8;

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
8,
'The Forgotten Monk',
'A monk with no official identity appears in classified Project Vritra records. Investigating his past uncovers decades of memory manipulation experiments.',
'medium',
45,
'Memory and Samskara',
'Prasoon discovers evidence of psychological experiments linked to Project Vritra.',
true,
8,
2,
9,
'The Conspiracy',
'Unknown'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(8,1,'Lead Investigator','Investigates memory experiments'),
(8,2,'Digital Forensics','Recovers erased records'),
(8,3,'Field Investigator','Tracks monastery links'),
(8,4,'Psychologist','Studies memory conditioning'),
(8,5,'Journalist','Investigates historical disappearances'),
(8,6,'Police Liaison','Coordinates agencies'),
(8,7,'Expert Consultant','Analyzes recovered manuscripts');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
8,
'Dr. Rohan Acharya',
52,
'Neuroscientist',
'Protected illegal memory experiments',
'Claims conference attendance',
'Travel records inconsistent',
'Research Program'
),

(
8,
'Swami Narottam',
61,
'Monastery Head',
'Concealed monk records',
'Monastery retreat',
'Witness testimony conflicts',
'Monastery Leadership'
),

(
8,
'Aniket Menon',
43,
'Psychiatrist',
'Conducted unauthorized studies',
'Private clinic',
'Patient logs altered',
'Behavioral Program'
),

(
8,
'Karan Vaidya',
48,
'Government Advisor',
'Suppressed investigation',
'Official meetings',
'Meeting records incomplete',
'State Oversight'
),

(
8,
'Harshvardhan Iyer',
39,
'Research Analyst',
'Deleted project evidence',
'Data center operations',
'Server activity contradicts statement',
'Project Archives'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(8,'Mukund Sharma',67,'Former Monk','The victim remembered fragments of another life.','High'),

(8,'Sakshi Verma',34,'Research Assistant','Several files disappeared overnight.','High'),

(8,'Ritesh Pathak',46,'Archivist','The monk appeared in old records.','Medium'),

(8,'Nandini Tiwari',29,'Psychology Student','Behavioral reports were classified.','Medium'),

(8,'Girish Joshi',58,'Temple Caretaker','Unknown visitors met the monk.','High'),

(8,'Pratap Mishra',41,'Security Officer','Research archives were accessed illegally.','Medium');

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(8,'Patient File 108','Memory experiment records.','Research Archive','Document'),

(8,'Psychological Evaluation','Behavioral observations.','Medical Facility','Document'),

(8,'Hypnosis Session Logs','Recovered recordings.','Research Center','Digital'),

(8,'Monastery Registry','Missing monk entries.','Monastery Office','Document'),

(8,'Oracle Cross Reference','Links monk to Oracle Project.','Secure Database','Digital'),

(8,'Neural Experiment Notes','Research findings.','Laboratory','Document'),

(8,'Deleted Identity File','Removed personal records.','Government Archive','Digital'),

(8,'Recovered Audio Tape','Victim testimony.','Archive Vault','Digital'),

(8,'Project Vritra Dossier','Classified documents.','Secure Storage','Document'),

(8,'Research Funding Ledger','Experiment financing records.','Accounts Office','Document'),

(8,'Photographic Evidence','Images of test subjects.','Research Archive','Document'),

(8,'Naga Symbol Record','Appears repeatedly in experiment files.','Recovered Dossier','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
8,
'Audio Recovery',
'Restoration of damaged recordings',
'Victim repeatedly references lost memories',
'Documentary'
),

(
8,
'Psychological Analysis',
'Review of behavioral reports',
'Evidence of memory conditioning',
'Documentary'
),

(
8,
'Document Authentication',
'Verification of research files',
'Records are authentic',
'Documentary'
),

(
8,
'Archive Audit',
'Review of deleted files',
'Systematic record removal detected',
'Documentary'
),

(
8,
'Identity Reconstruction',
'Cross-reference databases',
'Victim identity intentionally erased',
'Documentary'
),

(
8,
'Timeline Reconstruction',
'Victim movements',
'Victim attempted escape from program',
'Temporal'
),

(
8,
'Funding Analysis',
'Financial investigation',
'Project Vritra funded experiments',
'Documentary'
),

(
8,
'Network Mapping',
'Relationship analysis',
'Connections lead deeper into Ninth Mandala',
'Documentary'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('8','25 Years Ago','Experiment Begins','Memory research initiated'),

('8','20 Years Ago','Subject Enrollment','Monk enters program'),

('8','15 Years Ago','Identity Removal','Official records deleted'),

('8','10 Years Ago','Behavioral Conditioning','Experiments intensify'),

('8','5 Years Ago','Program Expansion','Additional subjects added'),

('8','6 Months Ago','Memory Recovery','Victim begins remembering'),

('8','2 Weeks Ago','Escape Attempt','Victim seeks help'),

('8','Yesterday','Evidence Found','Archives uncovered'),

('8','Today','Conspiracy Revealed','Project exposed');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(8,'Review Suspects','Identify key participants.','SELECT * FROM suspects WHERE case_id=8;','Study experiment roles.',3,1,100,false),

(8,'Analyze Witnesses','Review testimony.','SELECT * FROM witnesses WHERE case_id=8;','Focus on memory references.',3,2,100,false),

(8,'Review Evidence','Study recovered files.','SELECT * FROM evidence WHERE case_id=8;','Patient File 108 is important.',3,3,150,false),

(8,'Analyze Forensics','Review findings.','SELECT * FROM forensics WHERE case_id=8;','Identity reconstruction matters.',3,4,150,false),

(8,'Reconstruct Timeline','Follow experiment history.','SELECT * FROM timeline WHERE case_id=8;','Look at early events.',3,5,200,false),

(8,'Investigate Memory Experiments','Understand conditioning program.','SELECT * FROM evidence WHERE case_id=8;','Review hypnosis logs.',2,6,250,false),

(8,'Discover Victim Identity','Determine who the monk really was.','SELECT * FROM forensics WHERE case_id=8;','Cross-reference identity records.',2,7,250,false),

(8,'Identify Conspirators','Expose those responsible.','SELECT * FROM suspects WHERE case_id=8;','Combine funding and records.',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(8,NULL,'Patient 108','The monk was treated as a test subject.','special','🧠',1),

(8,NULL,'Lost Identity','Official records were erased.','evidence','📄',2),

(8,NULL,'Recovered Memories','Fragments of the past resurfaced.','information','💭',3),

(8,NULL,'Behavioral Conditioning','Psychological manipulation occurred.','special','🎭',4),

(8,NULL,'Memory Experiments','Project Vritra tested memory control.','special','🔬',5),

(8,NULL,'Deleted Archives','Files were systematically removed.','information','🗂️',6),

(8,NULL,'Oracle Connection','The monk appears in Oracle records.','special','🖥️',7),

(8,NULL,'Ninth Mandala','The organization supervised the experiments.','special','⚜️',8),

(8,NULL,'Naga Symbol','The serpent appears throughout recovered files.','special','🐍',9),

(8,NULL,'The Forgotten Man','Someone tried to erase a human being completely.','special','👤',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
8,
'Subject Zero Reference',
'An internal Project Vritra file mentions a mysterious Subject Zero whose psychological profile became the foundation of all later experiments.',
'Recovered Archive',
'Document'
);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
8,
NULL,
'The Serpent Ledger',
'A hidden financial ledger reveals decades of secret funding flowing through shell organizations connected to the Ninth Mandala.',
'special',
'📖',
11
);

COMMIT;
