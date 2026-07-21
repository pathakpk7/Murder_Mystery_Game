BEGIN;

-- ============================================
-- CASE 12
-- THE MAYA PROTOCOL
-- ACT 3 : THE SYSTEM
-- ============================================

DELETE FROM game_clues WHERE case_id = 12;
DELETE FROM game_objectives WHERE case_id = 12;
DELETE FROM timeline WHERE case_id = 12;
DELETE FROM forensics WHERE case_id = 12;
DELETE FROM evidence WHERE case_id = 12;
DELETE FROM witnesses WHERE case_id = 12;
DELETE FROM suspects WHERE case_id = 12;
DELETE FROM case_characters WHERE case_id = 12;
DELETE FROM game_cases WHERE id = 12;

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
12,
'The Maya Protocol',
'A forensic analyst is murdered after discovering a classified system capable of manufacturing evidence and manipulating reality itself.',
'hard',
65,
'Maya',
'Prasoon discovers that Project Vritra can create false truths.',
true,
12,
3,
13,
'The System',
'Unknown'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(12,1,'Lead Investigator','Questions previous investigations'),
(12,2,'Digital Forensics','Analyzes fabricated records'),
(12,3,'Field Investigator','Interviews compromised witnesses'),
(12,4,'Psychologist','Studies perception manipulation'),
(12,5,'Journalist','Investigates media influence'),
(12,6,'Police Liaison','Coordinates inquiry'),
(12,7,'Expert Consultant','Studies philosophical implications');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
12,
'Aryan Deshmukh',
45,
'Forensic Consultant',
'Protected Maya operations',
'Claims laboratory work',
'Lab logs manipulated',
'Maya Program'
),

(
12,
'Vikrant Rao',
53,
'Evidence Director',
'Controlled forensic databases',
'Administrative duties',
'Database records altered',
'Evidence Network'
),

(
12,
'Neel Sharma',
39,
'AI Systems Engineer',
'Built fabrication systems',
'Remote operations',
'Server logs contradict claim',
'Oracle-Maya Integration'
),

(
12,
'Sameera Iyer',
47,
'Media Strategist',
'Spread manufactured narratives',
'Media conference',
'Travel records inconsistent',
'Information Operations'
),

(
12,
'Harshit Vashisht',
50,
'Archive Controller',
'Deleted authentic evidence',
'Archive inspection',
'Witness statements conflict',
'Historical Manipulation'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(12,'Mehul Kapoor',41,'Forensic Technician','Evidence changed after submission.','High'),

(12,'Pallavi Pathak',34,'Data Analyst','Records were rewritten repeatedly.','High'),

(12,'Aakash Mishra',46,'Evidence Clerk','Original files disappeared.','Medium'),

(12,'Nandita Verma',38,'Journalist','Victim feared fabricated evidence.','High'),

(12,'Rohan Dubey',43,'Cyber Investigator','Multiple databases were synchronized.','Medium'),

(12,'Bhavesh Tiwari',57,'Retired Judge','Several past cases appear suspicious.','High');

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(12,'Maya Protocol Manual','Operational guide for evidence fabrication.','Secure Archive','Document'),

(12,'Forensic Database Copy','Modified evidence repository.','Data Center','Digital'),

(12,'Victim Notebook','Investigation notes.','Victim Office','Document'),

(12,'Photo Manipulation Records','Altered image archives.','Media Server','Digital'),

(12,'Witness Conditioning Files','Psychological influence records.','Research Facility','Document'),

(12,'Deleted Case Reports','Removed investigations.','Government Backup','Digital'),

(12,'Evidence Revision Logs','History of modifications.','Forensic Lab','Digital'),

(12,'Communication Archive','Internal project communications.','Mail Server','Digital'),

(12,'Media Influence Report','Narrative management strategies.','Media Office','Document'),

(12,'AI Decision Model','Automated evidence selection system.','Research Server','Digital'),

(12,'Shadow Authorization Document','Approval for Maya operations.','Secure Vault','Document'),

(12,'Naga Verification Seal','Official project insignia.','Recovered Archive','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
12,
'Database Audit',
'Review of evidence records',
'Thousands of modifications detected',
'Documentary'
),

(
12,
'Image Analysis',
'Verification of photographs',
'Several images fabricated',
'Documentary'
),

(
12,
'Witness Analysis',
'Behavioral review',
'Witness conditioning confirmed',
'Documentary'
),

(
12,
'Communication Recovery',
'Deleted messages restored',
'Maya operations discussed openly',
'Documentary'
),

(
12,
'Archive Reconstruction',
'Recovery of original files',
'Authentic evidence removed',
'Documentary'
),

(
12,
'Timeline Reconstruction',
'Sequence of manipulations',
'Fabrication ongoing for years',
'Temporal'
),

(
12,
'AI System Review',
'Oracle-Maya integration',
'Predictions used to shape narratives',
'Documentary'
),

(
12,
'Network Mapping',
'Operational hierarchy',
'Seven Shadows approved protocol',
'Documentary'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('12','8 Years Ago','Maya Created','Protocol development begins'),

('12','6 Years Ago','First Deployment','Evidence manipulation tested'),

('12','4 Years Ago','National Expansion','Protocol scaled'),

('12','2 Years Ago','Oracle Integration','Prediction linked to fabrication'),

('12','6 Months Ago','Victim Investigation','Analyst begins inquiry'),

('12','2 Weeks Ago','Evidence Discovery','Protocol exposed'),

('12','1 Day Ago','Threat Issued','Victim warned'),

('12','22:15','Murder','Victim killed'),

('12','23:00','Data Wipe Attempt','Evidence destroyed');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(12,'Review Suspects','Identify Maya operators.','SELECT * FROM suspects WHERE case_id=12;',3,1,100,false),

(12,'Analyze Witnesses','Review testimony.','SELECT * FROM witnesses WHERE case_id=12;',3,2,100,false),

(12,'Review Evidence','Study Maya records.','SELECT * FROM evidence WHERE case_id=12;',3,3,150,false),

(12,'Analyze Forensics','Review manipulation findings.','SELECT * FROM forensics WHERE case_id=12;',3,4,150,false),

(12,'Reconstruct Timeline','Follow protocol development.','SELECT * FROM timeline WHERE case_id=12;',3,5,200,false),

(12,'Investigate Fabrication','Discover how evidence was altered.','SELECT * FROM evidence WHERE case_id=12;',2,6,250,false),

(12,'Expose Maya Protocol','Reveal operational structure.','SELECT * FROM forensics WHERE case_id=12;',2,7,250,false),

(12,'Identify Killer','Solve the murder.','SELECT * FROM suspects WHERE case_id=12;',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(12,NULL,'Fabricated Evidence','Evidence can be manufactured.','special','🎭',1),

(12,NULL,'Manipulated Photos','Images were altered.','evidence','📷',2),

(12,NULL,'Conditioned Witnesses','Testimony was influenced.','special','🧠',3),

(12,NULL,'Deleted Originals','Authentic evidence disappeared.','information','🗂️',4),

(12,NULL,'Oracle Integration','Prediction and fabrication merged.','special','🖥️',5),

(12,NULL,'Seven Shadows Approval','Leadership authorized operations.','special','👥',6),

(12,NULL,'Project Vritra Evolution','The conspiracy became self-sustaining.','special','📂',7),

(12,NULL,'Ninth Mandala','The organization remains hidden.','special','⚜️',8),

(12,NULL,'Naga Seal','The serpent marks fabricated operations.','special','🐍',9),

(12,NULL,'Nothing Is Certain','Even evidence can lie.','special','❓',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
12,
'Crimson Yagna File',
'Recovered document connecting twenty years of murders, disappearances, political events, and social unrest into a single long-term pattern.',
'Recovered Shadow Archive',
'Document'
);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
12,
NULL,
'The Crimson Yagna',
'A classified report suggests that every major operation was part of a ritual-like social experiment spanning decades.',
'special',
'🔥',
11
);

COMMIT;
